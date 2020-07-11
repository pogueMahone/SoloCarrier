import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/shared/services/order.service';
import { ItemService } from 'src/app/shared/services/item.service';
import { UserService } from 'src/app/shared/services/user.service';
import {ToastrService} from 'src/app/shared/services/toastr.service';
import { Router, ActivatedRoute } from '@angular/router';
import {OrderComponent} from '../order/order.component';
import {ConfigService} from '../../../shared/services/config.service';
import {MessageDialogComponent} from '../../../shared/components/message-dialog/message-dialog.component';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss']
})
export class DeliveryComponent extends OrderComponent implements OnInit {
customer:any;
// items:any;
// total:number =0;
  constructor(private config: ConfigService, public dialog: MatDialog, private userService: UserService, router: Router, route: ActivatedRoute, toastr: ToastrService, oS: OrderService, iS: ItemService) {
    super(config, router, route, toastr, oS, iS);
   }

 
  ngOnInit(): void {  
    super.ngOnInit();  
    this.buyerId.subscribe(id => {
      if(id){
        this.userService.getUser(id).subscribe(u => {
          this.customer = u;          
        }, err => {
          this.toastr.error('An Error Occurred',`An error occurred retrieving user ${id}`);
        });
      }
    });
    // this.route.params.subscribe((params) => {
    //   const id = params['id'];
    //   this.oS.getOrder(id).subscribe(resp => {
    //     this.order = resp;
    //     this.getItems();
    //   },
    //   error => {
    //     this.toastr.error('An error occurred','An error occurred retrieving the order.  Please try again');
    //   });
    // });
  } 

  openDialog() {
    this.dialog.open(MessageDialogComponent, {
      data: {
        contact: this.customer,
        name : this.order.detail.delivery.contact,
        notes: this.order.notes,
        id: this.order.id
      }
    });
  }

  back(){
    this.router.navigate(['/delivery-list']);
  }

}
