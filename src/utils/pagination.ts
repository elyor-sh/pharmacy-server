interface Options {
    limit: number
    offset: number
    subQuery: boolean
}

interface PaginationQuery {
    page: number
    rowCount: number
    options: Options
}

export const paginationQuery = (rowsPerPage: number | null, pageNumber: number): PaginationQuery => {

    const page = +pageNumber ? +pageNumber : 1

    if (!rowsPerPage) {
        return {
            page,
            rowCount: 30,
            options: {
                limit: 10,
                offset: 0,
                subQuery: false
            }
        }
    }

    const offset = +pageNumber ? +pageNumber : ((pageNumber - 1) * rowsPerPage)

    return {
        page,
        rowCount: +rowsPerPage,
        options: {
            limit: +rowsPerPage,
            offset: offset,
            subQuery: false
        }
    }
}