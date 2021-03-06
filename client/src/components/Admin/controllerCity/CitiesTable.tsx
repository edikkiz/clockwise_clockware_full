import React, { Component, useEffect, useState, FC, useCallback } from 'react'
import axios from 'axios'
import './cities-table-module.css'
import { City } from 'src/models'
import { Link } from 'react-router-dom'
import Preloader from 'src/components/Preloader'
import { useToasts } from 'react-toast-notifications'
import AdminHeader from '../adminHeader/AdminHeader'
import Pagination from 'src/components/reusable–°omponents/pagination/pagination'

interface CitiesResult {
  total: number
  cities: City[]
}

interface ControllerCityTableProps {}
const CitiesTable: FC<ControllerCityTableProps> = () => {
  const [cities, setCities] = useState<CitiesResult>({ total: 0, cities: [] })

  const [limit, setLimit] = useState<number>(15)

  const [offset, setOffset] = useState<number>(0)

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { addToast } = useToasts()

  const getCitiesList = useCallback(() => {
    setIsLoading(true)
    const getCities = async () => {
      const { data } = await axios.get<CitiesResult>('/city', {
        params: {
          limit,
          offset,
        },
      })
      setCities(data)
      setIsLoading(false)
    }
    getCities()
  }, [offset, limit])

  useEffect(() => {
    getCitiesList()
  }, [getCitiesList])

  const onSubmitDelete = useCallback(
    (deleteId: number) => {
      setIsLoading(true)
      if (window.confirm('confirm deletion of the selected order')) {
        axios
          .delete<City[]>(`/admin/city`, {
            data: {
              id: +deleteId,
            },
          })
          .then(() => {
            const localCopy = cities
            const deleteIndex = localCopy.cities.findIndex(
              elem => elem.id === deleteId,
            )
            localCopy.cities.splice(deleteIndex, 1)
            setCities(localCopy)
            setIsLoading(false)
            addToast('city deleted', { appearance: 'success' })

            setIsLoading(true)
            const getCities = async () => {
              const { data } = await axios.get<CitiesResult>('/city', {
                params: {
                  limit,
                  offset,
                },
              })
              setCities(data)
              setIsLoading(false)
            }
            getCities()
          })
      }
      setIsLoading(false)
    },
    [cities],
  )

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
    <div className="wrapper_cities">
      <Preloader isLoading={isLoading} />
      <AdminHeader />
      <table className="wrapper_cities__table">
        <tr>
          <th className="table_block_id__city">id</th>
          <th className="table_block_name__city">Name</th>
          <Link
            className="link_create__city"
            to="/admin/change-city"
            title="add new city"
          >
            <th className="table_link__city">+</th>
          </Link>
        </tr>
        {cities.cities.map(({ id, name }) => (
          <tr>
            <th className="table_block_id__city">{`${id}`}</th>
            <th className="table_block_name__city">{`${name}`}</th>
            <Link
              to={`/admin/change-city/${id}/${name}`}
              title="update the city"
              className="link_update__city"
            >
              <th className="table_link">update</th>
            </Link>
            <button
              type="button"
              onClick={() => onSubmitDelete(id)}
              className="link_update__city"
            >
              <th className="table_link">delete</th>
            </button>
          </tr>
        ))}
      </table>
      {cities.cities.length === 0 && <div>Dont have more cities</div>}
      {cities.total && (
        <Pagination
          offset={offset}
          setOffset={setOffset}
          limit={limit}
          setLimit={setLimit}
          total={cities.total}
        />
      )}
    </div>
  )
}

export default CitiesTable
