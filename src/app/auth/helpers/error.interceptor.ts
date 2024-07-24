import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from 'app/auth/service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  /**
   * @param {Router} _router
   * @param {AuthenticationService} _authenticationService
   */
  constructor(private _router: Router, private _authenticationService: AuthenticationService,
      private tost :ToastrManager
    ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(err => {
        if ([401, 403].indexOf(err.status) !== -1) {
          // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
          this.tost.errorToastr('Your session is expire please login again')
          this._authenticationService.logout()

          // ? Can also logout and reload if needed
          // this._authenticationService.logout();
          // location.reload(true);
        }
        // throwError
        const error = err?.error?.message || err?.statusText;
        return throwError(error);
      })
    );
  }
}
