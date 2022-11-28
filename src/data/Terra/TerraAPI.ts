import { useMemo } from "react"
import { useQuery } from "react-query"
import axios, { AxiosError } from "axios"
import BigNumber from "bignumber.js"
import { OracleParams, ValAddress } from "@terra-money/terra.js"
import { TerraValidator } from "types/validator"
import { TerraProposalItem } from "types/proposal"
import { useNetwork } from "data/wallet"
import { useNetworks } from "app/InitNetworks"
import { queryKey, RefetchOptions } from "../query"
import { Pagination } from "../query"
import { useInterchainLCDClient } from "data/queries/lcdClient"
// import { PubKey } from "utils/keys"

export enum Aggregate {
  PERIODIC = "periodic",
  CUMULATIVE = "cumulative",
}

export enum AggregateStakingReturn {
  DAILY = "daily",
  ANNUALIZED = "annualized",
}

export enum AggregateWallets {
  TOTAL = "total",
  NEW = "new",
  ACTIVE = "active",
}

export const useTerraAPIURL = (mainnet?: true) => {
  const network = useNetwork()
  const networks = useNetworks()
  return mainnet ? networks["mainnet"].api : network.api
}

export const useIsTerraAPIAvailable = () => {
  const url = useTerraAPIURL()
  return !!url
}

export const useTerraAPI = <T>(path: string, params?: object, fallback?: T) => {
  const baseURL = useTerraAPIURL()
  const available = useIsTerraAPIAvailable()
  const shouldFallback = !available && fallback

  return useQuery<T, AxiosError>(
    [queryKey.TerraAPI, baseURL, path, params],
    async () => {
      if (shouldFallback) return fallback
      const { data } = await axios.get(path, { baseURL, params })
      return data
    },
    { ...RefetchOptions.INFINITY, enabled: !!(baseURL || shouldFallback) }
  )
}

/* fee */
export type GasPrices = Record<Denom, Amount>

export const useGasPrices = () => {
  const current = useTerraAPIURL()
  const mainnet = useTerraAPIURL(true)
  const baseURL = current ?? mainnet
  const path = "/gas-prices"

  return useQuery(
    [queryKey.TerraAPI, baseURL, path],
    async () => {
      const { data } = await axios.get<GasPrices>(path, { baseURL })
      return data
    },
    { ...RefetchOptions.INFINITY, enabled: !!baseURL }
  )
}

/* charts */
export enum ChartInterval {
  "1m" = "1m",
  "5m" = "5m",
  "15m" = "15m",
  "30m" = "30m",
  "1h" = "1h",
  "1d" = "1d",
}

export const useLunaPriceChart = (denom: Denom, interval: ChartInterval) => {
  return useTerraAPI<ChartDataItem[]>(`chart/price/${denom}`, { interval })
}

export const useTxVolume = (denom: Denom, type: Aggregate) => {
  return useTerraAPI<ChartDataItem[]>(`chart/tx-volume/${denom}/${type}`)
}

export const useStakingReturn = (type: AggregateStakingReturn) => {
  return useTerraAPI<ChartDataItem[]>(`chart/staking-return/${type}`)
}

export const useTaxRewards = (type: Aggregate) => {
  return useTerraAPI<ChartDataItem[]>(`chart/tax-rewards/${type}`)
}

export const useWallets = (walletsType: AggregateWallets) => {
  return useTerraAPI<ChartDataItem[]>(`chart/wallets/${walletsType}`)
}

export const useSumActiveWallets = () => {
  return useTerraAPI<Record<string, string>>(`chart/wallets/active/sum`)
}

/* validators */
export const useTerraValidators = () => {
  return useTerraAPI<TerraValidator[]>("validators", undefined, [])
}

export const useTerraValidator = (address: ValAddress) => {
  return useTerraAPI<TerraValidator>(`validators/${address}`)
}

export const useTerraProposal = (id: number) => {
  return useTerraAPI<TerraProposalItem[]>(`proposals/${id}`)
}

/* helpers */
export const getCalcVotingPowerRate = (TerraValidators: TerraValidator[]) => {
  const total = BigNumber.sum(
    ...TerraValidators.map(({ voting_power = 0 }) => voting_power)
  ).toNumber()

  return (address: ValAddress) => {
    const validator = TerraValidators.find(
      ({ operator_address }) => operator_address === address
    )

    if (!validator) return
    const { voting_power } = validator
    return voting_power ? Number(validator.voting_power) / total : undefined
  }
}

export const calcSelfDelegation = (validator?: TerraValidator) => {
  if (!validator) return
  const { self, tokens } = validator
  return self ? Number(self) / Number(tokens) : undefined
}

export const getCalcUptime = ({ slash_window }: OracleParams) => {
  return (validator?: TerraValidator) => {
    if (!validator) return
    const { miss_counter } = validator
    return miss_counter ? 1 - Number(miss_counter) / slash_window : undefined
  }
}

export const useVotingPowerRate = (address: ValAddress) => {
  const { data: TerraValidators, ...state } = useTerraValidators()
  const calcRate = useMemo(() => {
    if (!TerraValidators) return
    return getCalcVotingPowerRate(TerraValidators)
  }, [TerraValidators])

  const data = useMemo(() => {
    if (!calcRate) return
    return calcRate(address)
  }, [address, calcRate])

  return { data, ...state }
}

