import { HttpClient } from "@angular/common/http";
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";
import { Observable, catchError, map, of } from "rxjs";

export function ControlloStringa(control: AbstractControl): ValidationErrors | null {
    const valore = control.value
    if (valore === "ciao") {
        return { Controllostringa: "hai inserito ciao e non puoi" }
    } else {
        return null
    }
}

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
