import axios from 'axios'
import { Master } from 'src/models'
import { FC, useEffect, useState } from 'react'

interface MasterSelectProps {
  propsMasters?: Master[]
  setSelectValue: React.Dispatch<React.SetStateAction<number | null>>
}
const MasterSelect: FC<MasterSelectProps> = ({
  setSelectValue,
  propsMasters,
}) => {
  const [masters, setMasters] = useState<Master[]>([])

  useEffect(() => {
    if (propsMasters) {
      setMasters(propsMasters)
      if (propsMasters.length === 1) {
        setSelectValue(propsMasters[0].id)
      }
      return
    }
    const masters = async () => {
      const { data } = await axios.get<Master[]>(`/admin/all-masters`)
      setMasters(data)
      setSelectValue(null)
    }
    masters()
  }, [propsMasters])

  return (
    <div>
      <select
        className="selectFilter"
        onChange={event => {
          setSelectValue(+event.currentTarget.value || null)
        }}
      >
        <option value="null" selected>
          Select master filter
        </option>

        {masters.map(({ id, name }) => (
          <option
            selected={masters.length === 1}
            value={+id}
          >{`${name}`}</option>
        ))}
      </select>
    </div>
  )
}

export default MasterSelect
