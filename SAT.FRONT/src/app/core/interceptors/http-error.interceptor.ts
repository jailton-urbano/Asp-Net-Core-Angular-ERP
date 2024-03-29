import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { appConfig as c } from 'app/core/config/app.config';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from 'app/core/auth/auth.service';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { EmailService } from '../services/email.service';
import { Router } from '@angular/router';
import { CustomSnackbarService } from '../services/custom-snackbar.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
    constructor(
        private _authService: AuthService,
        private _snack: CustomSnackbarService,
        private _emailSvc: EmailService,
        private _router: Router
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let newReq = req.clone();

        if (this._authService.accessToken && !AuthUtils.isTokenExpired(this._authService.accessToken)) {
            newReq = req.clone({
                headers: req.headers.set('Authorization', 'Bearer ' + this._authService.accessToken)
            });
        }

        return next.handle(newReq).pipe(
            catchError((error) => {
                switch (error.status) {
                    case 0:
                        break;

                    case 401:
                        if (error instanceof HttpErrorResponse && error.status === 401) {
                            this._authService.signOut();

                            location.reload();
                        }
                        break;

                    case 403:
                        this._router.navigate(['403-forbidden']);
                        break;

                    case 400:
                        break;

                    case 404:
                        break;

                    case 503:
                        break;

                    case 500:
                        break;

                    default:
                        break;
                }

                return throwError(error);
            })
        );
    }

    enviarEmail(error: any) {
        this._emailSvc.enviarEmail({
            emailDestinatarios: [c.email_equipe],
            assunto: 'Erro durante o uso do SAT.V2: FRONTEND',
            corpo: `Tipo: ${error.type}\n Status: ${error.status}\n Mensagem: ${error.message}`
        }).toPromise(); 
    }
}
