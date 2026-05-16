import type { ImgHTMLAttributes } from 'react'

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  src: string
  alt: string
}

export default function PictureImg({ src, alt, ...rest }: Props) {
  const avif = src.replace(/\.(jpe?g|png)$/i, '.avif')
  const hasAvif = avif !== src
  return (
    <picture>
      {hasAvif && <source srcSet={avif} type="image/avif" />}
      <img src={src} alt={alt} {...rest} />
    </picture>
  )
}
