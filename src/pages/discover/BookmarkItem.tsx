import { ExternalLink } from "components/general"
import styles from "./BookmarkItem.module.scss"

export interface BookmarkProps {
  name: string
  url: string
}

const BookmarkItem = ({ name, url }: BookmarkProps) => {
  const { hostname } = new URL(url)

  return (
    <ExternalLink href={url} className={styles.component}>
      <h1 className={styles.title}>{name}</h1>
      <p className="small muted">{hostname}</p>
    </ExternalLink>
  )
}

export default BookmarkItem
