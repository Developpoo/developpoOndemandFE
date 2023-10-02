export type UserAuth = {
    idUserAuth: number,
    idUserClient: number,
    user: string,
    challenge?: string,
    secretJWT?: string,
    challengeStart?: number,
    mustChange?: number
}