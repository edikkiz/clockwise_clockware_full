import { useState, FC } from 'react'

interface DateRangeProps {
  setPropsStart: React.Dispatch<React.SetStateAction<string | null>>
  setPropsEnd: React.Dispatch<React.SetStateAction<string | null>>
}
const DateRange: FC<DateRangeProps> = ({ setPropsStart, setPropsEnd }) => {
  const [start, setStart] = useState<string | null>(null)
  const [end, setEnd] = useState<string | null>(null)

  return (
    <div>
      <input
        type="date"
        title="select start filter date"
        max={end !== null ? end : ''}
        onChange={event => {
          setPropsStart(event.currentTarget.value)
          setStart(event.currentTarget.value)
        }}
      />

      <input
        type="date"
        title="select end filter date"
        min={start !== null ? start : ''}
        onChange={event => {
          setPropsEnd(event.currentTarget.value)
          setEnd(event.currentTarget.value)
        }}
      />
    </div>
  )
}

export default DateRange
