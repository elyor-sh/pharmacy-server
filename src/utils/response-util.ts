
type IPaging = {
    page: number
    totalPage: number
    rowCount: number
} | null

export interface NormalizeResponse<T> {
    items: T
    message: any
    paging: IPaging
}


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