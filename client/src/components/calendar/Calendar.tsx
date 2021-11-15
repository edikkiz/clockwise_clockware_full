import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from '@fullcalendar/interaction' // needed for dayClick
import { EventClickArg } from '@fullcalendar/common'
import { useState, useEffect, FC, useCallback } from 'react'
import axios from 'axios'
import { AllOrderForOneMaster } from 'src/models'
import { useParams } from 'react-router-dom'
import Modal from './modal'
import MasterHeader from '../Master/masterHeader/masterHeader'
import Preloader from '../Preloader'

interface CalendarProps {}
const Calendar: FC<CalendarProps> = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [modalActive, setModalActive] = useState<boolean>(false)

  const [event, setEvent] = useState<EventClickArg>()

  const { masterId } = useParams<{ masterId: string }>()

  const [orders, setOrders] = useState<AllOrderForOneMaster[]>([])

  const getOrdersList = useCallback(() => {
    setIsLoading(true)
    const getAllOrders = async () => {
      const { data } = await axios.get<AllOrderForOneMaster[]>(
        `/master/master-calendar`,
        {
          params: {
            masterId: masterId,
          },
        },
      )
      setOrders(data)
      setIsLoading(false)
    }
    getAllOrders()
  }, [])

  useEffect(() => {
    getOrdersList()
  }, [getOrdersList])

  return (
    <>
      <Preloader isLoading={isLoading} />
      <MasterHeader masterId={+masterId} />
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        events={orders}
        eventClick={event => {
          setEvent(event)
          setModalActive(true)
        }}
      />
      <Modal active={modalActive} setActive={setModalActive}>
        <>
          <div>
            {`User name: ${event && event.event._def.extendedProps.userName}`}
          </div>
          <div>
            {`Clock size: ${event && event.event._def.extendedProps.name}`}
          </div>
        </>
      </Modal>
    </>
  )
}

export default Calendar
