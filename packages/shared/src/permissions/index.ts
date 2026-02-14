import type { User } from "@bchat/types"

export const PERMISSIONS = [
    "post:delete:any",
    "comment:delete:any",
    "message:delete:any",
] as const

export type Permission = (typeof PERMISSIONS)[number]

export const rolePermissions: Record<User["role"], Permission[]> = {
    user: [],
    admin: [...PERMISSIONS],
}

export const hasPermission = (
    role: User["role"],
    permission: Permission,
): boolean => {
    const userPermissions = rolePermissions[role]
    return userPermissions.includes(permission)
}

export * from "./groups"
