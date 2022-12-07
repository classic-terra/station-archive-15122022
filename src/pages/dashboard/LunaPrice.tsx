import { useTranslation } from "react-i18next"
import { useCurrency } from "data/settings/Currency"
import { useMemoizedPrices } from "data/queries/coingecko"
import { Card } from "components/layout"
import { Read } from "components/token"
import { ModalButton, ModalRef, Mode } from "components/feedback"
import LunaPriceChart from "../charts/LunaPriceChart"
import DashboardContent from "./components/DashboardContent"
import styles from "./Dashboard.module.scss"
import { isWallet } from "auth"
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"
import { forwardRef, useRef } from "react"

const ChartButton = forwardRef<ModalRef, any>((_, ref) => {
  const { t } = useTranslation()
  return (
    <ModalButton
      ref={ref}
      title={t("Luna price")}
      modalType={isWallet.mobile() ? Mode.FULL : Mode.DEFAULT}
      renderButton={(open) => (
        <div onClick={open}>
          {isWallet.mobile() ? (
            <ArrowForwardIosIcon style={{ fontSize: 12 }} />
          ) : (
            t("Show chart")
          )}
        </div>
      )}
    >
      <LunaPriceChart />
    </ModalButton>
  )
})

const LunaPrice = () => {
  const { t } = useTranslation()
  const currency = useCurrency()
  const denom = currency.id === "uluna" ? "uusd" : currency.id
  const { data: prices, ...state } = useMemoizedPrices()

  const modalRef = useRef<ModalRef>({
    open: () => {},
    close: () => {},
  })

  const render = () => {
    if (!prices) return
    const { uluna: price } = prices
    return (
      <DashboardContent
        value={<Read amount={String(price.price * 1e6)} denom={denom} auto />}
        footer={
          <ModalButton
            title={t("Luna price")}
            renderButton={(open) => (
              <button onClick={open}>{t("Show chart")}</button>
            )}
          >
            <LunaPriceChart />
          </ModalButton>
        }
      />
    )
  }

  return (
    <Card
      {...state}
      title={t("Luna price")}
      className={styles.price}
      size="small"
      extra={isWallet.mobile() && <ChartButton ref={modalRef} />}
      onClick={isWallet.mobile() ? () => modalRef.current.open() : undefined}
    >
      {render()}
    </Card>
  )
}

export default LunaPrice
