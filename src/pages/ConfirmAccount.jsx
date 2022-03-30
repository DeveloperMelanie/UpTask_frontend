import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axiosClient from '../config/axiosClient'

import Alert from '../components/Alert'

export default function ConfirmAccount() {
    const { id } = useParams()

    const [alert, setAlert] = useState({})
    const [confirmedAccount, setConfirmedAccount] = useState(false)

    useEffect(() => {
        const confirmAccount = async () => {
            try {
                const { data } = await axiosClient(`/users/confirm/${id}`)

                setAlert({ error: false, msg: data.msg })
                setConfirmedAccount(true)
            } catch (error) {
                const { data } = error.response
                setAlert({ error: true, msg: data.msg })
            }
        }
        confirmAccount()
    }, [])

    const { msg } = alert

    return (
        <>
            <h1 className='text-sky-600 font-black text-6xl capitalize'>
                Confirma tu cuenta y comienza a crear{' '}
                <span className='text-slate-700'>proyectos</span>
            </h1>

            <div className='mt-20 md:mt-10 shadow-lg px-5 py-10 rounded-xl bg-white'>
                {msg && <Alert alert={alert} />}

                {confirmedAccount && (
                    <Link to='/' className='block text-center my-5 text-base'>
                        <span className='text-sky-600'>Inicia sesión</span>
                    </Link>
                )}
            </div>
        </>
    )
}
