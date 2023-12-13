import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'environments/environment';
import { AuthenticationService } from 'app/auth/service';
import { tap } from 'rxjs/operators';
export const InterceptorSkipHeader = 'X-Skip-Interceptor';
export const InterceptorSkipAuthHeader = 'X-SkipAuth-Interceptor';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  /**
   *
   * @param {AuthenticationService} _authenticationService
   */
  constructor(private _authenticationService: AuthenticationService) { }

  /**
   * Add auth header with jwt if user is logged in and request is to api url
   * @param request
   * @param next
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const currentUser = this._authenticationService.currentUserValue;
    const isLoggedIn = currentUser && currentUser.token;
    const isApiUrl = request.url.startsWith(environment.baseApiUrl);
    if (isApiUrl) {
       if (this._authenticationService.tempToken) {
        request = request.clone({
          setHeaders: {
            Authorization: `${this._authenticationService.tempToken}`
          }
        });
      }
      if (isLoggedIn) {
        request = request.clone({
          setHeaders: {
            Authorization: `${currentUser.token}`
          }
        });
      } else if (this._authenticationService.tempToken) {
        request = request.clone({
          setHeaders: {
            Authorization: `${this._authenticationService.tempToken}`
          }
        });
      }
      if (request.headers.has(InterceptorSkipHeader)) {
        request = request.clone({ headers: request.headers.delete(InterceptorSkipHeader) });
      }
    }

    return next.handle(request).pipe(
      tap(ev => {
        if (ev instanceof HttpResponse) {
          if (ev.status == 200 && ev.body.auth == false) {
            this._authenticationService.logout();
          }
        }
      })
    );
  }
}
