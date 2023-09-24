import { File } from "./File.type"
import { Genere } from "./Genere.type"

export type CategoryFile = {
    idCategory: Genere | undefined,
    idFile: File | undefined,
    nome: string
}


// const oss: Observer<any> = {
//     next: (rit) => { this.dati = rit; console.log(this.dati) },
//     error: (err) => console.error(err),
//     complete: () => console.log("Completo")
// }

// // const obs$: Observable<any> = zip(arrCat$, arrFile$).pipe(
// // // tap((dati) => { console.log("DATI", dati) })
// // // );

// const obs$: Observable<any> = this.getGeneri()
//     .pipe(
//         // tap((ris) => console.log("RIS", ris.data)),
//         map((ris) => {
//             this.cat = ris.data;
//             return ris
//         }),
//         concatMap((ris: IRispostaServer, index: number): Observable<IRispostaServer> => {
//             // console.log("RIS2", ris, index)

//             return this.getFile()
//         }),
//         // tap((ris) => console.log("RIS", ris, this.cat)),
//         map((ris) => {
//             this.file = ris.data
//             let dati: Unione[] = []
//             for (let i = 0; i < ris.data.length; i++) {
//                 const item = ris.data[i]
//                 const obj = this.cat?.find(elemento => elemento.id === item.idCat)
//                 const tmp: Unione = {
//                     id: item.idFile,
//                     nome: item.nome,
//                     cat: obj
//                 }
//                 dati.push(tmp)
//             }
//             return dati
//         })
//     )

// obs$.subscribe(oss);

