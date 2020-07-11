import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GoogleTagService {  
  constructor() { }

  setItemEvent(data:any){
    const event = new GoogleTagEvent('productDataAvailable', data);
    window['dataLayer'].push(event);
  }

  setItemCatalogueEvent(data:any, page:number){
    const event = new GoogleTagEvent('productCatalogueAvailable', data, page);
    window['dataLayer'].push(event);
  }

  setItemBestSellersEvent(data:any){
    const event = new GoogleTagEvent('productBestSellersAvailable', data);
    window['dataLayer'].push(event);
  }
  

  private replaceSpaces(n:string ){
    return n.replace(/\s/g, '-');
  }
}

export class GoogleTagEvent{
  event:string;
  data:any;  
  index:number;
  constructor(name:string, event_data:any, index? : number) {
    this.event = name;
    this.data = event_data;
    this.index = index;
   }
}
