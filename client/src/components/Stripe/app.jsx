import axios from 'axios'
import React, { useState, useEffect} from 'react'

const Stripe = () => {
  const [message, setMessage] = useState('')

  const Message = ({ message }) => (
    <section>
      <p>{message}</p>
    </section>
  )
  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search)

    if (query.get('success')) {
      setMessage('Order placed! You will receive an email confirmation.')
    }

    if (query.get('canceled')) {
      setMessage(
        "Order canceled -- continue to shop around and checkout when you're ready.",
      )
    }
  }, [])

  const test = async (e) => {
    e.preventDefault()
    const {data} = await axios.post("/create-checkout-session")
    
  }

  return message ? (
    <Message message={message} />
  ) : (
    <section>
      <div className="product">
        <img
          src="https://i.imgur.com/EHyR2nP.png"
          alt="The cover of Stubborn Attachments"
        />
        <div className="description">
          <h3>Stubborn Attachments</h3>
          <h5>$20.00</h5>
        </div>
      </div>
        <button onClick={test}>Checkout</button>
    </section>
  )
}

export default Stripe
