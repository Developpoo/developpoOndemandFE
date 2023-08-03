import { Immagine } from "./Immagine.type"

export type Film = {
    id: number,
    idCat: number,
    titolo: string,
    autore: string,
    img?: Immagine
}