import React, {
  Component,
  useEffect,
  useState,
  FC,
  useCallback,
  useRef,
  SetStateAction,
} from 'react'
import axios from 'axios'
import './order_table_module.css'
import {
  OrderForTable,
  City,
  ClockSize,
  Master,
  Order,
  Status,
  User,
} from '../../../models/models'
import { Link } from 'react-router-dom'
import Preloader from '../../Preloader'
import { useToasts } from 'react-toast-notifications'
import AdminHeader from '../adminHeader/AdminHeader'

const limit = 10
interface ControllerOrderTableProps {}
const OrderTable: FC<ControllerOrderTableProps> = () => {
  const [orders, setOrders] = useState<OrderForTable[]>([])

  const [cities, setCities] = useState<City[]>([])
  const [cityFilter, setCityFilter] = useState<number | null>(null)

  const [masters, setMasters] = useState<Master[]>([])
  const [masterFilter, setMasterFilter] = useState<number | null>(null)

  const [clockSizes, setClockSizes] = useState<ClockSize[]>([])
  const [clockSizeFilter, setClockSizeFilter] = useState<number | null>(null)

  const [statusesFilter, setStatusesFilter] = useState<Status[]>([Status.Completed, Status.CREATED, Status.INPROGRESS])

  const [statusFilter, setStatusFilter] = useState<Status | null>(null)

  const [filterStart, setFilterStart] = useState<string | null>(null)
  const [filterEnd, setFilterEnd] = useState<string | null>(null)

  const [offset, setOffset] = useState<number>(0)

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { addToast } = useToasts()

  const getMasters = useCallback(async () => {
    setIsLoading(true)
    const { data } = await axios.get<Master[]>(`/admin/master`)
    setMasters(data)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    getMasters()
  }, [getMasters])

  const getCities = useCallback(async () => {
    setIsLoading(true)
    const { data } = await axios.get<City[]>(`/city`)
    setCities(data)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    getCities()
  }, [getCities])

  const getClockSizes = useCallback(async () => {
    setIsLoading(true)
    const { data } = await axios.get<ClockSize[]>(`/clockSizes`)
    setClockSizes(data)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    getClockSizes()
  }, [getClockSizes])

  const filtered = async () => {
    if (
      cityFilter ||
      masterFilter ||
      clockSizeFilter ||
      statusFilter ||
      filterStart ||
      filterEnd
    ) {
      const { data } = await axios.get<OrderForTable[]>(
        '/admin/allOrderFiltred',
        {
          params: {
            offset: offset,
            limit: limit,
            cityId: cityFilter,
            masterId: masterFilter,
            clockSizeId: clockSizeFilter,
            status: statusFilter,
            filterStart: filterStart,
            filterEnd: filterEnd,
          },
        },
      )
      if(!data.length) { addToast('no orders for this filter', {appearance: 'warning'})}
      setOrders(data)
    }
  }

  useEffect(() => {
    filtered()
  }, [offset])

  const onSubmitDelete = useCallback(
    (id: number) => {
      setIsLoading(true)
      if (window.confirm('confirm deletion of the selected order')) {
        axios
          .put<Order[]>(`/admin/deleteOrder`, {
            id: +id,
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
                `/admin/allOrder`,
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

  const getOrdersList = useCallback(async () => {
    if (
      cityFilter ||
      masterFilter ||
      clockSizeFilter ||
      statusFilter ||
      filterStart ||
      filterEnd
    ) {
      return
    }
    setIsLoading(true)
    const { data } = await axios.get<OrderForTable[]>(`/admin/allOrder`, {
      params: {
        offset,
        limit,
      },
    })
    setOrders(data)
    setIsLoading(false)
  }, [offset])

  useEffect(() => {
    getOrdersList()
  }, [getOrdersList])

  return (
    <div>
      <Preloader isLoading={isLoading} />
      <AdminHeader />
      <div className="wrapperFilter">
        <select
          className="selectFilter"
          onChange={event => {
            event.currentTarget.value === 'No city for filter'
              ? setCityFilter(null)
              : setCityFilter(+event.currentTarget.value)
          }}
        >
          <option selected>No city for filter</option>
          {cities.map(({ id, name }) => (
            <option selected={id === cityFilter} value={+id}>
              {`${name}`}
            </option>
          ))}
        </select>

        <select
          className="selectFilter"
          onChange={event => {
            event.currentTarget.value === 'No master for filter'
              ? setMasterFilter(null)
              : setMasterFilter(+event.currentTarget.value)
          }}
        >
          <option selected>No master for filter</option>
          {masters.map(({ id, name }) => (
            <option selected={id === masterFilter} value={+id}>
              {`${name}`}
            </option>
          ))}
        </select>

        <select
          className="selectFilter"
          onChange={event => {
            event.currentTarget.value === 'No clock size for filter'
              ? setClockSizeFilter(null)
              : setClockSizeFilter(+event.currentTarget.value)
          }}
        >
          <option selected>No clock size for filter</option>
          {clockSizes.map(({ id, size }) => (
            <option selected={id === clockSizeFilter} value={+id}>
              {`${size}`}
            </option>
          ))}
        </select>

        <select
          className="selectFilter"
          onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
            const { value } = event.currentTarget
            value !== 'No status for filter'
              ? setStatusFilter(
                  value as Status | null,
                )
              : setStatusFilter(null)
          }}
        >
          <option selected>No status for filter</option>
          {statusesFilter.map(elem => (
            <option value={elem}>{`${elem}`}</option>
          ))}
        </select>

        <button
          className={
            statusFilter ||
            cityFilter ||
            masterFilter ||
            clockSizeFilter ||
            filterEnd ||
            filterStart
              ? 'buttonFilter'
              : 'buttonFilter-disabled'
          }
          onClick={filtered}
        >
          filter
        </button>

        <input
          type="date"
          title="select start filter date"
          max={filterEnd !== null ? filterEnd : ''}
          onChange={event => {
            setFilterStart(event.currentTarget.value)
          }}
        />

        <input
          type="date"
          title="select end filter date"
          min={filterStart !== null ? filterStart : ''}
          onChange={event => {
            setFilterEnd(event.currentTarget.value)
          }}
        />
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
              <th className="table_block_name__order">{`${order.clockSize.size}`}</th>
              <th className="table_block_name__order">{`${order.master.name}`}</th>
              <th className="table_block_name__order">{`${new Date(
                order.startAt.split('.')[0]).toLocaleString()}`}</th>
              <th className="table_block_name__order">{`${new Date(
                order.endAt.split('.')[0],
              ).toLocaleString()} `}</th>
              <th className="table_block_name__order">{`${order.price}`}</th>
              <th className="table_block_name__order">{`${
                order.feedback === null ? 'no feedback' : order.feedback
              }`}</th>
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
                  pathname: `/admin/navOrder`,
                  state: {
                    id: order.id,
                    userId: order.user.id,
                    masterId: order.master.id,
                    cityId: order.city.id,
                    clockSizeId: order.clockSize.id,
                    startAt: order.startAt,
                    price: order.price
                  }
                }}
                title="update the order"
                  className="link_update__order"
                >
                  <th className="table_link__order">update</th>
                </Link>
              ) : (
                <Link
                  to={{
                    pathname: `/admin/navOrder`,
                    state: {
                      id: order.id,
                      userId: order.user.id,
                      masterId: order.master.id,
                      cityId: order.city.id,
                      clockSizeId: order.clockSize.id,
                      startAt: order.startAt,
                      price: order.price
                    }
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
      {offset !== 0 ? (
        <button className="after_button" onClick={after}>
          back
        </button>
      ) : (
        <button className="after_button" disabled={true} onClick={after}>
          back
        </button>
      )}
      {orders.length >= limit ? (
        <button className="next_button" onClick={next}>
          next
        </button>
      ) : (
        <button className="next_button" disabled={true} onClick={next}>
          next
        </button>
      )}
      {orders.length === 0 && <div>Dont have more orders</div>}
    </div>
  )
}

export default OrderTable
