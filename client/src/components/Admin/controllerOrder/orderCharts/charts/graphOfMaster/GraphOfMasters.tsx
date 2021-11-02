import { useEffect, useState, FC } from 'react'
import axios from 'axios'
import { Line } from 'react-chartjs-2'
import { FirstDayMonth, LastDayMonth } from '../diagramOfCities/DiagramOfCities'
import './graph-of-master-module.css'
import MasterMultiSelect from 'components/reusableСomponents/multiSelect/MultiSelect'
import Preloader from 'components/Preloader'
import DateRangeSelect from 'components/reusableСomponents/dateRangeSelect/DateRangeSelect'
import { Master } from 'models'

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

  const [idMultiSelect, setIdMultiSelect] = useState<
    MultiSelectOption[]
  >([])

  
  const [optionForSelect, setOptionForSelect] = useState<
    MultiSelectOption[]
  >([])

  useEffect(() => {
    const getMasters = async () => {
      const masters = await axios.get<Master[]>(`/admin/masters`)
      const mastersOptions: MultiSelectOption[] = []
      masters.data.forEach(({ name, id }) =>
        mastersOptions.push({ label: name, value: id }),
      )
      setOptionForSelect(mastersOptions)
      setIdMultiSelect(mastersOptions)
    }
    getMasters()
  }, [])


  useEffect(() => {
    if (idMultiSelect.length) {
      setIsLoading(true)
      const mastersId = idMultiSelect.map(({ value }) => value)
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
  }, [filterStart, filterEnd, idMultiSelect])

  return (
    <div className="wrapper_graph">
      <Preloader isLoading={isLoading} />
      <div className="filter">
      <DateRangeSelect 
        setPropsStart={setFilterStart}
        setPropsEnd={setFilterEnd}
        propsStart={filterStart}
        propsEnd={filterEnd}/>
        <label>Choose masters:</label>
        <MasterMultiSelect
        optionForSelect={optionForSelect}
          setMultiSelectValue={setIdMultiSelect}
          multiSelectValue={idMultiSelect}
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
