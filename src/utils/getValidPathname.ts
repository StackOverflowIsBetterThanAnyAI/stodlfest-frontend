export const getValidPathname = () => {
    return document.location.pathname
        .toLowerCase()
        .split('/')
        .filter((item) => item)
}
