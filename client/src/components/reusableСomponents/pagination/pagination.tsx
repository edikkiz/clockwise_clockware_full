import { FC, useEffect, useState } from 'react'
import './pagination-module.css'
import nextPage from './img/3916907.svg'
import previousPage from './img/3916912.svg'
import lastPage from './img/3916777.svg'
import firstPage from './img/3916770.svg'
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
      <button className="page-nav" onClick={() => setOffset(0)}>
        <img src={firstPage} />
      </button>
      <button className="page-nav" onClick={() => setOffset(offset - limit)}>
        <img src={previousPage} />
      </button>

      {pagesCount.map(number => (
        <button
          className={
            (offset + limit) / limit === number
              ? 'page-number active'
              : 'page-number'
          }
          onClick={() => setOffset((number - 1) * limit)}
        >
          {number}
        </button>
      ))}
      <button className="page-nav" onClick={() => setOffset(offset + limit)}>
        <img src={nextPage} />
      </button>
      <button
        className="page-nav"
        onClick={() => setOffset((pagesCount.length - 1) * limit)}
      >
        <img src={lastPage} />
      </button>

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
