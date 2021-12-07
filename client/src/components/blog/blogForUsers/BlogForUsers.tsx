import axios from 'axios'
import { FC, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Post } from 'src/models'
import './blog-for-users-module.css'

type Posts = {
  total: number
  posts: Post[]
}

const limit = 10
interface ControllerBlogForUsersProps {}
const BlogForUsers: FC<ControllerBlogForUsersProps> = () => {
  const [posts, setPosts] = useState<Posts>({
    total: 0,
    posts: [],
  })

  const [offset, setOffset] = useState<number>(0)

  const [onLoad, setOnLoad] = useState<boolean>(true)

  const scrollHandler = (event: any) => {
    if (
      event?.target.documentElement.scrollHeight -
        (event?.target.documentElement.scrollTop + window.innerHeight) <
        200 &&
      posts.total > posts.posts.length
    ) {
      setOnLoad(true)
    }
  }

  useEffect(() => {
    document.addEventListener('scroll', scrollHandler)
    return function () {
      document.removeEventListener('scroll', scrollHandler)
    }
  }, [posts])

  useEffect(() => {
    if (onLoad) {
      axios
        .get<Posts>('/posts', {
          params: {
            limit: limit,
            offset: offset,
          },
        })
        .then(({ data }) => {
          setPosts(prevPosts => {
            return {
              total: data.total,
              posts: [...prevPosts.posts, ...data.posts],
            }
          })
          setOffset(offset + limit)
          setOnLoad(false)
        })
    }
  }, [onLoad])

  return (
    <div>
      {posts.posts.map(({ titleImg, title, previewText, content }) => (
        <Link
          className="post-link"
          to={{
            pathname: `/opened-post`,
            state: {
              content: content,
            },
          }}
        >
          <div className="post-title">{title}</div>
          <div className="post-image">
            <img src={titleImg} />
          </div>
          <div className="post-preview-text">{previewText}</div>
        </Link>
      ))}
    </div>
  )
}

export default BlogForUsers
