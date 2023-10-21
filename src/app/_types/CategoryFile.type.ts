import { File } from "./File.type"
import { Genere } from "./Genere.type"

export type CategoryFile = {
    add?: string,
    update?: string,
    delete?: string,
    idCategory?: Genere | undefined | number,
    idFile?: number | undefined,
    idTipoFile?: number,
    nome?: string,
    src?: string,
    alt?: string,
    title?: string,
    icona?: string,
    watch?: number,
}

