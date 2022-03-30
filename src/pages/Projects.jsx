import useProjects from '../hooks/useProjects'

import ProjectPreview from '../components/ProjectPreview'
import Spinner from '../components/Spinner'
import Alert from '../components/Alert'

export default function Projects() {
    const { projects, loading, alert } = useProjects()

    const { msg } = alert

    if (loading) return <Spinner />

    return (
        <>
            <h1 className='text-4xl font-black'>Proyectos</h1>

            {msg && <Alert alert={alert} />}

            <div className='bg-white shadow mt-10 rounded-lg'>
                {projects.length ? (
                    projects.map(project => (
                        <ProjectPreview key={project._id} project={project} />
                    ))
                ) : (
                    <p className='text-center text-gray-600 uppercase p-5'>
                        No hay proyectos
                    </p>
                )}
            </div>
        </>
    )
}
