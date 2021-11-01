import { useState, FC } from 'react'
import { Status } from 'models'

interface StatusSelectProps {
  setSelectValue: React.Dispatch<React.SetStateAction<Status | null>>
}
const StatusSelect: FC<StatusSelectProps> = ({ setSelectValue }) => {
  const [statusesFilter, setStatusesFilter] = useState<Status[]>([
    Status.Completed,
    Status.Active,
    Status.InProgress,
    Status.InActive,
    Status.Pending,
  ])

  return (
    <div>
      <select
        className="selectFilter"
        onChange={event => {
            setSelectValue(event.currentTarget.value as Status || null)
        }}
      >
        <option value="" selected>
          Select status filter
        </option>
        {statusesFilter.map(elem => (
          <option value={elem}>{`${elem}`}</option>
        ))}
      </select>
    </div>
  )
}

export default StatusSelect
