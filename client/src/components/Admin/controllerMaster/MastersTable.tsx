import { useEffect, useState, FC, useCallback, useMemo } from 'react'
import axios from 'axios'
import './masters-table-module.css'
import { MasterForAdminTable } from 'src/models'
import Preloader from 'src/components/Preloader'
import { useToasts } from 'react-toast-notifications'
import AdminHeader from '../adminHeader/AdminHeader'
import Pagination from 'src/components/reusableСomponents/pagination/pagination'

interface MastersResult {
  total: number
  masters: MasterForAdminTable[]
}

interface ControllerMasterTableProps {}
const MastersTable: FC<ControllerMasterTableProps> = () => {
  const [masters, setMasters] = useState<MastersResult>({
    total: 0,
    masters: [],
  })

  const [offset, setOffset] = useState<number>(0)
  const [limit, setLimit] = useState<number>(15)

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { addToast } = useToasts()

  const masterLenght = useMemo(
    () => masters.masters.length,
    [masters.masters.length],
  )

  const getMastersList = useCallback(() => {
    setIsLoading(true)
    const getMasters = async () => {
      const { data } = await axios.get<MastersResult>('/admin/masters', {
        params: {
          limit,
          offset,
        },
      })
      setMasters(data)
      setIsLoading(false)
    }
    getMasters()
  }, [offset, limit])

  useEffect(() => {
    getMastersList()
  }, [getMastersList])

  const onSubmitDelete = useCallback((id: number) => {
    setIsLoading(true)
    if (window.confirm('confirm deletion of the selected order')) {
      axios
        .delete<MasterForAdminTable[]>(`/admin/master`, {
          data: {
            id: +id,
          },
        })
        .then(() => {
          const localCopy = masters
          const deleteIndex = localCopy.masters.findIndex(
            elem => elem.id === id,
          )
          localCopy.masters.splice(deleteIndex, 1)
          setMasters(localCopy)
          setIsLoading(false)
          addToast('master deleted', { appearance: 'success' })

          setIsLoading(true)
          const getMasters = async () => {
            const { data } = await axios.get<MastersResult>('/admin/masters', {
              params: {
                limit,
                offset,
              },
            })
            setMasters(data)
            setIsLoading(false)
          }
          getMasters()
        })
    }
    setIsLoading(false)
  }, [])

  return (
    <div>
      <Preloader isLoading={isLoading} />
      <AdminHeader />
      <div className="wrapper_masters">
        <table className="wrapper_masters__table">
          <tr>
            <th className="table_block_id__master">id</th>
            <th className="table_block_name__master">Name</th>
            <th className="table_block_name__master">City</th>
            <th className="link_delete__master">delete</th>
          </tr>
          {masters.masters.map(({ id, name, city }) => (
            <tr>
              <th className="table_block_id__master">{`${id}`}</th>
              <th className="table_block_name__master">{`${name}`}</th>
              <th className="table_block_name__master">{`${city.name}`}</th>

              <button
                type="button"
                onClick={() => onSubmitDelete(id)}
                className="link_update__master"
              >
                <th className="table_link">delete</th>
              </button>
            </tr>
          ))}
        </table>
      </div>
      {masterLenght === 0 && <div>Dont have more orders</div>}
      {masters.total && (
        <Pagination
          offset={offset}
          setOffset={setOffset}
          limit={limit}
          setLimit={setLimit}
          total={masters.total}
        />
      )}
    </div>
  )
}

export default MastersTable
