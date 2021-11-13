import { useEffect, useState, FC, useCallback } from 'react'
import axios from 'axios'
import { AllOrder, Status } from 'src/models'
import { Link } from 'react-router-dom'
import Preloader from 'src/components/Preloader'
import { useParams } from 'react-router-dom'
import './user-list-module.css'
import UserHeader from '../userHeader/UserHeader'
import { format } from 'date-fns'
import Modal from 'src/components/calendar/modal'
import ModalAddPhotos from 'src/components/reusableСomponents/modalAddPhotos/ModalAddPhotos'
import Pagination from 'src/components/reusableСomponents/pagination/pagination'

interface userListProps {}
const UserList: FC<userListProps> = () => {
  const { id: userId } = useParams<{ id: string }>()

  const [feedbackActive, setFeedbackActive] = useState<boolean>(false)
  const [feedbackText, setFeedbackText] = useState<string>()

  const [activeDownloadPhotos, setActiveDownloadPhotos] =
    useState<boolean>(false)
  const [orderId, setOrderId] = useState<number>(0)

  const [orders, setOrders] = useState<AllOrder[]>([])
  const [countOrders, setCountOrders] = useState<number>(0)

  const [offset, setOffset] = useState<number>(0)
  const [limit, setLimit] = useState<number>(0)

  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    setIsLoading(true)
    const getAllOrders = async () => {
      const { data } = await axios.get<AllOrder[]>(`/user/user-orders`, {
        params: {
          userId,
          offset,
          limit,
        },
      })
      setOrders(data)
      setIsLoading(false)
    }

    getAllOrders()
    setIsLoading(false)
  }, [offset, activeDownloadPhotos, limit])

  useEffect(() => {
    const countOrdersOfUser = async () => {
      const { data } = await axios.get('/user/count-orders', {
        params: { id: userId },
      })
      setCountOrders(data)
    }
    countOrdersOfUser()
  }, [])

  return (
    <div>
      <Preloader isLoading={isLoading} />
      <UserHeader />
      <div className="wrapper_orders">
        <table className="wrapper_orders__table">
          <tr>
            <th className="table_block_id__order">id</th>
            <th className="table_block_name__user-orders">city</th>
            <th className="table_block_name__user-orders">clock size</th>
            <th className="table_block_name__user-orders">master</th>
            <th className="table_block_name__user-orders">start at</th>
            <th className="table_block_name__user-orders">end at</th>
            <th className="table_block_name__user-orders">price</th>
            <th className="table_block_name__user-orders">feedback</th>
            <th className="table_block_name__user-orders">rating</th>
            <th className="table_block_id__order">status</th>
            <th className="table_block_id__order">images</th>
            <th className="table_block_id__order">Rate</th>
          </tr>
          {orders.map(order => (
            <tr>
              <th className="table_block_id__order">{`${order.id}`}</th>
              <th className="table_block_name__user-orders">{`${order.cityName}`}</th>
              <th className="table_block_name__user-orders">{`${order.size}`}</th>
              <th className="table_block_name__user-orders">{`${order.masterName}`}</th>
              <th className="table_block_name__user-orders">{`${format(
                new Date(order.startAt),
                'yyyy-MM-dd HH:mm',
              )}`}</th>
              <th className="table_block_name__user-orders">{`${format(
                new Date(order.endAt),
                'yyyy-MM-dd HH:mm',
              )} `}</th>
              <th className="table_block_name__user-orders">{`${order.price}`}</th>
              <th className="table_block_name__user-orders">
                {order.rating !== null ? (
                  <button
                    className="link_update__master"
                    onClick={() => {
                      setFeedbackText(order.feedback)
                      setFeedbackActive(true)
                    }}
                  >
                    check feedback
                  </button>
                ) : (
                  <div>no feedback</div>
                )}
              </th>
              <th className="table_block_name__user-orders">{`${
                order.rating === null ? 'not rated' : order.rating
              }`}</th>
              <th className="table_block_id__order">{`${order.status}`}</th>
              <th className="table_block_id__order">
                {!order.images.length ? (
                  <button
                    type="button"
                    className="link_update__user-disabled"
                    onClick={() => {
                      setOrderId(order.id)
                      setActiveDownloadPhotos(true)
                    }}
                  >
                    Upload images
                  </button>
                ) : (
                  `this order have images`
                )}
              </th>
              {order.status === Status.Completed &&
              order.feedbackToken !== null ? (
                <Link
                  to={`/rate/${order.feedbackToken}`}
                  className="link_update__user"
                >
                  <th className="table_link">Сlick here to rate master</th>
                </Link>
              ) : (
                <button
                  type="button"
                  disabled={true}
                  className="link_update__user-disabled"
                >
                  <th className="table_link__order-disabled">
                    {order.rating
                      ? 'this order has already been rated'
                      : 'Сan be rate after the order is completed'}
                  </th>
                </button>
              )}
            </tr>
          ))}
        </table>
      </div>
      {orders.length === 0 && <div>Dont have more orders</div>}
      <Modal active={feedbackActive} setActive={setFeedbackActive}>
        <div>{`feedback: ${feedbackText}`}</div>
      </Modal>
      <ModalAddPhotos
        active={activeDownloadPhotos}
        setActive={setActiveDownloadPhotos}
        filesLimit={5}
        orderId={orderId}
      ></ModalAddPhotos>
      {countOrders && (
        <Pagination
          offset={offset}
          setOffset={setOffset}
          limit={limit}
          setLimit={setLimit}
          total={countOrders}
        />
      )}
    </div>
  )
}

export default UserList
