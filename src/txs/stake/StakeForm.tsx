import { useCallback, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"
import { AccAddress, Coin, ValAddress } from "@terra-money/station.js"
import { Delegation, Validator } from "@terra-money/station.js"
import { MsgDelegate, MsgUndelegate } from "@terra-money/station.js"
import { MsgBeginRedelegate } from "@terra-money/station.js"
import { toAmount } from "@terra.kitchen/utils"
import { getAmount } from "utils/coin"
import { queryKey } from "data/query"
import { useAddress } from "data/wallet"
import { getFindMoniker } from "data/queries/staking"
import { Grid } from "components/layout"
import { Form, FormItem, FormWarning, Input, Select } from "components/form"
import { getPlaceholder, toInput } from "../utils"
import validate from "../validate"
import InterchainTx from "../InterchainTx"
import { getInitialGasDenom } from "../Tx"
import { useCreateQuickStakeTx } from "data/Terra/TerraAPI"
interface TxValues {
  source?: ValAddress
  input?: number
}

export enum StakeAction {
  DELEGATE = "delegate",
  REDELEGATE = "redelegate",
  UNBOND = "undelegate",
}

interface Props {
  tab: StakeAction
  destination: ValAddress
  balances: { denom: string; amount: string }[]
  validators: Validator[]
  delegations: Delegation[]
  isQuickStake?: boolean
}

const StakeForm = (props: Props) => {
  const { tab, destination, balances, validators, delegations, isQuickStake } =
    props

  const { t } = useTranslation()
  const x = useCreateQuickStakeTx(100)
  console.log("x", x)
  const address = useAddress()
  // @ts-expect-error
  const findMoniker = getFindMoniker(validators)

  const delegationsOptions = delegations.filter(
    ({ validator_address }) =>
      tab !== StakeAction.REDELEGATE || validator_address !== destination
  )

  const defaultSource = delegationsOptions[0]?.validator_address
  const findDelegation = (address: AccAddress) =>
    delegationsOptions.find(
      ({ validator_address }) => validator_address === address
    )

  /* tx context */
  const initialGasDenom = getInitialGasDenom()

  /* form */
  const form = useForm<TxValues>({
    mode: "onChange",
    defaultValues: { source: defaultSource },
  })

  const { register, trigger, watch, setValue, handleSubmit, formState } = form
  const { errors } = formState
  const { source, input } = watch()
  const amount = toAmount(input)

  /* tx */
  const createTx = useCallback(
    ({ input, source }: TxValues) => {
      if (!address) return

      const amount = toAmount(input)
      const coin = new Coin("uluna", amount)

      if (tab === StakeAction.REDELEGATE) {
        if (!source) return
        const msg = new MsgBeginRedelegate(address, source, destination, coin)
        return { msgs: [msg], chainID: "phoenix-1" }
      }

      if (isQuickStake) {
        const msgs = [new MsgDelegate(address, destination, coin)]
        return { msgs, chainID: "phoenix-1" }
      }

      const msgs = {
        [StakeAction.DELEGATE]: [new MsgDelegate(address, destination, coin)],
        [StakeAction.UNBOND]: [new MsgUndelegate(address, destination, coin)],
      }[tab]

      return { msgs, chainID: "phoenix-1" }
    },
    [address, destination, tab]
  )

  /* fee */
  const balance = {
    [StakeAction.DELEGATE]: getAmount(balances, "uluna"),
    [StakeAction.REDELEGATE]:
      (source && findDelegation(source)?.balance.amount.toString()) ?? "0",
    [StakeAction.UNBOND]:
      findDelegation(destination)?.balance.amount.toString() ?? "0",
  }[tab]

  const estimationTxValues = useMemo(() => {
    return {
      input: toInput(2),
      // to check redelegation stacks
      source: tab === StakeAction.REDELEGATE ? source : undefined,
    }
  }, [source, tab])

  const onChangeMax = useCallback(
    async (input: number) => {
      setValue("input", input)
      await trigger("input")
    },
    [setValue, trigger]
  )

  const token = tab === StakeAction.DELEGATE ? "uluna" : ""
  const tx = {
    token,
    amount,
    balance,
    initialGasDenom,
    estimationTxValues,
    createTx,
    onChangeMax,
    onSuccess: {
      path: `/validator/${destination}`,
    },
    queryKeys: [
      queryKey.staking.delegations,
      queryKey.staking.unbondings,
      queryKey.distribution.rewards,
    ],
    chain: "phoenix-1",
  }

  return (
    <InterchainTx {...tx}>
      {({ max, fee, submit }) => (
        <Form onSubmit={handleSubmit(submit.fn)}>
          {
            {
              [StakeAction.DELEGATE]: (
                <FormWarning>
                  {t(
                    "Leave enough amount of coins to pay fee for subsequent transactions"
                  )}
                </FormWarning>
              ),
              [StakeAction.REDELEGATE]: (
                <FormWarning>
                  {t(
                    "21 days must pass after this transaction to redelegate to this validator again"
                  )}
                </FormWarning>
              ),
              [StakeAction.UNBOND]: (
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

          {tab === StakeAction.REDELEGATE && (
            <FormItem label={t("From")}>
              <Select
                {...register("source", {
                  required:
                    tab === StakeAction.REDELEGATE
                      ? "Source validator is required"
                      : false,
                })}
              >
                {delegationsOptions
                  ?.filter(
                    ({ validator_address }) => validator_address !== destination
                  )
                  .map(({ validator_address }) => (
                    <option value={validator_address} key={validator_address}>
                      {findMoniker(validator_address)}
                    </option>
                  ))}
              </Select>
            </FormItem>
          )}

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

export default StakeForm
