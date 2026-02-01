import crypto from "crypto"

export const generateToken = () => {
    return crypto.randomBytes(64).toString("hex")
}
