import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {        
    let u = JSON.parse(localStorage.getItem('currentUser')) || null;
    if(u !== null && u.admin) {
      return true;
    }    
    this.router.navigate(['/']);
    return false;
  }
}
