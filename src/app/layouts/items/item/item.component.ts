import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {Title} from '@angular/platform-browser';
import {ToastrService} from '../../../shared/services/toastr.service';
import {ItemService} from '../../../shared/services/item.service';
import {CartService} from '../../../shared/services/cart.service';
import {AuthService} from '../../../shared/services/auth.service';
import {GoogleTagService} from '../../../shared/services/google-tag.service';
import {JsonLdTagService} from '../../../shared/services/json-ld-tag.service';
import { Item } from 'src/app/models/item';
import { Observable, Subscription, BehaviorSubject } from 'rxjs';


@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit, OnDestroy {
  item:Item;
  private sub: Subscription;
  isAdmin$: Observable<boolean>;
  selectedQuantity:number = 1;
  returnUrl:string;
  queryStringParams:string;
  private itemSet$ : BehaviorSubject<boolean>;
  constructor(private json_ld_tag: JsonLdTagService, private gTag: GoogleTagService, private title: Title, private router: Router, private aS:AuthService, private route: ActivatedRoute, private toastr: ToastrService, private iS: ItemService, private cart: CartService) { 
    this.isAdmin$ = aS.isAdmin;
  }

  addToCart(item: Item) {    
		this.cart.update(item, this.selectedQuantity, true);
	}

  ngOnInit(): void { 
    this.itemSet$ = new BehaviorSubject(false);
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/catalogue'; 
    if(this.returnUrl === '/catalogue'){
      this.returnUrl = this.iS.catalogueUrl;      
      this.iS.tags = null;
      this.iS.brand = null;    
    }    
    this.sub = this.route.params.subscribe((params) => {
      const id = params['id']; // (+) converts string 'id' to a number
      this.iS.getItem(id).subscribe(data => {
        if (data) {
          this.item = data;
          //this.gTag.setItemEvent(this.item);          
          this.json_ld_tag.setItemTag(this.item);
          this.title.setTitle(`${this.item.name} | ${this.item.brand} | Vancouver BC Online Delivery`);
          this.itemSet$.next(true);
        }
      },
        error => {
          this.toastr.info('Hmmm... that item could not be found','<p>We are going to redirect you back to the catalogue to help you find what you are looking for.</p>');
          setTimeout(() => {
            this.router.navigate(['/catalogue']);
          }, 1800);
          //this.toastr.error('Error', 'An error occurred retrieving this item.  Please try again.')
        }
      );
 
      
    });
    this.itemSet$.subscribe(ready =>{
      if(ready){
        const cI = this.cart.getCartItem(this.item.id);
        if(cI){
          this.selectedQuantity = cI.quantity;
          //console.log(this.selectedQuantity);
        }
      }
    })
  }

  brandUrl(){
    return `/catalogue/brand/${this.item.brand.replace(/\s/g, '-').toLowerCase()}`;
  }

  catUrl(i:number){
    let segment:string = '/catalogue/';
    for(var j=0; j<i+1; j++){      
      segment = segment.concat(`${this.item.tags[j].replace(/\s/g, '-').toLowerCase()}${j < i ? '/' : ''}`); 
    }
    return segment;
  }

  ngOnDestroy() {
    if(this.sub){this.sub.unsubscribe();}
    if(this.itemSet$){this.itemSet$.unsubscribe();}
	}

}
