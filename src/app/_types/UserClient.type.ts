export type UserClient = {
    idUserClient: number;
    idUserStatus?: number;
    idLingua?: number;
    nome: string;
    cognome: string;
    sesso: number;
    codiceFiscale: string;
    idNazione?: number;
    idComune?: number;
    dataNascita?: Date;
    accettaTermini?: number;
    archived?: number;
}
