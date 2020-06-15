import { Injectable, OnDestroy } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { Subscription, BehaviorSubject, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {environment} from '../../../environments/environment';
import { map } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', observe: 'events' })
};

@Injectable({
  providedIn: 'root'
})
export class ConfigService implements OnDestroy {
  
  private mCS: Subscription;
  private _isMobile: BehaviorSubject<boolean>;   
  private _config:any; 
  private _utcOffsetHours:number; 
  
  get isMobile() {
    return this._isMobile.asObservable(); 
  }

  get utcOffsetHours(){
    return this._utcOffsetHours;
  }
  
  constructor(private mediaObserver: MediaObserver, private http: HttpClient) { 
    var d = new Date();
    var o = d.getTimezoneOffset();
    this._utcOffsetHours = o / 60;
    this. _isMobile = new BehaviorSubject<boolean>(false);     
    this.mCS = this.mediaObserver.media$.subscribe(
      change => {        
        if (change.mqAlias === 'sm' || change.mqAlias === 'xs') {
          this._isMobile.next(true);       
        } else {
          this._isMobile.next(false);  
        }
      }
    );
  }

  getConfig(){
    if(!this._config){
      const url = environment.apiHost + '/api/Config';
      return this.http.get<any>(url)
      .pipe(map(config => {        
        this._config = config;
        return config;
      }));
    } else{
      return of(this._config);
    }
    
  }

  getCategories(){
    const url = environment.apiHost + '/api/Config/categories';
    return this.http.get<any>(url);
  }

  ngOnDestroy(): void {
    this.mCS.unsubscribe();    
    if(this._isMobile){
      this._isMobile.unsubscribe();
    }
  }
}
