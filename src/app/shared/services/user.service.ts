import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import {environment} from '../../../environments/environment';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', observe: 'events' })
};

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnDestroy {
private user:any;

  constructor(private http: HttpClient) { }

 

  private get(apiUrl: string){
    return this.http.get<any>(apiUrl);
  }

  getUser(id: string): Observable<any>{    
    const url = environment.apiHost + `/api/User/${id}`;
    return this.get(url);     
  }

  getCurrentUser(): Observable<any>{    
    const url = environment.apiHost + '/api/User/current';
    return this.get(url);     
  }

  getCarriers(): Observable<any>{    
    const url = environment.apiHost + '/api/User/carriers';
    return this.get(url);     
  }

  Update(formData: any): Observable<any>{    
    const url = environment.apiHost + '/api/User/update';
    return this.http.post(url, formData);
  }

  getPhone(): Observable<any>{    
    const url = environment.apiHost + '/api/User/current';
    return this.get(url).pipe(
      map(resp => {
        const u = resp;
        if(u.phone){
          return u.phone;
        }else{ return null;}
      })
    );
  }

  ngOnDestroy() {
  }
}
