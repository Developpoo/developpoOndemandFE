export interface IUtenteElement {
    userClient: {
        idUserClient: number;
    };
    userAuth: {
        user: string;
    };
    userPassword: {
        password: string;
        salt: string;
    };
    userRole: {
        idUserRole: number;
    };
    indirizzo: {
        idTipoIndirizzo: number;
        idNazione: number;
        idComune: number;
        indirizzo: string;
        cap: string;
    };
    recapito: {
        idTipoRecapito: number;
        recapito: string;
    };
}
