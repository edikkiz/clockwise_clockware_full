import axios, { AxiosError } from 'axios'
import { useState, useEffect, FC } from 'react'
import Preloader from 'components/Preloader'
import { useToasts } from 'react-toast-notifications'
import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import validator from 'email-validator';
import { City, FormError, Master } from 'models'
import './masterRegistration_module.css'
import { useHistory } from 'react-router-dom'


const regPasswordWithOneNumb = new RegExp("[0-9]{1,}")
const regPasswordWithOneSymbolLowerCase = new RegExp("[a-zа-я]{1,}")
const regPasswordWithOneSymbolUpperCase = new RegExp("[A-ZА-Я]{1,}")
const regPasswordWithOneSymbol = new RegExp("[$.,#@&^%()*!}{/]{1,}")


interface MasterRegistrationForm {
    id?: number
    login: string;
    password: string;
    confirmPassword: string;
    city: number | null;
    name: string;
    checkbox: boolean;
}

interface MasterRegistrationProps { }
const MasterRegistration: FC<MasterRegistrationProps> = () => {
    const { register, handleSubmit, control, reset, setValue, formState: { errors } } = useForm<MasterRegistrationForm>();

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [cities, setCities] = useState<City[]>([])

    const { addToast } = useToasts()

    const history = useHistory()

    const dataForRegisterMaster = useWatch({
        control,
        name: ["login", "password", "city", "name", "checkbox"]
    })

    useEffect(() => {
        const getCities = async () => {
            const data = await axios.get<City[]>(
                `/city`,
            )
            if (data.data.length) {
                setCities(data.data)
                const { id } = data.data[0]
                setValue("city", id)
            }
        }

        getCities()
    }, [])



    const onSubmit: SubmitHandler<MasterRegistrationForm> = async (data) => {
        if (data.city != null) {
            setIsLoading(true)
            await axios.post('/master-registration', {
                name: data.name,
                cityId: +data.city,
                login: data.login,
                password: data.password,
                confirmPassword: data.confirmPassword
            }).then((res) => {
                setIsLoading(false)
                localStorage.setItem('accessToken', `${res.headers.authorization.split(' ')[1]} master`)
                addToast('Master registrated', { appearance: 'success' })
                history.push(`/role/master/${res.data.id}`)
            }).catch((err: Error | AxiosError) => {
                if (err.message === "Request failed with status code 400") {
                    addToast('Master with this email existed', { appearance: 'error' })
                }
                setIsLoading(false)

            })
        }
    }

    return (
        <div className="wrapper_form">
            <Preloader isLoading={isLoading} />
            <form onSubmit={handleSubmit(onSubmit)} className="wrapper_form__form">
                <input placeholder="login" className="wrapper_form__input" {...register("login", { required: true, validate: value => validator.validate(value) })} />
                {errors?.login?.type === FormError.REQUIRED && <p>This field is required</p>}

                {errors?.login?.type === FormError.VALIDATE && <p>Email must be "email@example.com" format</p>}

                <input placeholder="password" type="password" className="wrapper_form__input" {...register("password", {
                    required: true, validate: {
                        testOneNumb: value => regPasswordWithOneNumb.test(value),
                        testOneSymbolLowerCase: value => regPasswordWithOneSymbolLowerCase.test(value),
                        testOneSymbolUpperCase: value => regPasswordWithOneSymbolUpperCase.test(value),
                        testOneSymbol: value => regPasswordWithOneSymbol.test(value)
                    }
                })} />
                {errors?.password?.type === FormError.REQUIRED && <p>This field is required</p>}

                {errors?.password?.type === FormError.TESTONENUMB && <p>Password must 1 or more number </p>}

                {errors?.password?.type === FormError.TESTONESYMBOLLOWERCASE && <p>Password must 1 or more symbol lower case </p>}

                {errors?.password?.type === FormError.TESTONESYMBOLUPPERCASE && <p>Password must 1 or more symbol upper case </p>}

                {errors?.password?.type === FormError.TESTONESYMBOL && <p>Password must 1 or more symbol `${"[.,/\$#@&^%()*!}{}]"}` </p>}

                <input placeholder="confirm password" type="password" className="wrapper_form__input" {...register("confirmPassword", { required: true, validate: value => dataForRegisterMaster[1] === value })} />
                {errors?.confirmPassword?.type === FormError.REQUIRED && <p>This field is required</p>}

                {errors?.confirmPassword?.type === FormError.VALIDATE && <p>Those passwords didn’t match. Try again.</p>}

                <select className="wrapper_form__select" {...register("city", { required: true, })}>
                    {
                        cities.map(({ name, id }) => (
                            <option className="city" selected={(id === cities[0].id)} value={+id}>
                                {`${name}`}
                            </option>
                        ))
                    }
                </select>

                <input placeholder="name" className="wrapper_form__input" {...register("name", { required: true, minLength: 3, maxLength: 30, pattern: /[A-Za-zА-Яа-я]/ })} />
                {errors?.name?.type === FormError.REQUIRED && <p>This field is required</p>}

                {errors?.name?.type === FormError.MAXLENGTH && (
                    <p>Master name cannot exceed 30 characters</p>
                )}

                {errors?.name?.type === FormError.MINLENGTH && (
                    <p>Master name must more 3 characters</p>
                )}

                {errors?.name?.type === FormError.PATTERN && (
                    <p>Alphabetical characters only</p>
                )}

                <div className="checkboxText"><input className="checkbox" type="checkbox" {...register("checkbox", { required: true })} />Terms of Use</div>

                {
                    dataForRegisterMaster[0] && dataForRegisterMaster[1] && dataForRegisterMaster[2] && dataForRegisterMaster[3] && dataForRegisterMaster[4] ?
                        <button className="wrapper_master_registration__form__button" type="submit" >Confirm </button>
                        :
                        <button className="wrapper_master_registration__form__button-disabled" type="submit" disabled >Confirm</button>
                }

            </form>
        </div >
    )
}


export default MasterRegistration