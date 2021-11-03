import { FC } from 'react'
import './Preloader.css'

type PreloaderProps = {
  isLoading: boolean
}

const TransparentPreloader: FC<PreloaderProps> = ({ isLoading }) => {
  return isLoading ? (
    <div className={`transparent-preloader`}>
      <div className="transparent-preloader__spinner" />
    </div>
  ) : (
    <></>
  )
}

export default TransparentPreloader
