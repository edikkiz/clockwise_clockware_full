import axios from 'axios'
import { FC, useEffect, useState } from 'react'
import { Redirect } from 'react-router'
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

  useEffect(() => {
    const getPosts = async () => {
      const { data } = await axios.get<Posts>('/posts', {
        params: {
          limit: limit,
          offset: offset,
        },
      })
      setPosts(data)
    }
    getPosts()
  }, [])

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
