import { createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosClient from '../config/axiosClient'
import useAuth from '../hooks/useAuth'
import io from 'socket.io-client'

let socket

const ProjectsContext = createContext()

const ProjectsProvider = ({ children }) => {
    const [projects, setProjects] = useState([])
    const [project, setProject] = useState({})
    const [alert, setAlert] = useState({})
    const [loading, setLoading] = useState(false)
    const [taskFormModal, setTaskFormModal] = useState(false)
    const [task, setTask] = useState({})
    const [collaborator, setCollaborator] = useState({})
    const [seeker, setSeeker] = useState(false)

    const navigate = useNavigate()
    const { auth } = useAuth()

    useEffect(() => {
        if (!auth._id) return

        const getProjects = async () => {
            setLoading(true)
            try {
                const token = localStorage.getItem('token')
                if (!token) return

                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }

                const { data } = await axiosClient('/projects', config)
                setProjects(data)
            } catch (error) {
                setAlert({
                    error: true,
                    msg: 'Error al obtener los proyectos',
                })
            } finally {
                setLoading(false)
            }
        }
        getProjects()
    }, [auth])

    useEffect(() => {
        socket = io(import.meta.env.VITE_BACKEND_URL)
    }, [])

    const showAlert = alert => {
        setAlert(alert)

        setTimeout(() => {
            setAlert({})
        }, 3000)
    }

    const submitProject = async project => {
        if (project.id) {
            await editProject(project)
        } else {
            await createProject(project)
        }
    }

    const editProject = async project => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }

            const { data } = await axiosClient.put(
                `/projects/${project.id}`,
                project,
                config
            )

            const updatedProjects = projects.map(p =>
                p._id === data._id ? data : p
            )
            setProjects(updatedProjects)

            showAlert({
                error: false,
                msg: 'Proyecto actualizado correctamente',
            })

            setTimeout(() => {
                setAlert({})
                navigate('/projects')
            }, 1500)
        } catch (error) {
            const { data } = error.response
            showAlert({ error: true, msg: data.msg })
        }
    }

    const createProject = async project => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }

            const { data } = await axiosClient.post(
                '/projects',
                project,
                config
            )
            setProjects([data, ...projects])

            showAlert({
                error: false,
                msg: 'Proyecto creado correctamente',
            })

            setTimeout(() => {
                setAlert({})
                navigate('/projects')
            }, 1500)
        } catch (error) {
            const { data } = error.response
            showAlert({ error: true, msg: data.msg })
        }
    }

    const getProject = async id => {
        setLoading(true)
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }

            const { data } = await axiosClient(`/projects/${id}`, config)
            setProject(data)
        } catch (error) {
            navigate('/projects')
            const { data } = error.response
            showAlert({ error: true, msg: data.msg })
        } finally {
            setLoading(false)
        }
    }

    const deleteProject = async id => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }

            await axiosClient.delete(`/projects/${id}`, config)

            const updatedProjects = projects.filter(p => p._id !== id)
            setProjects(updatedProjects)

            setTimeout(() => {
                setAlert({})
                navigate('/projects')
            }, 1500)
        } catch (error) {
            const { data } = error.response
            showAlert({ error: true, msg: data.msg })
        }
    }

    const handleTaskFormModal = () => {
        setTaskFormModal(!taskFormModal)
        setTimeout(() => {
            setTask({})
        }, 200)
    }

    const submitTask = async task => {
        if (task.id) {
            await editTask(task)
        } else {
            await createTask(task)
        }
    }

    const editTask = async task => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }

            const { data } = await axiosClient.put(
                `/tasks/${task.id}`,
                { ...task, project: project._id },
                config
            )

            setAlert({})
            handleTaskFormModal()

            // Socket.io
            socket.emit('edit-task', data)
        } catch (error) {
            const { data } = error.response
            showAlert({ error: true, msg: data.msg })
        }
    }

    const createTask = async task => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }

            const { data } = await axiosClient.post(
                '/tasks',
                { ...task, project: project._id },
                config
            )

            setAlert({})
            handleTaskFormModal()

            // Socket.io
            socket.emit('new-task', data)
        } catch (error) {
            const { data } = error.response
            showAlert({ error: true, msg: data.msg })
        }
    }

    const handleEditTaskModal = task => {
        setTask(task)
        setTaskFormModal(true)
    }

    const deleteTask = async task => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }

            await axiosClient.delete(`/tasks/${task._id}`, config)

            setAlert({})

            // Socket.io
            socket.emit('delete-task', task)
        } catch (error) {
            const { data } = error.response
            showAlert({ error: true, msg: data.msg })
        }
    }

    const submitCollaborator = async email => {
        setLoading(true)
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }

            const { data } = await axiosClient.post(
                '/projects/collaborators',
                { email },
                config
            )

            setCollaborator(data)
            setAlert({})
        } catch (error) {
            const { data } = error.response
            showAlert({ error: true, msg: data.msg })
        } finally {
            setLoading(false)
        }
    }

    const addCollaborator = async email => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }

            const { data } = await axiosClient.post(
                `/projects/collaborators/${project._id}`,
                { email },
                config
            )

            setAlert({
                error: false,
                msg: data.msg,
            })

            setCollaborator({})
            setTimeout(() => {
                setAlert({})
                navigate(`/projects/${project._id}`)
            }, 1500)
        } catch (error) {
            const { data } = error.response
            showAlert({ error: true, msg: data.msg })
        }
    }

    const deleteCollaborator = async id => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }

            await axiosClient.post(
                `/projects/eliminate-collaborator/${project._id}`,
                { id },
                config
            )

            const updatedCollaborators = project.collaborators.filter(
                c => c._id !== id
            )

            setProject({ ...project, collaborators: updatedCollaborators })

            setAlert({})
        } catch (error) {
            const { data } = error.response
            showAlert({ error: true, msg: data.msg })
        }
    }

    const changeTaskStatus = async id => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }

            const { data } = await axiosClient.post(
                `/tasks/status/${id}`,
                {},
                config
            )

            setAlert({})

            // Socket.io
            socket.emit('change-task-status', data)
        } catch (error) {
            const { data } = error.response
            showAlert({ error: true, msg: data.msg })
        }
    }

    const handleSeeker = () => {
        setSeeker(!seeker)
    }

    // Socket.io
    const submitProjectTasks = task => {
        const updatedTasks = [task, ...project.tasks]

        setProject({ ...project, tasks: updatedTasks })
    }

    const editProjectTasks = task => {
        const updatedTasks = project.tasks.map(t =>
            t._id === task._id ? task : t
        )

        setProject({ ...project, tasks: updatedTasks })
    }

    const deleteProjectTasks = task => {
        const updatedTasks = project.tasks.filter(t => t._id !== task._id)

        setProject({ ...project, tasks: updatedTasks })
    }

    const changeProjectTasksStatus = task => {
        const updatedTasks = project.tasks.map(t =>
            t._id === task._id ? task : t
        )

        setProject({ ...project, tasks: updatedTasks })
    }

    const signOut = () => {
        setProjects([])
        setProject({})
        setAlert({})
    }

    return (
        <ProjectsContext.Provider
            value={{
                projects,
                showAlert,
                alert,
                submitProject,
                getProject,
                project,
                loading,
                deleteProject,
                taskFormModal,
                handleTaskFormModal,
                submitTask,
                handleEditTaskModal,
                task,
                deleteTask,
                submitCollaborator,
                collaborator,
                addCollaborator,
                deleteCollaborator,
                changeTaskStatus,
                seeker,
                handleSeeker,
                submitProjectTasks,
                deleteProjectTasks,
                editProjectTasks,
                changeProjectTasksStatus,
                signOut,
            }}
        >
            {children}
        </ProjectsContext.Provider>
    )
}

export { ProjectsProvider }

export default ProjectsContext
