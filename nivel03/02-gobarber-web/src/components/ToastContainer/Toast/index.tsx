import React, { useEffect } from 'react'
import { FiAlertCircle, FiXCircle, FiInfo, FiCheckCircle } from 'react-icons/fi'

import { useToast, ToastMessage } from '../../../hooks/ToastContext'

import { Container } from './styles'

interface ToastProps {
  message: ToastMessage
  style: object
}

const icons = {
  info: <FiInfo size={24} />,
  error: <FiAlertCircle size={24} />,
  success: <FiCheckCircle size={24} />,
}

const Toast: React.FC<ToastProps> = ({ message, style }) => {
  const { removeToast } = useToast()

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(message.id)
    }, 3000)

    return () => {
      clearTimeout(timer)
    }
  }, [message.id, removeToast])

  return (
    <Container
      style={style}
      type={message.type}
      hasDescription={!!message.description}
    >
      {icons[message.type || 'info']}
      <div>
        <strong>{message.title}</strong>
        {message.description && <p>Descrição da mensagem</p>}
      </div>
      <button type="submit" onClick={() => removeToast(message.id)}>
        <FiXCircle size={18} />
      </button>
    </Container>
  )
}

export default Toast
