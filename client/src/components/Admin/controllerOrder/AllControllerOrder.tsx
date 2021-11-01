import React, { useEffect, useState, FC, ReactElement } from 'react'
import './all_controller_order_module.css'
import axios from 'axios'
import {
  AllOrder,
  City,
  ClockSize,
  FormError,
  Master,
  Order,
  Status,
  User,
} from '../../../models/models'
import { useHistory, useParams, useLocation } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import { useForm, SubmitHandler, useWatch } from 'react-hook-form'
import Preloader from '../../Preloader'
import AdminHeader from '../adminHeader/AdminHeader'

const orderTime = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
]

interface OrderController {
  city: number | null
  day: string
  time: string
  clockSize: number | null
  master: number | null
  price: number
  status: boolean
}

interface LocationState {
  id: string
  userId: string
  masterId: string
  cityId: string
  clockSizeId: string
  startAt: string
  price: string
  status: string
}

interface ControllerOrderProps {}
const AllControllerOrder: FC<ControllerOrderProps> = () => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<OrderController>()

  const location = useLocation<LocationState>()

  const { id, userId, masterId, cityId, clockSizeId, startAt, price, status } =
    location.state

  const dataForFreeMaster = useWatch({
    control,
    name: ['day', 'time', 'city', 'clockSize', 'time'],
  })

  const history = useHistory()

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { addToast } = useToasts()

  const [cities, setCities] = useState<City[]>([])

  const [putMasters, setPutMasters] = useState<Master[]>([])

  const [putUserId, setPutUserId] = useState<number>(0)

  const [clockSizes, setClockSizes] = useState<ClockSize[]>([])

  useEffect(() => {
    console.log(startAt)
    if (id) {
      const time = startAt.split('T')
      const result = orderTime.find(
        elem => elem === `${time[1].split(':')[0]}:00`,
      )
      if (result) {
        setValue('time', result)
      }

      setValue('day', time[0])
      setPutUserId(+userId)
      setValue('master', +masterId)
      setValue('city', +cityId)
      setValue('clockSize', +clockSizeId)
      setValue('price', +price)
    }
  }, [])

  useEffect(() => {
    const getClockSize = async () => {
      const { data } = await axios.get<ClockSize[]>(`/clockSizes`)
      setClockSizes(data)
    }

    getClockSize()
  }, [])

  useEffect(() => {
    const getMaters = async () => {
      if (dataForFreeMaster.every(elem => !!elem)) {
        const { data } = await axios.get<Master[]>(`/admin/getFreeMasters`, {
          params: {
            orderId: +id,
            startAt: dataForFreeMaster[0] + ' ' + dataForFreeMaster[1],
            cityId: Number(dataForFreeMaster[2]),
            clockSizeId: Number(dataForFreeMaster[3]),
          },
        })
        setPutMasters(data)
      }
    }

    getMaters()
  }, [dataForFreeMaster])

  useEffect(() => {
    const getCities = async () => {
      const { data } = await axios.get<City[]>(`/city`)
      setCities(data)
    }

    getCities()
  }, [])

  const onSubmitPut: SubmitHandler<OrderController> = data => {
    if (data.master && data.city && data.clockSize)
      axios
        .put<Order[]>(`/admin/order`, {
          id: +id,
          userId: +putUserId,
          masterId: +data.master,
          cityId: +data.city,
          clockSizeId: +data.clockSize,
          price: +data.price,
          startAt: `${data.day} ${data.time}`,
          status: data.status,
        })
        .then(() => {
          addToast('order updated', { appearance: 'success' })
          history.push('/admin/orders')
        })
  }

  return (
    <>
      <AdminHeader />
      <div className="wrapper_form">
        <Preloader isLoading={isLoading} />

        <form
          onSubmit={handleSubmit(onSubmitPut)}
          className="wrapper_form__form"
        >
          <select className="wrapper_form__select" {...register('clockSize')}>
            {clockSizes.map(({ id, name }) => (
              <option
                selected={+id === +clockSizeId}
                className="clockSize"
                value={+id}
              >
                {`${name}`}
              </option>
            ))}
          </select>

          <select className="wrapper_form__select" {...register('city')}>
            {cities.map(({ name, id }) => (
              <option className="city" selected={id === +cityId} value={+id}>
                {`${name}`}
              </option>
            ))}
          </select>

          <input
            className="wrapper_form__input"
            type="date"
            {...register('day')}
          />

          <select className="wrapper_form__select" {...register('time')}>
            {orderTime.map(elem => (
              <option>{`${elem}`}</option>
            ))}
          </select>

          <input
            className="wrapper_form__input"
            type="number"
            {...register('price', { required: true })}
          />
          {errors?.price?.type === FormError.TYPE && <p>Only numbers</p>}

          {errors?.price?.type === FormError.REQUIRED && (
            <p>This field is required</p>
          )}
          {status === Status.Completed ? (
            <select className="wrapper_form__select" {...register('status')}>
              <option selected className="status" value={Status.Completed}>
                Completed
              </option>
            </select>
          ) : (
            <select className="wrapper_form__select" {...register('status')}>
              <option selected className="status" value={Status.INPROGRESS}>
                In progress
              </option>
              <option selected className="status" value={Status.Completed}>
                Completed
              </option>
            </select>
          )}
          <select className="wrapper_form__select" {...register('master')}>
            {putMasters.map(({ name, id, rating }) =>
              !rating ? (
                <option
                  selected={id === +masterId}
                  className="masters"
                  value={id}
                >
                  {`${name} with rating: 0`}
                </option>
              ) : (
                <option
                  selected={id === +masterId}
                  className="masters"
                  value={id}
                >
                  {`${name} with rating: ${rating.toFixed(1)}`}
                </option>
              ),
            )}
          </select>
          <button className="wrapper_form__button" type="submit">
            Submit
          </button>
        </form>
      </div>
    </>
  )
}

export default AllControllerOrder
