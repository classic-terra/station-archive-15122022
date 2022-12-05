import { useNetworkName } from "data/wallet"
import styles from "./NetworkHeader.module.scss"

export const NetworkHeader = () => {
  const network = useNetworkName()

  return <div className={styles.component}>{network}</div>
}
