import { useState, FC } from 'react'
import './date-range-module.css'

interface DateRangeProps {
  setStart: React.Dispatch<React.SetStateAction<string>>
  start?: string
  setEnd: React.Dispatch<React.SetStateAction<string>>
  end?: string
}
const DateRange: FC<DateRangeProps> = ({
  setStart,
  setEnd,
  start,
  end,
}) => {
  const [innerStart, setInnerStart] = useState<string>('')
  const [innerEnd, setInnerEnd] = useState<string>('')

  return (
    <div className="date-range">
      <label className="date-range-label">Start: </label>
      <input
        defaultValue={start ? start : innerStart}
        type="date"
        title="select start filter date"
        max={end ? end : innerEnd}
        onChange={event => {
          setStart(event.currentTarget.value)
          setInnerStart(event.currentTarget.value)
        }}
      />

      <label className="date-range-label">End: </label>
      <input
        defaultValue={end ? end : innerEnd}
        type="date"
        title="select end filter date"
        min={start ? start : innerStart}
        onChange={event => {
          setEnd(event.currentTarget.value)
          setInnerEnd(event.currentTarget.value)
        }}
      />
    </div>
  )
}

export default DateRange
