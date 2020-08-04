import React, { useCallback, useRef } from 'react'
import { FiMail, FiLock, FiUser, FiArrowLeft } from 'react-icons/fi'
import * as Yup from 'yup'
import { FormHandles } from '@unform/core'
import { Link, useHistory } from 'react-router-dom'

import api from '../../services/api'
import getValidationErros from '../../utils/getValidationsErrors'
import { useToast } from '../../hooks/ToastContext'

import LogoImg from '../../assets/logo.svg'

import { Form } from '@unform/web'
import { Container, Content, Background, AnimationContainer } from './styles'

import Input from '../../components/Input'
import Button from '../../components/Button'

interface SignUpData {
  name: string
  email: string
  password: string
}
const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null)
  const { addToast } = useToast()
  const history = useHistory()

  const handleSubmit = useCallback(
    async (data: SignUpData) => {
      try {
        formRef.current?.setErrors({})

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('E-mail inválido'),
          password: Yup.string().min(6, 'Mínimo de 6 dígitos'),
        })

        await schema.validate(data, {
          abortEarly: false,
        })

        await api.post('users', data)

        history.push('/')

        addToast({
          type: 'success',
          title: 'Cadastro realizado!',
          description: 'Você já pode fazer seu logon no GoBarber.',
        })
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErros(err)

          formRef.current?.setErrors(errors)

          return
        }

        addToast({
          type: 'error',
          title: 'Ocorreu um erro!',
          description: 'Verifique os seus dados.',
        })
      }
    },
    [addToast, history],
  )

  return (
    <Container>
      <Background />

      <Content>
        <AnimationContainer>
          <img src={LogoImg} alt="GoBarber" />

          {/* <Form onSubmit={handleSubmit}
          initialData={{ name: 'Kennedy', email: 'admin@a.com' }}> */}
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Faça seu cadastro</h1>
            <Input name="name" icon={FiUser} placeholder="Nome" />
            <Input name="email" icon={FiMail} placeholder="E-mail" />
            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Senha"
            />

            <Button type="submit">Cadastrar</Button>
          </Form>

          <Link to="/">
            <FiArrowLeft />
            Voltar para logon
          </Link>
        </AnimationContainer>
      </Content>
    </Container>
  )
}

export default SignUp
