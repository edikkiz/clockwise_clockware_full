import { useEffect, useState, FC } from 'react'
import axios from 'axios'
import { Master } from 'models'

interface MasterSelectProps {
  setSelectValue: React.Dispatch<React.SetStateAction<number | null>>
}
const MasterSelect: FC<MasterSelectProps> = ({ setSelectValue }) => {
  const [masters, setMasters] = useState<Master[]>([])

  useEffect(() => {
    const masters = async () => {
      const { data } = await axios.get<Master[]>(`/admin/masters`)
      setMasters(data)
    }
    masters()
  }, [])

  return (
    <div>
      <select
        className="selectFilter"
        onChange={event => {
          console.log(typeof event.currentTarget.value)
          console.log(event.currentTarget.value)
          setSelectValue(+event.currentTarget.value || null)
        }}
      >
        <option value="null" selected>
          Select master filter
        </option>
        {masters.map(({ id, name }) => (
          <option value={+id}>{`${name}`}</option>
        ))}
      </select>
    </div>
  )
}

export default MasterSelect
