import { Component } from "@angular/core";
import { Form } from "@angular/forms";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent{
    isLoading = false;

    onLogin(form: Form){
        
    }
}