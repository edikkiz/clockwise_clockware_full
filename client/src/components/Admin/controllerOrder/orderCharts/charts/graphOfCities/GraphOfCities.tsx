import { useEffect, useState, FC } from 'react'
import axios from 'axios'
import { Line } from 'react-chartjs-2'
import { FirstDayMonth, LastDayMonth } from '../diagramOfCities/DiagramOfCities'
import './graph-of-cities-module.css'
import Preloader from 'components/Preloader'
import DateRangeSelect from 'components/reusableСomponents/dateRangeSelect/DateRangeSelect'
import CityMultiSelect from 'components/reusableСomponents/cityMultiSelect/CityMultiSelect'

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

  const [filterStart, setFilterStart] = useState<string>(FirstDayMonth)
  const [filterEnd, setFilterEnd] = useState<string>(LastDayMonth)

  const [citiesLabels, setCitiesLabels] = useState<string[]>([])
  const [citiesCount, setCitiesCount] = useState<number[]>([])

  const [IDsMultiSelect, setIDsMultiSelect] = useState<MultiSelectOption[]>([])

  useEffect(() => {
    if (IDsMultiSelect.length) {
      setIsLoading(true)
      const citiesId = IDsMultiSelect.map(({ value }) => value)
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
  }, [filterStart, filterEnd, IDsMultiSelect])

  return (
    <div className="wrapper_graph">
      <Preloader isLoading={isLoading} />
      <div className="filter">
        <DateRangeSelect
          setPropsStart={setFilterStart}
          setPropsEnd={setFilterEnd}
          propsStart={filterStart}
          propsEnd={filterEnd}
        />
        <CityMultiSelect
          setMultiSelectValue={setIDsMultiSelect}
          multiSelectValue={IDsMultiSelect}
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
