export function getPaginatedData<T>({
    total,
    data,
    page,
    perPage,
}: {
    total: number
    data: T[]
    page: number
    perPage: number
}) {
    const totalPages = Math.ceil(total / perPage)
    const prevPage = page === 1 ? null : page - 1
    const nextPage = page === totalPages || totalPages === 0 ? null : page + 1

    return {
        data,
        page,
        perPage,
        total,
        totalPages,
        nextPage,
        prevPage,
    }
}
