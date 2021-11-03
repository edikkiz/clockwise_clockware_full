import { useEffect, useState, FC } from 'react'
import axios from 'axios'
import { Line } from 'react-chartjs-2'
import { FirstDayMonth, LastDayMonth } from '../diagramOfCities/DiagramOfCities'
import './graph-of-master-module.css'
import Preloader from '@src/components/Preloader'
import DateRangeSelect from '@src/components/reusableСomponents/dateRangeSelect/DateRangeSelect'
import MasterMultiSelect from '@src/components/reusableСomponents/masterMultiSelect/MasterMultiSelect'

type DataForMasterDiagram = {
  count: number
  date: string
}

type MultiSelectOption = {
  label: string
  value: number
}

interface GraphOfMastersProps {}
const GraphOfMasters: FC<GraphOfMastersProps> = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [filterStart, setFilterStart] = useState<string>(FirstDayMonth)
  const [filterEnd, setFilterEnd] = useState<string>(LastDayMonth)

  const [mastersLabels, setMastersLabels] = useState<string[]>([])
  const [mastersCount, setMastersCount] = useState<number[]>([])

  const [mastersFilter, setMastersFilter] = useState<MultiSelectOption[]>([])

  useEffect(() => {
    if (mastersFilter.length) {
      setIsLoading(true)
      const mastersId = mastersFilter.map(({ value }) => value)
      const getDataForDiagram = async () => {
        const { data } = await axios.get<DataForMasterDiagram[]>(
          '/admin/graph/master',
          {
            params: {
              start: filterStart,
              end: filterEnd,
              mastersIDs: mastersId,
            },
          },
        )
        const count = data.map(day => day.count)
        const label = data.map(day => day.date)
        setMastersLabels(label)
        setMastersCount(count)
        setIsLoading(false)
      }
      getDataForDiagram()
    } else {
      setMastersLabels([])
      setMastersCount([])
    }
  }, [filterStart, filterEnd, mastersFilter])

  return (
    <div className="wrapper_graph">
      <Preloader isLoading={isLoading} />
      <div className="filter">
        <DateRangeSelect
          setStart={setFilterStart}
          setEnd={setFilterEnd}
          start={filterStart}
          end={filterEnd}
        />
        <MasterMultiSelect
          setMultiSelectValue={setMastersFilter}
          multiSelectValue={mastersFilter}
        />
      </div>
      {mastersFilter.length ? (
        <div className="pie-diagram">
          <Line
            data={{
              labels: mastersLabels,
              datasets: [
                {
                  label: 'orders for this master',
                  data: mastersCount,
                  borderWidth: 4,
                },
              ],
            }}
            options={{
              responsive: true,
            }}
          />
        </div>
      ) : (
        <div className="no-master">Please, select at least one master</div>
      )}
    </div>
  )
}

export default GraphOfMasters
