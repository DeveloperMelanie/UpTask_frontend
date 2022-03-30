import { formatDate, PRIORITIES } from '../helpers'
import useProjects from '../hooks/useProjects'
import useAdmin from '../hooks/useAdmin'
import Swal from 'sweetalert2/dist/sweetalert2.js'

export default function Task({ task }) {
    const { handleEditTaskModal, deleteTask, changeTaskStatus } = useProjects()
    const { name, description, priority, deliveryDate, status, _id } = task
    const admin = useAdmin()

    const handleClick = async () => {
        const { value: confirm } = await Swal.fire({
            title: '¿Estás seguro?',
            text: `¿Seguro que quieres eliminar la tarea «${name}»?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#0285c7',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Sí, eliminar',
        })
        if (confirm) {
            deleteTask(task)
        }
    }

    return (
        <div className='border-b p-5 flex justify-between items-center'>
            <div className='flex flex-col items-start'>
                <p className='mb-1 text-xl'>{name}</p>
                <p className='mb-1 text-sm text-gray-500 uppercase'>
                    {description}
                </p>
                <p className='mb-1 text-gray-600'>
                    Prioridad:{' '}
                    {PRIORITIES.find(({ value }) => value === priority).label}
                </p>
                <p className='mb-1 text-base'>
                    Fecha de entrega: {formatDate(deliveryDate)}
                </p>
                {status && (
                    <p className='text-sm bg-green-600 uppercase p-1 rounded-lg text-white'>
                        Completada por: {task.completedBy.name}
                    </p>
                )}
            </div>

            <div className='flex flex-col lg:flex-row gap-2'>
                {admin && (
                    <button
                        type='button'
                        className='bg-indigo-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg'
                        onClick={() => handleEditTaskModal(task)}
                    >
                        Editar
                    </button>
                )}
                <button
                    type='button'
                    className={`${
                        status ? 'bg-sky-600' : 'bg-gray-600'
                    } px-4 py-3 text-white uppercase font-bold text-sm rounded-lg`}
                    onClick={() => changeTaskStatus(_id)}
                >
                    {status ? 'Completa' : 'Incompleta'}
                </button>
                {admin && (
                    <button
                        type='button'
                        className='bg-red-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg'
                        onClick={handleClick}
                    >
                        Eliminar
                    </button>
                )}
            </div>
        </div>
    )
}
