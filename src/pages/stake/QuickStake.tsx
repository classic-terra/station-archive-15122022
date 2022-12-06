// import styles from "./QuickStake.module.scss"
import QuickStakeActionSelector from "./QuickStakeActionSelector"
import QuickStakeForm, { QuickStakeAction } from "txs/stake/QuickStakeForm"
import { useDelegations, useQuickStakeElgibleVals } from "data/queries/staking"
import { useBalances } from "data/queries/bank"
import TxContext from "txs/TxContext"
import { Card, ChainFilter, Page } from "components/layout"
import QuickStakeVals from "./QuickStakeVals"
import { ValAddress } from "@terra-money/feather.js"

const QuickStake = () => {
  const renderQuickStakeForm = (
    chainID: string | undefined,
    action: QuickStakeAction,
    destinations: ValAddress[]
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

  return (
    <Page>
      <QuickStakeActionSelector>
        {(action) => (
          <ChainFilter>
            {(chainID) => (
              <QuickStakeVals chainID={chainID}>
                {(chainID, destinations) => (
                  <TxContext>
                    {renderQuickStakeForm(chainID, action, destinations)}
                  </TxContext>
                )}
              </QuickStakeVals>
            )}
          </ChainFilter>
        )}
      </QuickStakeActionSelector>
    </Page>
  )
}

export default QuickStake
