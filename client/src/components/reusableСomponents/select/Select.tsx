import { FC } from 'react'

interface SelectProps {
  setSelectValue: React.Dispatch<React.SetStateAction<number | null>>
  Options: { id: number; name: string }[]
}
const Select: FC<SelectProps> = ({ setSelectValue, Options }) => {
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
        {Options.map(({ id, name }) => (
          <option value={+id}>{`${name}`}</option>
        ))}
      </select>
    </div>
  )
}

export default Select
