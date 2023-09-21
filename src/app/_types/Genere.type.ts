import { Immagine } from "./Immagine.type"

export type Genere = {
    idCategory: number,
    idFile: number,
    img: Immagine
    nome: string,
    icona: string,
    watch: number
}