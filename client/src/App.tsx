import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import './App.css'
import CitiesTable from './components/Admin/controllerCity/CitiesTable'
import Header from './components/Header/Header'

import AllControllerCity from './components/Admin/controllerCity/AllControllerCity'
import AllControllerMaster from './components/Admin/controllerMaster/AllControllerMaster'
import AllControllerOrder from './components/Admin/controllerOrder/AllControllerOrder'
import AllControllerUser from './components/Admin/controllerUser/AllControllerUser'
import Form from './components/Form/Form'
import Login from './components/Admin/Login'
import PrivateRoute from './PrivateRoute'
import MastersTable from './components/Admin/controllerMaster/MastersTable'
import OrderTable from './components/Admin/controllerOrder/OrderTable'
import UsersTable from './components/Admin/controllerUser/UsersTable'
import RateMaster from './components/rateMasters/RateMasters'


import { ToastProvider } from 'react-toast-notifications';
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

          <PrivateRoute path="/role/master/:id?" component={MasterWorkList} />

          <Route path="/master/registration" > <Header /> <MasterRegistration /> </Route>

          <Route path="/" exact> <Header /> <Form /> </Route>

          <Route path="/calendar/:masterId?" exact>  <Calendar /> </Route>

          <Route path="/rate/:feedbackToken"> <Header /> <RateMaster /> </Route>

          <PrivateRoute path="/admin/navCity/:id?/:name?" component={AllControllerCity} />

          <PrivateRoute
            path="/admin/navMaster/:id?/:cityId?/:name?"
            component={AllControllerMaster}
          />

          <PrivateRoute path='/admin/users' component={UsersTable} />

          <PrivateRoute path="/admin/orders" component={OrderTable} />

          <PrivateRoute path="/admin/orderCharts" component={OrderCharts} />

          <PrivateRoute path="/admin/navOrder/:id?/:userId?/:masterId?/:cityId?/:clockSizeId?/:startAt?/:price?/:status?" component={AllControllerOrder} />

          <PrivateRoute path="/admin/navUser/:id?/:userName?/:userEmail?" component={AllControllerUser} />

          <PrivateRoute path="/admin/masters" component={MastersTable} />

          <PrivateRoute path="/admin/cities" component={CitiesTable} />

          <Route path="/login"> <Header /> <Login /></Route>
        </Switch>
      </Router>
    </ToastProvider>
  )
}

export default App
