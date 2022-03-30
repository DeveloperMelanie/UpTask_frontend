import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useProjects from '../hooks/useProjects'

import Alert from './Alert'

export default function ProjectForm() {
    const [form, setForm] = useState({
        name: '',
        description: '',
        deliveryDate: '',
        client: '',
    })

    const { id } = useParams()

    const { showAlert, alert, submitProject, project } = useProjects()
    const { msg } = alert

    const { name, description, deliveryDate, client } = form

    useEffect(() => {
        if (id) {
            // Editing
            setForm({
                name: project.name,
                description: project.description,
                deliveryDate: project.deliveryDate?.split('T')[0],
                client: project.client,
            })
        }
    }, [id])

    const handleChange = e => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async e => {
        e.preventDefault()

        if (Object.values(form).includes('')) {
            showAlert({
                error: true,
                msg: 'Todos los campos son obligatorios',
            })
            return
        }

        await submitProject({ id, ...form })
        setForm({ name: '', description: '', deliveryDate: '', client: '' })
    }

    return (
        <form
            onSubmit={handleSubmit}
            className='bg-white py-10 px-5 md:w-1/2 rounded-lg shadow'
        >
            {msg && <Alert alert={alert} />}
            <div className='mb-5'>
                <label
                    htmlFor='name'
                    className='text-gray-700 uppercase font-bold text-sm'
                >
                    Nombre del Proyecto
                </label>
                <input
                    name='name'
                    id='name'
                    type='text'
                    placeholder='Nombre del Proyecto'
                    className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md'
                    value={name}
                    onChange={handleChange}
                />
            </div>
            <div className='mb-5'>
                <label
                    htmlFor='description'
                    className='text-gray-700 uppercase font-bold text-sm'
                >
                    Descripción
                </label>
                <textarea
                    name='description'
                    id='description'
                    placeholder='Descripción del Proyecto'
                    className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md'
                    value={description}
                    onChange={handleChange}
                />
            </div>
            <div className='mb-5'>
                <label
                    htmlFor='date'
                    className='text-gray-700 uppercase font-bold text-sm'
                >
                    Fecha de Entrega
                </label>
                <input
                    name='deliveryDate'
                    id='date'
                    type='date'
                    className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md'
                    value={deliveryDate}
                    onChange={handleChange}
                />
            </div>
            <div className='mb-5'>
                <label
                    htmlFor='client'
                    className='text-gray-700 uppercase font-bold text-sm'
                >
                    Cliente
                </label>
                <input
                    name='client'
                    id='client'
                    type='text'
                    placeholder='Nombre del Cliente'
                    className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md'
                    value={client}
                    onChange={handleChange}
                />
            </div>

            <input
                type='submit'
                value={id ? 'Guardar cambios' : 'Crear Proyecto'}
                className='bg-sky-600 w-full p-3 uppercase font-bold text-white rounded cursor-pointer hover:bg-sky-700 transition-colors'
            />
        </form>
    )
}
