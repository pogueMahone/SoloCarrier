import { Injectable, OnDestroy } from '@angular/core';
import {ToastrService} from '../services/toastr.service';
import {Item} from '../../models/item';
import { tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {environment} from '../../../environments/environment';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', observe: 'events' })
};


@Injectable({
  providedIn: 'root'
})
export class ItemService implements OnDestroy {
  
  private _item: Item = null;
  private _tags: string[];
  private _brand: string;
  private _page: number = 0;
  
  constructor(private http: HttpClient, private toastrService: ToastrService) { 
   
  }

  get page(): number {
    return this._page;
  }

  set page(data:number){
    this._page = data;
  }

  get tags(): string[] {
    return this._tags;
  }

  set tags(data:string[]){
    this._tags = data;
  }

  private getCategorySegment(tags:string[]):string{
    let cat_segment: string = '/';   
    tags.forEach((t, i) => {
      cat_segment += t.replace(/\s/g, '-');
      if(i < tags.length -1){
        cat_segment += '/';
      }
    });
    return cat_segment.toLowerCase();
  }

  

  get catalogueUrl():string {
    let url = '/catalogue';
    if(this._tags && this._tags.length > 0){
      url = url.concat(this.getCategorySegment(this._tags));
    }
    url = url.concat(`?page=${this._page}`);    
    if(this._brand){
      url = url.concat(`&brand=${encodeURI(this._brand)}`);
    }
    return url;
  }

  get brand(): string {
    return this._brand;
  }

  set brand(data:string){
    this._brand = data;
  }

  get item(): Item {
    return this._item;
  }

  set item(data:Item){
    this._item = data;
  }
  
  getById(id: string) {
    //return this.afs.collection<Item>('items').doc('0YYnHlIF2bpdroKDMWUI').ref;
   }
  
  update(data: Item) {
		//this.items.update(data.$key, data);
  }

  findList(idList: string[]){    
    const url = environment.apiHost + '/api/Item/findlist';
    return this.post(url, idList);
  }

  private put(apiUrl: string, data: any){
    return this.http.put(apiUrl, data)
      .pipe(
        tap(e => {
          this.log(e)
        }
      )
     );
  }

  private post(apiUrl: string, data: any){
    return this.http.post(apiUrl, data)
      .pipe(
        tap(e => {
          this.log(e)
        }
      )
     );
  }

  private get(apiUrl: string){
    return this.http.get<any>(apiUrl);
  }

  public postPhoto(data:any){    
    const url = environment.apiHost + '/api/Image/upload';
    return this.http.post(url, data, { reportProgress: true, observe: 'events' });
  }
  
  create(data: Item) {    
    const url = environment.apiHost + '/api/Item';
    return this.post(url, data);
  }
  updateItem(id:string, data:any){
    const url = environment.apiHost + `/api/Item/update/${id}`;
    return this.put(url, data);   
  }
  getItem(id:string){
    const url = environment.apiHost + `/api/Item/${id}`;
    return this.get(url);   
  }
  getItems(url:string){
    return this.get(url);   
  }
   getFavorites(){     
     const url = environment.apiHost + '/api/Item/favorites';
        return this.get(url);
  } 

  ngOnDestroy() {
    
  }

  private log(message: any) {
    //console.log(message);
  }
  
}
