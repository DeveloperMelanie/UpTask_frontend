import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axiosClient from '../config/axiosClient'

import Alert from '../components/Alert'

export default function NewPassword() {
    const { token } = useParams()

    const [validToken, setValidToken] = useState(false)
    const [alert, setAlert] = useState({})
    const [password, setPassword] = useState('')
    const [passwordModified, setPasswordModified] = useState(false)

    useEffect(() => {
        const checkToken = async () => {
            try {
                await axiosClient(`/users/forgot-password/${token}`)
                setValidToken(true)
            } catch (error) {
                const { data } = error.response
                setAlert({ error: true, msg: data.msg })
            }
        }
        checkToken()
    }, [])

    const handleSubmit = async e => {
        e.preventDefault()

        if (!password) {
            setAlert({
                error: true,
                msg: 'La contraseña es obligatoria',
            })
            return
        }

        if (password.length < 6) {
            setAlert({
                error: true,
                msg: 'La contraseña debe tener al menos 6 caracteres',
            })
            return
        }

        setAlert({})

        try {
            const { data } = await axiosClient.post(
                `/users/forgot-password/${token}`,
                {
                    password,
                }
            )

            setAlert({ error: false, msg: data.msg })
            setPasswordModified(true)
        } catch (error) {
            const { data } = error.response
            setAlert({
                error: true,
                msg: data.msg,
            })
        }
    }

    const { msg } = alert

    return (
        <>
            <h1 className='text-sky-600 font-black text-6xl capitalize'>
                Restablece tu contraseña y no pierdas acceso a tus{' '}
                <span className='text-slate-700'>proyectos</span>
            </h1>

            {msg && <Alert alert={alert} />}

            {validToken && (
                <form
                    onSubmit={handleSubmit}
                    className='my-10 bg-white shadow rounded-lg p-10'
                >
                    <div className='my-5'>
                        <label
                            htmlFor='password'
                            className='uppercase text-gray-600 block text-xl font-bold'
                        >
                            Nueva contraseña
                        </label>
                        <input
                            type='password'
                            name='password'
                            id='password'
                            placeholder='Escribe tu nueva contraseña'
                            className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>

                    <input
                        type='submit'
                        value='Restablecer contraseña'
                        className='bg-sky-700 w-full py-3 mb-5 text-white uppercase font-bold rounded cursor-pointer transition-colors hover:bg-sky-800'
                    />
                </form>
            )}

            {passwordModified && (
                <Link to='/' className='block text-center my-5 text-base'>
                    <span className='text-sky-600'>Inicia sesión</span>
                </Link>
            )}
        </>
    )
}
