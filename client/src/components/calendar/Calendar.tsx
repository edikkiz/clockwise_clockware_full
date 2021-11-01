import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from '@fullcalendar/interaction' // needed for dayClick
import { EventClickArg } from '@fullcalendar/common'
import React, { Component, useState, useEffect, FC, useCallback } from 'react'
import axios from 'axios'
import { AllOrderForOneMaster, Order } from 'models'
import { useParams } from 'react-router-dom'
import Modal from './modal'
import MasterHeader from '../Master/masterHeader/masterHeader'

interface CalendarProps {}
const Calendar: FC<CalendarProps> = () => {

  const [modalActive, setModalActive] = useState<boolean>(false)

  const [event, setEvent] = useState<EventClickArg>()

  const { masterId } = useParams<{ masterId: string }>()

  const [orders, setOrders] = useState<AllOrderForOneMaster[]>([])

  const getOrdersList = useCallback(() => {
    const getAllOrders = async () => {
      const { data } = await axios.get<AllOrderForOneMaster[]>(
        `/master/master-orders`,
        {
          params: {
            masterId: masterId,
          },
        },
      )
      setOrders(data)
    }
    getAllOrders()
  }, [])

  useEffect(() => {
    getOrdersList()
  }, [getOrdersList])

  return (
    <>
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
