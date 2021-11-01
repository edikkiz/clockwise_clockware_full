import { useEffect, useState, FC } from 'react'
import axios from 'axios'
import { City } from 'models'
import { MultiSelect } from 'react-multi-select-component'

type MultiSelectOption = {
  label: string
  value: number
}

interface CityMultiSelectProps {
  multiSelectValue: MultiSelectOption[]
  setMultiSelectValue: React.Dispatch<React.SetStateAction<MultiSelectOption[]>>
}
const CityMultiSelect: FC<CityMultiSelectProps> = ({
  multiSelectValue,
  setMultiSelectValue,
}) => {
  const [citiesOptionForSelect, setCitiesOptionForSelect] = useState<
    MultiSelectOption[]
  >([])

  useEffect(() => {
    const getCities = async () => {
      const cities = await axios.get<City[]>(`/city`)
      const citiesOptions = cities.data.map(
        ({ name, id }): MultiSelectOption => {
          return { label: name, value: id }
        },
      )

      console.log(citiesOptions)
      setCitiesOptionForSelect(citiesOptions)
      setMultiSelectValue(citiesOptions)
    }
    getCities()
  }, [])

  return (
    <div>
      <MultiSelect
        className="selectFilter"
        onChange={setMultiSelectValue}
        options={citiesOptionForSelect}
        value={multiSelectValue}
        labelledBy="Select cities"
      />
    </div>
  )
}

export default CityMultiSelect
