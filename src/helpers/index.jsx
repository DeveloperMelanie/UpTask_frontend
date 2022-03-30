export const PRIORITIES = [
    { value: 'low', label: 'Baja' },
    { value: 'medium', label: 'Media' },
    { value: 'high', label: 'Alta' },
]

export const formatDate = date => {
    const newDate = new Date(date.split('T')[0].split('-'))

    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }

    return newDate.toLocaleDateString('es-ES', options)
}
