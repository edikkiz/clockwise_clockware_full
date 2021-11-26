import { format } from 'date-fns'
import { OrderForPDF } from '../models'

export const orderCheckPdf = (order: OrderForPDF) => {
    return `
  <table align="center">
      <tr>
          <th colspan="2">Clockwise Clockware</th>
      </tr>
      <tr>
          <th>Order</th>
          <td>#${order.id}</td>
      </tr>
      <tr>
          <th>Clock size</th>
          <td>${order.clockSize.name}</td>
      </tr>
      <tr>
          <th>Master</th>
          <td>${order.master.name}</td>
      </tr>
      <tr>
          <th>Master email</th>
          <td>${order.master.person.email}</td>
      </tr>
      <tr>
          <th>Order start at</th>
          <td>${format(new Date(order.startAt), 'yyyy-MM-dd HH:mm')}</td>
      </tr>
      <tr>
          <th>Order end at</th>
          <td>${format(new Date(order.endAt), 'yyyy-MM-dd HH:mm')}</td>
      </tr>
      <tr>
          <th>Price</th>
          <td>${order.price.toString()}$</td>
      </tr>
      <tr>
          <th>Client</th>
          <td>${order.user.email}</td>
      </tr>
  </table>
  <style>
  table {
    border: solid 1px;
    font-size: 15px;
    width: 510px;
  }
  
  table th {
    border: solid 1px;
    width: 170px;
    height: auto;
    text-align: center;
  }
  table td {
    border: solid 1px;
    width: 340px;
    height: auto;
    text-align: center;
    word-break: break-all;
  }
  </style>
`
}
