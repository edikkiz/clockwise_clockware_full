import axios from 'axios'
import { useState, useEffect, FC, useCallback } from 'react'
import { City, ClockSize, FormError, Master, Order } from 'src/models'
import './form-module.css'
import Preloader from '../Preloader'
import { useToasts } from 'react-toast-notifications'
import { useForm, SubmitHandler, useWatch } from 'react-hook-form'
import validator from 'email-validator'
import { format } from 'date-fns'

const correctDate = format(new Date(), 'yyyy-MM-dd')
const hour = new Date().getHours()

const time = [
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

interface OrderForm {
  name: string
  email: string
  city: number
  day: string
  time: string
  clockSize: number
  master: number
  photos: FileList
}

interface ControllerFormProps {}
const Form: FC<ControllerFormProps> = () => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<OrderForm>()

  const day = useWatch({
    control,
    name: 'day',
    defaultValue: correctDate,
  })

  const dataForFreeMaster = useWatch({
    control,
    name: ['day', 'time', 'city', 'clockSize'],
  })

  const [filesKey, setFilesKey] = useState<number>(0)

  const [cities, setCities] = useState<City[]>([])

  const [clockSizes, setClockSizes] = useState<ClockSize[]>([])

  const [masters, setMasters] = useState<Master[]>([])

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [urls, setUrls] = useState<string[]>([])

  const [files, setFiles] = useState<FileList | null>()

  const { addToast } = useToasts()

  useEffect(() => {
    const getClockSize = async () => {
      const sizes = await axios.get<ClockSize[]>('/clock-sizes')
      setClockSizes(sizes.data)
      if (sizes.data) {
        const { id } = sizes.data[0]
        setValue('clockSize', id)
      }
    }

    getClockSize()
  }, [])

  useEffect(() => {
    setIsLoading(true)
    const getMaters = async () => {
      if (dataForFreeMaster.every(elem => !!elem)) {
        const timeToDone = clockSizes.find(
          ({ id }) => id === Number(dataForFreeMaster[3]),
        )?.timeToDone
        const endAt = new Date(
          `${dataForFreeMaster[0]} ${dataForFreeMaster[1]}`,
        )
        endAt.setHours(endAt.getHours() + Number(timeToDone))
        const { data } = await axios.get<Master[]>('/free-masters', {
          params: {
            startAt: new Date(
              `${dataForFreeMaster[0]} ${dataForFreeMaster[1]}`,
            ),
            cityId: dataForFreeMaster[2],
            endAt: endAt,
          },
        })

        if (data.length === 0) {
          addToast('There are not available masters at selected time', {
            appearance: 'error',
          })
          setMasters([])
          setIsLoading(false)
        }
        if (data.length) {
          setValue('master', data[0].id)
          setIsLoading(false)
          setMasters(data)
        }
        setIsLoading(false)
      }
    }

    getMaters()
    setIsLoading(false)
  }, [dataForFreeMaster])

  useEffect(() => {
    const getCities = async () => {
      const { data } = await axios.get<City[]>(`/city`)
      setCities(data)
      if (data.length) {
        const { id } = data[0]
        setValue('city', id)
      }
    }

    getCities()
  }, [])

  const validate = (time: string): boolean => {
    if (new Date(`${day}:${time}`) > new Date(`${correctDate}:${hour}:00`)) {
      return true
    }
    return false
  }

  const fileRender = useCallback(() => {
    if (files) {
      if (files.length > 5) {
        addToast('max 5 files', { appearance: 'error' })
        setIsLoading(false)
        setFilesKey(filesKey === 0 ? 1 : 0)
        setFiles(null)
        return
      }
      for (let i = 0; i < files.length; i++) {
        if (files[i].size > 1024 * 1024) {
          addToast('max 1 mb for one file', { appearance: 'error' })
          setIsLoading(false)
          setFilesKey(filesKey === 0 ? 1 : 0)
          setFiles(null)
          reset()
          return
        }
        const fileReader = new FileReader()
        fileReader.readAsDataURL(files[i])
        fileReader.onload = () => {
          const res = fileReader.result
          if (res && typeof res === 'string') {
            setUrls(prevUrl => [...prevUrl, res])
          }
        }
      }
    }
  }, [files])

  useEffect(() => {
    fileRender()
  }, [fileRender])

  const onSubmit: SubmitHandler<OrderForm> = async data => {
    setIsLoading(true)
    await axios
      .post<Order[]>(`/order`, {
        masterId: +data.master,
        cityId: +data.city,
        clockSizeId: +data.clockSize,
        startAt: `${data.day} ${data.time}`,
        name: data.name,
        email: data.email,
        images: urls,
      })
      .then(() => {
        addToast('Order created', { appearance: 'success' })
        reset()
        setValue('day', correctDate)
        setValue('time', time[0])
        setIsLoading(false)
      })
      .catch(() => {
        addToast('Something is wrong', { appearance: 'error' })
        setIsLoading(false)
      })

    setIsLoading(false)
  }

  const test = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 5000)
  }

  return (
    <div className="wrapper_form">
      <Preloader isLoading={isLoading} />

      <form onSubmit={handleSubmit(onSubmit)} className="wrapper_form__form">
        <input
          placeholder="name"
          className="wrapper_form__input"
          {...register('name', {
            required: true,
            minLength: 3,
            maxLength: 30,
            pattern: /[A-Za-zА-Яа-яёЁЇїІіЄєҐґ]/,
          })}
        />
        {errors?.name?.type === FormError.REQUIRED && (
          <p>This field is required</p>
        )}

        {errors?.name?.type === FormError.MAXLENGTH && (
          <p>First name cannot exceed 30 characters</p>
        )}

        {errors?.name?.type === FormError.MINLENGTH && (
          <p>First name must more 3 characters</p>
        )}

        {errors?.name?.type === FormError.PATTERN && (
          <p>Alphabetical characters only</p>
        )}

        <input
          placeholder="email"
          className="wrapper_form__input"
          {...register('email', {
            required: true,
            validate: value => validator.validate(value),
          })}
        />
        {errors?.email?.type === FormError.VALIDATE && (
          <p>Email must be "email@example.com" format</p>
        )}

        {errors?.email?.type === FormError.REQUIRED && (
          <p>This field is required</p>
        )}

        <select className="wrapper_form__select" {...register('clockSize')}>
          {clockSizes.map(({ id, name }) => (
            <option
              className="clockSize"
              selected={id === clockSizes[0].id}
              value={+id}
            >
              {`${name}`}
            </option>
          ))}
        </select>

        <select className="wrapper_form__select" {...register('city')}>
          {cities.map(({ name, id }) => (
            <option className="city" selected={id === cities[0].id} value={+id}>
              {`${name}`}
            </option>
          ))}
        </select>

        <input
          className="wrapper_form__input"
          min={correctDate}
          type="date"
          {...register('day', { required: true })}
        />

        <select
          className="wrapper_form__select"
          {...register('time', { validate: validate })}
        >
          {time.map(elem => (
            <option selected={elem === time[0]}>{`${elem}`}</option>
          ))}
        </select>
        {errors?.time?.type === FormError.VALIDATE && (
          <p>The time must be greater than the current one</p>
        )}

        <select className="wrapper_form__select" {...register('master')}>
          {masters.map(({ name, id, rating }) =>
            !rating ? (
              <option
                className="masters"
                selected={id === masters[0].id}
                value={+id}
              >
                {`${name} with rating: 0`}
              </option>
            ) : (
              <option className="masters" value={+id}>
                {`${name} with rating: ${rating.toFixed(1)}`}
              </option>
            ),
          )}
        </select>
        <div>Maximum 5 files and no more 1 mb for one</div>
        <input
          key={filesKey}
          type="file"
          multiple={true}
          accept=".PNG, .JPG, .JPEG"
          onChange={event => setFiles(event.currentTarget.files)}
        />
        <button className="wrapper_form__button" type="submit">
          Submit
        </button>
      </form>
      <button onClick={test}>pick me for fun</button>
    </div>
  )
}

export default Form
