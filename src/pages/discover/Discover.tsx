import { useTranslation } from "react-i18next"
import { useTerraAssets } from "data/Terra/TerraAssets"
import { Grid, Page } from "components/layout"
import WithSearchInput from "pages/custom/WithSearchInput"
import BookmarkItem from "./BookmarkItem"
import styles from "./Discover.module.scss"

const Discover = () => {
  const { t } = useTranslation()

  /* submit */
  const { data: result, ...state } = useTerraAssets("/cw20/tokens.json")

  return (
    <Page {...state} title={t("Discover")}>
      <WithSearchInput>
        {(keyword) => (
          <Grid gap={20} className={styles.list}>
            {list
              .filter(({ name, url }) =>
                [name, url].some((str) =>
                  str.toLowerCase().includes(keyword.toLowerCase())
                )
              )
              .map((item) => (
                <BookmarkItem {...item} key={item.name} />
              ))}
          </Grid>
        )}
      </WithSearchInput>
    </Page>
  )
}

export default Discover

const list = [
  { name: "Anchor", url: "https://app.anchorprotocol.com/" },
  { name: "Astroport", url: "https://app.astroport.fi/" },
  { name: "Coinhall", url: "https://coinhall.org/" },
  { name: "Mirror Protocol", url: "https://terra.mirror.finance/" },
  { name: "Edge Protocol", url: "https://app.edgeprotocol.io/pool" },
  { name: "Stader Labs", url: "https://terra.staderlabs.com/lt-pools" },
  { name: "Prism", url: "https://prismprotocol.app/" },
  { name: "Terraswap", url: "https://app.terraswap.io/swap" },
  { name: "Pylon Protocol", url: "https://www.pylon.money/" },
  { name: "Mars Protocol", url: "https://app.marsprotocol.io/#/redbank" },
  { name: "Spectrum Protocol", url: "https://terra.spec.finance/vaults" },
  { name: "Nexus Protocol", url: "https://terra.nexusprotocol.app/" },
  { name: "Loop Finance", url: "https://dex.loop.markets/" },
  { name: "Kujira", url: "https://kujira.app/" },
  { name: "White Whale", url: "https://app.whitewhale.money/" },
  { name: "ApolloDAO", url: "https://app.apollo.farm/" },
  { name: "Kinetic Money", url: "https://app.kinetic.money/vault" },
  { name: "Nebula", url: "https://app.neb.money/" },
  { name: "Terraformer", url: "http://tfm.com/" },
  { name: "RandomEarth", url: "https://randomearth.io/" },
  { name: "OnePlanet", url: "https://www.oneplanetnft.io/" },
  { name: "Luart", url: "https://luart.io/" },
  { name: "Talis Protocol", url: "https://talis.art/" },
  { name: "Knowhere", url: "https://knowhere.art/" },
  { name: "Messier", url: "https://messier.art/" },
  { name: "LunArt", url: "https://lunart.io/" },
  { name: "Risk Harbor", url: "https://ozone.riskharbor.com/" },
  { name: "Aperture Finance", url: "https://app.aperture.finance/" },
  { name: "StarTerra", url: "https://app.starterra.io/" },
  {
    name: "Angel Protocol",
    url: "https://www.angelprotocol.io/app/marketplace",
  },
  { name: "Sigma", url: "http://sig.finance/" },
  { name: "Suberra", url: "https://app.suberra.io/" },
  { name: "Retrograde", url: "https://retrograde.money/" },
  { name: "Reactor", url: "https://reactor.money/" },
  { name: "TerraFloki", url: "https://terrafloki.io/" },
  { name: "Valkyrie Protocol", url: "https://app.valkyrieprotocol.com/" },
  { name: "Terra World", url: "https://app.terraworld.me/Gov" },
  { name: "Atlo", url: "https://atlo.app/" },
  { name: "Terra Name Service", url: "https://tns.money/" },
  { name: "Deviants Factions", url: "https://deviantsfactions.com/" },
  { name: "Playnity", url: "https://terra.playnity.io/" },
  { name: "Sayve", url: "https://app.sayve.money/governance" },
  { name: "Robohero", url: "https://token.robohero.io/" },
  { name: "Orne", url: "https://app.orne.io/" },
  { name: "Lunaverse", url: "https://app.lunaverse.io/" },
  { name: "Terrnado", url: "https://terrnado.cash/deposit" },
  { name: "Miaw Trader", url: "https://miaw-trader.com/home" },
  { name: "Loterra", url: "https://loterra.io/" },
  { name: "Glow Savings", url: "https://gov.glowyield.com/" },
  { name: "Lighthouse Defi", url: "https://app.lighthousedefi.com/" },
  { name: "INK Protocol", url: "https://app.inkprotocol.finance/" },
  { name: "Brokrr", url: "https://app.brokkr.finance/" },
  { name: "777s Casino", url: "https://777s.art/" },
]
