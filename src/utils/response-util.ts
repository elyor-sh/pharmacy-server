
interface IPaging {
    count: number | null
}


export const getResponse = (response: any, message: any, paging: IPaging) => {
    return {
        items: response,
        message: message,
        paging: paging
    }
}