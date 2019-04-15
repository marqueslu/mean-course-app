import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { AuthData } from "./auth-data.model";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private readonly API = `${environment.API}/api/user/signup`;

  constructor(private http: HttpClient) {}

  createUser(email: string, password: string) {
    const userData: AuthData = { email, password };
    this.http.post(this.API, userData).subscribe(response => {
      console.log(response);
    });
  }
}
