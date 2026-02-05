import { makeQueryEndpoint } from "@/utils/wrappers"
import db from "@bchat/database"
import { users } from "@bchat/database/tables"
import { QueryUsersSchema } from "@bchat/shared/validation"

export const getUsers = makeQueryEndpoint(
    QueryUsersSchema,
    async (req, res, next) => {
        const { search } = req.validatedQuery

        try {
            const data = await db.query.users.findMany({
                where: (users, { ilike }) => {
                    if (search) return ilike(users.name, search)
                },
                columns: {
                    id: true,
                    name: true,
                    avatar: true,
                    role: true,
                },
                limit: 20,
            })

            res.status(200).json(data)
        } catch (err) {
            next(err)
        }
    },
)
