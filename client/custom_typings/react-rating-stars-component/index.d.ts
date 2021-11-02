declare module 'react-rating-stars-component' {
  import React, { MouseEventHandler, ReactElement, SetStateAction } from 'react'

  interface ReactStarsProps {
    count: number
    size: number
    activeColor: string
    isHalf: boolean
    value: number
    onChange: SetStateAction
    index: any
  }
  export default function ReactStars(
    props: ReactStarsProps,
  ): ReactElement<any, any>
}
