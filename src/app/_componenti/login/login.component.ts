import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable, Observer, Subject, catchError, delay, of, take, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/_servizi/auth.service';
import { Auth } from 'src/app/_types/Auth.type';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {


  stoControllando: boolean = false
  auth: BehaviorSubject<Auth>
  private distruggi$ = new Subject<void>()

  constructor(
    private authService: AuthService,
  ) {
    this.auth = this.authService.leggiObsAuth()
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.distruggi$.next()
  }

}
