import { useState } from 'react'
import useProjects from '../hooks/useProjects'

import Alert from './Alert'

export default function CollaboratorForm() {
    const [email, setEmail] = useState('')

    const { showAlert, alert, submitCollaborator } = useProjects()

    const handleSubmit = e => {
        e.preventDefault()

        if (!email) {
            showAlert({
                error: true,
                msg: 'El correo es obligatorio',
            })
            return
        }

        submitCollaborator(email)
    }

    const { msg } = alert

    return (
        <form
            onSubmit={handleSubmit}
            className='bg-white py-10 px-5 w-full lg:w-1/2 rounded-lg shadow'
        >
            {msg && <Alert alert={alert} />}
            <div className='mb-5'>
                <label
                    htmlFor='email'
                    className='text-gray-700 uppercase font-bold text-sm'
                >
                    Email del colaborador
                </label>
                <input
                    type='email'
                    name='email'
                    id='email'
                    placeholder='Email del usuario'
                    className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
            </div>

            <input
                type='submit'
                value='Buscar colaborador'
                className='bg-sky-600 hover:bg-sky-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors rounded text-sm'
            />
        </form>
    )
}
