export const isServer = (): boolean => typeof window === 'undefined' // window is undefined when running on server, defined when accessed by client from browser
