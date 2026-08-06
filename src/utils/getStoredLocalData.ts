export const getStoredLocalData = () => {
    const storedData = localStorage.getItem('stodlfest')
    return storedData ? JSON.parse(storedData) : {}
}
