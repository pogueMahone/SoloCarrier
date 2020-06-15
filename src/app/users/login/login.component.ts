import { Component, OnInit } from '@angular/core'
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import {ToastrService} from '../../shared/services/toastr.service';
import { AuthService as SAuthService } from "angularx-social-login";
import { GoogleLoginProvider } from "angularx-social-login";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  formSignIn: FormGroup;
  returnUrl: string;
  err: string;
  loading: boolean = false;
  constructor(private sAuthService: SAuthService, private toastr: ToastrService, private authService: AuthService, private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.authService.isLoggedIn.subscribe(a => {
      if (a) {
        this.router.navigate(['/']);
      }
    });
    this.formSignIn = this.formBuilder.group({      
      'email': new FormControl('', Validators.required),
      'password': new FormControl('', Validators.required)   
    });
    localStorage.removeItem('currentUser');
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  signInWithGoogle(): void {
    this.sAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then(sU => {
      this.authService.googleSignIn(sU)
      .pipe(first())
        .subscribe(
          data => {
            this.router.navigate([this.returnUrl]);
          },
          error => {
            this.err = error;
            this.loading = false;
            this.toastr.error('Login failed', error);
        }); 
    });
  }

  go($event): void{
    
    if (this.formSignIn.valid) {
      this.loading = true;
      this.authService.login(this.formSignIn.controls['email'].value, this.formSignIn.controls['password'].value)
        .pipe(first())
        .subscribe(
          data => {
            this.router.navigate([this.returnUrl]);
          },
          error => {
            this.err = error;
            this.loading = false;
            this.toastr.error('Login failed', error);
        });     
    }
  }

}
