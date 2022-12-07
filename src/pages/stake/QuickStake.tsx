// import QuickStakeActionSelector from "./QuickStakeActionSelector"
// import QuickStakeForm, { QuickStakeAction } from "txs/stake/QuickStakeForm"
import { useDelegations } from "data/queries/staking"
import { useBalances } from "data/queries/bank"
import { Card, ChainFilter, ButtonFilter } from "components/layout"
import QuickStakeForm from "txs/stake/QuickStakeForm"

export enum QuickStakeAction {
  DELEGATE = "delegate",
  UNBOND = "undelegate",
}

const QuickStake = () => {
  const renderQuickStakeForm = (
    chainID: string | undefined,
    action: string | undefined
  ) => {
    if (!(balances && chainID && action)) return null
    const props = {
      action,
      balances,
      chainID,
    }
    return <QuickStakeForm {...props} />
  }

  const { data: balances } = useBalances()

  return (
    <Card>
      <ButtonFilter
        title="Select action"
        actions={[QuickStakeAction.DELEGATE, QuickStakeAction.UNBOND]}
      >
        {(action) => (
          <Card muteBg>
            <ChainFilter outside>
              {(chainID) => renderQuickStakeForm(chainID, action)}
            </ChainFilter>
          </Card>
        )}
      </ButtonFilter>
    </Card>
  )
}

export default QuickStake
