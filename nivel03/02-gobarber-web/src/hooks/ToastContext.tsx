import React, { createContext, useContext, useCallback, useState } from 'react'
import { uuid } from 'uuidv4'

import ToastContainer from '../components/ToastContainer'

interface ToastContextData {
  addToast(message: Omit<ToastMessage, 'id'>): void
  removeToast(id: string): void
}

export interface ToastMessage {
  id: string
  type?: 'success' | 'error' | 'info'
  title: string
  description?: string
}

const ToastContext = createContext({} as ToastContextData)

const ToastProvider: React.FC = ({ children }) => {
  const [message, setMessage] = useState<ToastMessage[]>([])

  const addToast = useCallback(
    ({ type, title, description }: Omit<ToastMessage, 'id'>) => {
      const id = uuid()

      const toast = {
        id,
        type,
        title,
        description,
      }

      setMessage((oldMessages) => [...oldMessages, toast])
    },
    [],
  )
  const removeToast = useCallback((id: string) => {
    setMessage((oldMessages) =>
      oldMessages.filter((message) => message.id !== id),
    )
  }, [])

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer messages={message} />
    </ToastContext.Provider>
  )
}

function useToast(): ToastContextData {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }

  return context
}

export { ToastProvider, useToast }
