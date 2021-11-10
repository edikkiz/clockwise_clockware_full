import axios from 'axios'
import { FC, useEffect } from 'react'
import { useParams } from 'react-router'

interface CheckoutProps {}
const Checkout: FC<CheckoutProps> = () => {
  const { success } = useParams<{ success: string }>()

  useEffect(() => {
    if (success === 'true') {
      const order = async () => {
        await axios.post('/')
      }
    }
  }, [])
  return success === 'true' ? (
    <div>
      <div>success</div>
    </div>
  ) : (
    <div></div>
  )
}

export default Checkout
