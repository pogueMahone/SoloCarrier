import { Injectable, OnDestroy } from '@angular/core';
import {  BehaviorSubject } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  //userObs: Observable<firebase.User>;
  readonly user: any;
  
  private loggedIn: BehaviorSubject<boolean>;
  get isLoggedIn() {
    return this.loggedIn.asObservable(); 
  }
  private _isAdmin: BehaviorSubject<boolean>;
  get isAdmin() {
    return this._isAdmin.asObservable(); 
  }
  constructor(private http: HttpClient, private router: Router) { 
    this.user = JSON.parse(localStorage.getItem('currentUser')) || null;    
    this.loggedIn = new BehaviorSubject<boolean>(this.user ? true : false);    
    this._isAdmin =  new BehaviorSubject<boolean>((this.user && this.user.admin)? true: false);
   
  }

  login(email: string, password: string) {    
    const url = environment.apiHost + '/api/auth/authenticate';
    return this.http.post<any>(url, { email, password })
      .pipe(map(user => {        
        if (user && user.token) {         
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.loggedIn.next(true);
          this._isAdmin.next(user.admin);          
        }

        return user;
      }));
  }

  googleSignIn(user: any) {   
    const formData = new FormData();
    formData.append('authToken', user.authToken); 
    formData.append('idToken', user.idToken); 
    formData.append('email', user.email); 
    const url = environment.apiHost + '/api/auth/gauthenticate';
    return this.http.post<any>(url, formData)
      .pipe(map(user => {        
        if (user && user.token) {         
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.loggedIn.next(true);
          this._isAdmin.next(user.admin);          
        }

        return user;
      }));
  }

  sendReset(email: string) {   
    const formData = new FormData();    
    formData.append('email', email); 
    const url = environment.apiHost + '/api/auth/sendreset';
    return this.http.post<any>(url, formData);
  }

  reset(data: any) {
    const url = environment.apiHost + '/api/auth/reset';
    return this.http.post<any>(url, data);
  }

  register(email: string, password: string, confirm: string) {    
    const url = environment.apiHost + '/api/auth/register';
    return this.http.post<any>(url, { email, password, confirm })
      .pipe(map(user => {      
        if (user && user.token) {        
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.loggedIn.next(true);
        }
        return user;
      }));
  }

  logout() {   
    localStorage.removeItem('currentUser');
    this.loggedIn.next(false);
    this._isAdmin.next(false);
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 500);
  }  

  ngOnDestroy() {
    if(this.loggedIn){
      this.loggedIn.unsubscribe();
    }
    if(this._isAdmin){this._isAdmin.unsubscribe();}
  }
}
