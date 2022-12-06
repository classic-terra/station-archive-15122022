// import styles from "./QuickStake.module.scss"
import QuickStakeActionSelector from "./QuickStakeActionSelector"
import QuickStakeForm, { QuickStakeAction } from "txs/stake/QuickStakeForm"
import {
  useDelegations,
  getQuickStakeEligibleVals,
  useInterchainValidators,
} from "data/queries/staking"
import { useBalances } from "data/queries/bank"
import TxContext from "txs/TxContext"
import { Card, ChainFilter, Page } from "components/layout"

const QuickStake = () => {
  const renderQuickStakeForm = (
    chainID: string | undefined,
    action: QuickStakeAction
  ) => {
    const destinations = getQuickStakeEligibleVals(validators) // TODO: use currently selected chain
    if (!(balances && delegations && destinations && chainID && action))
      return null
    const props = {
      tab: action,
      destinations,
      balances,
      delegations,
      chainID,
    }
    return <QuickStakeForm {...props} />
  }

  const { data: balances } = useBalances()
  const { data: delegations } = useDelegations()
  const { data: validators = [] } = useInterchainValidators("phoenix-1") // to do, get chain from ChainFilter

  return (
    <QuickStakeActionSelector>
      {(action) => (
        <ChainFilter outside>
          {(chainID) => (
            <Card>
              <TxContext>{renderQuickStakeForm(chainID, action)}</TxContext>
            </Card>
          )}
        </ChainFilter>
      )}
    </QuickStakeActionSelector>
  )
}

export default QuickStake
