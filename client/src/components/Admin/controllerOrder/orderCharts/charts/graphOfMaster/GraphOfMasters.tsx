import { useEffect, useState, FC } from 'react'
import axios from 'axios'
import { Line } from 'react-chartjs-2'
import { format } from 'date-fns'
import { Master } from '../../../../../../models'
import { MultiSelect } from 'react-multi-select-component'
import './graph_of_master.css'

const nowDate = new Date()
const firstDayMonth = format(
  new Date(nowDate.getFullYear(), nowDate.getMonth(), 1),
  'yyyy-MM-dd',
)
const lastDayMonth = format(
  new Date(nowDate.getFullYear(), nowDate.getMonth() + 1, 0),
  'yyyy-MM-dd',
)

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
  const [filterStart, setFilterStart] = useState<string>(firstDayMonth)
  const [filterEnd, setFilterEnd] = useState<string>(lastDayMonth)

  const [mastersLabels, setMastersLabels] = useState<string[]>([])
  const [mastersCount, setMastersCount] = useState<number[]>([])

  const [mastersIdMultiSelect, setMastersIdMultiSelect] = useState<
    MultiSelectOption[]
  >([])

  const [mastersOptionForSelect, setMastersOptionForSelect] = useState<
    MultiSelectOption[]
  >([])

  useEffect(() => {
    const getCities = async () => {
      const masters = await axios.get<Master[]>(`/admin/master`)
      const mastersOptions: MultiSelectOption[] = []
      masters.data.forEach(({ name, id }) =>
        mastersOptions.push({ label: name, value: id }),
      )
      setMastersOptionForSelect(mastersOptions)
      setMastersIdMultiSelect(mastersOptions)
    }
    getCities()
  }, [])

  useEffect(() => {
    if (mastersIdMultiSelect.length) {
      const mastersId = mastersIdMultiSelect.map(({ value }) => value)
      const getDataForDiagram = async () => {
        const { data } = await axios.post<DataForMasterDiagram[]>(
          '/admin/get-data-for-master-graph',
          {
            start: filterStart,
            end: filterEnd,
            mastersId: mastersId,
          },
        )
        const count = data.map(day => day.count)
        const label = data.map(day => day.date)
        setMastersLabels(label)
        setMastersCount(count)
      }
      getDataForDiagram()
    }
    if (!mastersIdMultiSelect.length) {
      setMastersLabels([])
      setMastersCount([])
    }
  }, [filterStart, filterEnd, mastersIdMultiSelect])

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
        <label>Choose masters:</label>
        <MultiSelect
          className="selectFilter"
          onChange={setMastersIdMultiSelect}
          options={mastersOptionForSelect}
          value={mastersIdMultiSelect}
          labelledBy="No master for filter"
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
