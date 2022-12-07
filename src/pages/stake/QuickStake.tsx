// import QuickStakeActionSelector from "./QuickStakeActionSelector"
// import QuickStakeForm, { QuickStakeAction } from "txs/stake/QuickStakeForm"
import {
  useDelegations,
  getQuickStakeEligibleVals,
  useInterchainValidators,
} from "data/queries/staking"
import { useBalances } from "data/queries/bank"
import { Card, ChainFilter, Page } from "components/layout"

const QuickStake = () => {
  const { data: balances } = useBalances()
  const { data: delegations } = useDelegations()

  return <ChainFilter outside>{(chainID) => <Card></Card>}</ChainFilter>
}

export default QuickStake
