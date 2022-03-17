import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  error='';
  loading = false;
  submitted = false;
  
  constructor(private formBuilder: FormBuilder,
    private router: Router) { }

  ngOnInit(): void { 
    if(!!localStorage.getItem("user_details")) {
      this.router.navigate(['/home'])
    }
  }

  get f() { return this.form.controls; }

  onSubmit(){
    if(this.form.controls.username.value == 'admin' && this.form.controls.password.value == '123'){
      const user_details = {
        id:1,
        username:'admin',
        email:'admin@abc.com'
      }
      localStorage.setItem("user_details",JSON.stringify(user_details));
      this.router.navigate(['/home'])
    }
    else if(this.form.controls.username.value == 'admin2' && this.form.controls.password.value == '123'){
      const user_details = {
        id:1,
        username:'admin2',
        email:'admin2@abc.com'
      }
      localStorage.setItem("user_details",JSON.stringify(user_details));
      this.router.navigate(['/home'])
    }
    else{
      this.error = 'Invalid username/password! '
    }
    
  }

}
