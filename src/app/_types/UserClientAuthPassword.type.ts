import { UserAuth } from "./UserAuth.type"
import { UserClient } from "./UserClient.type"
import { UserPassword } from "./UserPassword.type"

export type UserClientAuthPassword = {
    authData: UserAuth[]; // Assicurati che 'authData' abbia lo stesso nome del campo nei dati API
    clientData: UserClient[]; // Assicurati che 'clientData' abbia lo stesso nome del campo nei dati API
    passwordData: UserPassword[]; // Assicurati che 'passwordData' abbia lo stesso nome del campo nei dati API
}
