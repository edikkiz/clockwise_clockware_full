import { FC } from 'react'
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

const Pagination: FC<PaginationProps> = ({
  offset,
  setOffset,
  limit,
  setLimit,
  total,
}) => {
  const page = (num: number) =>
    Math.ceil(total / limit) >= num && (
      <button
        className={
          (offset + limit) / limit === num
            ? 'page-number active'
            : 'page-number'
        }
        onClick={() => setOffset((num - 1) * limit)}
      >
        {num}
      </button>
    )

  return (
    <div className="pagination">
      <div className="pages">
        <button
          className={offset !== 0 ? 'page-nav' : 'page-nav disabled'}
          disabled={offset === 0}
          onClick={() => setOffset(0)}
        >
          <img src={firstPage} />
        </button>
        <button
          className={offset !== 0 ? 'page-nav' : 'page-nav disabled'}
          onClick={() => offset !== 0 && setOffset(offset - limit)}
          disabled={offset === 0}
        >
          <img src={previousPage} />
        </button>

        {(offset + limit) / limit > 3 && page((offset + limit) / limit - 3)}
        {(offset + limit) / limit > 2 && page((offset + limit) / limit - 2)}
        {(offset + limit) / limit > 1 && page((offset + limit) / limit - 1)}
        {page((offset + limit) / limit)}
        {page((offset + limit) / limit + 1)}
        {page((offset + limit) / limit + 2)}
        {page((offset + limit) / limit + 3)}
        {page((offset + limit) / limit + 4)}
        {page((offset + limit) / limit + 5)}
        {page((offset + limit) / limit + 6)}
        {page((offset + limit) / limit + 7)}

        {Math.ceil(total / limit) >= (offset + limit) / limit + 8 && (
          <button
            onClick={() => setOffset(((offset + limit) / limit + 7) * limit)}
          >
            ...
          </button>
        )}

        <button
          className={offset + limit < total ? 'page-nav' : 'page-nav disabled'}
          onClick={() => setOffset(offset + limit)}
          disabled={offset + limit > total}
        >
          <img src={nextPage} />
        </button>
        <button
          className={offset + limit < total ? 'page-nav' : 'page-nav disabled'}
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
