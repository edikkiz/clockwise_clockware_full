import { useEffect, useState, FC } from 'react'
import axios from 'axios'
import { City } from '@/models'
import { MultiSelect } from 'react-multi-select-component'
import './city-multi-select-module.css'

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
  const [optionForSelect, setOptionForSelect] = useState<MultiSelectOption[]>(
    [],
  )

  useEffect(() => {
    const getCities = async () => {
      const { data } = await axios.get<City[]>(`/city`)
      const citiesOptions = data.map(({ name, id }): MultiSelectOption => {
        return { label: name, value: id }
      })
      setOptionForSelect(citiesOptions)
      setMultiSelectValue(citiesOptions)
    }
    getCities()
  }, [])

  return (
    <div className="city-multi-select">
      <label className="label-city-multi-select">Choose Cities:</label>
      <MultiSelect
        className="selectFilter"
        onChange={setMultiSelectValue}
        options={optionForSelect}
        value={multiSelectValue}
        labelledBy="Select masters"
      />
    </div>
  )
}

export default CityMultiSelect
