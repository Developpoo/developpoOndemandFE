import { Bottone } from "./Bottone.type"
import { Immagine } from "./Immagine.type"


export type Card = {
    immagine?: Immagine,
    titolo: string | null,
    descrizione: string | null,
    bottone?: Bottone
}


// this.auth = this.authService.leggiObsAuth()
// console.log("AUTH", this.auth)