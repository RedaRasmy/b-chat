import { postService } from "@/features/posts/service"
import { profileService } from "@/features/profile/service"
import { makeEndpoint } from "@/utils/make-endpoint"
import { UpdateProfileSchema } from "@bchat/shared/validation"

export const getProfile = makeEndpoint(async (req, res, next) => {
    const user = req.user!

    try {
        const profile = await profileService.getProfile(user.id)
        res.json(profile)
    } catch (err) {
        next(err)
    }
})

export const getMyPosts = makeEndpoint(async (req, res, next) => {
    const user = req.user!

    try {
        const posts = await postService.getUserPosts(user.id)

        res.json(posts)
    } catch (err) {
        next(err)
    }
})

export const updateProfile = makeEndpoint(
    {
        body: UpdateProfileSchema,
    },
    async (req, res, next) => {
        const user = req.user!
        const { name } = req.body

        try {
            const profile = await profileService.updateProfile(user.id, name)

            res.json(profile)
        } catch (err) {
            next(err)
        }
    },
)

export const deleteProfile = makeEndpoint(async (req, res, next) => {
    try {
        await profileService.deleteProfile(req.user!.id)
        res.sendStatus(204)
    } catch (err) {
        next(err)
    }
})
