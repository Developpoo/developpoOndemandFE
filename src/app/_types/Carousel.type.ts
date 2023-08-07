import {
    Immagine
}

from "./Immagine.type"

export type Carousel= {
    id: number,
        idCat: number,
        titolo: string,
        autore: string,
        img?: Immagine
}