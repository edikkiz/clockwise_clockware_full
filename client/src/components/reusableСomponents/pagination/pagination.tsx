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

  const [selectedPage, setSelectedPage] = useState<number>(1)

  useEffect(() => {
    const localPagesCount: number[] = []
    for (let i = 1; i <= Math.ceil(total / limit); i++) {
      localPagesCount.push(i)
    }
    setPagesCount(localPagesCount)
  }, [limit])

  return (
    <div className="pagination">
      <div>
        <button
          className={offset !== 0 ? 'page-nav' : 'page-nav disabled'}
          disabled={offset === 0 && true}
          onClick={() => {
            setSelectedPage(1)
            setOffset(0)
          }}
        >
          <img src={firstPage} />
        </button>
        <button
          className={offset !== 0 ? 'page-nav' : 'page-nav disabled'}
          onClick={() => {
            setSelectedPage(selectedPage - 1)
            offset !== 0 && setOffset(offset - limit)
          }}
          disabled={offset === 0 && true}
        >
          <img src={previousPage} />
        </button>

        {pagesCount.map(
          number =>
            selectedPage + 7 >= number &&
            selectedPage - 3 <= number && (
              <button
                className={
                  selectedPage === number ? 'page-number active' : 'page-number'
                }
                onClick={() => {
                  setSelectedPage(number)
                  setOffset((number - 1) * limit)
                }}
              >
                {number}
              </button>
            ),
        )}
        <button
          className={offset + limit <= total ? 'page-nav' : 'page-nav disabled'}
          onClick={() => {
            setSelectedPage(selectedPage + 1)
            setOffset(offset + limit)
          }}
          disabled={offset + limit >= total && true}
        >
          <img src={nextPage} />
        </button>
        <button
          className={offset + limit <= total ? 'page-nav' : 'page-nav disabled'}
          onClick={() => {
            setSelectedPage(pagesCount.length)
            setOffset((pagesCount.length - 1) * limit)
          }}
          disabled={offset + limit >= total && true}
        >
          <img src={lastPage} />
        </button>

        <select
          onChange={event => {
            setOffset(0)
            setLimit(+event.currentTarget.value)
            setSelectedPage(1)
          }}
        >
          <option selected value={15}>
            15
          </option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
        <label className="label">items per page</label>
      </div>
      <div>
        <div>
          {offset === 0 ? 1 : offset}-
          {offset + limit > total ? total : offset + limit} of {total} items
        </div>
      </div>
    </div>
  )
}

export default Pagination
