export const setItemInLocalStorage = (key: string, value: unknown) => {
    const storage = localStorage.getItem('stodlfest')
    const parsedTracker = storage ? JSON.parse(storage) : {}
    parsedTracker[key] = value
    localStorage.setItem('stodlfest', JSON.stringify(parsedTracker))
}
