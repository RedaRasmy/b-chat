import { QueryUsersSchema } from "@bchat/shared/validation"
import { userService } from "@/features/users/service"
import { makeEndpoint } from "@/utils/make-endpoint"

export const getUsers = makeEndpoint(
    {
        query: QueryUsersSchema,
    },
    async (req, res, next) => {
        const { search } = req.query
        const user = req.user!

        try {
            const users = await userService.getUsers({
                userId: user.id,
                search,
            })

            res.json(users)
        } catch (err) {
            next(err)
        }
    },
)
