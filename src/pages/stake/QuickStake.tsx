// import QuickStakeActionSelector from "./QuickStakeActionSelector"
// import QuickStakeForm, { QuickStakeAction } from "txs/stake/QuickStakeForm"
import {
  useDelegations,
  getQuickStakeEligibleVals,
  useInterchainValidators,
} from "data/queries/staking"
import { useBalances } from "data/queries/bank"
import { Card, ChainFilter, Page, ButtonFilter } from "components/layout"

export enum QuickStakeAction {
  DELEGATE = "delegate",
  UNBOND = "undelegate",
}

const QuickStake = () => {
  const { data: balances } = useBalances()
  const { data: delegations } = useDelegations()

  return (
    <ButtonFilter
      title="Select Actions"
      actions={[QuickStakeAction.DELEGATE, QuickStakeAction.UNBOND]}
    >
      {(action) => (
        <ChainFilter outside>{(chainID) => <Card>{chainID}</Card>}</ChainFilter>
      )}
    </ButtonFilter>
  )
}

export default QuickStake
