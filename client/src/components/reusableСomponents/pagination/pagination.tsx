import { FC, useEffect, useState } from 'react'
import './pagination-module.css'

interface PaginationProps {
  offset: number
  setOffset: React.Dispatch<React.SetStateAction<number>>
  limit: number
  setLimit: React.Dispatch<React.SetStateAction<number>>
  total: number
}
const Pagination: FC<PaginationProps> = ({
  offset,
  setOffset,
  limit,
  setLimit,
  total,
}) => {
  const [pagesCount, setPagesCount] = useState<number[]>([])

  useEffect(() => {
    const localPagesCount: number[] = []
    for (let i = 1; i <= Math.ceil(total / limit); i++) {
      localPagesCount.push(i)
    }
    setPagesCount(localPagesCount)
  }, [limit])

  return (
    <div className="pagination">
      <button
          className="page-number"
          onClick={() => setOffset(pagesCount.length - 1 * limit)}
        >
          {/* <img src={} /> */}
        </button>
      {pagesCount.map(number => (
        <button
          className="page-number"
          onClick={() => setOffset((number - 1) * limit)}
        >
          {number}
        </button>
      ))}
      <select onChange={event => setLimit(+event.currentTarget.value)}>
        <option selected value={15}>
          15
        </option>
        <option value={25}>25</option>
        <option value={50}>50</option>
      </select>
    </div>
  )
}

export default Pagination
