import type { User } from "@bchat/types"

export const PERMISSIONS = [
    "post:delete:any",
    "post:delete:own",
    "comment:delete:any",
    "comment:delete:own",
] as const

export type Permission = (typeof PERMISSIONS)[number]

export const rolePermissions: Record<User["role"], Permission[]> = {
    user: ["post:delete:own", "comment:delete:own"],
    admin: [...PERMISSIONS],
}

export const hasPermission = (
    role: User["role"],
    permission: Permission,
): boolean => {
    const userPermissions = rolePermissions[role]
    return userPermissions.includes(permission)
}
