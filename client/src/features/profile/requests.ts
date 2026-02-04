import { api } from "@/lib/api"
import type { Profile, UpdateProfileData } from "@bchat/shared/validation"

export async function fetchProfile() {
    const res = await api.get("/profile")
    return res.data as Profile
}

export async function updateProfile(data: UpdateProfileData) {
    const res = await api.patch("/profile", data)
    return res.data
}
