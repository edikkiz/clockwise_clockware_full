import { useEffect, useState, FC, useCallback } from 'react'
import axios from 'axios'
import './user-table-module.css'
import { User } from 'src/models'
import { Link } from 'react-router-dom'
import Preloader from 'src/components/Preloader'
import { useToasts } from 'react-toast-notifications'
import AdminHeader from '../adminHeader/AdminHeader'
import Pagination from 'src/components/reusable–°omponents/pagination/pagination'

interface UsersResult {
  total: number
  users: User[]
}

interface ControllerUserTableProps {}
const UsersTable: FC<ControllerUserTableProps> = () => {
  const [users, setUsers] = useState<UsersResult>({ total: 0, users: [] })

  const [offset, setOffset] = useState<number>(0)
  const [limit, setLimit] = useState<number>(15)

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { addToast } = useToasts()

  const getUsersList = useCallback(() => {
    setIsLoading(true)
    const getUsers = async () => {
      const { data } = await axios.get<UsersResult>('/admin/users', {
        params: {
          limit,
          offset,
        },
      })
      setUsers(data)
      setIsLoading(false)
    }
    getUsers()
  }, [offset, limit])

  useEffect(() => {
    getUsersList()
  }, [getUsersList])

  const onSubmitDelete = useCallback(
    (id: number) => {
      setIsLoading(true)
      if (window.confirm('confirm deletion of the selected order')) {
        axios
          .delete(`/admin/user`, {
            data: {
              id: +id,
            },
          })
          .then(() => {
            const localCopy = users
            const deleteIndex = localCopy.users.findIndex(
              elem => elem.id === id,
            )
            localCopy.users.splice(deleteIndex, 1)

            setUsers(localCopy)
            setIsLoading(false)
            addToast('user deleted', { appearance: 'success' })

            setIsLoading(true)
            const getUsers = async () => {
              const { data } = await axios.get('/admin/users', {
                params: {
                  limit,
                  offset,
                },
              })
              setUsers(data)
              setIsLoading(false)
            }
            getUsers()
          })
      }
      setIsLoading(false)
    },
    [users],
  )

  return (
    <div>
      <Preloader isLoading={isLoading} />
      <AdminHeader />
      <div className="wrapper_user">
        <table className="wrapper_user__table">
          <tr>
            <th className="table_block_id__user">id</th>
            <th className="table_block_name__user">Name</th>
            <th className="table_block_name__user">email</th>
            <th className="link_create__user">update / delete</th>
          </tr>
          {users.users.map(({ id, name, email }) => (
            <tr>
              <th className="table_block_id__user">{`${id}`}</th>
              <th className="table_block_name__user">{`${name}`}</th>
              <th className="table_block_name__user">{`${email}`}</th>
              <Link
                to={`/admin/change-user/${id}/${name}/${email}`}
                title="update the user"
                className="link_update__user"
              >
                <th className="table_link__user">update</th>
              </Link>
              <button
                type="button"
                onClick={() => onSubmitDelete(id)}
                className="link_update__user"
              >
                <th className="table_link__user">delete</th>
              </button>
            </tr>
          ))}
        </table>
      </div>
      {users.users.length === 0 && <div>Dont have more orders</div>}
      {users.total && (
        <Pagination
          offset={offset}
          setOffset={setOffset}
          limit={limit}
          setLimit={setLimit}
          total={users.total}
        />
      )}
    </div>
  )
}

export default UsersTable
