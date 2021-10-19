import React, { Component, useEffect, useState, FC, useCallback } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Bar, Doughnut, Line, Radar } from 'react-chartjs-2'
import Preloader from '../../../Preloader'
import {
  ChartsData,
  ChartsDataCity,
  ChartsDataMaster,
  City,
  ClockSize,
  dataCityGraph,
  dataGraph,
  dataMasterAndCityGraph,
  dataMasterGraph,
  Master,
  MasterForTableCharts,
  MultiSelectOption,
} from '../../../../models/models'
import { PolarArea } from 'react-chartjs-2'
import { useToasts } from 'react-toast-notifications'
import AdminHeader from '../../adminHeader/AdminHeader'
import { MultiSelect } from "react-multi-select-component";
import './order_charts_module.css'

const limit = 10
const nowDate = new Date()
const firstDayMonth = new Date(`${nowDate.getFullYear()}-${nowDate.getMonth() + 1 < 10 ? '0' + nowDate.getMonth() + 1 : nowDate.getMonth() + 1}-01`).toISOString().split('T')[0]
const lastDayMonth = new Date(nowDate.getFullYear(), nowDate.getMonth() + 1, 0 + 1).toISOString().split('T')[0]

interface OrderChartsProps { }
const OrderCharts: FC<OrderChartsProps> = () => {
  const [offset, setOffset] = useState<number>(0)

  const [cityFilter, setCityFilter] = useState([])
  const [citiesOption, setCitiesOption] = useState<MultiSelectOption[]>([])
  const [citiesId, setCitiesId] = useState<number[]>()
  const [citiesLabelsDiagram, setCitiesLabelsDiagram] = useState<string[]>([])
  const [citiesCountDiagram, setCitiesCountDiagram] = useState<number[]>([])

  const [masterFilter, setMasterFilter] = useState([])
  const [mastersOption, setMastersOption] = useState<MultiSelectOption[]>([])
  const [mastersId, setMastersId] = useState<number[]>()
  const [mastersLabelsDiagram, setMastersLabelsDiagram] = useState<string[]>([])
  const [mastersCountDiagram, setMastersCountDiagram] = useState<number[]>([])

  const [masters, setMasters] = useState<MasterForTableCharts[]>([])
  const [clockSizes, setClockSizes] = useState<ClockSize[]>([])

  const [filterStart, setFilterStart] = useState<string>(firstDayMonth)
  const [filterEnd, setFilterEnd] = useState<string>(lastDayMonth)

  const { addToast } = useToasts()

  const [labelsGraph, setLabelsGraph] = useState<string[]>([])
  const [dataGraph, setDataGraph] = useState<number[]>([])

  const [dataMasterGraph, setDataMasterGraph] = useState<number[]>([])
  const [dataCityGraph, setDataCityGraph] = useState<number[]>([])

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const getMasters = useCallback(async () => {
    setIsLoading(true)
    const masters = await axios.get<Master[]>(`/admin/master`)
    masters.data.map(({ name, id }) => setMastersOption((prevMasters) => [...prevMasters, { label: name, value: id }]))
    const allMastersId = masters.data.map(({ id }) => id)
    setMastersId(allMastersId)
    setIsLoading(false)
  }, [])


  const getClockSize = useCallback(async () => {
    setIsLoading(true)
    const { data } = await axios.get<ClockSize[]>(`/clockSizes`)
    setClockSizes(data)
    setIsLoading(false)
  }, [])

  const getCities = useCallback(async () => {
    setIsLoading(true)
    const cities = await axios.get<City[]>(`/city`)
    cities.data.forEach(({ name, id }) => setCitiesOption((prevCities) => [...prevCities, { label: name, value: id }]))
    const allCitiesId = cities.data.map(({ id }) => id)
    setCitiesId(allCitiesId)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    getMasters()
    getCities()
    getClockSize()
  }, [getMasters, getCities, getClockSize])

  const startCharts = useCallback(async () => {
    const { data } = await axios.post('/admin/allOrderGraph', {
      cityId: citiesId,
      masterId: mastersId,
      filterStart: filterStart,
      filterEnd: filterEnd,
    })
    data.map((data: dataMasterAndCityGraph) => {
      setDataMasterGraph((prevData) => [...prevData, data.masterCount])
      setDataCityGraph((prevData) => [...prevData, data.cityCount])
      setLabelsGraph((prevLabels) => [...prevLabels, data.label])
    })
    const dataForMasterDiagram = await axios.post('/admin/allOrderMasterDiagram', {
      masterId: mastersId,
      filterStart: filterStart,
      filterEnd: filterEnd,
    })
    dataForMasterDiagram.data.map((data: ChartsDataMaster) => {
      const label = mastersOption.find((master) => master.value === data.masterId)
      if (label) {
        setMastersLabelsDiagram((prevLabels) => [...prevLabels, label.label])
        setMastersCountDiagram((prevCount) => [...prevCount, data._count])
      }
      if (data.masterId === 0) {
        setMastersLabelsDiagram((prevLabels) => [...prevLabels, 'other'])
        setMastersCountDiagram((prevCount) => [...prevCount, data._count])
      }
    })
    const dataForCityDiagram = await axios.post('/admin/allOrderCityDiagram', {
      cityId: citiesId,
      filterStart: filterStart,
      filterEnd: filterEnd,
    })
    dataForCityDiagram.data.map((data: ChartsDataCity) => {
      const label = citiesOption.find((city) => city.value === data.cityId)
      if (label) {
        setCitiesLabelsDiagram((prevLabels) => [...prevLabels, label.label])
        setCitiesCountDiagram((prevCount) => [...prevCount, data._count])
      }
    })
  }, [citiesId])

  useEffect(() => {
    if (citiesId && mastersId) {
      startCharts()
    }
  }, [startCharts])

  const filtered = async () => {
    const cityFilterArray = cityFilter.map((cityData: MultiSelectOption) => cityData.value)
    const masterFilterArray = masterFilter.map((masterData: MultiSelectOption) => masterData.value)
    const { data } = await axios.post('/admin/allOrderGraph', {
      cityId: cityFilterArray,
      masterId: masterFilterArray,
      filterStart: filterStart,
      filterEnd: filterEnd,
    })
    if (!data.length) {
      addToast('no orders for this filter', { appearance: 'warning' })
    }
    setDataGraph([])
    setLabelsGraph([])
    setDataMasterGraph([])
    setDataCityGraph([])
    setMastersLabelsDiagram([])
    setMastersCountDiagram([])
    setCitiesLabelsDiagram([])
    setCitiesCountDiagram([])
    if (typeof data[0].cityCount === 'number' && typeof data[0].masterCount === 'undefined') {
      data.map((data: dataCityGraph) => {
        setDataCityGraph((prevData) => [...prevData, data.cityCount])
        setLabelsGraph((prevLabels) => [...prevLabels, data.label])
      })
    }
    if (typeof data[0].masterCount === 'number' && typeof data[0].cityCount === 'undefined') {
      data.map((data: dataMasterGraph) => {
        setDataMasterGraph((prevData) => [...prevData, data.masterCount])
        setLabelsGraph((prevLabels) => [...prevLabels, data.label])
      })
    }
    if (typeof data[0].masterCount === 'number' && typeof data[0].cityCount === 'number') {
      data.map((data: dataMasterAndCityGraph) => {
        setDataMasterGraph((prevData) => [...prevData, data.masterCount])
        setDataCityGraph((prevData) => [...prevData, data.cityCount])
        setLabelsGraph((prevLabels) => [...prevLabels, data.label])
      })
    }
    if (typeof data[0].count === 'number') {
      data.map((data: dataGraph) => {
        setDataGraph((prevData) => [...prevData, data.count])
        setLabelsGraph((prevLabels) => [...prevLabels, data.label])
      })
    }
    if (masterFilterArray.length) {
      const dataForMasterDiagram = await axios.post('/admin/allOrderMasterDiagram', {
        masterId: masterFilterArray,
        filterStart: filterStart,
        filterEnd: filterEnd,
      })
      dataForMasterDiagram.data.map((data: ChartsDataMaster) => {
        const label = mastersOption.find((master) => master.value === data.masterId)
        if (label) {
          setMastersLabelsDiagram((prevLabels) => [...prevLabels, label.label])
          setMastersCountDiagram((prevCount) => [...prevCount, data._count])
        }
        if (data.masterId === 0) {
          setMastersLabelsDiagram((prevLabels) => [...prevLabels, 'other'])
          setMastersCountDiagram((prevCount) => [...prevCount, data._count])
        }
      })
    }
    if (cityFilterArray.length) {
      const dataForCityDiagram = await axios.post('/admin/allOrderCityDiagram', {
        cityId: cityFilterArray,
        filterStart: filterStart,
        filterEnd: filterEnd,
      })
      dataForCityDiagram.data.map((data: ChartsDataCity) => {
        const label = citiesOption.find((city) => city.value === data.cityId)
        if (label) {
          setCitiesLabelsDiagram((prevLabels) => [...prevLabels, label.label])
          setCitiesCountDiagram((prevCount) => [...prevCount, data._count])
        }
      })
    }
  }

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

  useEffect(() => {
    const allMastersTable = async () => {
      const { data } = await axios.get<MasterForTableCharts[]>('/admin/allMastersTableCharts', { params: { limit: limit, offset: offset } })
      setMasters(data)
    }
    allMastersTable()
  }, [offset])


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
            value={filterEnd}
            min={filterStart !== null ? filterStart : ''}
            onChange={event => {
              setFilterEnd(event.currentTarget.value)
            }}
          />
        </div>

        {dataCityGraph.length && !dataMasterGraph.length
          &&
          <div className="line">
            <Line
              data={{
                labels: labelsGraph,
                datasets: [
                  {
                    label: 'Orders of the selected cities for this day',
                    data: dataCityGraph,
                    borderWidth: 4,
                  },
                ],
              }}
              options={{
                responsive: true,
              }}
            />
          </div>
        }

        {!dataCityGraph.length && dataMasterGraph.length
          &&
          <div className="line">
            <Line
              data={{
                labels: labelsGraph,
                datasets: [
                  {
                    label: 'Orders of the selected masters for this day',
                    data: dataMasterGraph,
                    borderWidth: 4,
                  },
                ],
              }}
              options={{
                responsive: true,
              }}
            />
          </div>
        }

        {dataGraph.length
          &&
          <div className="line">
            <Line
              data={{
                labels: labelsGraph,
                datasets: [
                  {
                    label: 'orders for this day',
                    data: dataGraph,
                    borderWidth: 4,
                  },
                ],
              }}
              options={{
                responsive: true,
              }}
            />
          </div>
        }

        {(dataCityGraph.length && dataMasterGraph.length && !dataGraph.length) &&

          <div className="doubleLine">
            <div className="lines">
              <Line
                data={{
                  labels: labelsGraph,
                  datasets: [
                    {
                      label: 'Orders of the selected cities for this day',
                      data: dataCityGraph,
                      borderWidth: 4,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                }}
              />
            </div>

            <div className="lines">
              <Line
                data={{
                  labels: labelsGraph,
                  datasets: [
                    {
                      label: 'Orders of the selected masters for this day',
                      data: dataMasterGraph,
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
        }

        {citiesLabelsDiagram.length &&
          <div className="line-diagram">
            <Doughnut
              data={{
                labels: citiesLabelsDiagram,
                datasets: [
                  {
                    label: 'orders for this city',
                    data: citiesCountDiagram,
                    borderWidth: 4,
                  },
                ],
              }}
              options={{
                responsive: true,
              }}
            />
          </div>
        }
        {mastersLabelsDiagram.length &&
          <div className="line-diagram">
            <Doughnut
              data={{
                labels: mastersLabelsDiagram,
                datasets: [
                  {
                    label: 'orders for this city',
                    data: mastersCountDiagram,
                    borderWidth: 4,
                  },
                ],
              }}
              options={{
                responsive: true,
              }}
            />
          </div>
        }

        <div className="wrapper_masters__charts">
          <table className="wrapper_masters__table__charts">
            <tr>
              <th className="table_block_id__master__charts">id</th>
              <th className="table_block_name__master__charts">Name</th>
              {clockSizes.map((ClockSize) => (
                <th className="table_block_name__master__charts">{`${ClockSize.size}`}</th>
              ))
              }
              <th className="table_block_name__master__charts">Rating</th>
              <th className="table_block_name__master__charts">Profit</th>
              <th className="table_block_name__master__charts">Completed</th>
              <th className="table_block_name__master__charts">Not completed</th>
            </tr>
            {
              masters.map((master) => (
                <tr>
                  <th className="table_block_id__master">{`${master.id}`}</th>
                  <th className="table_block_name__master__charts">{`${master.name}`}</th>
                  {
                    master.clockSize.map((elem) => (
                      <th className="table_block_name__master__charts">{`${elem}`}</th>
                    ))
                  }
                  <th className="table_block_name__master__charts">{`${master.rating === null ? 0 : master.rating}`}</th>
                  <th className="table_block_name__master__charts">{`${master.profit === null ? 0 : master.profit}`}</th>
                  <th className="table_block_name__master__charts">{`${master.completedOrder}`}</th>
                  <th className="table_block_name__master__charts">{`${master.notCompletedOrder}`}</th>
                </tr>
              ))
            }
          </table>
        </div>
        {
          offset !== 0 ? <button className="after_button" onClick={after}>back</button> : <button className="after_button" disabled={true} onClick={after}>back</button>
        }
        {
          masters.length >= limit ? <button className="next_button" onClick={next}>next</button> : <button className="next_button" disabled={true} onClick={next}>next</button>
        }
        {
          masters.length === 0 && <div>Dont have more masters</div>
        }

      </div>
    </>
  )
}

export default OrderCharts
