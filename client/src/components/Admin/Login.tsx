import React, { useState, FC } from 'react'
import './login-module.css'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import Preloader from '../Preloader'
import { useToasts } from 'react-toast-notifications'
import visible from 'src/images/visible.svg'
import { useForm } from 'react-hook-form'
import visibleOff from 'src/images/visibleOff.svg'
import { Link } from 'react-router-dom'
import { Role } from 'src/models'

interface Login {
  email: string
  password: string
}

interface LoginProps {}
const Login: FC<LoginProps> = () => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<Login>()

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const history = useHistory()

  const [email, setEmail] = useState<string>('')

  const [password, setPassword] = useState<string>('')

  const [seePass, setSeePass] = useState<boolean>(true)

  const { addToast } = useToasts()

  const onSubmit = async () => {
    setIsLoading(true)
    try {
      const payload = {
        email,
        password,
      }
      const login = await axios.post(`/login`, payload)
      if (login.data.role === Role.admin) {
        localStorage.setItem(
          'accessToken',
          login.headers.authorization.split(' ')[1],
        )
        addToast('you are logged in', { appearance: 'success' })
        history.push('/admin/orders')
      }
      if (login.data.role === Role.master) {
        localStorage.setItem(
          'accessToken',
          login.headers.authorization.split(' ')[1],
        )
        addToast(`Hello master: ${login.data.name}`, { appearance: 'success' })
        history.push(`/role/master/${login.data.id}`)
      }
      if (login.data.role === Role.user) {
        localStorage.setItem(
          'accessToken',
          login.headers.authorization.split(' ')[1],
        )
        addToast(`Hello: ${login.data.name}`, { appearance: 'success' })
        history.push(`/role/user/${login.data.id}`)
      }
    } catch (e) {
      addToast('invalid login or password', { appearance: 'error' })
      setPassword('')
      setIsLoading(false)
    }
  }

  const turn = () => {
    if (seePass === true) {
      setSeePass(false)
    } else {
      setSeePass(true)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="wrapper_login">
      <Preloader isLoading={isLoading} />
      <div className="wrapper_login__email">
        <input
          className="wrapper_login__email-input"
          placeholder="email"
          type="email"
          value={email}
          onChange={(e: React.FormEvent<HTMLInputElement>) =>
            setEmail(e.currentTarget.value)
          }
        />
      </div>
      {!seePass ? (
        <div className="wrapper_login__password">
          <input
            className="wrapper_login__password-input"
            placeholder="password"
            type="text"
            value={password}
            onChange={(e: React.FormEvent<HTMLInputElement>) =>
              setPassword(e.currentTarget.value)
            }
          />
          <button type="button" className="visible" onClick={turn}>
            <img src={visible} />
          </button>
        </div>
      ) : (
        <div className="wrapper_login__password">
          <input
            className="wrapper_login__password-input"
            placeholder="password"
            type="password"
            value={password}
            onChange={(e: React.FormEvent<HTMLInputElement>) =>
              setPassword(e.currentTarget.value)
            }
          />
          <button type="button" className="visible" onClick={turn}>
            <img src={visibleOff} />
          </button>
        </div>
      )}
      <div className="wrapper_login__singin">
        <button className="wrapper_login__singin-button" type="submit">
          Sign in
        </button>
      </div>
      <div className="wrapper_login__singin-master">
        <Link to="/master/registration" className="wrapper_login__singin-link">
          <div className="link-content">Master registration</div>
        </Link>
      </div>
    </form>
  )
}

export default Login
