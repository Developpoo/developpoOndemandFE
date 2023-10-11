export interface IPeriodicElement {
    add?: string;
    update?: string;
    delete?: string;
    idUserAuth: number;
    nome: string;
    cognome: string;
    idUserStatus: number;
    idLingua: number;
    sesso: number;
    codiceFiscale: string;
    idNazione?: number;
    idComune?: number;
    dataNascita?: Date;
    accettaTermini?: number;
    user: string;
    password: string;
}
