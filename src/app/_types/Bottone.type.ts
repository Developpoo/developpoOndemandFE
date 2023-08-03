export type TipoBottone = "submit" | "button" | "reset"


export type Bottone = {
    testo: string,
    title: string,
    icona: string | null,
    tipo: TipoBottone,
    link: string | null,
    emitId: number | null
}