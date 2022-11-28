// import styles from "./QuickStake.module.scss"
import QuickStakeActionSelector from "./QuickStakeActionSelector"
import StakeForm, { StakeAction } from "txs/stake/StakeForm"
import { useDelegations, useValidators } from "data/queries/staking"
import { useBalances } from "data/queries/bank"
import TxContext from "txs/TxContext"
import { Card, ChainFilter, Page } from "components/layout"

const QuickStake = () => {
  const destination = "terravaloper1q8w4u2wyhx574m70gwe8km5za2ptanny9mnqy3"

  const renderQuickStakeForm = (chainID: string, action: StakeAction) => {
    if (!(balances && validators && delegations && chainID && action))
      return null
    const props = {
      tab: action,
      destination,
      balances,
      validators,
      delegations,
      isQuickStake: true,
      chainID,
    }
    return <StakeForm {...props} />
  }

  const { data: balances } = useBalances()
  const { data: validators } = useValidators()
  const { data: delegations } = useDelegations()

  return (
    <Page>
      <QuickStakeActionSelector>
        {(action) => (
          <ChainFilter>
            {(chainID) => (
              <Card>
                <TxContext>{renderQuickStakeForm(chainID!, action)}</TxContext>
              </Card>
            )}
          </ChainFilter>
        )}
      </QuickStakeActionSelector>
    </Page>
  )
}

export default QuickStake
