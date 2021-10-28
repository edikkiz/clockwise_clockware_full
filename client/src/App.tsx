import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import './App.css'
import CitiesTable from './components/Admin/controllerCity/CitiesTable'
import Header from './components/Header/Header'

import FormForChangeOrCreateCity from './components/Admin/controllerCity/FormForChangeOrCreateCity'
import ChangeOrderForm from './components/Admin/controllerOrder/ChangeOrderForm'
import ChangeUserForm from './components/Admin/controllerUser/ChangeUserForm'
import Form from './components/Form/Form'
import Login from './components/Admin/Login'
import PrivateRoute from './PrivateRoute'
import MastersTable from './components/Admin/controllerMaster/MastersTable'
import OrderTable from './components/Admin/controllerOrder/OrderTable'
import UsersTable from './components/Admin/controllerUser/UsersTable'
import RateMaster from './components/rateMasters/RateMasters'

import { ToastProvider } from 'react-toast-notifications'
import MasterRegistration from './components/Master/masterRegistration/masterRegistration'
import MasterWorkList from './components/Master/masterWorkList/masterWorkList'
import Calendar from './components/calendar/Calendar'
import UserList from './components/User/userList/UserList'
import OrderCharts from './components/Admin/controllerOrder/orderCharts/OrderCharts'

function App() {
  return (
    <ToastProvider placement="top-right">
      <Router>
        <Switch>
          <PrivateRoute path="/role/user/:id?" component={UserList} />

          <PrivateRoute path="/role/master/:masterId?" component={MasterWorkList} />

          <Route path="/master/registration">
            <Header /> <MasterRegistration />
          </Route>

          <Route path="/" exact>
            <Header /> <Form />
          </Route>

          <PrivateRoute path="/admin/charts" component={OrderCharts} />

          <Route path="/calendar/:masterId?" exact>
            <Calendar />
          </Route>

          <Route path="/rate/:feedbackToken">
            <Header /> <RateMaster />
          </Route>

          <PrivateRoute
            path="/admin/change-city/:id?/:name?"
            component={FormForChangeOrCreateCity}
          />

          <PrivateRoute path="/admin/users" component={UsersTable} />

          <PrivateRoute path="/admin/orders" component={OrderTable} />

          <PrivateRoute
            path="/admin/change-order/:id?/:userId?/:masterId?/:cityId?/:clockSizeId?/:startAt?/:price?/:status?"
            component={ChangeOrderForm}
          />

          <PrivateRoute
            path="/admin/change-user/:id?/:userName?/:userEmail?"
            component={ChangeUserForm}
          />

          <PrivateRoute path="/admin/masters" component={MastersTable} />

          <PrivateRoute path="/admin/cities" component={CitiesTable} />

          <Route path="/login">
            <Header /> <Login />
          </Route>
        </Switch>
      </Router>
    </ToastProvider>
  )
}

export default App
