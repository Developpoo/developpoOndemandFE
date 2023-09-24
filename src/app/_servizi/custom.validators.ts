import { HttpClient } from "@angular/common/http";
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";
import { Observable, catchError, map, of } from "rxjs";


/**
 * Funzione di validazione personalizzata per controllare una stringa.
 * Restituisce un oggetto di errori se la stringa è "ciao", altrimenti null.
 *
 * @param control Il controllo AbstractControl da validare.
 * @returns Un oggetto di errori se la stringa è "ciao", altrimenti null.
 */
export function ControlloStringa(control: AbstractControl): ValidationErrors | null {
    const valore = control.value
    if (valore === "ciao") {
        return { Controllostringa: "hai inserito ciao e non puoi" }
    } else {
        return null
    }
}

/**
 * Validatore per confrontare due campi di password e verificare se sono uguali.
 * Se le password non coincidono, viene impostato un errore sul campo di conferma password.
 *
 * @param controlName Il nome del campo password.
 * @param matchingControlName Il nome del campo di conferma password.
 * @returns Una funzione di validazione che verifica se le password coincidono.
 */
export function PasswordUgualiValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];
        if (control.value !== null && matchingControl !== null) {
            if (control.value !== matchingControl.value) {
                const tmp: ValidationErrors = { customPasswwordNotTheSameError: `Le password non coincidono` };
                matchingControl.setErrors(tmp);
                return tmp;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }
}
