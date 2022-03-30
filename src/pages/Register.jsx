import { useState } from 'react'
import { Link } from 'react-router-dom'
import axiosClient from '../config/axiosClient'

import Alert from '../components/Alert'

export default function Register() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        password1: '',
    })
    const [alert, setAlert] = useState({})

    const { name, email, password, password1 } = form
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

        if (password !== password1) {
            setAlert({
                error: true,
                msg: 'Las contraseñas no coinciden',
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

        // Create user
        try {
            const { data } = await axiosClient.post('/users', {
                name,
                email,
                password,
            })

            setAlert({
                error: false,
                msg: data.msg,
            })

            setForm({ name: '', email: '', password: '', password1: '' })
        } catch (error) {
            const { data } = error.response
            setAlert({
                error: true,
                msg: data.msg,
            })
        }
    }

    return (
        <>
            <h1 className='text-sky-600 font-black text-6xl capitalize'>
                Crea tu cuenta y administra tus{' '}
                <span className='text-slate-700'>proyectos</span>
            </h1>

            {msg && <Alert alert={alert} />}

            <form
                onSubmit={handleSubmit}
                className='my-10 bg-white shadow rounded-lg p-10'
            >
                <div className='my-5'>
                    <label
                        htmlFor='name'
                        className='uppercase text-gray-600 block text-xl font-bold'
                    >
                        Nombre
                    </label>
                    <input
                        type='text'
                        name='name'
                        id='name'
                        placeholder='Ingresa tu nombre'
                        className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
                        value={name}
                        onChange={handleChange}
                    />
                </div>
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
                <div className='my-5'>
                    <label
                        htmlFor='password1'
                        className='uppercase text-gray-600 block text-xl font-bold'
                    >
                        Confirmar contraseña
                    </label>
                    <input
                        type='password'
                        name='password1'
                        id='password1'
                        placeholder='Repite tu contraseña'
                        className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
                        value={password1}
                        onChange={handleChange}
                    />
                </div>

                <input
                    type='submit'
                    value='Crear cuenta'
                    className='bg-sky-700 w-full py-3 mb-5 text-white uppercase font-bold rounded cursor-pointer transition-colors hover:bg-sky-800'
                />
            </form>

            <nav className='lg:flex lg:justify-between'>
                <Link to='/' className='block text-center my-5 text-base'>
                    ¿Ya tienes una cuenta?{' '}
                    <span className='text-sky-600'>Inicia sesión</span>
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
