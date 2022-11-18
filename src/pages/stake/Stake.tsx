import { useTranslation } from "react-i18next"
import { LinkButton } from "components/general"
import { Col, Page } from "components/layout"
import StakeOptions from "./StakeOptions"

const Stake = () => {
  const { t } = useTranslation()

  return (
    <Page
      title={t("Stake")}
      extra={
        <LinkButton to="/rewards" color="primary" size="small">
          {t("Withdraw all rewards")}
        </LinkButton>
      }
    >
      <Col>
        <StakeOptions />
      </Col>
    </Page>
  )
}

export default Stake
