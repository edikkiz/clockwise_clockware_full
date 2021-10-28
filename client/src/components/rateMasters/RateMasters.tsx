import axios from 'axios'
import './rate-masters-module.css'
import React, { Component, useState, useEffect, FC } from 'react'
import { AllOrder } from '../../models'
import { useHistory, useParams } from 'react-router-dom'
import { Redirect } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
/* @ts-ignore */
import ReactStars from 'react-rating-stars-component'

interface ControllerRateMasterProps {}
const RateMaster: FC<ControllerRateMasterProps> = () => {
  const history = useHistory()

  const [feedbackText, setFeedbackText] = useState<string>('')

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [rating, setRating] = useState<number>(0)

  const { feedbackToken } = useParams<{ feedbackToken: string }>()

  const [order, setOrder] = useState<AllOrder>()

  const { addToast } = useToasts()

  useEffect(() => {
    const getOrder = async () => {
      const { data } = await axios.get<AllOrder[]>('/order-for-feedback', {
        params: {
          feedbackToken: feedbackToken,
        },
      })
      if (data) {
        setOrder(data[0])
      } else {
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
          const token = localStorage.getItem('accessToken')
          token
            ? history.push(`/role/user/${order.userId}`)
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
              {order.masterName}
            </div>
            <div className="info_rate">
              <b>Order #{order.id}</b>
              <br />
              <b> user name:</b> {order.userName}
              <br />
              <b>user email:</b> {order.userEmail}
              <br />
              <b>clock size:</b> {order.size}
              <br />
              <b>city:</b> {order.cityName}
              <br />
              <b>price:</b> {order.price}
              <br />
              <b>start work on:</b> {order.startAt}
              <br />
              <b>end work on:</b> {order.endAt}
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
          count={5}
          size={60}
          activeColor="#ffd700"
          isHalf={true}
          value={rating}
          onChange={(newRating: number) => setRating(newRating)}
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
