import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { AuthData } from "./auth-data.model";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private token: string;
  private readonly API = `${environment.API}/api/user`;

  constructor(private http: HttpClient) {}

  getToken() {
    return this.token;
  }

  createUser(email: string, password: string) {
    const userData: AuthData = { email, password };
    this.http.post(`${this.API}/signup`, userData).subscribe(response => {
      
    });
  }

  login(email: string, password: string) {
    const userData: AuthData = { email, password };
    this.http
      .post<{ token: string }>(`${this.API}/login`, userData)
      .subscribe(response => {        
        const token = response.token;
        this.token = token;
      });
  }
}
