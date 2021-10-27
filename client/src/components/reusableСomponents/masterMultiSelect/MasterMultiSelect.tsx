import { useEffect, useState, FC } from 'react'
import axios from 'axios'
import { Master } from '../../../models'
import { MultiSelect } from 'react-multi-select-component'

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
  const [mastersOptionForSelect, setMastersOptionForSelect] = useState<
    MultiSelectOption[]
  >([])

  useEffect(() => {
    const getMasters = async () => {
      const masters = await axios.get<Master[]>(`/admin/masters`)
      const mastersOptions: MultiSelectOption[] = []
      masters.data.forEach(({ name, id }) =>
        mastersOptions.push({ label: name, value: id }),
      )
      setMastersOptionForSelect(mastersOptions)
      setMultiSelectValue(mastersOptions)
    }
    getMasters()
  }, [])

  return (
    <div>
      <MultiSelect
        className="selectFilter"
        onChange={setMultiSelectValue}
        options={mastersOptionForSelect}
        value={multiSelectValue}
        labelledBy="Select masters"
      />
    </div>
  )
}

export default MasterMultiSelect
