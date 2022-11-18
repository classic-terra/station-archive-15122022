import { useTranslation } from "react-i18next"
import { useState } from "react"
import { RadioGroup } from "components/form"

const QuickStake = () => {
  const { t } = useTranslation()
  const [stakeAction, setStakeAction] = useState<string>("")
  const options = [
    { value: "delegate", label: "delegate" },
    { value: "undelegate", label: "undelegate" },
  ]
  return (
    <RadioGroup
      options={options}
      value={stakeAction}
      onChange={(action) => setStakeAction(action)}
    />
  )
}

export default QuickStake
