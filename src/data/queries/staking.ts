import { useQuery } from "react-query"
import { flatten, path, uniqBy } from "ramda"
import BigNumber from "bignumber.js"
import {
  AccAddress,
  MsgDelegate,
  ValAddress,
  MsgUndelegate,
  Validator,
  Coin,
  UnbondingDelegation,
  Delegation,
} from "@terra-money/feather.js"
/* FIXME(terra.js): Import from terra.js */
import { BondStatus } from "@terra-money/terra.proto/cosmos/staking/v1beta1/staking"
import { has } from "utils/num"
import { StakeAction } from "txs/stake/StakeForm"
import { queryKey, Pagination, RefetchOptions } from "../query"
import { useAddress } from "../wallet"
// import { useElimSlashedVals } from "./distribution"
// import { useLatestBlock } from "./tendermint"
import { useInterchainLCDClient, useLCDClient } from "./lcdClient"
import shuffle from "utils/shuffle"

export const useValidators = () => {
  const lcd = useLCDClient()

  return useQuery(
    [queryKey.staking.validators],
    async () => {
      // TODO: Pagination
      // Required when the number of results exceed LAZY_LIMIT

      const [v1] = await lcd.staking.validators({
        status: BondStatus[BondStatus.BOND_STATUS_UNBONDED],
        ...Pagination,
      })

      const [v2] = await lcd.staking.validators({
        status: BondStatus[BondStatus.BOND_STATUS_UNBONDING],
        ...Pagination,
      })

      const [v3] = await lcd.staking.validators({
        status: BondStatus[BondStatus.BOND_STATUS_BONDED],
        ...Pagination,
      })

      return uniqBy(path(["operator_address"]), [...v1, ...v2, ...v3])
    },
    { ...RefetchOptions.INFINITY }
  )
}

export const useInterchainValidators = (chain: string) => {
  const lcd = useInterchainLCDClient()
  return useQuery(
    [queryKey.staking.interchainValidators, chain],
    async () => {
      const [Validators] = await lcd.staking.validators(chain, {
        ...Pagination,
      })
      return Validators
    },
    { ...RefetchOptions.INFINITY }
  )
}

// export const useQuickStakeElgibleVals2 = (chainID: string) => {
//   const MAX_COMMISSION = 0.05
//   const VOTE_POWER_INCLUDE = 0.65
//   const { data: validators = [] } = useInterchainValidators(chainID)
//   const { data: latestHeight } = useLatestBlock(chainID)
//   const totalStaked = getTotalStakedTokens(validators)

//   const elgible = new Set<ValAddress>();
//   let sumVotePower = 0;

//   for (const v of validators.sort((a, b) => Number(a.tokens) / totalStaked - Number(b.tokens) / totalStaked)) {
//     const votingPower = Number(v.tokens) / getTotalStakedTokens(validators);
//     if (Number(v.commission.commission_rates.rate) > MAX_COMMISSION) {
//       continue;
//     }
//     elgible.add(v.operator_address);
//     sumVotePower += votingPower;
//     if (sumVotePower >= VOTE_POWER_INCLUDE) {
//       break;
//     }
//   }
//   return shuffle(Array.from(elgible));
// }

export const getQuickStakeEligibleVals = (validators: Validator[]) => {
  const MAX_COMMISSION = 0.05
  const VOTE_POWER_INCLUDE = 0.65

  const totalStaked = getTotalStakedTokens(validators)
  const vals = validators
    .map((v) => ({ ...v, votingPower: Number(v.tokens) / totalStaked }))
    .filter(
      ({ commission }) =>
        Number(commission.commission_rates.rate) <= MAX_COMMISSION
    )
    .sort((a, b) => a.votingPower - b.votingPower) // least to greatest
    .reduce(
      (acc, cur) => {
        acc.sumVotePower += cur.votingPower
        if (acc.sumVotePower < VOTE_POWER_INCLUDE) {
          acc.elgible.push(cur.operator_address)
        }
        return acc
      },
      {
        sumVotePower: 0,
        elgible: [] as ValAddress[],
      }
    )
  return shuffle(vals.elgible)
}

export const useValidator = (operatorAddress: ValAddress) => {
  const lcd = useLCDClient()
  return useQuery(
    [queryKey.staking.validator, operatorAddress],
    () => lcd.staking.validator(operatorAddress),
    { ...RefetchOptions.INFINITY }
  )
}

export const useDelegations = () => {
  const address = useAddress()
  const lcd = useLCDClient()

  return useQuery(
    [queryKey.staking.delegations, address],
    async () => {
      if (!address) return []
      // TODO: Pagination
      // Required when the number of results exceed LAZY_LIMIT
      const [delegations] = await lcd.staking.delegations(
        address,
        undefined,
        Pagination
      )

      return delegations.filter(({ balance }) => has(balance.amount.toString()))
    },
    { ...RefetchOptions.DEFAULT }
  )
}

