import axios from 'axios'
import './rate-masters-module.css'
import React, { useState, useEffect, FC } from 'react'
import { OrderForFeedback } from 'src/models'
import { useHistory, useParams } from 'react-router-dom'
import { Redirect } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import { format } from 'date-fns'
import ReactStars from 'react-rating-stars-component'

interface ControllerRateMasterProps {}
const RateMaster: FC<ControllerRateMasterProps> = () => {
  const history = useHistory()

  const [feedbackText, setFeedbackText] = useState<string>('')

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [rating, setRating] = useState<number>(0)

  const { feedbackToken } = useParams<{ feedbackToken: string }>()

  const [order, setOrder] = useState<OrderForFeedback>()

  const { addToast } = useToasts()

  useEffect(() => {
    const getOrder = async () => {
      const { data } = await axios.get<OrderForFeedback>(
        '/order-for-feedback',
        {
          params: {
            feedbackToken: feedbackToken,
          },
        },
      )
      if (data) {
        setOrder(data)
      } else {
        addToast('this order is appreciated', { appearance: 'info' })
        history.push('/')
      }
    }
    getOrder()
  }, [])

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (order) {
      setIsLoading(true)

      axios
        .put('/add-feedback', {
          feedbackDate: new Date().toISOString(),
          feedbackToken: feedbackToken,
          feedbackText: feedbackText,
          rating: rating,
          id: +order.id,
        })
        .then(() => {
          addToast('thanks for the tip', { appearance: 'success' })
          setIsLoading(false)
          const token = localStorage.getItem('accessToken')
          token
            ? history.push(`/role/user/${order.user.id}`)
            : history.push('/login')
        })
    }
  }

  const redirect = () => {
    addToast('this order has already been rated', { error: 'info' })
    return <Redirect to="/" />
  }

  return feedbackToken ? (
    <div className="wrapper_rate__master">
      <form className="wrapper_rate__master__form" onSubmit={onSubmit}>
        {order && (
          <>
            <div className="info_rate">
              <b>Please rate work of the master:</b>
              <br />
              {order.master.name}
            </div>
            <div className="info_rate">
              <b>Order #{order.id}</b>
              <br />
              <b> user name:</b> {order.user.name}
              <br />
              <b>user email:</b> {order.user.email}
              <br />
              <b>clock size:</b> {order.clockSize.name}
              <br />
              <b>city:</b> {order.city.name}
              <br />
              <b>price:</b> {order.price}
              <br />
              <b>start work on:</b>
              {format(new Date(order.startAt), 'yyyy-MM-dd HH:mm')}
              <br />
              <b>end work on:</b>
              {format(new Date(order.endAt), 'yyyy-MM-dd HH:mm')}
            </div>
          </>
        )}

        <textarea
          value={feedbackText}
          onChange={event => setFeedbackText(event.target.value)}
          className="feedback__text"
          placeholder="feedback on the work of the master"
          maxLength={255}
        />

        <ReactStars
          onChange={setRating}
          count={5}
          size={30}
          activeColor="#ffd700"
          isHalf={true}
          value={rating}
        />

        <p></p>
        <button className="onsubmit_button" type="submit">
          submit
        </button>
      </form>
    </div>
  ) : (
    redirect()
  )
}

export default RateMaster
