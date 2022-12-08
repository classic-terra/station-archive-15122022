import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { readPercent } from "@terra.kitchen/utils"
import { Validator } from "@terra-money/feather.js"
/* FIXME(terra.js): Import from terra.js */
import { combineState } from "data/query"
import { useInterchainValidators } from "data/queries/staking"
import { useUnbondings, useInterchainDelegation } from "data/queries/staking"
import { getCalcVotingPowerRateByTokens } from "data/Terra/TerraAPI"
import { Table, Flex, Grid } from "components/layout"
import ProfileIcon from "./components/ProfileIcon"
import { ValidatorJailed } from "./components/ValidatorTag"
import styles from "./Validators.module.scss"
import { getIsUnbonded } from "./Validators"

interface Props {
  chainID: string
  keyword: string
  setPageState: React.Dispatch<React.SetStateAction<Object>>
}

const InterchainValidators = (props: Props) => {
  const { t } = useTranslation()

  const { chainID, keyword, setPageState } = props

  const { data: validators, ...validatorsState } =
    useInterchainValidators(chainID)
  const { data: delegations, ...delegationsState } = useInterchainDelegation()
  const { data: undelegations, ...undelegationsState } = useUnbondings()

  const state = combineState(
    validatorsState,
    delegationsState,
    undelegationsState
  )

  setPageState(state)

  const activeValidators = useMemo(() => {
    if (!validators) return null

    const calcRate = getCalcVotingPowerRateByTokens(validators)

    return validators
      .filter(({ status }) => !getIsUnbonded(status))
      .map((validator, index) => {
        //TODO what is the value of index here?
        const { operator_address } = validator

        const rank = index + 1
        const voting_power_rate = calcRate(operator_address)

        return {
          ...validator,
          rank,
          voting_power_rate,
        }
      })
      .sort(({ rank: a }, { rank: b }) => a - b)
  }, [validators])

  //   const [byRank, setByRank] = useState(false)
  //   const renderTerraVals = (keyword: string) => {
  if (!activeValidators) return null
  return (
    <>
      <Table
        //   key={Number(byRank)}
        //   onSort={() => setByRank(false)}
        //   initialSorterKey={byRank ? undefined : "rewards"}
        dataSource={activeValidators}
        filter={({ description: { moniker }, operator_address }) => {
          if (!keyword) return true
          if (moniker.toLowerCase().includes(keyword.toLowerCase())) return true
          if (operator_address === keyword) return true
          return false
        }}
        sorter={(a, b) => Number(a.jailed) - Number(b.jailed)}
        rowKey={({ operator_address }) => operator_address}
        columns={[
          {
            title: t("Moniker"),
            dataIndex: ["description", "moniker"],
            defaultSortOrder: "asc",
            sorter: ({ description: a }, { description: b }) =>
              a.moniker.localeCompare(b.moniker),
            render: (moniker, validator) => {
              const { operator_address, jailed } = validator

              const delegated = delegations?.find(
                ({ validator_address }) =>
                  validator_address === operator_address
              )

              const undelegated = undelegations?.find(
                ({ validator_address }) =>
                  validator_address === operator_address
              )

              return (
                <Flex start gap={8}>
                  <ProfileIcon size={22} />
                  <Grid gap={2}>
                    <Flex gap={4} start>
                      <Link
                        to={`/validator/${operator_address}`}
                        className={styles.moniker}
                      >
                        {moniker}
                      </Link>

                      {jailed && <ValidatorJailed />}
                    </Flex>

                    {(delegated || undelegated) && (
                      <p className={styles.muted}>
                        {[
                          delegated && t("Delegated"),
                          undelegated && t("Undelegated"),
                        ]
                          .filter(Boolean)
                          .join(" | ")}
                      </p>
                    )}
                  </Grid>
                </Flex>
              )
            },
          },
          {
            title: t("Voting power"),
            dataIndex: "voting_power_rate",
            defaultSortOrder: "desc",
            sorter: (
              { voting_power_rate: a = 0 },
              { voting_power_rate: b = 0 }
            ) => a - b,
            render: (value = 0) => readPercent(value),
            align: "right",
          },
          {
            title: t("Commission"),
            dataIndex: ["commission", "commission_rates"],
            defaultSortOrder: "asc",
            sorter: (
              { commission: { commission_rates: a } },
              { commission: { commission_rates: b } }
            ) => a.rate.toNumber() - b.rate.toNumber(),
            render: ({ rate }: Validator.CommissionRates) =>
              readPercent(rate.toString(), { fixed: 2 }),
            align: "right",
          },
        ]}
      />
    </>
  )
}

export default InterchainValidators
