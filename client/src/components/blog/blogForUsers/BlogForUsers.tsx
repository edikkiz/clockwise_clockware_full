import axios from 'axios'
import { FC, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import { Post } from 'src/models'
import './blog-for-users-module.css'

type Posts = {
  total: number
  posts: Post[]
}

const limit = 10
const BlogForUsers = () => {
  const [posts, setPosts] = useState<Posts>({
    total: 0,
    posts: [],
  })

  const [onLoadElement, setOnLoadElement] = useState<HTMLDivElement | null>(
    null,
  )

  const [offset, setOffset] = useState<number>(0)

  const [onLoad, setOnLoad] = useState<boolean>(true)

  const { addToast } = useToasts()

  const observer = useRef(
    new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const first = entries[0]
        if (first.isIntersecting) {
          setOnLoad(true)
        }
      },
      { threshold: 1 },
    ),
  )

  useEffect(() => {
    const currentElement = onLoadElement
    const currentObserver = observer.current
    if (currentElement) {
      currentObserver.observe(currentElement)
    }
    return () => {
      if (currentElement) {
        currentObserver.unobserve(currentElement)
      }
    }
  }, [onLoadElement])

  useEffect(() => {
    const getPosts = () => {
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
          .catch(() => {
            addToast('Something wrong, please try again later', {
              appearance: 'error',
            })
          })
      }
    }
    getPosts()
  }, [onLoad])

  return (
    <div>
      {posts.posts.map(({ previewImg, title, previewText, id }) => (
        <div className="post-link-wrapper">
          <Link className="post-link" to={`/opened-post/${id}`}>
            <div className="post-title">{title}</div>
            <div className="post-image">
              <img src={previewImg} />
            </div>
            <div className="post-preview-text">{previewText}</div>
          </Link>
        </div>
      ))}
      {posts.total > posts.posts.length && (
        <div ref={setOnLoadElement} className="on-load-element"></div>
      )}
    </div>
  )
}

export default BlogForUsers
