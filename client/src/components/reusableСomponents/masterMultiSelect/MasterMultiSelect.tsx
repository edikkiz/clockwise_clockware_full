import { useEffect, useState, FC } from 'react'
import axios from 'axios'
import { Master } from 'src/models'
import { MultiSelect } from 'react-multi-select-component'
import './master-multi-select-module.css'

type MultiSelectOption = {
  label: string
  value: number
}

interface MasterMultiSelectProps {
  multiSelectValue: MultiSelectOption[]
  setMultiSelectValue: React.Dispatch<React.SetStateAction<MultiSelectOption[]>>
}

const MasterMultiSelect: FC<MasterMultiSelectProps> = ({
  multiSelectValue,
  setMultiSelectValue,
}) => {
  const [optionForSelect, setOptionForSelect] = useState<MultiSelectOption[]>(
    [],
  )

  useEffect(() => {
    const getMasters = async () => {
      const { data } = await axios.get<Master[]>(`/admin/all-masters`)
      const mastersOptions = data.map(({ name, id }): MultiSelectOption => {
        return {
          label: name,
          value: id,
        }
      })
      setOptionForSelect(mastersOptions)
      setMultiSelectValue(mastersOptions)
    }
    getMasters()
  }, [])

  return (
    <div className="master-multi-select">
      <label className="label-master-multi-select">Choose masters:</label>
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

export default MasterMultiSelect
