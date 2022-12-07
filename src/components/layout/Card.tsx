import { PropsWithChildren, ReactNode } from "react"
import { Link, To } from "react-router-dom"
import classNames from "classnames/bind"
import { ExternalLink } from "components/general"
import { Flex } from "../layout"
import { ErrorBoundary, WithFetching } from "../feedback"
import styles from "./Card.module.scss"

const cx = classNames.bind(styles)

export interface Props extends QueryState {
  title?: ReactNode
  extra?: ReactNode

  /* customize */
  size?: "small"
  bordered?: boolean
  muteBg?: boolean
  bg?: boolean

  className?: string
  mainClassName?: string

  /* button */
  onClick?: () => void
  disabled?: boolean

  /* link */
  to?: To
  href?: string
}

const Card = (props: PropsWithChildren<Props>) => {
  const { title, extra, children, onClick, to, href } = props
  const { size, bordered, muteBg, disabled, className, mainClassName, bg } =
    props

  return (
    <WithFetching {...props} height={2}>
      {(progress, wrong) => {
        const style = {
          bordered,
          muteBg,
          bg,
          default: !bordered,
          grid: (title || extra) && (children || wrong),
          link: to || href,
          button: onClick,
          error: wrong,
        }

        const cardClassName = cx(styles.card, size, style, className)

        const content = (
          <>
            {progress}

            {(title || extra) && (
              <header className={styles.header}>
                <h1 className={styles.title}>{title}</h1>
                <Flex className={styles.extra}>{extra}</Flex>
              </header>
            )}

            <section className={classNames(styles.main, mainClassName)}>
              {wrong ?? (children && <ErrorBoundary>{children}</ErrorBoundary>)}
            </section>
          </>
        )

        return href ? (
          <ExternalLink href={href} className={cardClassName}>
            {content}
          </ExternalLink>
        ) : to ? (
          <Link to={to} className={cardClassName}>
            {content}
          </Link>
        ) : onClick ? (
          <button
            className={cardClassName}
            onClick={onClick}
            disabled={disabled}
          >
            {content}
          </button>
        ) : (
          <article className={cardClassName}>{content}</article>
        )
      }}
    </WithFetching>
  )
}

export default Card
