// import styles from "./QuickStake.module.scss"
import QuickStakeActionSelector from "./QuickStakeActionSelector"
import QuickStakeForm, { QuickStakeAction } from "txs/stake/QuickStakeForm"
import {
  useDelegations,
  useQuickStakeElgibleVals,
  useValidators,
} from "data/queries/staking"
import { useBalances } from "data/queries/bank"
import TxContext from "txs/TxContext"
import { Card, ChainFilter, Page } from "components/layout"

const QuickStake = () => {
  const renderQuickStakeForm = (
    chainID: string | undefined,
    action: QuickStakeAction
  ) => {
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
  const destinations = useQuickStakeElgibleVals("phoenix-1") // TODO: use currently selected chain

  return (
    <Page>
      <QuickStakeActionSelector>
        {(action) => (
          <ChainFilter>
            {(chainID) => (
              <Card>
                <TxContext>{renderQuickStakeForm(chainID, action)}</TxContext>
              </Card>
            )}
          </ChainFilter>
        )}
      </QuickStakeActionSelector>
    </Page>
  )
}

export default QuickStake
