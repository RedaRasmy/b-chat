import { makeQueryEndpoint } from "@/utils/wrappers"
import db from "@bchat/database"
import { QueryUsersSchema } from "@bchat/shared/validation"

export const getUsers = makeQueryEndpoint(
    QueryUsersSchema,
    async (req, res, next) => {
        const { search } = req.validatedQuery
        const user = req.user!

        try {
            const data = await db.query.users.findMany({
                where: (users, { ilike, and, ne }) => {
                    if (search)
                        return and(
                            ne(users.id, user.id),
                            ilike(users.name, search),
                        )

                    return ne(users.id, user.id)
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
