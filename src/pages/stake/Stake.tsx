import { useTranslation } from "react-i18next"
import { LinkButton } from "components/general"
import { Page } from "components/layout"
import StakeOptions from "./StakeOptions"
import styles from "./Stake.module.scss"

const Stake = () => {
  const { t } = useTranslation()

  return (
    <Page
      title={t("Stake")}
      mainClassName={styles.page}
      extra={
        <LinkButton to="/rewards" color="primary" size="small">
          {t("Withdraw all rewards")}
        </LinkButton>
      }
    >
      {" "}
      <div className={styles.stake__options}>
        <StakeOptions />
      </div>
    </Page>
  )
}

export default Stake
