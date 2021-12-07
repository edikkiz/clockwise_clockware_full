import axios from 'axios'
import { FC, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminHeader from 'src/components/Admin/adminHeader/AdminHeader'
import Pagination from 'src/components/reusableСomponents/pagination/pagination'
import { Post } from 'src/models'
import './blog-table-module.css'
import Preloader from '../../Preloader'

type Posts = {
  total: number
  posts: Post[]
}

interface ControllerBlogTableProps {}
const BlogTable: FC<ControllerBlogTableProps> = () => {
  const [posts, setPosts] = useState<Posts>({
    total: 0,
    posts: [],
  })

  const [limit, setLimit] = useState<number>(15)

  const [offset, setOffset] = useState<number>(0)

  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    const getPosts = async () => {
      setIsLoading(true)
      const { data } = await axios.get<Posts>('/posts', {
        params: {
          limit: limit,
          offset: offset,
        },
      })
      setPosts(data)
      setIsLoading(false)
    }
    getPosts()
  }, [limit, offset])


  return (
    <div>
      <Preloader isLoading={isLoading} />
      <AdminHeader />
      <div className="wrapper_blog">
        <table className="wrapper_blog__table">
          <tr>
            <th className="table_block_id__blog">id</th>
            <th className="table_block_id__blog">title Image</th>
            <th className="table_block_name__blog">title</th>
            <th className="table_block_name__blog">description</th>
            <Link
              className="link_create__city"
              to="/admin/add-post"
              title="add new post"
            >
              <th className="table_link__city">+</th>
            </Link>
          </tr>
          {posts.posts.map(post => (
            <tr>
              <th className="table_block_id__blog">{`${post.id}`}</th>
              <th className="table_block_id__blog">
                <img src={post.titleImg} />
              </th>
              <th className="table_block_name__blog">{`${post.title}`}</th>
              <th className="table_block_name__blog">{`${post.previewText}`}</th>
              <Link
                className="link_update__blog"
                to={{
                  pathname: `/admin/add-post`,
                  state: {
                    post: post,
                  },
                }}
              >
                <th className="table_link_blog">update</th>
              </Link>
            </tr>
          ))}
        </table>
      </div>
      {posts.total && (
        <Pagination
          total={posts.total}
          offset={offset}
          setOffset={setOffset}
          limit={limit}
          setLimit={setLimit}
        />
      )}
    </div>
  )
}

export default BlogTable
