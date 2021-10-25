import React, { Component, useEffect, useState, FC, useCallback, useMemo } from 'react'
import axios from 'axios'
import './masters_table_module.css'
import { City, Master } from '../../../models'
import { Link } from 'react-router-dom'
import Preloader from '../../Preloader'
import { useToasts } from 'react-toast-notifications'
import AdminHeader from '../adminHeader/AdminHeader'
const limit = 10

interface ControllerMasterTableProps { }
const MastersTable: FC<ControllerMasterTableProps> = () => {

  const [masters, setMasters] = useState<Master[]>([])

  const [cities, setCities] = useState<City[]>([])

  const [offset, setOffset] = useState<number>(0)

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { addToast } = useToasts()

  const masterLenght = useMemo(() => masters.length, [masters.length])

  const getMastersList = useCallback(() => {
    setIsLoading(true)
    const getMasters = async () => {
      const { data } = await axios.get<Master[]>('/admin/master', {
        params: {
          limit,
          offset
        }
      })
      setMasters(data)
      setIsLoading(false)
    }
    getMasters()
  }, [offset])

  useEffect(() => {
    getMastersList()
  }, [getMastersList])

  const getCity = useCallback(() => {
    setIsLoading(true)
    const getCities = async () => {
      const { data } = await axios.get<City[]>('/city')
      setCities(data)
      setIsLoading(false)
    }
    getCities()
  }, [offset])

  useEffect(() => {
    getCity()
  }, [])


  const city = (id: number) => cities.find((elem) => elem.id === id)?.name

  const onSubmitDelete = useCallback((id: number) => {
    setIsLoading(true)
    if (window.confirm('confirm deletion of the selected order')) {
      axios
        .delete<Master[]>(`/admin/master`, {
          data: {
            id: +id,
          },
        })
        .then(() => {
          const localCopy = [...masters]
          const deleteIndex = localCopy.findIndex(elem => elem.id === id)
          localCopy.splice(deleteIndex, 1)
          setMasters(localCopy)
          setIsLoading(false)
          addToast('master deleted', { appearance: 'success' })

          setIsLoading(true)
          const getMasters = async () => {
            const { data } = await axios.get<Master[]>('/admin/master', {
              params: {
                limit,
                offset
              }
            })
            setMasters(data)
            setIsLoading(false)
          }
          getMasters()
        })
    }
    setIsLoading(false)
  }, [])

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
      <div className="wrapper_masters">
        <table className="wrapper_masters__table">
          <tr>
            <th className="table_block_id__master">id</th>
            <th className="table_block_name__master">Name</th>
            <th className="table_block_name__master">City</th>
            <th className="link_delete__master">delete</th>
          </tr>
          {
            masters.map(({ id, name, cityId }) => (
              <tr>
                <th className="table_block_id__master">{`${id}`}</th>
                <th className="table_block_name__master">{`${name}`}</th>
                <th className="table_block_name__master">{`${(city(cityId))}`}</th>

                <button type="button" onClick={() => onSubmitDelete(id)} className="link_update__master"><th className="table_link">delete</th></button>

              </tr>
            ))
          }
        </table>
      </div>
      {
        offset !== 0 ? <button className="after_button" onClick={after}>back</button> : <button className="after_button" disabled={true} onClick={after}>back</button>
      }
      {
        masterLenght >= limit ? <button className="next_button" onClick={next}>next</button> : <button className="next_button" disabled={true} onClick={next}>next</button>
      }
      {
        masterLenght === 0 && <div>Dont have more orders</div>
      }
    </div>
  )
}


export default MastersTable