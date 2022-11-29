import { useTranslation } from "react-i18next"
import { useState } from "react"
import styles from "./QuickStakeActionSelector.module.scss"
import { capitalize } from "@mui/material"
import { QuickStakeAction } from "txs/stake/QuickStakeForm"

export interface Props {
  children: (action: QuickStakeAction) => React.ReactNode
}

const QuickStakeActionSelector = (props: Props) => {
  const { children } = props
  const { t } = useTranslation()
  const [stakeAction, setStakeAction] = useState<QuickStakeAction>(
    "delegate" as QuickStakeAction
  )

  return (
    <div className={styles.action__selector}>
      {["delegate", "undelegate"].map((o) => (
        <button
          className={o === stakeAction ? styles.active : ""}
          key={o}
          onClick={() => setStakeAction(o as QuickStakeAction)}
        >
          {capitalize(t(o))}
        </button>
      ))}
      <div className={styles.content}>{children(stakeAction)}</div>
    </div>
  )
}

export default QuickStakeActionSelector
