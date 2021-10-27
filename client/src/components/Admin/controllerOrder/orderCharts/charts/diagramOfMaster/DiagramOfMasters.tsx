import { useEffect, useState, FC } from 'react'
import axios from 'axios'
import { Pie } from 'react-chartjs-2'
import './diagram_of_masters_module.css'
import { FirstDayMonth, LastDayMonth } from '../diagramOfCities/DiagramOfCities'
import Preloader from '../../../../../Preloader'

type DataForMasterDiagram = {
  count: number
  name: string
}

interface DiagramOfMastersProps {}
const DiagramOfMasters: FC<DiagramOfMastersProps> = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [filterStart, setFilterStart] = useState<string>(FirstDayMonth())
  const [filterEnd, setFilterEnd] = useState<string>(LastDayMonth())

  const [mastersLabels, setMastersLabels] = useState<string[]>([])
  const [mastersCount, setMastersCount] = useState<number[]>([])

  useEffect(() => {
    const getDataForDiagram = async () => {
      setIsLoading(true)
      const { data } = await axios.get<DataForMasterDiagram[]>(
        '/admin/diagrama/master',
        {
          params: {
            start: filterStart,
            end: filterEnd,
          },
        },
      )
      const count = data.map(dataForDiagram => dataForDiagram.count)
      const label = data.map(dataForDiagram => dataForDiagram.name)
      setMastersLabels(label)
      setMastersCount(count)
      setIsLoading(false)
    }
    getDataForDiagram()
  }, [filterStart, filterEnd])

  return (
    <div className="wrapper_charts">
      <Preloader isLoading={isLoading} />
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
