import React, { FC, ReactElement } from 'react'
import './modal.css'

interface ModalProps {
  active: boolean
  setActive: React.Dispatch<React.SetStateAction<boolean>>
  children: ReactElement<any, any>
}
const Modal: FC<ModalProps> = ({ active, setActive, children }) => {
  return (
    <div
      className={active ? 'modal active' : 'modal'}
      onClick={() => setActive(false)}
    >
      <div
        className={active ? 'modal__content active' : 'modal__content'}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

export default Modal
