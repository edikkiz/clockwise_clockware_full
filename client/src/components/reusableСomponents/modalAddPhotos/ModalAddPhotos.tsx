import axios from 'axios'
import React, { FC, ReactElement, useEffect, useState } from 'react'
import FileInput from '../fileInput/FileInput'
import './modal-add-photos.module.css'
import { useToasts } from 'react-toast-notifications'
import Preloader from 'src/components/Preloader'

interface ModalAddPhotosProps {
  active: boolean
  setActive: React.Dispatch<React.SetStateAction<boolean>>
  orderId: number
}
const ModalAddPhotos: FC<ModalAddPhotosProps> = ({
  active,
  setActive,
  orderId,
}) => {
  const [files, setFiles] = useState<string[]>([])

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { addToast } = useToasts()
  useEffect(() => {
    if (active === false) {
      setFiles([])
    } else {
      return
    }
  }, [active])

  const addPhotos = async () => {
    setIsLoading(true)
    await axios
      .put('/user/add-photos', {
        orderId: orderId,
        images: files,
      })
      .then(() => {
        addToast('photos added', { appearance: 'success' })
        setActive(false)
        setIsLoading(false)
      })
  }

  return (
    <div
      className={active ? 'modal active' : 'modal'}
      onClick={() => setActive(false)}
    >
      <Preloader isLoading={isLoading} />
      <div
        className={active ? 'modal__content active' : 'modal__content'}
        onClick={e => e.stopPropagation()}
      >
        {active === true ? (
          <div>
            <FileInput files={files} setFiles={setFiles} />
            <button className="wrapper_form__button" onClick={addPhotos}>
              Add photos
            </button>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  )
}

export default ModalAddPhotos
