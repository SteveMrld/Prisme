'use client'

import styles from './Skeleton.module.css'

type Props = {
  width?: number | string
  height?: number | string
  borderRadius?: number | string
  className?: string
  style?: React.CSSProperties
  dark?: boolean
}

function dim(v: number | string | undefined, fallback: string): string {
  if (v === undefined) return fallback
  return typeof v === 'number' ? `${v}px` : v
}

export default function Skeleton({
  width = '100%',
  height = 20,
  borderRadius = 2,
  className,
  style,
  dark,
}: Props) {
  return (
    <div
      className={`${styles.skeleton} ${dark ? styles.dark : ''} ${className || ''}`}
      style={{
        width: dim(width, '100%'),
        height: dim(height, '20px'),
        borderRadius: dim(borderRadius, '2px'),
        ...style,
      }}
      aria-hidden="true"
    />
  )
}
