import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { AuthData } from "./auth-data.model";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private readonly API = `${environment.API}/api/user`;

  constructor(private http: HttpClient) {}

  createUser(email: string, password: string) {
    const userData: AuthData = { email, password };
    this.http.post(`${this.API}/signup`, userData).subscribe(response => {
      console.log(response);
    });
  }

  login(email: string, password: string) {
    const userData: AuthData = { email, password };
    this.http.post(`${this.API}/login`, userData).subscribe(response => {
      console.log(response);
    });
  }
}
