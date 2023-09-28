export interface IRispostaFilm {
    film: {
        idFilm: number;
        titolo: string;
        descrizione: string;
        durata: number;
        regista: string;
        attori: string;
        icona: string | null;
        anno: Date;
        watch: number;
        files: {
            idFile: number;
            idTipoFile: number;
            nome: string;
            src: string;
            alt: string;
            title: string;
            descrizione: string | null;
            formato: string | null;
        }[];
    };
}
