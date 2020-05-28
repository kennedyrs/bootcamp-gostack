import React, {
  createContext,
  useCallback,
  useState,
  useContext,
  useEffect,
} from 'react'
import AsyncStorage from '@react-native-community/async-storage'
import api from '../services/api'

interface SignInCredentials {
  email: string
  password: string
}

interface AuthContextData {
  user: object
  signIn(credentials: SignInCredentials): Promise<void>
  signOut(): void
  loading: boolean
}

interface AuthState {
  token: string
  user: object
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>({} as AuthState)
  const [loading, setLoadind] = useState(true)

  useEffect(() => {
    async function loadStorageData(): Promise<void> {
      const [user, token] = await AsyncStorage.multiGet([
        '@GoBarber:user',
        '@GoBarber:token',
      ])

      if (token[1] && user[1]) {
        setData({ user: JSON.parse(user[1]), token: token[1] })
      }

      setLoadind(false)
    }

    loadStorageData()
  }, [])

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', {
      email,
      password,
    })

    const { token, user } = response.data

    await AsyncStorage.multiSet([
      ['@GoBarber:user', JSON.stringify(user)],
      ['@GoBarber:token', token],
    ])

    setData(response.data)
  }, [])

  const signOut = useCallback(async () => {
    await AsyncStorage.multiRemove(['@GoBarber:token', '@GoBarber:user'])

    setData({} as AuthState)
  }, [])

  return (
    <AuthContext.Provider value={{ user: data.user, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

function useAuth(): AuthContextData {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.')
  }

  return context
}

export { AuthProvider, useAuth }
