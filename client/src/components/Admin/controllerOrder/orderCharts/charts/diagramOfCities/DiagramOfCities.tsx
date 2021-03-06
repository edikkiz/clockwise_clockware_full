import { useEffect, useState, FC } from 'react'
import axios from 'axios'
import { Pie } from 'react-chartjs-2'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import './diagram-of-cities-module.css'
// import Preloader from '@/components/Preloader'
import DateRangeSelect from 'src/components/reusable–°omponents/dateRangeSelect/DateRangeSelect'

export const FirstDayMonth = format(startOfMonth(new Date()), 'yyyy-MM-dd')
export const LastDayMonth = format(endOfMonth(new Date()), 'yyyy-MM-dd')

type DataForCityDiagram = {
  count: number
  name: string
}

interface DiagramOfCitiesProps {}
const DiagramOfCities: FC<DiagramOfCitiesProps> = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [filterStart, setFilterStart] = useState<string>(FirstDayMonth)
  const [filterEnd, setFilterEnd] = useState<string>(LastDayMonth)

  const [citiesLabels, setCitiesLabels] = useState<string[]>([])
  const [citiesCount, setCitiesCount] = useState<number[]>([])

  useEffect(() => {
    setIsLoading(true)
    const getDataForDiagram = async () => {
      const { data } = await axios.get<DataForCityDiagram[]>(
        '/admin/diagrama/city',
        {
          params: {
            start: filterStart,
            end: filterEnd,
          },
        },
      )
      const count = data.map(dataForDiagram => dataForDiagram.count)
      const label = data.map(dataForDiagram => dataForDiagram.name)
      setCitiesLabels(label)
      setCitiesCount(count)
      setIsLoading(false)
    }
    getDataForDiagram()
  }, [filterStart, filterEnd])

  return (
    <div className="wrapper_charts">
      {/* <Preloader isLoading={isLoading} /> */}
      <DateRangeSelect
        setStart={setFilterStart}
        setEnd={setFilterEnd}
        start={filterStart}
        end={filterEnd}
      />
      <div className="pie-diagram">
        <Pie
          data={{
            labels: citiesLabels,
            datasets: [
              {
                backgroundColor: [
                  'black',
                  'blue',
                  'red',
                  'green',
                  'yellow',
                  'pink',
                  'navy',
                  'brown',
                  'gray',
                  'orange',
                ],
                hoverBackgroundColor: [
                  'black',
                  'blue',
                  'red',
                  'green',
                  'yellow',
                  'pink',
                  'navy',
                  'brown',
                  'rgb(50, 50, 50)',
                  'orange',
                ],
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
