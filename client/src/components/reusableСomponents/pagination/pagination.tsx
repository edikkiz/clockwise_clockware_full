import { FC, useEffect, useState } from 'react'
import './pagination-module.css'
import nextPage from './img/3916869.svg'
import previousPage from './img/3916892.svg'
import lastPage from './img/3916777.svg'
import firstPage from './img/3916770.svg'

interface PaginationProps {
  offset: number
  setOffset: React.Dispatch<React.SetStateAction<number>>
  limit: number
  setLimit: React.Dispatch<React.SetStateAction<number>>
  total: number
}

const pagesBeforeCurrentPage = 5
const pagesAfterCurrentPage = 8
const Pagination: FC<PaginationProps> = ({
  offset,
  setOffset,
  limit,
  setLimit,
  total,
}) => {
  const [pages, setPages] = useState<JSX.Element[]>([])

  useEffect(() => {
    const result = []
    for (
      let i = (offset + limit) / limit - pagesBeforeCurrentPage;
      i <= (offset + limit) / limit + pagesAfterCurrentPage;
      i++
    ) {
      if (i > 0 && Math.ceil(total / limit) >= i) {
        result.push(
          <button
            className={
              (offset + limit) / limit === i
                ? 'page-number activePage'
                : 'page-number'
            }
            onClick={() => setOffset((i - 1) * limit)}
          >
            {i}
          </button>,
        )
      }
      setPages(result)
    }
  }, [limit, offset])

  return (
    <div className="pagination">
      <div className="pages">
        <button
          className="page-nav"
          disabled={offset === 0}
          onClick={() => setOffset(0)}
        >
          <img src={firstPage} />
        </button>
        <button
          className="page-nav"
          onClick={() => offset !== 0 && setOffset(offset - limit)}
          disabled={offset === 0}
        >
          <img src={previousPage} />
        </button>

        {pages.map(elem => (
          <div>{elem}</div>
        ))}

        {Math.ceil(total / limit) >= (offset + limit) / limit + 8 && (
          <button
            onClick={() => setOffset(((offset + limit) / limit + 7) * limit)}
          >
            ...
          </button>
        )}

        <button
          className="page-nav"
          onClick={() => setOffset(offset + limit)}
          disabled={offset + limit > total}
        >
          <img src={nextPage} />
        </button>
        <button
          className="page-nav"
          onClick={() => setOffset(Math.ceil(total / limit) * limit - limit)}
          disabled={offset + limit > total}
        >
          <img src={lastPage} />
        </button>

        <select
          className="pagination-select"
          onChange={event => {
            setOffset(0)
            setLimit(+event.currentTarget.value)
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
        <div className="total">
          {offset + 1}-{offset + limit > total ? total : offset + limit}
          of {total} items
        </div>
      </div>
    </div>
  )
}

export default Pagination
