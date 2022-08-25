
type IPaging = {
    page: number
    totalPage: number
    rowCount: number
} | null


export function normalizeResponse<T>(
    response: T,
    paging: IPaging,
    message: any = 'success',
) {
    return {
        items: response,
        message,
        paging
    }
}