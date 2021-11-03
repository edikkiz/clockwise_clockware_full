import axios from 'axios'
import { ClockSize } from 'src/models'
import { FC, useEffect, useState } from 'react'

interface ClockSizeProps {
  setSelectValue: React.Dispatch<React.SetStateAction<number | null>>
}
const ClockSizeSelect: FC<ClockSizeProps> = ({ setSelectValue }) => {
  const [clockSizes, setClockSizes] = useState<ClockSize[]>([])

  useEffect(() => {
    const clockSize = async () => {
      const { data } = await axios.get<ClockSize[]>(`/clock-sizes`)
      setClockSizes(data)
    }
    clockSize()
  }, [])

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
        {clockSizes.map(({ id, name }) => (
          <option value={+id}>{`${name}`}</option>
        ))}
      </select>
    </div>
  )
}

export default ClockSizeSelect
