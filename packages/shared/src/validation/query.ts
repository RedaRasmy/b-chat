import z from "zod"

export function getSortSchema(sortableFields: string[]) {
    return z
        .string()
        .regex(/^[^:]+:(asc|desc)$/, {
            message:
                "Sort parameter must be in 'field:direction' format (e.g., 'name:asc')",
        })
        .refine(
            (val) => {
                const [field] = val.split(":")
                return sortableFields.includes(field)
            },
            {
                message: `Invalid sortable field, allowed fields are : ${sortableFields.join(", ")}`,
            },
        )
}

export const SearchSchema = z
    .string()
    .min(1, "Search must not be empty")
    .max(50, "Search length must not exceed 50 character")
    .optional()

export const PaginationSchema = z.object({
    page: z.coerce.number().int().min(1, "Page must be at least 1").default(1),
    perPage: z.coerce
        .number()
        .int()
        .min(1, "Per page must be at least 1")
        .max(100, "Per page must be at most 100")
        .default(20),
})
