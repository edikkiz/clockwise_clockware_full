import { FC, useEffect } from 'react'
import { useLocation, useParams } from 'react-router'
import { Link } from 'react-router-dom'
import './opened-post-module.css'

type LocationState = {
  content: string
}
interface ControllerOpenedPostProps {}
const OpenedPost: FC<ControllerOpenedPostProps> = () => {
  const location = useLocation<LocationState>()

  const { content } = location.state

  return (
    <div className="post">
      <div dangerouslySetInnerHTML={{ __html: content }}></div>
      <div className="button-wrapper">
        <Link to="/blog" className="wrapper_form__button">
          Close post
        </Link>
      </div>
    </div>
  )
}

export default OpenedPost
