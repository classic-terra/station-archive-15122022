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

const LoremIpsum =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

const IMAGE =
  "https://assets.website-files.com/611153e7af98140f97da19cf/613042c86c45a079f2bb0dde_612bbc4f0ca5ae3a217f16d5_Anchor_dark-p-500.png"

const list = [
  {
    url: "https://app.anchorprotocol.com/",
    name: "Anchor",
    description: LoremIpsum,
    image: IMAGE,
  },
  {
    url: "https://app.astroport.fi/",
    name: "Astroport",
    description: LoremIpsum,
    image: IMAGE,
  },
  {
    url: "https://coinhall.org/",
    name: "Coinhall",
    description: LoremIpsum,
    image: IMAGE,
  },
  {
    url: "https://terra.mirror.finance/",
    name: "Mirror Protocol",
    description: LoremIpsum,
    image: IMAGE,
  },
  {
    url: "https://app.edgeprotocol.io/pool",
    name: "Edge Protocol",
    description: LoremIpsum,
    image: IMAGE,
  },
  {
    url: "https://terra.staderlabs.com/lt-pools",
    name: "Stader Labs",
    description: LoremIpsum,
    image: IMAGE,
  },
  {
    url: "https://prismprotocol.app/",
    name: "Prism",
    description: LoremIpsum,
    image: IMAGE,
  },
  {
    url: "https://app.terraswap.io/swap",
    name: "Terraswap",
    description: LoremIpsum,
    image: IMAGE,
  },
  {
    url: "https://www.pylon.money/",
    name: "Pylon Protocol",
    description: LoremIpsum,
    image: IMAGE,
  },
  {
    url: "https://app.marsprotocol.io/#/redbank",
    name: "Mars Protocol",
    description: LoremIpsum,
    image: IMAGE,
  },
  {
    url: "https://terra.spec.finance/vaults",
    name: "Spectrum Protocol",
    description: LoremIpsum,
    image: IMAGE,
  },
  {
    url: "https://terra.nexusprotocol.app/",
    name: "Nexus Protocol",
    description: LoremIpsum,
    image: IMAGE,
  },
  {
    url: "https://dex.loop.markets/",
    name: "Loop Finance",
    description: LoremIpsum,
    image: IMAGE,
  },
  {
    url: "https://kujira.app/",
    name: "Kujira",
    description: LoremIpsum,
    image: IMAGE,
  },
  {
    url: "https://app.whitewhale.money/",
    name: "White Whale",
    description: LoremIpsum,
    image: IMAGE,
  },
  {
    url: "https://app.apollo.farm/",
    name: "ApolloDAO",
    description: LoremIpsum,
    image: IMAGE,
  },
  {
    url: "https://app.kinetic.money/vault",
    name: "Kinetic Money",
    description: LoremIpsum,
    image: IMAGE,
  },
  {
    url: "https://app.neb.money/",
    name: "Nebula",
    description: LoremIpsum,
    image: IMAGE,
  },
  {
    url: "http://tfm.com/",
    name: "Terraformer",
    description: LoremIpsum,
    image: IMAGE,
  },
  {
    url: "https://randomearth.io/",
    name: "RandomEarth",
    description: LoremIpsum,
    image: IMAGE,
  },
  {
    url: "https://www.oneplanetnft.io/",
    name: "OnePlanet",
    description: LoremIpsum,
    image: IMAGE,
  },
  {
    url: "https://luart.io/",
    name: "Luart",
    description: LoremIpsum,
    image: IMAGE,
  },
  {
    url: "https://talis.art/",
    name: "Talis Protocol",
    description: LoremIpsum,
    image: IMAGE,
  },
  {
    url: "https://knowhere.art/",
    name: "Knowhere",
    description: LoremIpsum,
    image: IMAGE,
  },
  {
    url: "https://messier.art/",
    name: "Messier",
    description: LoremIpsum,
    image: IMAGE,
  },
  {
    url: "https://lunart.io/",
    name: "LunArt",
    description: LoremIpsum,
    image: IMAGE,
  },
  {
    url: "https://ozone.riskharbor.com/",
    name: "Risk Harbor",
    description: LoremIpsum,
    image: IMAGE,
  },
  {
    url: "https://app.aperture.finance/",
    name: "Aperture Finance",
    description: LoremIpsum,
    image: IMAGE,
  },
  {
    url: "https://app.starterra.io/",
    name: "StarTerra",
    description: LoremIpsum,
    image: IMAGE,
  },
  {
    url: "https://www.angelprotocol.io/app/marketplace",
    name: "Angel Protocol",
    description: LoremIpsum,
    image: IMAGE,
  },
  {
    url: "http://sig.finance/",
    name: "Sigma",
    description: LoremIpsum,
    image: IMAGE,
  },
  {
    url: "https://app.suberra.io/",
    name: "Suberra",
    description: LoremIpsum,
    image: IMAGE,
  },
  {
    url: "https://retrograde.money/",
    name: "Retrograde",
    description: LoremIpsum,
    image: IMAGE,
  },
  {
    url: "https://reactor.money/",
    name: "Reactor",
    description: LoremIpsum,
    image: IMAGE,
  },
  {
    url: "https://terrafloki.io/",
    name: "TerraFloki",
    description: LoremIpsum,
    image: IMAGE,
  },
  {
    url: "https://app.valkyrieprotocol.com/",
    name: "Valkyrie Protocol",
    description: LoremIpsum,
    image: IMAGE,
  },
  {
    url: "https://app.terraworld.me/Gov",
    name: "Terra World",
    description: LoremIpsum,
    image: IMAGE,
  },
  {
    url: "https://atlo.app/",
    name: "Atlo",
    description: LoremIpsum,
    image: IMAGE,
  },
  {
    url: "https://tns.money/",
    name: "Terra Name Service",
    description: LoremIpsum,
    image: IMAGE,
  },
  {
    url: "https://deviantsfactions.com/",
    name: "Deviants Factions",
    description: LoremIpsum,
    image: IMAGE,
  },
  {
    url: "https://terra.playnity.io/",
    name: "Playnity",
    description: LoremIpsum,
    image: IMAGE,
  },
  {
    url: "https://app.sayve.money/governance",
    name: "Sayve",
    description: LoremIpsum,
    image: IMAGE,
  },
  {
    url: "https://token.robohero.io/",
    name: "Robohero",
    description: LoremIpsum,
    image: IMAGE,
  },
  {
    url: "https://app.orne.io/",
    name: "Orne",
    description: LoremIpsum,
    image: IMAGE,
  },
  {
    url: "https://app.lunaverse.io/",
    name: "Lunaverse",
    description: LoremIpsum,
    image: IMAGE,
  },
  {
    url: "https://terrnado.cash/deposit",
    name: "Terrnado",
    description: LoremIpsum,
    image: IMAGE,
  },
  {
    url: "https://miaw-trader.com/home",
    name: "Miaw Trader",
    description: LoremIpsum,
    image: IMAGE,
  },
  {
    url: "https://loterra.io/",
    name: "Loterra",
    description: LoremIpsum,
    image: IMAGE,
  },
  {
    url: "https://gov.glowyield.com/",
    name: "Glow Savings",
    description: LoremIpsum,
    image: IMAGE,
  },
  {
    url: "https://app.lighthousedefi.com/",
    name: "Lighthouse Defi",
    description: LoremIpsum,
    image: IMAGE,
  },
  {
    url: "https://app.inkprotocol.finance/",
    name: "INK Protocol",
    description: LoremIpsum,
    image: IMAGE,
  },
  {
    url: "https://app.brokkr.finance/",
    name: "Brokrr",
    description: LoremIpsum,
    image: IMAGE,
  },
  {
    url: "https://777s.art/",
    name: "777s Casino",
    description: LoremIpsum,
    image: IMAGE,
  },
]
