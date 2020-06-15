import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import {AuthService} from '../../shared/services/auth.service';
import {ItemService} from '../../shared/services/item.service';
import {OrderService} from '../../shared/services/order.service';
import {DeliveryService} from '../../shared/services/delivery.service';
import {CartService} from '../../shared/services/cart.service';
import {ConfigService} from '../../shared/services/config.service';
import {ToastrService} from '../../shared/services/toastr.service';
import {KeyValuePair} from '../../models/types';
import {environment} from '../../../environments/environment';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Router } from '@angular/router';

declare var Stripe: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  addressForm: FormGroup;
  deliveryForm: FormGroup;
  cartItems:Array<any>;
  total:number =0;
  cities:KeyValuePair[];
  city : KeyValuePair;
  private readonly today: Date;
  private readonly tomorrow: Date;
  minDeliveryDate:Date;
  maxDeliveryDate:Date;
  selectedTODSwitch = new Array<boolean>(false, false, false);
  private ssid:string;
  redirect:boolean = false; 
  error = {quantity:false, system:false}; 
  config:any;
  constructor(private formBuilder: FormBuilder,
    private configService:ConfigService,
     private aS: AuthService,
      private iS : ItemService,
      private cart: CartService,
      private orderService: OrderService,
      private router: Router,
      private deliveryService: DeliveryService,
      private toastr: ToastrService) {
      this.today = new Date();   
      this.tomorrow = new Date();
      this.tomorrow.setDate(this.today.getDate() + 1);
      this.minDeliveryDate = new Date();      
      this.maxDeliveryDate = new Date();
      this.maxDeliveryDate.setMonth(this.minDeliveryDate.getMonth() + 1);      
      this.cities = this.deliveryService.cities;      
       }

  ngOnInit(): void {    
    this.addressForm = this.formBuilder.group({
      'name': new FormControl('', Validators.required),
      'streetAddress1': new FormControl('', Validators.required),
      'streetAddress2': new FormControl(''),
      'city': new FormControl(null, Validators.required),
      'postcode': new FormControl('', [Validators.required, Validators.pattern(/^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i)])
       
    });
    this.deliveryForm = this.formBuilder.group({
      'deliveryDate': [this.minDeliveryDate, Validators.required],
      'timeofday': new FormControl('0', Validators.required)   
    });
    // if(this.today.getHours() > 14){
    //   this.minDeliveryDate.setDate(this.today.getDate() + 1);      
    // } else{
    //   this.setTOD();
    // } 
    this.cartItems = this.cart.getCartItems();   
    this.getTotal(); 
    this.configService.getConfig().subscribe(config => {     
      this.config = config; 
      if(this.config.blockOrders) {
        this.toastr.warning('Important!','Solo Carrier is not accepting new orders at this time due to a backlog of deliveries.');
      }else{
        if(this.config.minOrderAmount > this.total) {
          setTimeout(() => {
            this.router.navigate(['/items/shopping-cart']);
          }, 1500);
        }        
      }    
      // set calender
      if(this.config.availability && new Date(this.config.availability) >= this.tomorrow) {         
        this.minDeliveryDate =new Date(this.config.availability);
        this.maxDeliveryDate.setMonth(this.minDeliveryDate.getMonth() + 1);
        this.deliveryForm.controls['deliveryDate'].setValue(this.minDeliveryDate);
      } else if(this.today.getHours() > 14){        
        this.minDeliveryDate.setDate(this.today.getDate() + 1); 
        this.deliveryForm.controls['deliveryDate'].setValue(this.minDeliveryDate);     
      } else{
        this.setTOD();
      } 
    });   
    
    //this.getSession();
    this.loadStripe();
  }

  

  private isToday (someDate:Date) :boolean{    
    return someDate.getDate() === this.today.getDate() &&
      someDate.getMonth() === this.today.getMonth() &&
      someDate.getFullYear() === this.today.getFullYear()
  }
