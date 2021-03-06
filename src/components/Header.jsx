import { Link } from 'react-router-dom'
import useProjects from '../hooks/useProjects'
import useAuth from '../hooks/useAuth'

import Search from './Search'

export default function Header() {
    const { logout } = useAuth()
    const { handleSeeker, signOut } = useProjects()

    const handleSignOut = () => {
        logout()
        signOut()
        localStorage.removeItem('token')
    }

    return (
        <header className='px-4 py-5 bg-white border-b'>
            <div className='md:flex md:justify-between'>
                <h2 className='text-4xl text-sky-600 font-black text-center mb-5 md:mb-0'>
                    <Link to='/projects'>UpTask</Link>
                </h2>

                <div className='flex flex-col md:flex-row items-center gap-4'>
                    <button
                        type='button'
                        className='font-bold uppercase'
                        onClick={handleSeeker}
                    >
                        Buscar Proyecto
                    </button>

                    <Link to='/projects' className='font-bold uppercase'>
                        Proyectos
                    </Link>

                    <button
                        type='button'
                        className='text-white text-sm bg-sky-600 p-3 rounded-md uppercase font-bold'
                        onClick={handleSignOut}
                    >
                        Cerrar sesión
                    </button>

                    <Search />
                </div>
            </div>
        </header>
    )
}
