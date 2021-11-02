import { useEffect, useState, FC } from 'react'
import axios from 'axios'
import { Pie } from 'react-chartjs-2'
import './diagram-of-masters-module.css'
import { FirstDayMonth, LastDayMonth } from '../diagramOfCities/DiagramOfCities'
import Preloader from 'components/Preloader'
import DateRangeSelect from 'components/reusableСomponents/dateRangeSelect/DateRangeSelect'
type DataForMasterDiagram = {
  count: number
  name: string
}

interface DiagramOfMastersProps {}
const DiagramOfMasters: FC<DiagramOfMastersProps> = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [filterStart, setFilterStart] = useState<string>(FirstDayMonth)
  const [filterEnd, setFilterEnd] = useState<string>(LastDayMonth)

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
      <DateRangeSelect
        setPropsStart={setFilterStart}
        setPropsEnd={setFilterEnd}
        propsStart={filterStart}
        propsEnd={filterEnd}
      />
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
