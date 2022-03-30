import Swal from 'sweetalert2/dist/sweetalert2.js'
import useProjects from '../hooks/useProjects'

export default function Collaborator({ collaborator }) {
    const { name, email, _id } = collaborator

    const { deleteCollaborator } = useProjects()

    const handleClick = async () => {
        const { value: confirm } = await Swal.fire({
            title: '¿Estás seguro?',
            text: `¿Seguro que quieres eliminar al colaborador ${name}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#0285c7',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Sí, eliminar',
        })
        if (confirm) {
            await deleteCollaborator(_id)
            Swal.fire({
                title: 'Eliminado',
                text: `El colaborador ${name} ha sido eliminado`,
                icon: 'success',
                confirmButtonColor: '#0285c7',
            })
        }
    }

    return (
        <div className='border-b p-5 flex justify-between items-center'>
            <div>
                <p>{name}</p>
                <p className='text-sm text-gray-700'>{email}</p>
            </div>

            <div>
                <button
                    type='button'
                    className='bg-red-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg'
                    onClick={handleClick}
                >
                    Eliminar
                </button>
            </div>
        </div>
    )
}
