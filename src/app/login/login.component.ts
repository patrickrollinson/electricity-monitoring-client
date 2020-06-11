import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styles: []
})


export class LoginComponent {
  public loginForm;
  public logingIn: boolean = false;
  public loginStatus: boolean = false;
  public loginRes = null;

  constructor(
    private auth: AuthService,
    private fb: FormBuilder
  ) {
    this.createLoginForm()
  }

  createLoginForm() {
    console.log("Form")
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    console.log(this.loginForm.value);
    this.logingIn = true;
    this.auth.login(this.loginForm.value).subscribe( res => {
      console.log('res:', res)
      if(res['error']){
        console.log('error')
          this.loginStatus = false;
          this.logingIn = false;
          this.loginRes = res['error'];
          console.log('this.loginRes: ', this.loginRes)
      }
      if(!res['error']){
        console.log('success')
          this.loginStatus = true;
          this.auth.authenticate(res)   
      }
  });
    
  }

}

