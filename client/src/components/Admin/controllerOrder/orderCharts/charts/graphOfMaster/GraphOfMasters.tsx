import { useEffect, useState, FC } from 'react'
import axios from 'axios'
import { Line } from 'react-chartjs-2'
import { FirstDayMonth, LastDayMonth } from '../diagramOfCities/DiagramOfCities'
import './graph-of-master-module.css'
import Preloader from 'components/Preloader'
import DateRangeSelect from 'components/reusableСomponents/dateRangeSelect/DateRangeSelect'
import MasterMultiSelect from 'components/reusableСomponents/masterMultiSelect/MasterMultiSelect'

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

  const [IDsMultiSelect, setIDsMultiSelect] = useState<
    MultiSelectOption[]
  >([])

  useEffect(() => {
    if (IDsMultiSelect.length) {
      setIsLoading(true)
      const mastersId = IDsMultiSelect.map(({ value }) => value)
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
        propsEnd={filterEnd}/>
        <MasterMultiSelect
          setMultiSelectValue={setIDsMultiSelect}
          multiSelectValue={IDsMultiSelect}
        />
      </div>
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
    </div>
  )
}

export default GraphOfMasters
