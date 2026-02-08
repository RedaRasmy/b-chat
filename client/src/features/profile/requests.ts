import { api } from "@/lib/api"
import type { UpdateProfileData } from "@bchat/shared/validation"
import type { Post, Profile } from "@bchat/types"

export async function fetchProfile() {
    const res = await api.get("/profile")
    return res.data as Profile
}

export async function fetchMyPosts() {
    const res = await api.get("/profile/posts")
    return res.data as Post[]
}

export async function updateProfile(data: UpdateProfileData) {
    const res = await api.patch("/profile", data)
    return res.data as Profile
}

export async function deleteAccount() {
    return await api.delete("/profile")
}
