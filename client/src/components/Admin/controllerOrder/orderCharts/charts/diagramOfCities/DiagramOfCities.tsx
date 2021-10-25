import { useEffect, useState, FC } from 'react'
import axios from 'axios'
import { Pie } from 'react-chartjs-2'
import { format } from 'date-fns'
import './diagram_of_cities_module.css'

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
  name: string
}

interface DiagramOfCitiesProps {}
const DiagramOfCities: FC<DiagramOfCitiesProps> = () => {
  const [filterStart, setFilterStart] = useState<string>(firstDayMonth)
  const [filterEnd, setFilterEnd] = useState<string>(lastDayMonth)

  const [citiesLabels, setCitiesLabels] = useState<string[]>([])
  const [citiesCount, setCitiesCount] = useState<number[]>([])
  const [allColors, setAllColors] = useState<string[]>([])

  useEffect(() => {
    const getDataForDiagram = async () => {
      const { data } = await axios.post<DataForCityDiagram[]>(
        '/admin/get-data-for-city-diagram',
        {
          start: filterStart,
          end: filterEnd,
        },
      )
      const count = data.map(dataForDiagram => dataForDiagram.count)
      const label = data.map(dataForDiagram => dataForDiagram.name)
      setCitiesLabels(label)
      setCitiesCount(count)

      const result: string[] = []
      for (let i = 0; i < data.length; i++) {
        const r = Math.round(Math.random() * 255)
        const g = Math.round(Math.random() * 255)
        const b = Math.round(Math.random() * 255)
        result.push(`rgb(${r}, ${g}, ${b})`)
      }
      setAllColors(result)
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
            labels: citiesLabels,
            datasets: [
              {
                backgroundColor: allColors,
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

export default DiagramOfCities
