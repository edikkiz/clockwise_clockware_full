import axios from 'axios'
import './rate_masters_module.css'
import React, { Component, useState, useEffect, FC } from 'react'
import { AllOrder, } from '../../models/models'
import { useHistory, useParams } from 'react-router-dom'
import Preloader from '../Preloader'
import { Redirect } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
/* @ts-ignore */
import ReactStars from "react-rating-stars-component";

interface ControllerRateMasterProps { }
const RateMaster: FC<ControllerRateMasterProps> = () => {

    const history = useHistory()

    const [feedbackText, setFeedbackText] = useState<string>('')

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [rating, setRating] = useState<number>(0)

    const { feedbackToken } = useParams<{ feedbackToken: string }>()

    const [order, setOrder] = useState<AllOrder[]>([])

    const { addToast } = useToasts()

    useEffect(() => {
        const getOrder = async () => {
            const { data } = await axios.get<AllOrder[]>('/getOrderForFeedback', {
                params: {
                    feedbackToken: feedbackToken
                }
            })

            setOrder(data)
            data.length ? setOrder(data) : history.push('/')
        }
        getOrder()
    }, [])

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (order[0]) {
            setIsLoading(true)

            axios.put('/updateFeedbackOrder', {
                feedbackText: feedbackText,
                rating: rating,
                id: +order[0].id
            }).then(() => {
                addToast('thanks for the tip', { appearance: 'success' })
                const token = localStorage.getItem('accessToken')
                token ? 
                history.push(`/role/user/${order[0].userId}`)
                :
                history.push('/login')
            })
        }


    }

    const redirect = () => {

        addToast('this order has already been rated', { error: 'info' })
        return <Redirect to="/" />


    }

    return (
        feedbackToken ?
            <div className="wrapper_rate__master">
                <form className="wrapper_rate__master__form" onSubmit={onSubmit}>
                    {order[0] &&
                        <>
                            <div className="info_rate"><b>Please rate work of the master:</b>
                                <br />
                                {order[0].masterName}</div>
                            <div className="info_rate">
                                <b>Order #{order[0].id}</b>
                                <br />
                                <b> user name:</b>  {order[0].userName}
                                <br />
                                <b>user email:</b> {order[0].userEmail}
                                <br />
                                <b>clock size:</b>  {order[0].size}
                                <br />
                                <b>city:</b>  {order[0].cityName}
                                <br />
                                <b>price:</b>  {order[0].price}
                                <br />
                                <b>start work on:</b>  {order[0].startAt.split("T")[0]} {order[0].startAt.split("T")[1]}
                                <br />
                                <b>end work on:</b>  {order[0].endAt.split("T")[0]} {order[0].endAt.split("T")[1]}
                            </div>
                        </>
                    }

                    <textarea value={feedbackText} onChange={(event) => setFeedbackText(event.target.value)} className="feedback__text" placeholder="feedback on the work of the master" maxLength={255} />

                    <ReactStars
                        count={5}
                        size={60}
                        activeColor="#ffd700"
                        isHalf={true}
                        value={rating}
                        onChange={(newRating: number) => setRating(newRating)}
                    />



                    <p></p><button className="onsubmit_button" type="submit">submit</button>
                </form>
            </div>
            :
            redirect()
                
            


    )
}

export default RateMaster