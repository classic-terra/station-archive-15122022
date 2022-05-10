import { ExternalLink } from "components/general"
import styles from "./BookmarkItem.module.scss"

export interface BookmarkProps {
  url: string
  name: string
  description: string
  image: string
}

const BookmarkItem = ({ url, name, description, image }: BookmarkProps) => {
  const { hostname } = new URL(url)

  return (
    <ExternalLink href={url} className={styles.component}>
      <img src={image} alt="" width={50} height={50} />
      <h1 className={styles.title}>{name}</h1>
      <p className="small muted">{hostname}</p>
      <p className={styles.description}>{description}</p>
    </ExternalLink>
  )
}

export default BookmarkItem
