import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import useProjects from '../hooks/useProjects'
import useAdmin from '../hooks/useAdmin'
import io from 'socket.io-client'

import Spinner from '../components/Spinner'
import TaskFormModal from '../components/TaskFormModal'
import Task from '../components/Task'
import Collaborator from '../components/Collaborator'

export default function Project() {
    const { id } = useParams()
    const {
        getProject,
        project,
        loading,
        handleTaskFormModal,
        submitProjectTasks,
        editProjectTasks,
        deleteProjectTasks,
        changeProjectTasksStatus,
    } = useProjects()
    const admin = useAdmin()

    const [socket, setSocket] = useState(null)

    useEffect(() => {
        getProject(id)

        const newSocket = io(import.meta.env.VITE_BACKEND_URL, {
            transports: ['websocket'],
        })
        newSocket.emit('join', id)
        setSocket(newSocket)
        return () => {
            newSocket.close()
        }
    }, [id])

    useEffect(() => {
        if (!socket) return

        socket.on('task-added', task => {
            if (task.project === project._id) {
                submitProjectTasks(task)
            }
        })

        socket.on('task-edited', task => {
            if (task.project._id === project._id) {
                editProjectTasks(task)
            }
        })

        socket.on('task-deleted', task => {
            const projectOfTaskId = task.project?._id || task.project
            if (projectOfTaskId === project._id) {
                deleteProjectTasks(task)
            }
        })

        socket.on('task-status-changed', task => {
            if (task.project._id === project._id) {
                changeProjectTasksStatus(task)
            }
        })

        return () => {
            socket.off('task-added')
            socket.off('task-edited')
            socket.off('task-deleted')
            socket.off('task-status-changed')
        }
    }, [socket, project])

    const { name, tasks, collaborators } = project

    if (loading) return <Spinner />

    return (
        <>
            <div className='flex justify-between'>
                <h1 className='font-black text-4xl'>{name}</h1>

                {admin && (
                    <Link
                        to={`/projects/edit/${id}`}
                        className='flex uppercase font-bold'
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
                                    d='M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z'
                                />
                            </svg>
                            Editar
                        </div>
                    </Link>
                )}
            </div>

            {admin && (
                <button
                    type='button'
                    className='flex gap-2 items-center justify-center text-sm px-5 py-3 w-full md:w-auto rounded-lg uppercase font-bold bg-sky-400 text-white text-center mt-5'
                    onClick={handleTaskFormModal}
                >
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-6 w-6'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                    >
                        <path
                            fillRule='evenodd'
                            d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z'
                            clipRule='evenodd'
                        />
                    </svg>
                    Nueva Tarea
                </button>
            )}

            <p className='font-bold text-xl mt-10'>Tareas del Proyecto</p>

            <div className='bg-white shadow mt-10 rounded-lg'>
                {tasks?.length ? (
                    tasks.map(task => <Task key={task._id} task={task} />)
                ) : (
                    <p className='text-center my-5 p-10'>
                        No hay tareas para este proyecto
                    </p>
                )}
            </div>

            {admin && (
                <>
                    <div className='flex items-center justify-between mt-10'>
                        <p className='font-bold text-xl'>Colaboradores</p>
                        <Link
                            to={`/projects/new-collaborator/${id}`}
                            className='text-gray-400 hover:text-black uppercase font-bold'
                        >
                            Añadir
                        </Link>
                    </div>

                    <div className='bg-white shadow mt-10 rounded-lg'>
                        {collaborators?.length ? (
                            collaborators.map(collaborator => (
                                <Collaborator
                                    key={collaborator._id}
                                    collaborator={collaborator}
                                />
                            ))
                        ) : (
                            <p className='text-center my-5 p-10'>
                                No hay colaboradores en este proyecto
                            </p>
                        )}
                    </div>
                </>
            )}

            <TaskFormModal />
        </>
    )
}
