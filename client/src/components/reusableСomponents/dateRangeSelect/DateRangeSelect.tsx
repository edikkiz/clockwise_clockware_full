import { useState, FC } from 'react'
import './date-range-module.css'

interface DateRangeProps {
  setPropsStart: React.Dispatch<React.SetStateAction<string>>
  propsStart?: string
  setPropsEnd: React.Dispatch<React.SetStateAction<string>>
  propsEnd?: string
}
const DateRange: FC<DateRangeProps> = ({
  setPropsStart,
  setPropsEnd,
  propsStart,
  propsEnd,
}) => {
  const [start, setStart] = useState<string>('')
  const [end, setEnd] = useState<string>('')

  return (
    <div className="date-range">
      <label className="date-range-label">Start: </label>
      <input
        defaultValue={propsStart ? propsStart : start}
        type="date"
        title="select start filter date"
        max={propsEnd ? propsEnd : end}
        onChange={event => {
          setPropsStart(event.currentTarget.value)
          setStart(event.currentTarget.value)
        }}
      />

      <label className="date-range-label">End: </label>
      <input
        defaultValue={propsEnd ? propsEnd : end}
        type="date"
        title="select end filter date"
        min={propsStart ? propsStart : start}
        onChange={event => {
          setPropsEnd(event.currentTarget.value)
          setEnd(event.currentTarget.value)
        }}
      />
    </div>
  )
}

export default DateRange
