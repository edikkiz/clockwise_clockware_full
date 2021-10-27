import { useEffect, useState, FC } from 'react'
import axios from 'axios'
import { Line } from 'react-chartjs-2'
import { FirstDayMonth, LastDayMonth } from '../diagramOfCities/DiagramOfCities'
import './graph_of_master_module.css'
import MasterMultiSelect from '../../../../../reusableСomponents/masterMultiSelect/MasterMultiSelect'
import Preloader from '../../../../../Preloader'

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

  const [filterStart, setFilterStart] = useState<string>(FirstDayMonth())
  const [filterEnd, setFilterEnd] = useState<string>(LastDayMonth())

  const [mastersLabels, setMastersLabels] = useState<string[]>([])
  const [mastersCount, setMastersCount] = useState<number[]>([])

  const [mastersIdMultiSelect, setMastersIdMultiSelect] = useState<
    MultiSelectOption[]
  >([])

  useEffect(() => {
    if (mastersIdMultiSelect.length) {
      setIsLoading(true)
      const mastersId = mastersIdMultiSelect.map(({ value }) => value)
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
  }, [filterStart, filterEnd, mastersIdMultiSelect])

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
        <label>Choose masters:</label>
        <MasterMultiSelect
          setMultiSelectValue={setMastersIdMultiSelect}
          multiSelectValue={mastersIdMultiSelect}
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
