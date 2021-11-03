import { useEffect, FC } from 'react'
import './change-user-form-module.css'
import axios from 'axios'
import { FormError, User } from 'src/models'
import { useHistory, useParams } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useToasts } from 'react-toast-notifications'
import validator from 'email-validator'
import AdminHeader from '../adminHeader/AdminHeader'

interface UserAdd {
  name: string
  email: string
}

interface ChangeUserFormProps {}
const ChangeUserForm: FC<ChangeUserFormProps> = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UserAdd>()

  const { id, userName, userEmail } =
    useParams<{ id: string; userName: string; userEmail: string }>()

  const history = useHistory()

  const { addToast } = useToasts()

  useEffect(() => {
    if (userEmail && userName) {
      setValue('name', userName)
      setValue('email', userEmail)
    }
  }, [])

  const onSubmitPut: SubmitHandler<UserAdd> = data => {
    axios
      .put<User[]>(`/admin/user`, {
        id: +id,
        name: data.name,
        email: data.email,
      })
      .then(() => {
        addToast('user updated', { appearance: 'success' })
        history.push('/admin/users')
      })
  }

  return (
    <>
      <AdminHeader />
      <div className="wrapper_controller-city">
        <form
          className="wrapper_controller-city__form"
          onSubmit={handleSubmit(onSubmitPut)}
        >
          <input
            placeholder="Enter user name"
            className="wrapper_controller-city__form__input"
            {...register('name', {
              required: true,
              minLength: 3,
              maxLength: 50,
              pattern: /[A-Za-zА-Яа-я]/,
            })}
          />
          {errors?.name?.type === FormError.REQUIRED && (
            <p>This field is required</p>
          )}

          {errors?.name?.type === FormError.MAXLENGTH && (
            <p>User name cannot exceed 30 characters</p>
          )}

          {errors?.name?.type === FormError.MINLENGTH && (
            <p>User name must more 3 characters</p>
          )}

          {errors?.name?.type === FormError.PATTERN && (
            <p>Alphabetical characters only</p>
          )}

          <input
            className="controller_user__input"
            placeholder="enter user email"
            {...register('email', {
              required: true,
              validate: value => validator.validate(value),
            })}
          ></input>
          {errors?.name?.type === FormError.REQUIRED && (
            <p>This field is required</p>
          )}

          {errors?.name?.type === FormError.VALIDATE && (
            <p>Email must be "email@example.com" format</p>
          )}

          <button className="wrapper_controller__city__button" type="submit">
            Submit
          </button>
        </form>
      </div>
    </>
  )
}

export default ChangeUserForm