private resetTOD(){
  for(let i=0; i< this.selectedTODSwitch.length; i++){
    this.selectedTODSwitch[i] = false;
  } 
  this.deliveryForm.controls['timeofday'].setValue("0");
}
  private setTOD(){
      if(this.today.getHours() > 7 && this.today.getHours() < 9){
        this.deliveryForm.controls['timeofday'].setValue("1");
        this.selectedTODSwitch[0] = true;
      } else if(this.today.getHours() > 9){
        this.deliveryForm.controls['timeofday'].setValue("2");
        this.selectedTODSwitch[0] = true;
        this.selectedTODSwitch[1] = true;
      }   
  }

  private formatAddress(o: any){
    o.address['streetAddress1'] = this.addressForm.controls['streetAddress1'].value;
    o.address['streetAddress2'] = this.addressForm.controls['streetAddress2'].value;
    o.address['city'] = this.city.value;
    o.address['state'] = 'BC';
    o.address['postcode'] = this.addressForm.controls['postcode'].value;
  }

  private formatDelivery(o : any){    
    o.delivery['charge'] = this.city.key;
    o.delivery['contact'] = this.addressForm.controls['name'].value;
    o.delivery['date'] = this.deliveryForm.controls['deliveryDate'].value;
    o.delivery['TOD'] = parseInt(this.deliveryForm.controls['timeofday'].value);
  }

  private getSession(){
    const o = {items: new Array<any>(), address: {}, delivery:{}};

    this.cartItems.forEach(i => {
      if(i.quantity > 0){
        o.items.push({id: i.id, quantity: i.quantity});
      }      
    });
    this.formatAddress(o);
    this.formatDelivery(o);
    
     this.orderService.create(o).subscribe(response => {
       if(response['error']){
           if(response['msg'] === 'quantity'){
             this.error.quantity = true;
             setTimeout(() => {
               this.router.navigate(['/items/shopping-cart']);
             }, 3500);
           } else{
             this.error.system = true;
             this.toastr.warning('An error has occurred','An error occurred connecting with Stripe payment system');
           }
       } else {
         //console.log(response);
         this.ssid = response['sid'];
         this.gotoStripe();
       }
     }, err =>{
       this.toastr.warning('An Error Occurred', 'An error occurred connecting with Stripe Payment system.');
     });
  }
  dateChange(e:MatDatepickerInputEvent<Date>){
    this.resetTOD();
    if(this.isToday(e.value)){
      this.setTOD();
    } 
  }
  citySelect(){ 
    const i = this.addressForm.controls['city'].value;
    this.city = this.cities[i];
    this.getTotal();      
  }

  getTotal(){
    this.total = 0;
    this.cartItems.forEach(item =>{
      this.total += item.quantity * item.data.price;
    });    
    if(this.addressForm.controls['city'].value){
      this.total +=this.city.key;
    }    
  }

   private loadStripe() {
     
	 	if(!window.document.getElementById('stripe-script')) {
	 	  var s = window.document.createElement("script");
	 	  s.id = "stripe-script";
	 	  s.type = "text/javascript";
       s.src = "https://js.stripe.com/v3/";
       window.document.head.appendChild(s);
	 
	 	}
  }

  saveOrder(){    
    this.getSession();
  }
  
  private gotoStripe(){
    this.redirect = true;
    this.toastr.info('Please wait','You are being redirected to Stripe payment.');
    const tS = this.toastr;
    var stripe = Stripe(environment.stripeKey);
          stripe.redirectToCheckout({           
            sessionId: this.ssid
          }).then(function (result) {
            // If `redirectToCheckout` fails due to a browser or network
            // error, display the localized error message to your customer
            // using `result.error.message`.    
            if(result.error.message){
              setTimeout(() => {
                tS.error('An Error Occured','An error occured connecting to Stripe payment.  Please try again.'); 
              }, 5000);  
            }          
          });
  }
}
