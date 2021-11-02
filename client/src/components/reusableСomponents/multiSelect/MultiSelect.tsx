import { useEffect, useState, FC } from 'react'
import axios from 'axios'
import { Master } from 'models'
import { MultiSelect } from 'react-multi-select-component'

type MultiSelectOption = {
  label: string
  value: number
}

interface MasterMultiSelectProps {
  multiSelectValue: MultiSelectOption[]
  setMultiSelectValue: React.Dispatch<React.SetStateAction<MultiSelectOption[]>>
  optionForSelect: MultiSelectOption[]
}

const MasterMultiSelect: FC<MasterMultiSelectProps> = ({
  multiSelectValue,
  setMultiSelectValue,
  optionForSelect,
}) => {


  return (
    <div>
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
