import { useTranslation } from "react-i18next"
import { useState } from "react"
import styles from "./QuickStake.module.scss"
import QuickStakeActionSelector from "./QuickStakeActionSelector"
import StakeForm, { StakeAction } from "txs/stake/StakeForm"
import { useDelegations, useValidators } from "data/queries/staking"
import { useBalances } from "data/queries/bank"
import { combineState } from "data/query"
import TxContext from "txs/TxContext"
import { Page, Card } from "components/layout"

const QuickStake = () => {
  const [stakeAction, setStakeAction] = useState<StakeAction>(
    "delegate" as StakeAction
  )
  const options = [{ value: "delegate" }, { value: "undelegate" }]
  const destination = "terravaloper1q8w4u2wyhx574m70gwe8km5za2ptanny9mnqy3"

  const renderStakeForm = () => {
    if (!(balances && validators && delegations)) return null
    const props = {
      tab: stakeAction,
      destination,
      balances,
      validators,
      delegations,
    }
    return <StakeForm {...props} />
  }

  const { data: balances, ...balancesState } = useBalances()
  const { data: validators, ...validatorsState } = useValidators()
  const { data: delegations, ...delegationsState } = useDelegations()
  const state = combineState(balancesState, validatorsState, delegationsState)

  return (
    <>
      <QuickStakeActionSelector
        options={options}
        stakeAction={stakeAction}
        setStakeAction={setStakeAction}
      />
      <Page {...state}>
        <Card>
          <TxContext>{renderStakeForm()}</TxContext>
        </Card>
        ,
      </Page>
    </>
  )
}

export default QuickStake
