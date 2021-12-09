import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import './opened-post-module.css'
import Preloader from 'src/components/Preloader'
import axios from 'axios'
import { Post } from 'src/models'
import { useToasts } from 'react-toast-notifications'

const OpenedPost = () => {
  const { id: postId } = useParams<{ id: string }>()

  const [content, setContent] = useState<string>('')

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { addToast } = useToasts()

  useEffect(() => {
    if (postId) {
      const getPostForUpdate = async () => {
        try {
          setIsLoading(true)
          const { data } = await axios.get<Post>('/one-post', {
            params: {
              id: postId,
            },
          })
          setContent(data.content)
          setIsLoading(false)
        } catch {
          addToast('Something wrong, please try again later', {
            appearance: 'error',
          })
          setIsLoading(false)
        }
      }
      getPostForUpdate()
    }
  }, [postId])

  return (
    <div>
      <Preloader isLoading={isLoading} />
      <div className="post">
        <div dangerouslySetInnerHTML={{ __html: content }}></div>
      </div>
    </div>
  )
}

export default OpenedPost
