import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useProjects from '../hooks/useProjects'
import Swal from 'sweetalert2/dist/sweetalert2.js'

import ProjectForm from '../components/ProjectForm'
import Spinner from '../components/Spinner'

export default function EditProject() {
    const { id } = useParams()
    const { getProject, project, loading, deleteProject } = useProjects()

    useEffect(() => {
        getProject(id)
    }, [])

    const { name } = project

    const handleClick = async () => {
        const { value: confirm } = await Swal.fire({
            title: '¿Estás seguro?',
            text: `¿Seguro que quieres eliminar el proyecto «${name}»?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#0285c7',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Sí, eliminar',
        })
        if (confirm) {
            await deleteProject(id)
            Swal.fire({
                title: 'Eliminado',
                text: `El proyecto «${name}» ha sido eliminado`,
                icon: 'success',
                confirmButtonColor: '#0285c7',
            })
        }
    }

    if (loading) return <Spinner />

    return (
        <>
            <div className='flex justify-between'>
                <h1 className='font-black text-4xl'>Editar Proyecto: {name}</h1>

                <button
                    className='h-fit uppercase font-bold'
                    onClick={handleClick}
                >
                    <div className='flex items-center gap-1 text-gray-400 hover:text-black'>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='h-6 w-6'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                            />
                        </svg>
                        Eliminar
                    </div>
                </button>
            </div>

            <div className='mt-10 flex justify-center'>
                <ProjectForm />
            </div>
        </>
    )
}
