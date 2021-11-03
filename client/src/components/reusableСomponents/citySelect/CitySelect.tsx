import axios from 'axios'
import { City } from 'src/models'
import { FC, useEffect, useState } from 'react'

interface CitySelectProps {
  setSelectValue: React.Dispatch<React.SetStateAction<number | null>>
}
const CitySelect: FC<CitySelectProps> = ({ setSelectValue }) => {
  const [cities, setCities] = useState<City[]>([])

  useEffect(() => {
    const getCities = async () => {
      const { data } = await axios.get<City[]>(`/city`)
      setCities(data)
    }
    getCities()
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
        {cities.map(({ id, name }) => (
          <option value={+id}>{`${name}`}</option>
        ))}
      </select>
    </div>
  )
}

export default CitySelect
