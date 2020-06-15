import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {ToastrService} from '../../shared/services/toastr.service';
import {AuthService} from '../../shared/services/auth.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent implements OnInit {
  formReset: FormGroup;
  returnUrl: string;
  err: string;
  loading: boolean = false;
  token:any;
  done:boolean = false;
  constructor(private formBuilder: FormBuilder, private authService:AuthService, private route: ActivatedRoute, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParams['tok'] || '';
    
    // this.route.params.subscribe((params) => {
    //   this.token = params['token'];
    // });
    this.formReset = this.formBuilder.group({      
      'password': new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]),
      'confirm': new FormControl('', Validators.required)
    });
    this.formReset.valueChanges.subscribe(field => {
      this.err = null;
      if (field.password !== field.confirm) {
        this.formReset.controls['confirm'].setErrors({ mismatch: true });
      } else {
        this.formReset.controls['confirm'].setErrors(null);
      }
    });    
    if(this.token === ''){      
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 2000);
    }
  }

  go($event): void{    
    if (this.formReset.valid) {
      const formData = new FormData();    
      formData.append('token', this.token); 
      formData.append('password', this.formReset.controls['password'].value); 
      formData.append('confirm', this.formReset.controls['confirm'].value); 
      this.loading = true;
      this.authService.reset(formData).subscribe(resp => {
        this.toastr.success('Password Updated','Your password has been updated.  Please login to continue.');
        this.done = true;
      }, error => {
        this.toastr.warning('An Error Occurred', 'An error occurred resetting your password. Please try again.');
      });
    }
  }

}
