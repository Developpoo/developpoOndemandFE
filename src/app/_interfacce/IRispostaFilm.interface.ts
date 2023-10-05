export interface IRispostaFilm {
    idFilm: number;
    titolo: string;
    descrizione: string;
    durata: string;
    regista: string;
    attori: string;
    icona: string;
    anno: Date;
    watch: string;
    file: {
        idFile: number;
        idTipoFile: number;
        src: string;
        alt: string;
        title: string;
        descrizione: string;
        formato: string;
    }[];
}
