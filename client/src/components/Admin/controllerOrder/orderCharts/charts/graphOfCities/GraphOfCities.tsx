import { useEffect, useState, FC } from 'react'
import axios from 'axios'
import { Line } from 'react-chartjs-2'
import { format } from 'date-fns'
import { City } from '../../../../../../models'
import { MultiSelect } from 'react-multi-select-component'
import './graph_of_cities.css'

const nowDate = new Date()
const firstDayMonth = format(
  new Date(nowDate.getFullYear(), nowDate.getMonth(), 1),
  'yyyy-MM-dd',
)
const lastDayMonth = format(
  new Date(nowDate.getFullYear(), nowDate.getMonth() + 1, 0),
  'yyyy-MM-dd',
)

type DataForCityDiagram = {
  count: number
  date: string
}

type MultiSelectOption = {
  label: string
  value: number
}

interface GraphOfCitiesProps {}
const GraphOfCities: FC<GraphOfCitiesProps> = () => {
  const [filterStart, setFilterStart] = useState<string>(firstDayMonth)
  const [filterEnd, setFilterEnd] = useState<string>(lastDayMonth)

  const [citiesLabels, setCitiesLabels] = useState<string[]>([])
  const [citiesCount, setCitiesCount] = useState<number[]>([])

  const [citiesIdMultiSelect, setCitiesIdMultiSelect] = useState<
    MultiSelectOption[]
  >([])

  const [citiesOptionForSelect, setCitiesOptionForSelect] = useState<
    MultiSelectOption[]
  >([])

  useEffect(() => {
    const getCities = async () => {
      const cities = await axios.get<City[]>(`/city`)
      const citiesOptions: MultiSelectOption[] = []
      cities.data.forEach(({ name, id }) =>
        citiesOptions.push({ label: name, value: id }),
      )
      setCitiesOptionForSelect(citiesOptions)
      setCitiesIdMultiSelect(citiesOptions)
    }
    getCities()
  }, [])

  useEffect(() => {
    if (citiesIdMultiSelect.length) {
      const citiesId = citiesIdMultiSelect.map(({ value }) => value)
      const getDataForDiagram = async () => {
        const { data } = await axios.post<DataForCityDiagram[]>(
          '/admin/get-data-for-city-graph',
          {
            start: filterStart,
            end: filterEnd,
            citiesId: citiesId,
          },
        )
        const count = data.map(day => day.count)
        const label = data.map(day => day.date)
        setCitiesLabels(label)
        setCitiesCount(count)
      }
      getDataForDiagram()
    }
    if (!citiesIdMultiSelect.length) {
      setCitiesLabels([])
      setCitiesCount([])
    }
  }, [filterStart, filterEnd, citiesIdMultiSelect])

  return (
    <div className="wrapper_graph">
      <div className="filter">
        <label>Start:</label>
        <input
          type="date"
          title="select start filter date"
          value={filterStart}
          max={filterEnd !== null ? filterEnd : ''}
          onChange={event => {
            setFilterStart(event.currentTarget.value)
          }}
        />

        <label>End:</label>
        <input
          type="date"
          title="select end filter date"
          value={filterEnd}
          min={filterStart !== null ? filterStart : ''}
          onChange={event => {
            setFilterEnd(event.currentTarget.value)
          }}
        />

        <label>Choose Cities:</label>
        <MultiSelect
          className="selectFilter"
          onChange={setCitiesIdMultiSelect}
          options={citiesOptionForSelect}
          value={citiesIdMultiSelect}
          labelledBy="No city for filter"
        />
      </div>
      <div className="pie-diagram">
        <Line
          data={{
            labels: citiesLabels,
            datasets: [
              {
                label: 'orders for this city',
                data: citiesCount,
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
  )
}

export default GraphOfCities
