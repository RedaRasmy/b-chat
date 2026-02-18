import type { User, Message } from "@bchat/types"

export function createUser(overrides?: Partial<User>): User {
    return {
        id: crypto.randomUUID(),
        name: "Jane Doe",
        email: "jane@example.com",
        role: "user",
        status: "online",
        avatar: null,
        lastSeen: new Date(),
        ...overrides,
    }
}

export function createMessage(overrides?: Partial<Message>): Message {
    return {
        id: crypto.randomUUID(),
        content: "Hello world",
        senderId: crypto.randomUUID(),
        channelId: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
        ...overrides,
    }
}
