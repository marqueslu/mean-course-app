import { Component } from "@angular/core";
import { Form } from "@angular/forms";

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent{
    isLoading = false;

    onSignup(form: Form){
        
    }
}