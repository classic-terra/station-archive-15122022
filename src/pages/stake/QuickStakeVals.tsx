import { ValAddress } from "@terra-money/feather.js"
import { useQuickStakeElgibleVals } from "data/queries/staking"

const QuickStakeVals = ({
  chainID,
  children,
}: {
  chainID: string
  children: (chain?: string, destinations?: ValAddress[]) => React.ReactNode
}) => {
  const destinations = useQuickStakeElgibleVals(chainID)
  return <div>{children(chainID, destinations)}</div>
}

export default QuickStakeVals
