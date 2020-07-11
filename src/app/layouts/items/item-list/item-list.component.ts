import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {environment} from '../../../../environments/environment';
import {Item} from '../../../models/item';
import {ItemService} from '../../../shared/services/item.service';
import {CartService} from '../../../shared/services/cart.service';
import {ConfigService} from '../../../shared/services/config.service';
//import {GoogleTagService} from '../../../shared/services/google-tag.service';
import {JsonLdTagService} from '../../../shared/services/json-ld-tag.service';
import {Title} from '@angular/platform-browser';
import {Location} from '@angular/common';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {
  loading = false;
  itemList: any;
  // MatPaginator Inputs
  public pageIndex = 0;
  public pageSize = 0;
  public pageCount = 0;
  public lastPage = false;  
  //selectedCategory= '';  
  selectedBrand = '';
  filter: boolean = false;
  filterList: any;
  brandList: any;
  categories:any;
  private tags:string[] = new Array<string>();    
  constructor(private location: Location, private json_ld_tag: JsonLdTagService, private title: Title, private config: ConfigService, private iS: ItemService, private cart : CartService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {   
    this.config.getCategories().subscribe(data => {
      this.categories = [{name:'Categories', subs: data.categories}];  
      this.pageIndex = this.route.snapshot.queryParams['page'] || 0;  
      this.selectedBrand = decodeURI(this.route.snapshot.queryParams['brand'] || '');
      if(this.route.snapshot.params['brand']){        
        this.selectedBrand = decodeURI(this.route.snapshot.params['brand'].replace(/-/g, ' '));       
      }
      // if(this.selectedBrand && this.selectedBrand.length > 0){
      //   this.selectedBrand = this.titlecasePipe.transform(this.selectedBrand);
      // }
      for(let i =0; i < 3; i++){
        if(this.route.snapshot.params[`cat${i}`]){
          this.tags.push(this.route.snapshot.params[`cat${i}`].replace(/-/g, ' '));
        }
      }
      // for legacy keyword querystring param
      const tagStr = decodeURI(this.route.snapshot.queryParams['keywords'] || ''); 
      if(tagStr.length > 0 && this.tags.length === 0){
        this.tags = tagStr.split('_');
      }      
      this.getItems(true);   
    }); 

  }
  

  private get apiUrl(): string {  
    this.iS.tags = null;
    this.iS.brand = null;
    this.iS.page = this.pageIndex;
    if((!this.tags || this.tags.length === 0) && this.selectedBrand.length === 0){ 
      this.title.setTitle('Vancouver BC Online Delivery');        
      return `${environment.apiHost}/api/Item/list?page=${this.pageIndex}`;
    }
    let url = `${environment.apiHost}/api/Item/tag-filtered?page=${this.pageIndex}`;
    
    // if(this.selectedCategory.length > 0){
    //   url = url.concat(`&category=${this.selectedCategory}`);
    // }      
    if(this.tags && this.tags.length > 0){      
      this.iS.tags = this.tags;
      //let tag_param = this.iS.getTagsParam(this.tags);
     
      url = url.concat(`&tags=${JSON.stringify(this.tags)}`); 
    }
    if(this.selectedBrand.length > 0){      
      this.iS.brand = this.selectedBrand;
      url = url.concat(`&brand=${this.selectedBrand}`);
    }  
      
    return url;
  }  

  // clear(){   
  //   this.selectedCategory = '';
  //   this.selectedBrand = '';
  //   this.pageIndex = 0;  
  //   this.getItems();      
  // }
  filterItems(e){   
    this.pageIndex = 0;  
    this.getItems();      
  }

  page(e){    
    this.pageIndex = e.pageIndex;
    this.getItems();
  }

  getItems(pageInit:boolean = false) {  
    if(!pageInit){
      this.json_ld_tag.removePageViewTags();
      this.iS.tags = this.tags;
      this.iS.brand = this.selectedBrand;
      this.iS.page = this.pageIndex;
      this.location.replaceState(this.iS.catalogueUrl);
    } 
    this.iS.getItems(this.apiUrl).subscribe(data => {
      if (data) {
        this.itemList = data.list; 
        this.itemList.forEach(element => {
          const cartItem = this.cart.getCartItem(element.id);
          if(cartItem){
            element.quantity = element.quantity - cartItem.quantity;
          }
          //element['url'] = `catalogue/item/${this.replaceSpaces(element.brand)}/${this.replaceSpaces(element.name)}/${element.id}`;
        });
        //this.gTag.setItemCatalogueEvent(this.itemList, this.pageIndex);
        this.json_ld_tag.setItemListTag(this.itemList);
        if(data.filterList){
          this.filterList = data.filterList;           
        } 
        if(data.brandList){
          this.brandList = data.brandList; 
          if(this.selectedBrand && this.selectedBrand.length > 0){
            let brandRegEx = new RegExp(this.selectedBrand, 'i');
            this.selectedBrand = this.brandList.find(b => brandRegEx.exec(b));  
            this.title.setTitle(`${this.selectedBrand} | Vancouver BC Online Delivery`);
          } else{
            if(this.tags && this.tags.length > 0){
              if(this.tags.length === 1){
                this.title.setTitle(`${this.tags[0]} | Vancouver BC Online Delivery`);
              } else{
                this.title.setTitle(`${this.itemList[0].category} | Vancouver BC Online Delivery`);
              }
            }
          }

        }               
        this.pageCount = data.count;
        this.pageSize = data.limit;      
      }
    },
      error => {
      }
    );
		
  }

  view(item: Item) {
    this.iS.item = item;
    this.router.navigate(['/catalogue/item',  item.id ]);
  }

	addToCart(item: Item, i: number) {
    item.quantity--;
    this.cart.update(item, 1, false);
	}
 
  filterChanged(tags:any){   
    this.selectedBrand = ''; 
    this.pageIndex = 0;
    tags.pop();
    this.tags = tags.reverse();
    this.getItems();   
  }

  removeFilter(i: number): void {
    this.selectedBrand = '';
    this.pageIndex = 0;
    this.tags.splice(i, this.tags.length -i);
    this.getItems();  
  }   
}
