import { UserAuth } from "./UserAuth.type"
import { UserClient } from "./UserClient.type"
import { UserPassword } from "./UserPassword.type"

export type UserClientAuthPassword = {
    idUserClient: UserClient | undefined,
    idUserAuth: UserAuth | undefined,
    idUserPassword: UserPassword | undefined,
    nome: string,
    cognome: string,
    sesso: number,
    codiceFiscale: string,
    user: string,
    password: string
}
