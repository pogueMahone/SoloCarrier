import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JsonLdTagService {
  private _pageViewObs: BehaviorSubject<any>;
  
  constructor() { 
    this._pageViewObs = new BehaviorSubject<any>(null);
  }

  removePageViewTags(){
    let scripts = document.head.getElementsByClassName('page-view-json-ld'); 
      if(scripts && scripts.length > 0){
        for(let i =0; i<scripts.length; i++) {                 
          document.head.removeChild(scripts[i]);
        };
      }
  }

  addPageViewTags(tag:any){
    let s = document.createElement('script');
    s.type = 'application/ld+json';
    s.classList.add('page-view-json-ld');
    s.text = JSON.stringify(tag);
    document.head.append(s);
  }

  private replaceSpaces(n:string ){
    return n.replace(/\s/g, '-');
  }

  get pageTagReady():Observable<any>{
    return this._pageViewObs.asObservable();
  }

  setItemListTag(items:any[]){
    let itemAr = new Array<any>();
    items.forEach((item, i) => {
      itemAr.push( {
        "@type":"ListItem",
        "position":i+1,
        "url":`https://solocarrier.com/${this.replaceSpaces(item.brand)}/${this.replaceSpaces(item.name)}/${item.id}`
      });
    });
    const tag = {
      "@context":"https://schema.org",
      "@type":"ItemList",
      "itemListElement": itemAr
    };
    this._pageViewObs.next(tag);    
    this._pageViewObs.next(null);
  }

  setItemTag(item:any){
     const tag = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": item.name,
      "image": [
        `https://solocarrier.com/${item.imageUrl}`
       ],      
      "description": item.description,
      "brand": {
        "@type": "Brand",
        "name": item.brand
      },
      "offers": {
        "@type": "Offer",
        "priceCurrency": "CAD",
        "price": item.price,
         "url":`https://solocarrier.com/${this.replaceSpaces(item.brand)}/${this.replaceSpaces(item.name)}/${item.id}`,
        "itemCondition": "https://schema.org/NewCondition",
        "availability": "https://schema.org/InStock",
        "availableDeliveryMethod": "http://purl.org/goodrelations/v1#DeliveryModeOwnFleet",
        "areaServed": { 
          "@type": "GeoCircle", 
          "geoMidpoint": { 
          "@type": "GeoCoordinates", 
          "latitude": "49.263558", 
          "longitude": "-123.091581" 
          }, 
          "geoRadius": "25000" 
        }
      }
    };    
    this._pageViewObs.next(tag);    
    this._pageViewObs.next(null);
  }

  ngOnDestroy() {
    if(this._pageViewObs){
      this._pageViewObs.unsubscribe();
    }
  }
}
