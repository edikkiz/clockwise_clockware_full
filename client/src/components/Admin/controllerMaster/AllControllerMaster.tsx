import React, { Component, useEffect, useState, FC } from 'react'
import './all_controller_master_module.css'
import axios from 'axios'
import { City, FormError, Master } from '../../../models/models'
import { useHistory, useParams } from 'react-router-dom'
import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import { useToasts } from 'react-toast-notifications'
import AdminHeader from '../adminHeader/AdminHeader'

interface MasterAdd {
  city: number;
  name: string;
}

interface ControllerMasterProps { }
const AllControllerMaster: FC<ControllerMasterProps> = () => {
  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm<MasterAdd>();

  const { id: updateId, name, cityId: updateCityId } = useParams<{ id: string, name: string, cityId: string }>()

  const history = useHistory()

  const [cities, setCities] = useState<City[]>([])

  const { addToast } = useToasts()

  useEffect(() => {
    if (name && updateCityId) {
      setValue("name", name)
      setValue("city", +updateCityId)
    }
  }, [])

  useEffect(() => {
    const getCities = async () => {
      const { data } = await axios.get<City[]>(
        `/city`,
      )
      setValue("city", data[0].id)
      setCities(data)
    }

    getCities()
  }, [])

  const whatControllerUse: SubmitHandler<MasterAdd> = (data) => {
    !updateId ? onSubmitAdd(data) : onSubmitPatchMaster(data)
  }

  const onSubmitAdd: SubmitHandler<MasterAdd> = (data) => {
    axios
      .post<Master[]>(`/admin/master`, {
        name: data.name,
        cityId: +data.city,
      })
      .then(() => {
        addToast('Master created', { appearance: 'success' })
        history.push("/admin/masters")
      })
  }


  const onSubmitPatchMaster: SubmitHandler<MasterAdd> = (data) => {
    axios
      .put<Master[]>(`/admin/master`, {
          id: +updateId,
          name: data.name,
          cityId: +data.city,
      })
      .then(() => {
        addToast("master updated", { appearance: 'success' })
        history.push("/admin/masters")
      })
  }

  return (
    <>
      <AdminHeader />
    <div className="wrapper_controller-city">
      <form className="wrapper_controller-city__form" onSubmit={handleSubmit(whatControllerUse)}>
        <input placeholder="Enter master name" className="wrapper_controller-city__form__input" {...register("name", { required: true, minLength: 3, maxLength: 30, pattern: /[A-Za-zА-Яа-я]/ })} />
        {errors?.name?.type === FormError.REQUIRED && <p>This field is required</p>}

        {errors?.name?.type === FormError.MAXLENGTH && (
          <p>City name cannot exceed 30 characters</p>
        )}

        {errors?.name?.type ===FormError.MINLENGTH && (
          <p>City name must more 3 characters</p>
        )}

        {errors?.name?.type === FormError.PATTERN && (
          <p>Alphabetical characters only</p>
        )}

        <select className="controller_master__select" {...register("city")}>
          {cities.map(({ name, id }) => (
            <option selected={id === +updateCityId} className="cities" value={+id}>
              {`${name}`}
            </option>
          ))}
        </select>
        <button className="wrapper_controller__city__button" type="submit" >Submit</button>
      </form>
    </div>
    </>
  );
};

export default AllControllerMaster
