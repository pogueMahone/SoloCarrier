import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {environment} from '../../../../environments/environment';
import {Item} from '../../../models/item';
import {ItemService} from '../../../shared/services/item.service';
import {CartService} from '../../../shared/services/cart.service';

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
  selectedCategory= '';  
  selectedBrand = '';
  filter: boolean = false;
  filterList: any;
  brandList: any;
  constructor(private iS: ItemService, private cart : CartService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {   
    this.selectedCategory = this.route.snapshot.queryParams['category'] || '';  
    this.selectedBrand = this.route.snapshot.queryParams['brand'] || '';
    this.getItems();
  }
  

  private get apiUrl(): string {
    if(this.selectedCategory.length === 0 && this.selectedBrand.length === 0){
      return `${environment.apiHost}/api/Item/list?page=${this.pageIndex}`;
    }
    let url = `${environment.apiHost}/api/Item/filtered?page=${this.pageIndex}`;
    
    if(this.selectedCategory.length > 0){
      url = url.concat(`&category=${this.selectedCategory}`);
    }  
    if(this.selectedBrand.length > 0){
      url = url.concat(`&brand=${this.selectedBrand}`);
    } 
    return url;
  }  

  clear(){   
    this.selectedCategory = '';
    this.selectedBrand = '';
    this.pageIndex = 0;  
    this.getItems();      
  }
  filterItems(e){   
    this.pageIndex = 0;  
    this.getItems();      
  }

  page(e){    
    this.pageIndex = e.pageIndex;
    this.getItems();
  }

  getItems() {
    this.iS.getItems(this.apiUrl).subscribe(data => {
      if (data) {
        this.itemList = data.list;  
        this.itemList.forEach(element => {
          const cartItem = this.cart.getCartItem(element.id);
          if(cartItem){
            element.quantity = element.quantity - cartItem.quantity;
          }
        });
        if(data.filterList){
          this.filterList = data.filterList;           
        } 
        if(data.brandList){
          this.brandList = data.brandList;           
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
 

}
