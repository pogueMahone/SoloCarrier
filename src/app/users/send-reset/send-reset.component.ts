import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import {ToastrService} from '../../shared/services/toastr.service';

@Component({
  selector: 'app-send-reset',
  templateUrl: './send-reset.component.html',
  styleUrls: ['./send-reset.component.scss']
})
export class SendResetComponent implements OnInit {
  formReset: FormGroup;  
  loading: boolean = false;
  done:boolean = false;
  constructor(private toastr: ToastrService, private authService: AuthService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.formReset = this.formBuilder.group({      
      'email': new FormControl('', Validators.required)      
    });
  }
  go($event): void{    
    if (this.formReset.valid) {
      this.loading = true;
      this.authService.sendReset(this.formReset.controls['email'].value).subscribe(resp => {
        this.toastr.success('Notification Sent',`Notification sent to ${this.formReset.controls['email'].value}.  Please check your email.`);
        this.done = true;
      }, error => {
        this.toastr.error('An Error Occurred', 'An error occurred sending password reset.  Please try again.');
      });
    }
  }

}
