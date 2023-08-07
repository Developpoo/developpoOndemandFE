

export type Film = {
    idFilm: number,
    titolo: string,
    descrizione: string,
    durata: number,
    regista: string,
    attori: string,
    anno: number,
    idImg?: string | null,
    idFilmato?: string | null,
    idTrailer?: string |null,
    watch: number
}