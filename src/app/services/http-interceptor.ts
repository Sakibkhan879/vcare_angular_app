import {
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse,
  HttpHandler,
  HttpRequest,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, Subscriber } from 'rxjs';
import { tap, map, filter, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Injectable, EventEmitter, Output } from '@angular/core';

import { EMPTY } from 'rxjs'
@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  @Output() error = new EventEmitter<any>();
  constructor(
    private router: Router
    //, private app: GenericComponent
  ) {
  }
  //intercept http request and the token from cookie
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    var _token = (localStorage["stockmtoken"]) ? localStorage["stockmtoken"] : "";
    var yearData = localStorage['yeardata'] ? Number(localStorage['yeardata']) : null;
    var companymasterid = localStorage['companymasterid'] ? Number(localStorage['companymasterid']) : null;

    let clonedRequest = (_token && _token != "") ? req.clone({ headers: req.headers.set('Authorization', _token) }) : req.clone();
    req.headers.set('Authorization', _token)
    // Pass the cloned request instead of the original request to the next handle

    if (
    yearData &&
    clonedRequest.body &&
     !(clonedRequest.body instanceof FormData) && // ⬅️ Important check
    typeof clonedRequest.body === 'object'
) {
  clonedRequest = clonedRequest.clone({
    body: {
      ...clonedRequest.body,
      financialyearid: yearData,
      companymasterid: companymasterid
    },
  });
}

    return next.handle(clonedRequest).pipe(map((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        event = event.clone({ body: this.modifyBody(event.body) });
      }
      return event;
    }), catchError((err: any): Observable<HttpEvent<any>> => {
      if (err instanceof HttpErrorResponse) {
        //console.log("Error" + req.url);
        //this.app.fetchError(err);
        return EMPTY;
      }
    }))
  }
  private modifyBody(body: any) {
    /*
    * write your logic to modify the body
    * */
  }
}
