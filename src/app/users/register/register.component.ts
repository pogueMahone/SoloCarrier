import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  formReg: FormGroup;
  returnUrl: string;
  err: string;
  loading: boolean = false;
  constructor(private authService: AuthService, private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.authService.isLoggedIn.subscribe(a => {
      if (a) {
        this.router.navigate(['/']);
      }
    });
    this.formReg = this.formBuilder.group({
      'email': new FormControl('', [Validators.required, , Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/i)]),
      'password': new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]),
      'confirm': new FormControl('', Validators.required)
    });
    this.formReg.valueChanges.subscribe(field => {
      this.err = null;
      if (field.password !== field.confirm) {
        this.formReg.controls['confirm'].setErrors({ mismatch: true });
      } else {
        this.formReg.controls['confirm'].setErrors(null);
      }
    });
  }

  go($event): void {
    //$event.preventDefault();
    if (this.formReg.valid) {
      this.loading = true;
      this.authService.register(this.formReg.controls['email'].value, this.formReg.controls['password'].value, this.formReg.controls['confirm'].value).subscribe(
        u => {
          //this.postResponse.status = n.status;
          this.router.navigate([this.returnUrl]);
        },
        err => {
          this.err = err;          
          this.loading = false;
        }
      );
    }
  }

}