export const useInterchainQuickStake = async (
  amount: number,
  chainID: string
) => {
  const MAX_COMMISSION = 0.1 // 0.1 = 10%
  const SLASH_WINDOW = 1_200_000
  const VOTE_POWER_INCLUDE = 0.65
  const lcd = useInterchainLCDClient()

  const {
    block: {
      header: { height: latestHeight },
    },
  } = await lcd.tendermint.blockInfo(chainID)

  const [Validators] = await lcd.staking.validators(chainID, { ...Pagination })

  if (!Validators || !latestHeight) return

  const totalTokens = BigNumber.sum(
    ...Validators.map(({ tokens = 0 }) => Number(tokens))
  ).toNumber()

  const slashQueryParams = {
    ...Pagination,
    starting_height: Number(latestHeight) - SLASH_WINDOW,
    ending_height: Number(latestHeight),
  }

  let valInfo = await Promise.all(
    Validators.map(async (v) => {
      const [slashCount] = await lcd.distribution.validatorSlashingEvents(
        v.operator_address,
        { ...slashQueryParams }
      )
      return {
        ...v,
        ...slashCount,
        votingPower: Number(v.tokens) / totalTokens,
      }
    })
  )
  let { elgible } = valInfo
    .sort((a, b) => a.votingPower - b.votingPower) // least to greatest
    .reduce(
      (acc, cur) => {
        acc.sumVotePower += cur.votingPower
        if (acc.sumVotePower < VOTE_POWER_INCLUDE) {
          acc.elgible.push(cur)
        }
        return acc
      },
      {
        sumVotePower: 0,
        elgible: [] as any[], // todo: fix type
      }
    )

  elgible = elgible.filter(
    ({ commission }) =>
      parseFloat(commission.commission_rates.rate) <= MAX_COMMISSION
  )

  if (amount / 10e6) {
    return elgible
  }
}

// ; (async () => {
//   // fetch validators list
//   let { data: { validators } }: { data: { validators: Validator[] } } = await axios.get(`${LCD}/cosmos/staking/v1beta1/validators?pagination.limit=1000`)
//   const { data: { block: lastBlock } } = await axios.get(`${LCD}/blocks/latest`)
//   const lastBlockHeight = parseInt(lastBlock.header.height)
//   console.log(`Last block height: ${lastBlockHeight}`)
//   // remove jailed or unbonded validators
//   validators = validators.filter(({ jailed, status }) => !jailed && status === 'BOND_STATUS_BONDED')
//   // sort from highest to lowest voting power
//   validators.sort((a, b) => parseInt(b.tokens) - parseInt(a.tokens))
//   // save the voting power of the top validator
//   const topVotingPower = parseInt(validators[0].tokens) / 1e6
//   // remove the top EXCLUDE_TOP
//   validators.splice(0, EXCLUDE_TOP)
//   // remove validators with commission > MAX_COMMISSION
//   validators = validators.filter(({ commission }) => parseFloat(commission.commission_rates.rate) <= MAX_COMMISSION)

//   const result = await Promise.all(validators.map(async ({ operator_address, consensus_pubkey, tokens, description }) => {
//     const consAddress = new PubKey(consensus_pubkey).toBech32()
//     const missedBlocks = parseInt(signingInfo.find(({ address }) => address === consAddress)?.missed_blocks_counter || '0')
//     // TODO: is missedBlocks on the latest 10k block or slashing window?
//     const downtime = (missedBlocks / 10_000)
//     const votingPower = Math.round(parseInt(tokens) / 1e6)
//     // fetch slash events
//     const { data: { slashes } }: { data: { slashes: any[] } } = await axios.get(`${LCD}/cosmos/distribution/v1beta1/validators/${operator_address}/slashes?starting_height=${lastBlockHeight - SLASH_WINDOW}&ending_height=${lastBlockHeight}`)
//     // TODO: fetch governance & slashing
//     const score = slashes.length ? 0 : Math.round(((topVotingPower - votingPower) * (1 - (downtime * DOWNTIME_WEIGHT)) / 10000))
//     return {
//       address: operator_address,
//       moniker: description.moniker.substring(0, 20),
//       votingPower,
//       uptime: (1 - downtime) * 100,
//       score
//     }
//   }))
//   // sort result from highest to lowest score
//   result.filter(r => r.score > 0).sort((a, b) => b.score - a.score)
//   console.table(result)
// })()

// const { data: TerraValidators } = useTerraValidators()
// const { data: TerraValidator } = useTerraValidator(QUICK_STAKE_EXCLUDE_THRESHOLD)
// const { data: TerraProposal } = useTerraProposal(QUICK_STAKE_EXCLUDE_THRESHOLD)

// return (validator?: TerraValidator) => {
//   if (!validator) return
//   const { miss_counter } = validator
//   return miss_counter ? 1 - Number(miss_counter) / slash_window : undefined
// }

// export const useFindQuickStakeVals = () => {
//   const { data: TerraValidators, ...state } = useTerraValidators()
//   if (!TerraValidators) return

//   const calcRate = getCalcVotingPowerRate(TerraValidators)
//   // const calcUptime = getCalcUptime({ slash_window: 1200000 })
//   let sumVotingPower = 0
//   console.log("TerraValidators", TerraValidators)
//   const valsByVotingPower = TerraValidators.map((v) => ({
//     address: v.operator_address,
//     uptime: v.miss_counter,
//     votingPower: calcRate(v.operator_address) ?? 0 * 100,
//   })).sort((a, b) => b.votingPower - a.votingPower)
//   //       .forEach(v => {
//   //   if (sumVotingPower >= QUICK_STAKE_EXCLUDE_THRESHOLD) return
//   //   sumVotingPower += v.votingPower
//   // });
//   console.log("valsByVotingPower", valsByVotingPower)
//   return { ...state, data: valsByVotingPower }
