import axios from 'axios'
import { Master } from 'src/models'
import { FC, useEffect, useState } from 'react'

const limit = 20

interface FindMasterInputProps {
  setFoundMasters: React.Dispatch<React.SetStateAction<Master[] | null>>
}
const FindMasterInput: FC<FindMasterInputProps> = ({ setFoundMasters }) => {
  const [searchString, setSearchString] = useState<string>('')
  const [searchTemp, setSearchTemp] = useState<string>('')

  const [dataList, setDataList] = useState<Master[]>([])

  useEffect(() => {
    if (searchString) {
      setTimeout(() => {
        setSearchTemp(searchString)
      }, 1000)
      if (searchString === searchTemp) {
        const searchMastersByName = async () => {
          const { data } = await axios.get('/admin/masters-by-name', {
            params: { searchString: searchString, limit: limit },
          })
          setFoundMasters(data)
          setDataList(data)
        }
        searchMastersByName()
      }
    } else {
      setFoundMasters([])
      setDataList([])
    }
  }, [searchString, searchTemp])

  return (
    <div>
      <datalist id="masters-list">
        {dataList.map(master => (
          <option value={master.name}>{master.name}</option>
        ))}
      </datalist>
      <input
        className="selectFilter"
        type="search"
        list="masters-list"
        placeholder="Master name to search"
        value={searchString}
        onChange={event => {
          setSearchString(event.currentTarget.value)
        }}
      />
    </div>
  )
}

export default FindMasterInput
