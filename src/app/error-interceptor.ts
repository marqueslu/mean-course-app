import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse
  } from "@angular/common/http";
  import { Observable, throwError } from "rxjs";
  import { Injectable } from "@angular/core";
import { catchError } from "rxjs/operators";
  
  
  
  export class ErrorInterceptor implements HttpInterceptor {
   
    intercept(
      req: HttpRequest<any>,
      next: HttpHandler
    ): Observable<HttpEvent<any>> {
      return next.handle(req).pipe(
          catchError((error: HttpErrorResponse) => {
              alert(error.error.message);
              return throwError(error);
          })
      );
    }
  }
  