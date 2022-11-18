import { Tabs } from "components/layout"
import Validators from "./Validators"
import QuickStake from "./QuickStake"
import { useTranslation } from "react-i18next"

const StakeOptions = () => {
  const { t } = useTranslation()
  const tabs = [
    {
      key: "quick",
      tab: t("Quick stake"),
      children: <QuickStake />,
    },
    {
      key: "manual",
      tab: t("Manual stake"),
      children: [<Validators />],
    },
  ]

  return <Tabs tabs={tabs} type="card" />
}

export default StakeOptions
