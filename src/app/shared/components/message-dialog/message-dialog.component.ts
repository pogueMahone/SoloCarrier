import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import {ToastrService} from 'src/app/shared/services/toastr.service';
import { OrderService } from 'src/app/shared/services/order.service';

@Component({
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.scss']
})
export class MessageDialogComponent implements OnInit {
  msgForm: FormGroup;
  orderData:any;
  constructor(private orderService: OrderService, private toastr : ToastrService, private formBuilder: FormBuilder, private dialogRef: MatDialogRef<MessageDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.orderData = data;
  }

  ngOnInit(): void {
    this.msgForm = this.formBuilder.group({     
      'subject': new FormControl('', [Validators.required, Validators.maxLength(80)]),
      'msg': new FormControl('', [Validators.required, Validators.maxLength(350)]),
      'delivered': new FormControl(false)
    });
  }

  send(){    
    if(this.msgForm.valid){
      const formData = new FormData();
      formData.append('msg', this.msgForm.controls['msg'].value); 
      formData.append('subject', this.msgForm.controls['subject'].value); 
      formData.append('delivered', this.msgForm.controls['delivered'].value); 
      this.orderService.contactReceiver(this.orderData.id, formData).subscribe(resp => {
        this.toastr.success("Message Sent", "Your message was sent to the receiver");
      }, error => {        
        this.toastr.error("Error Sending Message", "An error occurred sending your message.  Please try again.");
      });
    }
  }

  close() {
    this.msgForm.controls['msg'].setValue('');
    this.msgForm.controls['subject'].setValue('');
    this.msgForm.controls['delivered'].setValue(false);
    this.msgForm.reset();
    Object.keys(this.msgForm.controls).forEach(key => {
      this.msgForm.get(key).setErrors(null) ;
    });
    this.dialogRef.close();
  }  
}
