import { File } from "./File.type"
import { Genere } from "./Genere.type"

export type CategoryFile = {
    idCategory: Genere | undefined,
    idFile: File | undefined,
    nome: string,
    src: string,
    alt: string,
    title: string
}
