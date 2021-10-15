// sleep function for testing slow requests
export const sleep = (ms: number): Promise<unknown> =>
  new Promise((res) => setTimeout(res, ms))
