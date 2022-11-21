import { useTranslation } from "react-i18next"
import styles from "./QuickStakeActionSelector.module.scss"
import { capitalize } from "@mui/material"
import { Dispatch } from "react"
import { StakeAction } from "txs/stake/StakeForm"

export interface Props {
  options: { value: string }[]
  setStakeAction: Dispatch<StakeAction>
  stakeAction: StakeAction
}

const QuickStakeActionSelector = (props: Props) => {
  const { options, setStakeAction, stakeAction } = props
  const { t } = useTranslation()

  return (
    <div className={styles.action__selector}>
      {options.map((o) => (
        <button
          className={o.value === stakeAction ? styles.active : ""}
          key={o.value}
          onClick={() => setStakeAction(o.value as StakeAction)}
        >
          {capitalize(t(o.value))}
        </button>
      ))}
    </div>
  )
}

export default QuickStakeActionSelector
