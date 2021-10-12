import React, { Component, useEffect, useState, FC, useCallback } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Bar } from 'react-chartjs-2'
import Preloader from '../../../Preloader'
import {
  AllOrder,
  City,
  Master,
  OrderForTable,
} from '../../../../models/models'
import { PolarArea } from 'react-chartjs-2'
import { useToasts } from 'react-toast-notifications'

interface OrderChartsProps {}
const OrderCharts: FC<OrderChartsProps> = () => {
  const [orders, setOrders] = useState<OrderForTable[]>([])

  const [cities, setCities] = useState<City[]>([])
  const [cityFilter, setCityFilter] = useState<number | null>(null)

  const [masters, setMasters] = useState<Master[]>([])
  const [masterFilter, setMasterFilter] = useState<number | null>(null)

  const [filterStart, setFilterStart] = useState<string | null>(null)
  const [filterEnd, setFilterEnd] = useState<string | null>(null)

  const { addToast } = useToasts()

  const [labelsCharts, setLabelsCharts] =useState<string[]>(['monday', 'tuesday', 'wednesday', 'thursday', 'friday'])
  const [dataCharts, setDataCharts] = useState<number[]>([])

  const [ordersChartsData, setOrdersChartsData] = useState({
    labels: labelsCharts,
    datasets: [
      {
        label: 'level of thiccness',
        data: dataCharts,
        backgroundcolor: ['rgba(75, 192, 192, 0.6)'],
        borderWidth: 4,
      },
    ],
  })

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const chart = () => {}

  useEffect(() => {
    chart()
  }, [])

  const getMasters = useCallback(async () => {
    setIsLoading(true)
    const { data } = await axios.get<Master[]>(`/admin/master`)
    setMasters(data)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    getMasters()
  }, [getMasters])

  const getCities = useCallback(async () => {
    setIsLoading(true)
    const { data } = await axios.get<City[]>(`/city`)
    setCities(data)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    getCities()
  }, [getCities])

  const filtered = async () => {
    if (cityFilter || masterFilter || (filterEnd && filterStart)) {
      const { data } = await axios.get<OrderForTable[]>(
        '/admin/allOrderCharts',
        {
          params: {
            cityId: cityFilter,
            masterId: masterFilter,
            filterStart: filterStart,
            filterEnd: filterEnd,
          },
        },
      )
      if (!data.length) {
        addToast('no orders for this filter', { appearance: 'warning' })
      }
      setOrders(data)
    }
  }

  return (
    <div>
      <Preloader isLoading={isLoading} />
      <div className="wrapperFilter">
        <select
          className="selectFilter"
          onChange={event => {
            event.currentTarget.value === 'No city for filter'
              ? setCityFilter(null)
              : setCityFilter(+event.currentTarget.value)
          }}
        >
          <option selected>No city for filter</option>
          {cities.map(({ id, name }) => (
            <option selected={id === cityFilter} value={+id}>
              {`${name}`}
            </option>
          ))}
        </select>

        <select
          className="selectFilter"
          onChange={event => {
            event.currentTarget.value === 'No master for filter'
              ? setMasterFilter(null)
              : setMasterFilter(+event.currentTarget.value)
          }}
        >
          <option selected>No master for filter</option>
          {masters.map(({ id, name }) => (
            <option selected={id === masterFilter} value={+id}>
              {`${name}`}
            </option>
          ))}
        </select>

        <button
          className={
            cityFilter || masterFilter || (filterEnd && filterStart)
              ? 'buttonFilter'
              : 'buttonFilter-disabled'
          }
          onClick={filtered}
        >
          filter
        </button>

        <input
          type="date"
          title="select start filter date"
          max={filterEnd !== null ? filterEnd : ''}
          onChange={event => {
            setFilterStart(event.currentTarget.value)
          }}
        />

        <input
          type="date"
          title="select end filter date"
          min={filterStart !== null ? filterStart : ''}
          onChange={event => {
            setFilterEnd(event.currentTarget.value)
          }}
        />
      </div>
      <div style={{ height: '500px', width: '500px' }}>
        <PolarArea
          data={ordersChartsData}
          options={{
            responsive: true,
          }}
        />
      </div>
    </div>
  )
}

export default OrderCharts
