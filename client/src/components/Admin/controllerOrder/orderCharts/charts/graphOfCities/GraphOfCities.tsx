import { useEffect, useState, FC } from 'react'
import axios from 'axios'
import { Line } from 'react-chartjs-2'
import { FirstDayMonth, LastDayMonth } from '../diagramOfCities/DiagramOfCities'
import './graph_of_cities_module.css'
import CityMultiSelect from '../../../../../reusableСomponents/cityMultiSelect/CityMultiSelect'
import Preloader from '../../../../../Preloader'

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
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [filterStart, setFilterStart] = useState<string>(FirstDayMonth())
  const [filterEnd, setFilterEnd] = useState<string>(LastDayMonth())

  const [citiesLabels, setCitiesLabels] = useState<string[]>([])
  const [citiesCount, setCitiesCount] = useState<number[]>([])

  const [citiesIdMultiSelect, setCitiesIdMultiSelect] = useState<
    MultiSelectOption[]
  >([])

  useEffect(() => {
    if (citiesIdMultiSelect.length) {
      setIsLoading(true)
      const citiesId = citiesIdMultiSelect.map(({ value }) => value)
      const getDataForDiagram = async () => {
        const { data } = await axios.get<DataForCityDiagram[]>(
          '/admin/graph/city',
          {
            params: {
              start: filterStart,
              end: filterEnd,
              citiesIDs: citiesId,
            },
          },
        )
        const count = data.map(day => day.count)
        const label = data.map(day => day.date)
        setCitiesLabels(label)
        setCitiesCount(count)
        setIsLoading(false)
      }
      getDataForDiagram()
    } else {
      setIsLoading(true)
      setCitiesLabels([])
      setCitiesCount([])
      setIsLoading(false)
    }
  }, [filterStart, filterEnd, citiesIdMultiSelect])

  return (
    <div className="wrapper_graph">
      <Preloader isLoading={isLoading} />
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
        <CityMultiSelect
          multiSelectValue={citiesIdMultiSelect}
          setMultiSelectValue={setCitiesIdMultiSelect}
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
