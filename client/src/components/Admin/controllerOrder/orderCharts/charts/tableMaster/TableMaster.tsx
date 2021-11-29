import { useEffect, useState, FC, useCallback } from 'react'
import axios from 'axios'
import { ClockSize, MasterForTable } from 'src/models'
import './table-master-module.css'
import Preloader from 'src/components/Preloader'
import Pagination from 'src/components/reusableСomponents/pagination/pagination'

interface MastersResult {
  total: number
  masters: MasterForTable[]
}

interface MasterTableChartsProps {}
const MasterTableCharts: FC<MasterTableChartsProps> = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [offset, setOffset] = useState<number>(0)
  const [limit, setLimit] = useState<number>(15)

  const [masters, setMasters] = useState<MastersResult>({
    total: 0,
    masters: [],
  })

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
  }, [offset, limit])

  return (
    <div>
      <Preloader isLoading={isLoading} />
      <div className="wrapper_masters__charts">
        <table className="wrapper_masters__table__charts">
          <tr>
            <th className="table_block_id__master__charts">id</th>
            <th className="table_block_name__master__charts">Name</th>
            {clockSizes.map(ClockSize => (
              <th className="table_block_name__master__charts">{`${ClockSize.name}`}</th>
            ))}
            <th className="table_block_name__master__charts">Rating</th>
            <th className="table_block_name__master__charts">Profit</th>
            <th className="table_block_name__master__charts">Completed</th>
            <th className="table_block_name__master__charts">Not completed</th>
          </tr>
          {masters.masters.map(master => (
            <tr>
              <th className="table_block_id__master">{`${master.id}`}</th>
              <th className="table_block_name__master__charts">{`${master.name}`}</th>
              <th className="table_block_name__master__charts">{`${master.smallOrdersCount}`}</th>
              <th className="table_block_name__master__charts">{`${master.middleOrdersCount}`}</th>
              <th className="table_block_name__master__charts">{`${master.largeOrdersCount}`}</th>

              <th className="table_block_name__master__charts">{`${
                master.rating === null ? 0 : master.rating.toFixed(1)
              }`}</th>
              <th className="table_block_name__master__charts">{`${
                master.profit === null ? 0 : master.profit
              }$`}</th>
              <th className="table_block_name__master__charts">{`${master.countCompletedOrders}`}</th>
              <th className="table_block_name__master__charts">{`${master.countNotCompletedOrders}`}</th>
            </tr>
          ))}
        </table>
      </div>
      {masters.masters.length === 0 && <div>Dont have more masters</div>}
      {masters.total && (
        <Pagination
          offset={offset}
          setOffset={setOffset}
          limit={limit}
          setLimit={setLimit}
          total={masters.total}
        />
      )}
    </div>
  )
}

export default MasterTableCharts
