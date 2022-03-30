import { useState } from 'react'
import { Link } from 'react-router-dom'
import axiosClient from '../config/axiosClient'

import Alert from '../components/Alert'

export default function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [alert, setAlert] = useState({})

    const handleSubmit = async e => {
        e.preventDefault()

        if (!email) {
            setAlert({
                error: true,
                msg: 'El email es obligatorio',
            })
            return
        }

        setAlert({})

        try {
            const { data } = await axiosClient.post('/users/forgot-password', {
                email,
            })

            setAlert({ error: false, msg: data.msg })
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
                Recupera tu acceso y no pierdas tus{' '}
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
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>

                <input
                    type='submit'
                    value='Enviar instrucciones'
                    className='bg-sky-700 w-full py-3 mb-5 text-white uppercase font-bold rounded cursor-pointer transition-colors hover:bg-sky-800'
                />
            </form>

            <nav className='lg:flex lg:justify-between'>
                <Link to='/' className='block text-center my-5 text-base'>
                    ¿Ya tienes una cuenta?{' '}
                    <span className='text-sky-600'>Inicia sesión</span>
                </Link>
                <Link
                    to='/register'
                    className='block text-center my-5 text-base'
                >
                    ¿No tienes cuenta?{' '}
                    <span className='text-sky-600'>Regístrate</span>
                </Link>
            </nav>
        </>
    )
}
