import { useEffect, useState, FC, useCallback } from 'react'
import axios from 'axios'
import { ClockSize, MasterForTable } from '../../../../../../models'
import './table-master-module.css'
import Preloader from '../../../../../Preloader'

const limit = 10
interface MasterTableChartsProps {}
const MasterTableCharts: FC<MasterTableChartsProps> = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [offset, setOffset] = useState<number>(0)

  const [masters, setMasters] = useState<MasterForTable[]>([])

  const [clockSizes, setClockSizes] = useState<ClockSize[]>([])

  useEffect(() => {
    setIsLoading(true)
    const getClockSizes = async () => {
      const { data } = await axios.get('/clock-sizes')
      setClockSizes(data)
      setIsLoading(false)
    }
    getClockSizes()
  }, [])

  useEffect(() => {
    setIsLoading(true)
    const getMasterForTable = async () => {
      const { data } = await axios.get('/admin/masters-list', {
        params: { limit: limit, offset: offset },
      })
      setMasters(data)
      setIsLoading(false)
    }
    getMasterForTable()
  }, [])

  const next = useCallback(() => {
    setOffset(currentOffset => currentOffset + limit)
  }, [])

  const after = useCallback(() => {
    if (offset < 10) {
      setOffset(0)
    }
    if (offset >= 10) {
      setOffset(offset - limit)
    }
  }, [offset])

  return (
    <div>
      <Preloader isLoading={isLoading} />
      <div className="wrapper_masters__charts">
        <table className="wrapper_masters__table__charts">
          <tr>
            <th className="table_block_id__master__charts">id</th>
            <th className="table_block_name__master__charts">Name</th>
            {clockSizes.map(ClockSize => (
              <th className="table_block_name__master__charts">{`${ClockSize.size}`}</th>
            ))}
            <th className="table_block_name__master__charts">Rating</th>
            <th className="table_block_name__master__charts">Profit</th>
            <th className="table_block_name__master__charts">Completed</th>
            <th className="table_block_name__master__charts">Not completed</th>
          </tr>
          {masters.map(master => (
            <tr>
              <th className="table_block_id__master">{`${master.id}`}</th>
              <th className="table_block_name__master__charts">{`${master.name}`}</th>
              <th className="table_block_name__master__charts">{`${master.smallOrdersCount}`}</th>
              <th className="table_block_name__master__charts">{`${master.middleOrdersCount}`}</th>
              <th className="table_block_name__master__charts">{`${master.largeOrdersCount}`}</th>

              <th className="table_block_name__master__charts">{`${
                master.rating === null ? 0 : master.rating
              }`}</th>
              <th className="table_block_name__master__charts">{`${
                master.profit === null ? 0 : master.profit
              }`}</th>
              <th className="table_block_name__master__charts">{`${master.countCompletedOrders}`}</th>
              <th className="table_block_name__master__charts">{`${master.countNotCompletedOrders}`}</th>
            </tr>
          ))}
        </table>
      </div>
      {offset !== 0 ? (
        <button className="after_button" onClick={after}>
          back
        </button>
      ) : (
        <button className="after_button" disabled={true} onClick={after}>
          back
        </button>
      )}
      {masters.length >= limit ? (
        <button className="next_button" onClick={next}>
          next
        </button>
      ) : (
        <button className="next_button" disabled={true} onClick={next}>
          next
        </button>
      )}
      {masters.length === 0 && <div>Dont have more masters</div>}
    </div>
  )
}

export default MasterTableCharts
