import React, { Component, useEffect, useState, FC } from 'react'
import './all_controller_city_module.css'
import axios from 'axios'
import { City, FormError } from '../../../models'
import { useHistory, useParams } from 'react-router-dom'
import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import { useToasts } from 'react-toast-notifications'
import AdminHeader from '../adminHeader/AdminHeader'

interface CityAdd {
  name: string
}

interface ControllerCityProps { }
const AllControllerCity: FC<ControllerCityProps> = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<CityAdd>();

  const { id: updateId, name } = useParams<{ id: string, name: string }>()

  const history = useHistory()

  const { addToast } = useToasts()

  const whatControllerUse: SubmitHandler<CityAdd> = (data) => {
    !updateId ? addCity(data) : updateCity(data)
  }


  useEffect(() => {
    if (name) {
      setValue("name", name)
    }
  }, [])

  const addCity: SubmitHandler<CityAdd> = (data) => {
    axios
      .post<City[]>(`/admin/city`, {
        name: data.name,
      })
      .then(() => {
        addToast('city created', { appearance: 'success' })
        history.push("/admin/cities")
      })
  }

  const updateCity: SubmitHandler<CityAdd> = (data) => {
    axios
      .put<City[]>(`/admin/city`, {
        id: +updateId,
        name: data.name,
      })
      .then(() => {
        addToast('city updated', { appearance: 'success' })
        history.push("/admin/cities")

      })
  }


  return (
    <>
      <AdminHeader />
      <div className="wrapper_controller-city">
        <form className="wrapper_controller-city__form" onSubmit={handleSubmit(whatControllerUse)}>
          <input placeholder="Enter city name" className="wrapper_controller-city__form__input" {...register("name", { required: true, minLength: 3, maxLength: 50, pattern: /[A-Za-zА-Яа-я]/ })} />
          {errors?.name?.type === FormError.REQUIRED && <p>This field is required</p>}

          {errors?.name?.type === FormError.MAXLENGTH && (
            <p>City name cannot exceed 50 characters</p>
          )}

          {errors?.name?.type === FormError.MINLENGTH && (
            <p>City name must more 3 characters</p>
          )}

          {errors?.name?.type === FormError.PATTERN && (
            <p>Alphabetical characters only</p>
          )}
          <button className="wrapper_controller__city__button" type="submit" >Submit</button>
        </form>
      </div>
    </>
  );
};


export default AllControllerCity
