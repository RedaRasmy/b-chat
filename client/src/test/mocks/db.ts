import type { Message, User } from "@bchat/types"
import { createUser } from "./factories"

export const db = {
    users: [createUser({ name: "reda", email: "reda@gmail.com" })] as User[],
    messages: [] as Message[],

    findUser: (id: string) => db.users.find((u) => u.id === id),
    addUser: (user: User) => {
        db.users.push(user)
        return user
    },
    reset: () => {
        db.users = [createUser({ name: "reda", email: "reda@gmail.com" })]
        db.messages = []
    },
}
