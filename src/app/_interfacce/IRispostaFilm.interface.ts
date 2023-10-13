export interface IRispostaFilm {
    add?: string,
    update?: string,
    delete?: string,
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
        idFile?: number;
        idTipoFile: number;
        src: string;
        alt: string;
        title: string;
        descrizione?: string;
        formato?: string;
    }[];
    // Aggiungi le proprietà per i file da inviare
    idTipoFile1?: number;
    src1?: string;
    alt1?: string;
    title1?: string;
    idTipoFile2?: number;
    src2?: string;
    alt2?: string;
    title2?: string;
}
