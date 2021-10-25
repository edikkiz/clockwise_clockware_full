import { useEffect, useState, FC } from 'react'
import axios from 'axios'
import { Pie } from 'react-chartjs-2'
import { format } from 'date-fns'
import './diagram_of_masters_module.css'

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
  name: string
}

interface DiagramOfMastersProps {}
const DiagramOfMasters: FC<DiagramOfMastersProps> = () => {
  const [filterStart, setFilterStart] = useState<string>(firstDayMonth)
  const [filterEnd, setFilterEnd] = useState<string>(lastDayMonth)

  const [mastersLabels, setMastersLabels] = useState<string[]>([])
  const [mastersCount, setMastersCount] = useState<number[]>([])

  useEffect(() => {
    const getDataForDiagram = async () => {
      const { data } = await axios.post<DataForMasterDiagram[]>(
        '/admin/get-data-for-master-diagram',
        {
          start: filterStart,
          end: filterEnd,
        },
      )
      const count = data.map(dataForDiagram => dataForDiagram.count)
      const label = data.map(dataForDiagram => dataForDiagram.name)
      setMastersLabels(label)
      setMastersCount(count)
    }
    getDataForDiagram()
  }, [filterStart, filterEnd])

  return (
    <div className="wrapper_charts">
      <div className="date_filter">
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
      </div>
      <div className="pie-diagram">
        <Pie
          data={{
            labels: mastersLabels,
            datasets: [
              {
                backgroundColor: ['orange', 'blue', 'red', 'green'],
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

export default DiagramOfMasters
