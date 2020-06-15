import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import {ToastrService} from '../../shared/services/toastr.service';
import {UserService} from '../../shared/services/user.service';
import {AuthService} from '../../shared/services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  userForm: FormGroup;
  selectedProvider: any = "-1";
  providers: any;  
  email:any;
  isAdmin$: Observable<boolean>;
  constructor(private aS:AuthService, private userService : UserService, private formBuilder: FormBuilder, private toastr: ToastrService) { 
    this.isAdmin$ = aS.isAdmin;
  }

  ngOnInit(): void {
    
    this.userForm = this.formBuilder.group({  
      'email': new FormControl('', Validators.required),
      'provider': new FormControl('-1', Validators.required),
      'phone': new FormControl(null, Validators.pattern(/^\d{10}$/))
    });
    this.userService.getCurrentUser().subscribe(u => {
      this.userForm.controls['email'].setValue(u.email);
      this.email = u.email;
      if(u.phone){
        this.userForm.controls['phone'].setValue(u.phone);        
      }     
      this.userService.getCarriers().subscribe(data => {
        this.providers = data;
        if(u.carrierId){
          this.userForm.controls['provider'].setValue(u.carrierId);
        }
      });
    });    
  }

  save(e){
    if(this.userForm.invalid){ return;}
    let phone = this.userForm.controls['phone'].value;    
    const formData = new FormData();
    formData.append('email', this.userForm.controls['email'].value); 
    if(phone){
      if(this.userForm.controls['provider'].value < 1){
        this.toastr.info("Mobile / Cellular Provider", "Please select your mobile / cellular provider from the list");       
        return;
      }
      formData.append('carrierid', this.userForm.controls['provider'].value); 
      formData.append('phone', phone);
    }
   
    this.userService.Update(formData).subscribe(resp => {
      this.toastr.success("Profile Updated", "Your profile has been updated.");
    }, error => {
      this.toastr.warning("An Error Occurred", "An error occurred updating your profile.  Please try again.");
    });
  }
  

}
