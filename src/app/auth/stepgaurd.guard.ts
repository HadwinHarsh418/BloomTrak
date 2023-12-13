import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Role } from './models';
import { AuthenticationService } from './service/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class StepgaurdGuard implements CanActivate {
  constructor( 
    private auth :AuthenticationService,
    private rout : Router
  ){

  }
  canActivate() {
    const currentUser = this.auth.currentUserValue;
    // disabling guards until we enable login
    if ( currentUser?.role == Role.Community && (!currentUser?.stepper  || currentUser.stepper < 0)) {
      this.rout.navigateByUrl('/setup')
      return false;    
    }
    
    return true;
  }
  
}
