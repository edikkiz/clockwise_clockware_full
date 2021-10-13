import React, { Component, useEffect, useState, FC, useCallback } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Bar, Line } from 'react-chartjs-2'
import Preloader from '../../../Preloader'
import {
  ChartsData,
  City,
  Master,
  MultiSelectOption,
} from '../../../../models/models'
import { PolarArea } from 'react-chartjs-2'
import { useToasts } from 'react-toast-notifications'
import AdminHeader from '../../adminHeader/AdminHeader'
import { MultiSelect } from "react-multi-select-component";
// 
const nowDate = new Date()
const firstDayMonth = new Date(`${nowDate.getFullYear}-${nowDate.getMonth() < 10 ? '0' + nowDate.getMonth() : nowDate.getMonth()}-${nowDate.getDate() < 10 ? '0' + nowDate.getDate() : nowDate.getDate()}`).toISOString().split('T')[0]

interface OrderChartsProps { }
const OrderCharts: FC<OrderChartsProps> = () => {

  const [cities, setCities] = useState<City[]>([])
  const [cityFilter, setCityFilter] = useState([])
  const [citiesOption, setCitiesOption] = useState<MultiSelectOption[]>([])

  const [masters, setMasters] = useState<Master[]>([])
  const [masterFilter, setMasterFilter] = useState([])
  const [mastersOption, setMastersOption] = useState<MultiSelectOption[]>([])

  const [filterStart, setFilterStart] = useState<string>(firstDayMonth)
  const [filterEnd, setFilterEnd] = useState<string | null>('')

  const { addToast } = useToasts()

  const [labelsCharts, setLabelsCharts] = useState<string[]>([])
  const [dataCharts, setDataCharts] = useState<number[]>([])

  // const [chartsData, setChartsData] = useState()

  // useEffect(() => {
  //   setChartsData({
  //     labels: labelsCharts,
  //     datasets: [
  //       {
  //         label: 'level of thiccness',
  //         data: dataCharts,
  //         backgroundcolor: ['rgba(75, 192, 192, 0.6)'],
  //         borderWidth: 4,
  //       },
  //     ],
  //   })
  // }, [dataCharts, labelsCharts])

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const chart = () => { }

  useEffect(() => {
    chart()
  }, [])

  const getMasters = useCallback(async () => {
    setIsLoading(true)
    const { data } = await axios.get<Master[]>(`/admin/master`)
    setMasters(data)
    data.map(({ name, id }) => setMastersOption((prevMasters) => [...prevMasters, { label: name, value: id }]))
    setIsLoading(false)

  }, [])

  useEffect(() => {
    getMasters()
  }, [getMasters])

  const getCities = useCallback(async () => {
    setIsLoading(true)
    const { data } = await axios.get<City[]>(`/city`)
    setCities(data)
    data.map(({ name, id }) => setCitiesOption((prevCities) => [...prevCities, { label: name, value: id }]))
    setIsLoading(false)
  }, [])

  useEffect(() => {
    getCities()
  }, [getCities])

  const filtered = async () => {
    if (cityFilter || masterFilter || (filterEnd && filterStart)) {
      const { data } = await axios.post('/admin/allOrderCharts', {
        cityId: cityFilter,
        masterId: masterFilter.map((masterData: MultiSelectOption) => masterData.value),
        filterStart: filterStart,
        filterEnd: filterEnd,

      })
      if (!data.length) {
        addToast('no orders for this filter', { appearance: 'warning' })
      }
      setDataCharts([])
      setLabelsCharts([])
      data.map((data: ChartsData) => {
        setDataCharts((prevData) => [...prevData, data.count])
        setLabelsCharts((prevLabels) => [...prevLabels, data.date])
      })
    }
  }




  return (
    <>
      <AdminHeader />
      <div>
        <Preloader isLoading={isLoading} />
        <div className="wrapperFilter">
          <MultiSelect

            className="selectFilter"
            onChange={setCityFilter}
            options={citiesOption}
            value={cityFilter}
            labelledBy="No city for filter"
          />

          <MultiSelect

            className="selectFilter"
            onChange={setMasterFilter}
            options={mastersOption}
            value={masterFilter}
            labelledBy="No city for filter"
          />

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
            value={filterStart}
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
        <div style={{ width: '1750px', margin: 'auto' }}>
          <Line
            data={{
              labels: labelsCharts,
              datasets: [
                {
                  label: 'orders for this day',
                  data: dataCharts,
                  borderWidth: 4,
                },
              ],
            }}
            options={{
              responsive: true,
            }}
          />
        </div>
      </div>
    </>
  )
}

export default OrderCharts
