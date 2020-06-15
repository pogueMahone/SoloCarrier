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
    this._cities.push({key : 8, value :'Burnaby'});
    this._cities.push({key : 10, value :'Richmond'});
    this._cities.push({key : 10, value :'New Westminster'});
    this._cities.push({key : 10, value :'North Vancouver'});
    this._cities.push({key : 12, value :'West Vancouver'});
    this._cities.push({key : 14, value :'Surrey'});
   }

   get cities(): Array<KeyValuePair> {
    return this._cities;
  }
  
}
