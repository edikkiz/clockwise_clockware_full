import React, { Component, useEffect, useState, FC, useCallback } from 'react'
import axios from 'axios'
import './user-table-module.css'
import { City, Master, User } from 'models'
import { Link } from 'react-router-dom'
import Preloader from 'components/Preloader'
import { useToasts } from 'react-toast-notifications'
import AdminHeader from '../adminHeader/AdminHeader'
const limit = 10


interface ControllerUserTableProps { }
const UsersTable: FC<ControllerUserTableProps> = () => {

  const [users, setUsers] = useState<User[]>([])

  const [offset, setOffset] = useState<number>(0)

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { addToast } = useToasts()

  const getUsersList = useCallback(() => {
    setIsLoading(true)
    const getUsers = async () => {
      const { data } = await axios.get('/admin/users', {
        params: {
          limit,
          offset
        }
      })
      setUsers(data)
      setIsLoading(false)
    }
    getUsers()
  }, [offset])

  useEffect(() => {
    getUsersList()
  }, [getUsersList])

  const onSubmitDelete = useCallback((id: number) => {
    setIsLoading(true)
    if (window.confirm('confirm deletion of the selected order')) {
      axios
        .delete<User[]>(`/admin/user`, {
          data: {
            id: +id,
          },
        })
        .then(() => {
          const localCopy = [...users]
          const deleteIndex = localCopy.findIndex(
            elem => elem.id === id,
          )
          localCopy.splice(deleteIndex, 1)

          setUsers(localCopy)
          setIsLoading(false)
          addToast('user deleted', { appearance: 'success' })

          setIsLoading(true)
          const getUsers = async () => {
            const { data } = await axios.get('/admin/users', {
              params: {
                limit,
                offset
              }
            })
            setUsers(data)
            setIsLoading(false)
          }
          getUsers()
        })
    }
    setIsLoading(false)
  }, [users])

  const next = useCallback(() => {
    setOffset(currentOffset => currentOffset + limit)
  }, [])

  const after = useCallback(() => {
    if (offset < 10) {
      setOffset(0)
    }
    if (offset >= 10) {
      setOffset(offset - limit)
    }
  }, [offset])

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
          {
            users.map(({ id, name, email }) => (
              <tr>
                <th className="table_block_id__user">{`${id}`}</th>
                <th className="table_block_name__user">{`${name}`}</th>
                <th className="table_block_name__user">{`${email}`}</th>
                <Link to={`/admin/change-user/${id}/${name}/${email}`} title="update the user" className="link_update__user"><th className="table_link__user">update</th></Link>
                <button type="button" onClick={() => onSubmitDelete(id)} className="link_update__user"><th className="table_link__user">delete</th></button>
              </tr>
            ))
          }
        </table>
      </div>
      {
        offset !== 0 ? <button className="after_button" onClick={after}>back</button> : <button className="after_button" disabled={true} onClick={after}>back</button>
      }
      {
        users.length >= limit ? <button className="next_button" onClick={next}>next</button> : <button className="next_button" disabled={true} onClick={next}>next</button>
      }
      {
        users.length === 0 && <div>Dont have more orders</div>
      }
    </div>
  )
}

export default UsersTable