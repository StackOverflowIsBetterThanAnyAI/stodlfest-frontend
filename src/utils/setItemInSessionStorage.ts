export const setItemInSessionStorage = (key: string, value: unknown) => {
    const storage = sessionStorage.getItem('stodlfest')
    const parsedTracker = storage ? JSON.parse(storage) : {}
    parsedTracker[key] = value
    sessionStorage.setItem('stodlfest', JSON.stringify(parsedTracker))
}
