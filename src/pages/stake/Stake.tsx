import { useTranslation } from "react-i18next"
import { LinkButton } from "components/general"
import { Card, Col, Page, Row } from "components/layout"
import StakeTabs from "./StakeTabs"
import StakedDonut from "./StakedDonut"
import { useInterchainDelegations } from "data/queries/staking"

const Stake = () => {
  const { t } = useTranslation()

  const interchainDelegations = useInterchainDelegations()

  if (!interchainDelegations) return null

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
        <Row>{interchainDelegations.length && <StakedDonut />}</Row>
        <Card>
          <StakeTabs />
        </Card>
      </Col>
    </Page>
  )
}

export default Stake
