import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {ToastrService} from '../../../shared/services/toastr.service';
import {OrderService} from '../../../shared/services/order.service';
import {UserService} from '../../../shared/services/user.service';
import {ItemService} from '../../../shared/services/item.service';
import {CartService} from '../../../shared/services/cart.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { retryWhen, flatMap } from 'rxjs/operators';
import { throwError, Observable, interval, of } from 'rxjs';


@Component({
  selector: 'app-stripe',
  templateUrl: './stripe.component.html',
  styleUrls: ['./stripe.component.scss']
})
export class StripeComponent implements OnInit {
  success:boolean;
  paid:boolean = false;
  deliveryForm: FormGroup;
  id:string;
  cid:string;
  providers: any;
  constructor(private cart: CartService, private iS: ItemService, private formBuilder: FormBuilder, private toastr: ToastrService, private router: Router, private route: ActivatedRoute, private oS: OrderService, private uS: UserService) { }

  ngOnInit(): void {
    let err:string = null;
    const url = this.route.snapshot.url;
    const verb = url[url.length -3].path;
    
     this.route.params.subscribe((params) => {
       this.id = params['id'];
       this.cid = params['cid'];
       let obs: any;
        if(verb === 'cancel'){
          obs = this.oS.cancel(this.id, this.cid);
        }
        if(verb === 'success'){
          obs = this.oS.commit(this.id, this.cid);
          this.paid = true;
        }        
        obs.pipe(this.http_retry())        
          .subscribe(res => {
            this.success = res.success;
          }, error => {
            err = error;          
            this.toastr.warning('We can\'t find that order', 'We will redirect you to your orders page to help find it.');
            this.success = false;         
              setTimeout(() => {
              this.router.navigate(['/user/orders']);
            }, 2000);
         }).add(() => { 
            if(!this.success && !err){
            this.toastr.info('Welcome back', 'You are being redirected back to your orders page');
           setTimeout(() => {
            this.router.navigate(['/user/orders']);
            }, 2000);
           } else {
             if(verb === 'success'){             
               this.cart.clear();
             }
           }
        });
     });

    this.deliveryForm = this.formBuilder.group({      
      'door': new FormControl(false),
      'notes': new FormControl('', [Validators.maxLength(200)]),
      'provider': new FormControl('-1', Validators.required),
      'phone': new FormControl(null, Validators.pattern(/^\d{10}$/))
    });
    this.uS.getCurrentUser().subscribe(u => {      
      if(u.phone){       
        this.deliveryForm.controls['phone'].setValue(u.phone);
      }
      this.uS.getCarriers().subscribe(data => {
        this.providers = data;
        if(u.carrierId){
          this.deliveryForm.controls['provider'].setValue(u.carrierId);
        }
      });
    });  
  }

  private http_retry(maxRetry: number = 5, delayMs: number = 1000) {
    return (src: Observable<any>) => src.pipe(
      retryWhen(err => {
        return interval(delayMs).pipe(
          flatMap(count => count === maxRetry ? throwError('There was a problem retrieving your order.') : of(count))
        )
      })      
    )
  }

  go(){  
    if(this.deliveryForm.invalid){ return;}
    let phone = this.deliveryForm.controls['phone'].value; 
    const formData = new FormData();
    formData.append('notes', this.deliveryForm.controls['notes'].value); 
    formData.append('door', this.deliveryForm.controls['door'].value); 
    formData.append('id', this.id);
    if(phone){
      if(this.deliveryForm.controls['provider'].value < 1){
        this.toastr.info("Mobile / Cellular Provider", "Please select your mobile / cellular provider from the list");       
        return;
      }
      formData.append('carrierid', this.deliveryForm.controls['provider'].value); 
      formData.append('phone', phone);
    }
    this.oS.sendNotes(formData).subscribe(resp =>{
      const r = resp;
    }, error =>{
      this.toastr.warning('An Error Occurred','An error occurred saving your notes.  Please try again.')
    },()=>{
      this.router.navigate(['/user/order/',  this.id ]);
    }   
    );
    
  }

}
