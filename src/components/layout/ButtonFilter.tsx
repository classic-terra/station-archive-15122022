import { useState } from "react"
import styles from "./ButtonFilter.module.scss"

const ButtonFilter = ({
  children,
  actions,
  outside,
  title,
}: {
  children: (action?: string) => React.ReactNode
  actions: string[]
  outside?: boolean
  title?: string
}) => {
  const [selectedAction, setAction] = useState<string | undefined>(actions[0])

  return (
    <div className={outside ? styles.buttonfilter__out : styles.buttonfilter}>
      <div className={styles.header}>
        {title && <h1>{title}</h1>}
        <div className={styles.actions}>
          {actions.map((action) => (
            <button
              key={action}
              onClick={() => setAction(action)}
              className={selectedAction === action ? styles.active : undefined}
            ></button>
          ))}
        </div>
      </div>
      <div className={styles.content}>{children(selectedAction)}</div>
    </div>
  )
}

export default ButtonFilter
