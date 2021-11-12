import { useEffect, useState, FC, useCallback } from 'react'
import axios from 'axios'
import './order-table-module.css'
import { OrderForTable, Order, Status } from 'src/models/'
import { Link } from 'react-router-dom'
import Preloader from '../../Preloader'
import { useToasts } from 'react-toast-notifications'
import AdminHeader from '../adminHeader/AdminHeader'
import { format } from 'date-fns'
import StatusSelect from 'src/components/reusableСomponents/statusSelect/StatusSelect'
import DateRange from 'src/components/reusableСomponents/dateRangeSelect/DateRangeSelect'
import ClockSizeSelect from 'src/components/reusableСomponents/clockSizeSelect/ClockSizeSelect'
import MasterSelect from 'src/components/reusableСomponents/masterSelect/MasterSelect'
import CitySelect from 'src/components/reusableСomponents/citySelect/CitySelect'
import Modal from 'src/components/calendar/modal'
import Pagination from 'src/components/reusableСomponents/pagination/pagination'

interface ControllerOrderTableProps {}
const OrderTable: FC<ControllerOrderTableProps> = () => {
  const [orders, setOrders] = useState<OrderForTable[]>([])

  const [cityFilter, setCityFilter] = useState<number | null>(null)
  const [masterFilter, setMasterFilter] = useState<number | null>(null)
  const [clockSizeFilter, setClockSizeFilter] = useState<number | null>(null)
  const [statusFilter, setStatusFilter] = useState<Status | null>(null)

  const [filterStart, setFilterStart] = useState<string>('')
  const [filterEnd, setFilterEnd] = useState<string>('')

  const [offset, setOffset] = useState<number>(0)
  const [limit, setLimit] = useState<number>(15)

  const [modalActive, setModalActive] = useState<boolean>(false)
  const [modalText, setModalText] = useState<string | null>()

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { addToast } = useToasts()

  const filtered = async () => {
    setIsLoading(true)
    const { data } = await axios.get<OrderForTable[]>(
      '/admin/orders-filtered',
      {
        params: {
          offset: offset,
          limit: limit,
          cityId: cityFilter,
          masterId: masterFilter,
          clockSizeId: clockSizeFilter,
          status: statusFilter,
          start: filterStart,
          end: filterEnd,
        },
      },
    )
    setOrders(data)
    setIsLoading(false)
  }

  useEffect(() => {
    filtered()
  }, [offset, limit])

  const onSubmitDelete = useCallback(
    (id: number) => {
      setIsLoading(true)
      if (window.confirm('confirm deletion of the selected order')) {
        axios
          .delete<Order[]>(`/admin/delete-order`, {
            data: {
              id: +id,
            },
          })
          .then(() => {
            const localCopy = [...orders]
            const deleteIndex = localCopy.findIndex(elem => elem.id === id)
            localCopy.splice(deleteIndex, 1)
            setOrders(localCopy)
            setIsLoading(false)
            addToast('order deleted', { appearance: 'success' })
            setIsLoading(true)

            const getAllOrders = async () => {
              const { data } = await axios.get<OrderForTable[]>(
                `/admin/orders-filtered`,
                {
                  params: {
                    offset,
                    limit,
                  },
                },
              )
              setOrders(data)
              setIsLoading(false)
            }

            getAllOrders()
          })
      }
      setIsLoading(false)
    },
    [orders],
  )

  return (
    <div>
      <Preloader isLoading={isLoading} />
      <AdminHeader />
      <div className="wrapperFilter">
        <CitySelect setSelectValue={setCityFilter} />
        <MasterSelect setSelectValue={setMasterFilter} />
        <ClockSizeSelect setSelectValue={setClockSizeFilter} />
        <StatusSelect setSelectValue={setStatusFilter} />
        <button className="buttonFilter" onClick={filtered}>
          filter
        </button>
        <DateRange setStart={setFilterStart} setEnd={setFilterEnd} />
      </div>

      <div className="wrapper_orders">
        <table className="wrapper_orders__table">
          <tr>
            <th className="table_block_id__order">id</th>
            <th className="table_block_name__order">user name</th>
            <th className="table_block_name__order">user email</th>
            <th className="table_block_name__order">city</th>
            <th className="table_block_name__order">clock size</th>
            <th className="table_block_name__order">master</th>
            <th className="table_block_name__order">start at</th>
            <th className="table_block_name__order">end at</th>
            <th className="table_block_name__order">price</th>
            <th className="table_block_name__order">feedback</th>
            <th className="table_block_name__order">rating</th>
            <th className="table_block_name__order">status</th>
            <th className="link_create__order">update / delete</th>
          </tr>
          {orders.map(order => (
            <tr>
              <th className="table_block_id__order">{`${order.id}`}</th>
              <th className="table_block_name__order">{`${order.user.name}`}</th>
              <th className="table_block_name__order">{`${order.user.email}`}</th>
              <th className="table_block_name__order">{`${order.city.name}`}</th>
              <th className="table_block_name__order">{`${order.clockSize.name}`}</th>
              <th className="table_block_name__order">{`${order.master.name}`}</th>
              <th className="table_block_name__order">{`${format(
                new Date(order.startAt),
                'yyyy-MM-dd HH:mm',
              )}`}</th>
              <th className="table_block_name__order">{`${format(
                new Date(order.endAt),
                'yyyy-MM-dd HH:mm',
              )} `}</th>
              <th className="table_block_name__order">{`${order.price}`}</th>
              <th className="table_link_master">
                {order.rating !== null ? (
                  <button
                    className="link_update__master"
                    onClick={() => {
                      setModalText(order.feedback)
                      setModalActive(true)
                    }}
                  >
                    check feedback
                  </button>
                ) : (
                  <div>no feedback</div>
                )}
              </th>
              <th className="table_block_name__order">{`${
                order.rating === null ? 'not rated' : order.rating
              }`}</th>
              <th className="table_block_name__order">{`${order.status}`}</th>
              <button
                type="button"
                onClick={() => onSubmitDelete(order.id)}
                className="link_update__order"
              >
                <th className="table_link__order">delete</th>
              </button>
              {order.status != Status.Completed ? (
                <Link
                  to={{
                    pathname: `/admin/change-order`,
                    state: {
                      id: order.id,
                      userId: order.user.id,
                      masterId: order.master.id,
                      cityId: order.city.id,
                      clockSizeId: order.clockSize.id,
                      startAt: order.startAt,
                      price: order.price,
                    },
                  }}
                  title="update the order"
                  className="link_update__order"
                >
                  <th className="table_link__order">update</th>
                </Link>
              ) : (
                <Link
                  to={{
                    pathname: `/admin/change-order`,
                    state: {
                      id: order.id,
                      userId: order.user.id,
                      masterId: order.master.id,
                      cityId: order.city.id,
                      clockSizeId: order.clockSize.id,
                      startAt: order.startAt,
                      price: order.price,
                    },
                  }}
                  title="update the order"
                  className="link_update__order-disabled"
                >
                  <th className="table_link__order-disabled">update</th>
                </Link>
              )}
            </tr>
          ))}
        </table>
      </div>

      {!orders.length && <div>Dont have more orders</div>}
      <Modal active={modalActive} setActive={setModalActive}>
        <div>{`feedback: ${modalText}`}</div>
      </Modal>
      <Pagination
        offset={offset}
        setOffset={setOffset}
        limit={limit}
        setLimit={setLimit}
        total={1000}
      ></Pagination>
    </div>
  )
}

export default OrderTable
