import { useCallback, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"
import { ValAddress, Delegation, Coin } from "@terra-money/feather.js"
import { toAmount } from "@terra.kitchen/utils"
import { getAmount } from "utils/coin"
import { queryKey } from "data/query"
import { useAddress } from "data/wallet"
import { Grid } from "components/layout"
import { Form, FormItem, FormWarning, Input } from "components/form"
import { getPlaceholder, toInput } from "../utils"
import validate from "../validate"
import InterchainTx from "../InterchainTx"
import { useChains } from "data/queries/chains"
import { getInitialGasDenom } from "../Tx"
import {
  calcDelegationsTotal,
  getQuickStakeMsgs,
  getQuickUnstakeMsgs,
  getQuickStakeEligibleVals,
  useInterchainDelegation,
} from "data/queries/staking"
import { useNativeDenoms } from "data/token"
import { QuickStakeAction } from "pages/stake/QuickStake"
import { useInterchainValidators } from "data/queries/staking"

interface TxValues {
  input?: number
}

interface Props {
  action: string
  balances: { denom: string; amount: string }[]
  chainID: string
}

const QuickStakeForm = (props: Props) => {
  const { action, balances, chainID } = props

  const { t } = useTranslation()
  const address = useAddress()
  const chains = useChains()
  const vals = useInterchainValidators(chainID)
  const { data: delegations } = useInterchainDelegation()
  const readNativeDenom = useNativeDenoms()

  const { baseAsset } = chains[chainID]

  /* tx context */
  const initialGasDenom = getInitialGasDenom()

  /* form */
  const form = useForm<TxValues>({
    mode: "onChange",
  })

  const { register, trigger, watch, setValue, handleSubmit, formState } = form
  const { errors } = formState
  const { input } = watch()
  const amount = toAmount(input)

  /* tx */
  const createTx = useCallback(
    ({ input }: TxValues) => {
      if (!(address && vals && delegations)) return
      const coin = new Coin(baseAsset, amount)
      const { decimals } = readNativeDenom(baseAsset)
      const destinations = getQuickStakeEligibleVals([])

      const msgs =
        action === QuickStakeAction.DELEGATE
          ? getQuickStakeMsgs(address, coin, destinations, decimals)
          : getQuickUnstakeMsgs(address, coin, delegations)
      console.log("msgs", msgs)
      return { msgs, chainID }
    },
    [action, amount]
  )

  /* fee */
  const balance = {
    [QuickStakeAction.DELEGATE]: getAmount(balances, baseAsset), // TODO flexible denom
    // [QuickStakeAction.UNBOND]: calcDelegationsTotal(delegations),
  }[action]

  const estimationTxValues = useMemo(() => ({ input: toInput(2) }), [action])

  const onChangeMax = useCallback(
    async (input: number) => {
      setValue("input", input)
      await trigger("input")
    },
    [setValue, trigger]
  )

  const token = action === QuickStakeAction.DELEGATE ? baseAsset : ""

  const tx = {
    token,
    amount,
    balance,
    initialGasDenom,
    estimationTxValues,
    createTx,
    onChangeMax,
    queryKeys: [queryKey.staking.delegations, queryKey.staking.unbondings],
    chain: chainID,
  }

  return (
    <InterchainTx {...tx}>
      {({ max, fee, submit }) => (
        <Form onSubmit={handleSubmit(submit.fn)}>
          {
            {
              [QuickStakeAction.DELEGATE]: (
                <FormWarning>
                  {t(
                    "Leave enough amount of coins to pay fee for subsequent transactions"
                  )}
                </FormWarning>
              ),
              [QuickStakeAction.UNBOND]: (
                <Grid gap={4}>
                  <FormWarning>
                    {t(
                      "Maximum 7 undelegations can be in progress at the same time"
                    )}
                  </FormWarning>
                  <FormWarning>
                    {t(
                      "No reward is distributed during 21 days undelegation period"
                    )}
                  </FormWarning>
                </Grid>
              ),
            }[action]
          }
          <FormItem
            label={t("Amount")}
            extra={max.render()}
            error={errors.input?.message}
          >
            <Input
              {...register("input", {
                valueAsNumber: true,
                validate: validate.input(toInput(max.amount)),
              })}
              token="uluna"
              onFocus={max.reset}
              inputMode="decimal"
              placeholder={getPlaceholder()}
              autoFocus
            />
          </FormItem>

          {fee.render()}
          {submit.button}
        </Form>
      )}
    </InterchainTx>
  )
}

export default QuickStakeForm
