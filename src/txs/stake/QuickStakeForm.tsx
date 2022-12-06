import { useCallback, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"
import { ValAddress, Delegation } from "@terra-money/feather.js"
import { toAmount } from "@terra.kitchen/utils"
import { getAmount } from "utils/coin"
import { queryKey } from "data/query"
import { useAddress } from "data/wallet"
import { Grid } from "components/layout"
import { Form, FormItem, FormWarning, Input } from "components/form"
import { getPlaceholder, toInput } from "../utils"
import validate from "../validate"
import InterchainTx from "../InterchainTx"
import { getInitialGasDenom } from "../Tx"
import {
  calcDelegationsTotal,
  getQuickStakeMsgs,
  getQuickUnstakeMsgs,
} from "data/queries/staking"

interface TxValues {
  input?: number
}

export enum QuickStakeAction {
  DELEGATE = "delegate",
  UNBOND = "undelegate",
}

interface Props {
  tab: QuickStakeAction
  destinations: ValAddress[]
  balances: { denom: string; amount: string }[]
  delegations: Delegation[]
  chainID: string
}

const QuickStakeForm = (props: Props) => {
  const { tab, destinations, balances, delegations, chainID } = props

  const { t } = useTranslation()
  const address = useAddress()

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
      if (!address) return
      const amount = toAmount(input)
      const msgs = getQuickStakeMsgs(address, amount, destinations)

      if (tab === QuickStakeAction.DELEGATE) {
        const msgs = getQuickStakeMsgs(address, amount, destinations)
      }

      if (tab === QuickStakeAction.UNBOND) {
        getQuickUnstakeMsgs(address, amount, delegations)
        return { msgs, chainID }
      }
      return { msgs, chainID }
    },
    [address, tab]
  )

  /* fee */
  const balance = {
    [QuickStakeAction.DELEGATE]: getAmount(balances, "uluna"), // TODO flexible denom
    [QuickStakeAction.UNBOND]: calcDelegationsTotal(delegations),
  }[tab]

  const estimationTxValues = useMemo(() => {
    return {
      input: toInput(2),
    }
  }, [tab])

  const onChangeMax = useCallback(
    async (input: number) => {
      setValue("input", input)
      await trigger("input")
    },
    [setValue, trigger]
  )

  const token = tab === QuickStakeAction.DELEGATE ? "uluna" : ""

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
            }[tab]
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
