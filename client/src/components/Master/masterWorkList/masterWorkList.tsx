import { useEffect, useState, FC, useCallback } from 'react'
import axios from 'axios'
import { AllOrder, Status } from 'src/models'
import Preloader from '../../Preloader'
import { useParams } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import './masterWorkList_module.css'
import MasterHeader from '../masterHeader/masterHeader'
import { format } from 'date-fns'
import { saveAs } from 'file-saver'

const options = {
  year: 'numeric',
  month: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
}

const limit = 10
interface masterWorkListProps {}
const MasterWorkList: FC<masterWorkListProps> = () => {
  const { masterId } = useParams<{ masterId: string }>()

  const [orders, setOrders] = useState<AllOrder[]>([])

  const [offset, setOffset] = useState<number>(0)

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { addToast } = useToasts()

  useEffect(() => {
    setIsLoading(true)
    const getAllOrders = async () => {
      const { data } = await axios.get<AllOrder[]>(`/master/master-orders`, {
        params: {
          masterId,
          offset,
          limit,
        },
      })
      setOrders(data)
      setIsLoading(false)
    }

    getAllOrders()
    setIsLoading(false)
  }, [offset])

  const next = useCallback(() => {
    setOffset(offset + limit)
  }, [])

  const after = useCallback(() => {
    if (offset < 10) {
      setOffset(0)
    }
    if (offset >= 10) {
      setOffset(offset - limit)
    }
  }, [])

  const changeStatus = (id: number, email: string) => {
    if (window.confirm(`confirm change status in order: ${id}`)) {
      setIsLoading(true)
      axios
        .put('/master/change-status', {
          id: +id,
          email: email,
        })
        .then(async () => {
          const { data } = await axios.get<AllOrder[]>(
            `/master/master-orders`,
            {
              params: {
                masterId,
                offset,
                limit,
              },
            },
          )
          setOrders(data)
          setIsLoading(false)
        })
    }
  }

  const download = (images: string[]) => {
    images.forEach(image => {
      saveAs(image, 'download.jpg')
    })
  }

  return (
    <div>
      <Preloader isLoading={isLoading} />
      <MasterHeader masterId={+masterId} />
      <div className="wrapper_orders">
        <table className="wrapper_orders__table">
          <tr>
            <th className="table_block_id__order">id</th>
            <th className="table_block_name__master-orders">user name</th>
            <th className="table_block_name__master-orders">user email</th>
            <th className="table_block_name__master-orders">city</th>
            <th className="table_block_name__master-orders">clock size</th>
            <th className="table_block_name__master-orders">master</th>
            <th className="table_block_name__master-orders">start at</th>
            <th className="table_block_name__master-orders">end at</th>
            <th className="table_block_name__master-orders">price</th>
            <th className="table_block_name__master-orders">feedback</th>
            <th className="table_block_name__master-orders">rating</th>
            <th className="table_block_id__order">status</th>
            <th className="table_block_name__master-orders">download images</th>
            <th className="table_block_name__master-orders">
              change order status
            </th>
          </tr>
          {orders.map(order => (
            <tr>
              <th className="table_block_id__order">{`${order.id}`}</th>
              <th className="table_block_name__master-orders">{`${order.userName}`}</th>
              <th className="table_block_name__master-orders">{`${order.userEmail}`}</th>
              <th className="table_block_name__master-orders">{`${order.cityName}`}</th>
              <th className="table_block_name__master-orders">{`${order.size}`}</th>
              <th className="table_block_name__master-orders">{`${order.masterName}`}</th>
              <th className="table_block_name__master-orders">{`${format(
                new Date(order.startAt),
                'yyyy-MM-dd HH:mm',
              )}`}</th>
              <th className="table_block_name__master-orders">{`${format(
                new Date(order.endAt),
                'yyyy-MM-dd HH:mm',
              )}`}</th>
              <th className="table_block_name__master-orders">{`${order.price}`}</th>
              <th className="table_block_name__master-orders">{`${
                order.rating === null ? 'no feedback' : order.feedback
              }`}</th>
              <th className="table_block_name__master-orders">{`${
                order.rating === null ? 'not rated' : order.rating
              }`}</th>
              <th className="table_block_id__order">{`${order.status}`}</th>

              {order.images.length ? (
                <th className="table_link_master">
                  <button
                    type="button"
                    onClick={() => download(order.images)}
                    className="link_update__master"
                  >
                    Сlick here for download images
                  </button>
                </th>
              ) : (
                <th className="table_link__order-disabled">
                  this order dont have images
                </th>
              )}
              {order.status != Status.Completed ? (
                <th className="table_link">
                  <button
                    type="button"
                    onClick={() => changeStatus(order.id, order.email)}
                    className="link_update__master"
                  >
                    Сlick here to set the status completed
                  </button>
                </th>
              ) : (
                <th className="table_link__order-disabled">
                  This order is completed
                  <button
                    type="button"
                    disabled={true}
                    className="link_update__master-disabled"
                  ></button>
                </th>
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

export default MasterWorkList
