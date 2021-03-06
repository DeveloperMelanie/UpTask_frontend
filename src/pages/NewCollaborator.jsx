import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useProjects from '../hooks/useProjects'

import CollaboratorForm from '../components/CollaboratorForm'
import Alert from '../components/Alert'

export default function NewCollaborator() {
    const { id } = useParams()
    const { getProject, project, collaborator, addCollaborator, loading } =
        useProjects()

    useEffect(() => {
        getProject(id)
    }, [])

    if (!loading && !project?._id) {
        return (
            <Alert
                alert={{
                    error: true,
                    msg: 'Proyecto no encontrado',
                }}
            />
        )
    }

    return (
        <>
            <h1 className='text-4xl font-black'>
                Añadir Colaborador al proyecto: {project.name}
            </h1>

            <div className='mt-10 flex justify-center'>
                <CollaboratorForm />
            </div>

            {collaborator?._id && (
                <div className='flex justify-center mt-10'>
                    <div className='bg-white py-10 px-5 w-full lg:w-1/2 rounded-lg shadow'>
                        <h2 className='text-center mb-10 text-2xl font-bold'>
                            Resultado:
                        </h2>
                        <div className='flex justify-between items-center'>
                            <p>{collaborator.name}</p>
                            <button
                                type='button'
                                className='bg-slate-500 px-5 py-2 rounded-lg uppercase text-white font-bold text-sm'
                                onClick={() =>
                                    addCollaborator(collaborator.email)
                                }
                            >
                                Agregar al Proyecto
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
