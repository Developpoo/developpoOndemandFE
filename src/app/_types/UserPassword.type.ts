export type UserPassword = {
    idUserPassword: number,
    idUserClient: number,
    password: string,
    salt?: string
}