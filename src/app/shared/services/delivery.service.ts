import { Injectable } from '@angular/core';
import {KeyValuePair} from '../../models/types';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {
private readonly _cities:Array<KeyValuePair>;
  constructor() {
    this._cities = new Array<KeyValuePair>();    
    this._cities.push({key : 0, value :'Vancouver'});
    this._cities.push({key : 5, value :'Burnaby'});
    this._cities.push({key : 6, value :'Richmond'});
    this._cities.push({key : 6, value :'New Westminster'});
    this._cities.push({key : 6, value :'North Vancouver'});
    this._cities.push({key : 7, value :'West Vancouver'});
    this._cities.push({key : 8, value :'Surrey'});
    this._cities.push({key : 8, value :'Port Moody'});
    this._cities.push({key : 8, value :'Coquitlam'});
    this._cities.push({key : 9, value :'Port Coquitlam'});
   }

   get cities(): Array<KeyValuePair> {
    return this._cities;
  }
  
}
