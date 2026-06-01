import type { ImgHTMLAttributes } from 'react'

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  src: string
  alt: string
}

/* Wrapper minimaliste autour de <img>. On n'émet plus de <source> AVIF
   spéculatif : la grande majorité des images du repo n'a pas de jumeau
   .avif, et un srcSet AVIF qui 404 ne déclenche pas le fallback du
   <picture> sur les navigateurs modernes — l'image casse silencieusement.
   Si on veut un jour servir de l'AVIF sélectivement, le faire à partir
   d'une liste positive vérifiée, pas par substitution d'extension. */
export default function PictureImg({ src, alt, ...rest }: Props) {
  return <img src={src} alt={alt} {...rest} />
}
