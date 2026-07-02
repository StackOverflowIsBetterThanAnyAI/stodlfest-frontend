export const getStoredSessionData = () => {
    const storedData = sessionStorage.getItem('stodlfest')
    return storedData ? JSON.parse(storedData) : {}
}
