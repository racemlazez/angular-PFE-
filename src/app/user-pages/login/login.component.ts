import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm:FormGroup;
  constructor(private fb: FormBuilder,private authService:AuthService,private router:Router) { }
  errorMessage;
  error:Boolean=false;
  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
			password: ['', Validators.required]

    })
  }

  onSubmit(){
    this.authService.login(this.loginForm.value).subscribe(
      res => {
        this.error=false;
        this.authService.setToken(res['accessToken']);
        this.router.navigateByUrl('/dashboard');
      },
      err => {
        this.error=true;

        this.errorMessage="Invalid Credentials";
      }
    );

  }

}
