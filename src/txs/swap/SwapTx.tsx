import { useTranslation } from "react-i18next"
import { useIsClassic } from "data/query"
import { LinkButton } from "components/general"
import is from "auth/scripts/is"
import { useNetworkName } from "data/wallet"
import { Card, Page } from "components/layout"
import { Wrong } from "components/feedback"
import TxContext from "../TxContext"
import TFMSwapContext from "./TFMSwapContext"
import TFMSwapForm from "./TFMSwapForm"
import TFMPoweredBy from "./TFMPoweredBy"

// The sequence below is required before rendering the Swap form:
// 1. `TxContext` - Fetch gas prices through, like other forms.
// 2. `SwapContext` - Complete the network request related to swap.
// 3. `SwapSingleContext` - Complete the network request not related to multiple swap

const SwapTx = () => {
  const { t } = useTranslation()
  const networkName = useNetworkName()
  const isClassic = useIsClassic()

  if (networkName === "testnet") {
    return (
      <Page title={t("Swap")} small>
        <Card>
          <Wrong>{t("Not supported")}</Wrong>
        </Card>
      </Page>
    )
  }

  if (networkName === "testnet") {
    return (
      <Page title={is.mobile() ? "" : t("Swap")} small>
        <Card>
          <Wrong>{t("Not supported")}</Wrong>
        </Card>
      </Page>
    )
  }

  if (!isClassic)
    return (
      <Page title={is.mobile() ? "" : t("Swap")} extra={<TFMPoweredBy />} small>
        <TxContext>
          <TFMSwapContext>
            <TFMSwapForm />
          </TFMSwapContext>
        </TxContext>
      </Page>
    )

  return (
    <Page title={t("Swap")} small extra={<TFMPoweredBy />}>
      <TxContext>
        <TFMSwapContext>
          <TFMSwapForm />
        </TFMSwapContext>
      </TxContext>
      {is.mobile() && (
        <div className="row bottom top">
          <LinkButton to="/swap/multiple" block>
            {t("Swap multiple coins")}
          </LinkButton>
        </div>
      )}
    </Page>
  )
}

export default SwapTx
