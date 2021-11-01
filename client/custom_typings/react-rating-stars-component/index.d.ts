import React from 'react'

export interface ReactStarsProps {
  count: number
  size: number
  activeColor: string
  isHalf: boolean
  value: number
  onChange: MouseEventHandler<HTMLSpanElement>
  index: any
  active: any
  config: any
  onMouseOver: any
  onMouseLeave: any
  halfStarHidden: any
  halfStarAt: any
  isUsingIcons: any
  uniqueness: any
}

declare module 'react-rating-stars-component' {
  export function ReactStars(props: ReactStarsProps): ReactElement
}
