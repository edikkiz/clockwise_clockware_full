import React, { Component, useEffect, useState, FC, useCallback } from 'react'
import axios from 'axios'
import { AllOrder, Status } from 'models'
import Preloader from 'components/Preloader'
import { useHistory, useParams } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import './masterWorkList_module.css'
import MasterHeader from '../masterHeader/masterHeader'
import { format } from 'date-fns'

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

  const reStatus = (id: number, email: string) => {
    if (window.confirm(`confirm change status in order: ${id}`)) {
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
              {order.status != Status.Completed ? (
                <button
                  type="button"
                  onClick={() => reStatus(order.id, order.email)}
                  className="link_update__master"
                >
                  <th className="table_link">
                    Сlick here to set the status completed
                  </th>
                </button>
              ) : (
                <button
                  type="button"
                  disabled={true}
                  className="link_update__master-disabled"
                >
                  <th className="table_link__order-disabled">
                    This order is completed
                  </th>
                </button>
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
