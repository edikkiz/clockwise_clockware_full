import { FC } from 'react'
import AdminHeader from '../../adminHeader/AdminHeader'
import DiagramOfCities from './charts/diagramOfCities/DiagramOfCities'
import DiagramOfMasters from './charts/diagramOfMaster/DiagramOfMasters'
import GraphOfCities from './charts/graphOfCities/GraphOfCities'
import GraphOfMasters from './charts/graphOfMaster/GraphOfMasters'
import MasterTableCharts from './charts/tableMaster/TableMaster'

interface OrderChartsProps {}
const OrderCharts: FC<OrderChartsProps> = () => {
  return (
    <div>
      <AdminHeader />
      <DiagramOfCities />
      <DiagramOfMasters />
      <GraphOfCities />
      <GraphOfMasters />
      <MasterTableCharts />
    </div>
  )
}

export default OrderCharts
