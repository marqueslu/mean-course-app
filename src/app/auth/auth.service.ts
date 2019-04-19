import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { AuthData } from "./auth-data.model";
import { Subject } from "rxjs";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private token: string;
  private readonly API = `${environment.API}/api/user`;
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated = false;
  private tokenTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth(){
    return this.isAuthenticated;
  }
  createUser(email: string, password: string) {
    const userData: AuthData = { email, password };
    this.http.post(`${this.API}/signup`, userData).subscribe(response => {});
  }

  login(email: string, password: string) {
    const userData: AuthData = { email, password };
    this.http
      .post<{ token: string, expiresIn: number }>(`${this.API}/login`, userData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.tokenTimer = setTimeout(() => {
            this.logout();
          }, expiresInDuration * 1000);
          console.log(expiresInDuration);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          this.router.navigate(['/']);
        }
      });
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  logout(){

    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.router.navigate(['/']);
  }
}
