import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axiosClient from '../config/axiosClient'
import useAuth from '../hooks/useAuth'

import Alert from '../components/Alert'

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' })
    const [alert, setAlert] = useState({})

    const navigate = useNavigate()
    const { setAuth } = useAuth()
    const { email, password } = form
    const { msg } = alert

    const handleChange = e => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async e => {
        e.preventDefault()

        if (Object.values(form).includes('')) {
            setAlert({
                error: true,
                msg: 'Todos los campos son obligatorios',
            })
            return
        }

        setAlert({})

        // Login user
        try {
            const { data } = await axiosClient.post('/users/login', {
                email,
                password,
            })

            localStorage.setItem('token', data.token)
            setAuth(data)
            navigate('/projects')
        } catch (error) {
            const { data } = error.response
            setAlert({ error: true, msg: data.msg })
        }
    }

    return (
        <>
            <h1 className='text-sky-600 font-black text-6xl capitalize'>
                Inicia sesión y administra tus{' '}
                <span className='text-slate-700'>proyectos</span>
            </h1>

            {msg && <Alert alert={alert} />}

            <form
                onSubmit={handleSubmit}
                className='my-10 bg-white shadow rounded-lg p-10'
            >
                <div className='my-5'>
                    <label
                        htmlFor='email'
                        className='uppercase text-gray-600 block text-xl font-bold'
                    >
                        Email
                    </label>
                    <input
                        type='email'
                        name='email'
                        id='email'
                        placeholder='ejemplo@correo.com'
                        className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
                        value={email}
                        onChange={handleChange}
                    />
                </div>
                <div className='my-5'>
                    <label
                        htmlFor='password'
                        className='uppercase text-gray-600 block text-xl font-bold'
                    >
                        Contraseña
                    </label>
                    <input
                        type='password'
                        name='password'
                        id='password'
                        placeholder='Escribe tu contraseña'
                        className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
                        value={password}
                        onChange={handleChange}
                    />
                </div>

                <input
                    type='submit'
                    value='Iniciar sesión'
                    className='bg-sky-700 w-full py-3 mb-5 text-white uppercase font-bold rounded cursor-pointer transition-colors hover:bg-sky-800'
                />
            </form>

            <nav className='lg:flex lg:justify-between'>
                <Link
                    to='/register'
                    className='block text-center my-5 text-base'
                >
                    ¿No tienes cuenta?{' '}
                    <span className='text-sky-600'>Regístrate</span>
                </Link>
                <Link
                    to='/forgot-password'
                    className='block text-center my-5 text-base'
                >
                    Olvidé mi contraseña
                </Link>
            </nav>
        </>
    )
}