export const useDelegation = (validatorAddress: ValAddress) => {
  const address = useAddress()
  const lcd = useLCDClient()

  return useQuery(
    [queryKey.staking.delegation, address, validatorAddress],
    async () => {
      if (!address) return
      try {
        const delegation = await lcd.staking.delegation(
          address,
          validatorAddress
        )
        return delegation
      } catch {
        return
      }
    },
    { ...RefetchOptions.DEFAULT }
  )
}

export const useUnbondings = () => {
  const address = useAddress()
  const lcd = useLCDClient()

  return useQuery(
    [queryKey.staking.unbondings, address],
    async () => {
      if (!address) return []
      // Pagination is not required because it is already limited
      const [unbondings] = await lcd.staking.unbondingDelegations(address)
      return unbondings
    },
    { ...RefetchOptions.DEFAULT }
  )
}

export const useStakingPool = (chain: string) => {
  const lcd = useInterchainLCDClient()
  return useQuery([queryKey.staking.pool], () => lcd.staking.pool(chain), {
    ...RefetchOptions.INFINITY,
  })
}

/* helpers */
export const getFindValidator = (validators: Validator[]) => {
  return (address: AccAddress) => {
    const validator = validators.find((v) => v.operator_address === address)
    if (!validator) throw new Error(`${address} is not a validator`)
    return validator
  }
}
export const getTotalStakedTokens = (validators: Validator[]) => {
  const total = BigNumber.sum(
    ...validators.map(({ tokens = 0 }) => Number(tokens))
  ).toNumber()
  return total
}

export const getFindMoniker = (validators: Validator[]) => {
  return (address: AccAddress) => {
    const validator = getFindValidator(validators)(address)
    return validator.description.moniker
  }
}

export const getAvailableStakeActions = (
  destination: ValAddress,
  delegations: Delegation[]
) => {
  return {
    [StakeAction.DELEGATE]: true,
    [StakeAction.REDELEGATE]:
      delegations.filter(
        ({ validator_address }) => validator_address !== destination
      ).length > 0,
    [StakeAction.UNBOND]: !!delegations.filter(
      ({ validator_address }) => validator_address === destination
    ).length,
  }
}

/* delegation */
export const calcDelegationsTotal = (delegations: Delegation[]) => {
  return delegations.length
    ? BigNumber.sum(
        ...delegations.map(({ balance }) => balance.amount.toString())
      ).toString()
    : "0"
}

/* unbonding */
export const calcUnbondingsTotal = (unbondings: UnbondingDelegation[]) => {
  return BigNumber.sum(
    ...unbondings.map(({ entries }) => sumEntries(entries))
  ).toString()
}

export const flattenUnbondings = (unbondings: UnbondingDelegation[]) => {
  return flatten(
    unbondings.map(({ validator_address, entries }) => {
      return entries.map((entry) => ({ ...entry, validator_address }))
    })
  ).sort((a, b) => a.completion_time.getTime() - b.completion_time.getTime())
}

export const sumEntries = (entries: UnbondingDelegation.Entry[]) =>
  BigNumber.sum(
    ...entries.map(({ initial_balance }) => initial_balance.toString())
  ).toString()

/* quick staking helpers */

// TODO: update both to accept non uluna denoms
export const getQuickStakeMsgs = (
  address: string,
  coin: Coin,
  elgibleVals: ValAddress[]
) => {
  const { denom, amount } = coin.toData()
  const bnAmt = new BigNumber(amount)
  const numOfValDests = bnAmt.isLessThan(100 * 10e6)
    ? 1
    : bnAmt.isLessThan(1000 * 10e6)
    ? 2
    : bnAmt.isLessThan(10000 * 10e6)
    ? 3
    : 4

  const destVals = shuffle(elgibleVals).slice(0, numOfValDests)

  const msgs = destVals.map(
    (valDest) =>
      new MsgDelegate(
        address,
        valDest,
        new Coin(denom, bnAmt.dividedToIntegerBy(destVals.length).toString())
      )
  )
  console.log("STAKE MSGS", msgs)

  return msgs
}

//  choose random val and undelegate amount and if not matchign amount add next random validator until remainder of desired stake is met
export const getQuickUnstakeMsgs = (
  address: string,
  coin: Coin,
  delegations: Delegation[]
) => {
  const { denom, amount } = coin.toData()
  const bnAmt = new BigNumber(amount)
  const msgs = []
  let remaining = bnAmt

  for (const delegation of delegations) {
    const { balance, delegator_address } = delegation
    const delAmt = new BigNumber(balance.amount.toString())
    console.log("delAmt", delAmt)
    msgs.push(
      new MsgUndelegate(
        address,
        delegator_address,
        new Coin(
          denom,
          remaining.lt(delAmt) ? remaining.toString() : bnAmt.toString()
        )
      )
    )
    if (remaining.lt(delAmt)) {
      remaining = new BigNumber(0)
    } else {
      remaining = remaining.minus(delAmt)
    }
    if (remaining.isZero()) {
      break
    }
  }
  return msgs
}
