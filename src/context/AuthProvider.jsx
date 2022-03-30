import { createContext, useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axiosClient from '../config/axiosClient'

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({})
    const [loading, setLoading] = useState(true)

    const { pathname } = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        const authenticateUser = async () => {
            const token = localStorage.getItem('token')
            if (!token) {
                setLoading(false)
                return
            }

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }

            try {
                const { data } = await axiosClient('/users/profile', config)
                setAuth(data)
                if (pathname === '/') navigate('/projects')
            } catch (error) {
                setAuth({})
            } finally {
                setLoading(false)
            }
        }
        authenticateUser()
    }, [])

    const logout = () => {
        setAuth({})
    }

    return (
        <AuthContext.Provider
            value={{
                auth,
                setAuth,
                loading,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export { AuthProvider }

export default AuthContext
