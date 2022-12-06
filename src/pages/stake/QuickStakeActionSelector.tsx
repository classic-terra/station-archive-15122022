import { useTranslation } from "react-i18next"
import { useState } from "react"
import styles from "./QuickStakeActionSelector.module.scss"
import { capitalize } from "@mui/material"
import { QuickStakeAction } from "txs/stake/QuickStakeForm"
import { Button } from "components/general"

export interface Props {
  children: (action: QuickStakeAction) => React.ReactNode
}

const QuickStakeActionSelector = (props: Props) => {
  const { children } = props
  const { t } = useTranslation()
  const [stakeAction, setStakeAction] = useState<QuickStakeAction>(
    QuickStakeAction.DELEGATE
  )
  const actions = [QuickStakeAction.DELEGATE, QuickStakeAction.UNBOND]

  return (
    <div className={styles.action__selector}>
      {actions.map((o) => (
        <Button
          className={o === stakeAction ? styles.active : ""}
          key={o}
          onClick={() => setStakeAction(o)}
        >
          {capitalize(t(o))}
        </Button>
      ))}
      <div className={styles.content}>{children(stakeAction)}</div>
    </div>
  )
}

export default QuickStakeActionSelector
