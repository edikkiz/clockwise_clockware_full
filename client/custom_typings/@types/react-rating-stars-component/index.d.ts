declare module 'react-rating-stars-component' {
  import React, { ReactElement } from 'react'

  interface ReactStarsProps {
    count: number
    size: number
    activeColor: string
    isHalf: boolean
    value: number
    onChange: React.Dispatch<React.SetStateAction<number>>
  }
  export default function ReactStars(
    props: ReactStarsProps,
  ): ReactElement<any, any>
}
