// import styles from "./QuickStake.module.scss"
import QuickStakeActionSelector from "./QuickStakeActionSelector"
import StakeForm, { StakeAction } from "txs/stake/StakeForm"
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
    chain: string | undefined,
    action: StakeAction
  ) => {
    if (
      !(
        balances &&
        validators &&
        delegations &&
        chain &&
        action &&
        quickStakeDesinations &&
        chain
      )
    )
      return null
    const props = {
      tab: action,
      quickStakeDesinations,
      balances,
      validators,
      destination: quickStakeDesinations[0], //TODO: find workaround for this
      delegations,
      chain,
    }
    return <StakeForm {...props} />
  }

  const { data: balances } = useBalances()
  const { data: validators } = useValidators()
  const { data: delegations } = useDelegations()
  const quickStakeDesinations = useQuickStakeElgibleVals("phoenix-1")

  return (
    <Page>
      <QuickStakeActionSelector>
        {(action) => (
          <ChainFilter>
            {(chain) => (
              <Card>
                <TxContext>{renderQuickStakeForm(chain, action)}</TxContext>
              </Card>
            )}
          </ChainFilter>
        )}
      </QuickStakeActionSelector>
    </Page>
  )
}

export default QuickStake
