import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {ToastrService} from '../../../shared/services/toastr.service';
import {ItemService} from '../../../shared/services/item.service';
import {CartService} from '../../../shared/services/cart.service';
import {AuthService} from '../../../shared/services/auth.service';
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
  private itemSet$ : BehaviorSubject<boolean>;
  constructor(private router: Router, private aS:AuthService, private route: ActivatedRoute, private toastr: ToastrService, private iS: ItemService, private cart: CartService) { 
    this.isAdmin$ = aS.isAdmin;
  }

  addToCart(item: Item) {    
		this.cart.update(item, this.selectedQuantity, true);
	}

  ngOnInit(): void {   
    this.itemSet$ = new BehaviorSubject(false);
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/catalogue'; 
    this.sub = this.route.params.subscribe((params) => {
      const id = params['id']; // (+) converts string 'id' to a number
      this.iS.getItem(id).subscribe(data => {
        if (data) {
          this.item = data;           
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
      // if(this.iS.item !== null){        
      //   this.item = this.iS.item;
      //   this.iS.item = null;
      //   this.itemSet$.next(true);
      // }else{
      //   this.iS.getItem(id).subscribe(data => {
      //     if (data) {
      //       this.item = data;           
      //       this.itemSet$.next(true);
      //     }
      //   },
      //     error => {
      //       this.toastr.info('Hmmm... that item could not be found','<p>We are going to redirect you back to the catalogue to help you find what you are looking for.</p>');
      //       setTimeout(() => {
      //         this.router.navigate(['/catalogue']);
      //       }, 1800);
      //       //this.toastr.error('Error', 'An error occurred retrieving this item.  Please try again.')
      //     }
      //   );
      // }     
      
    });
    this.itemSet$.subscribe(ready =>{
      if(ready){
        const cI = this.cart.getCartItem(this.item.id);
        if(cI){
          this.selectedQuantity = cI.quantity;
          console.log(this.selectedQuantity);
        }
      }
    })
  }

  ngOnDestroy() {
    if(this.sub){this.sub.unsubscribe();}
    if(this.itemSet$){this.itemSet$.unsubscribe();}
	}

}
