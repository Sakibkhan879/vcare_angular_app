import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InvoiceExcelService {
  userData:any ={}
  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject('BASE_URL') private baseUrl: string
  ) {}

  /**
   * Upload an Excel (.xlsx) file to the server.
   * @param formData - The FormData object containing the Excel file.
   */
  uploadXlsx(formData: FormData): Observable<any> {
    const url = `${this.baseUrl}api/Invoice/UploadInvoice`; 
    return this.http.post<any>(url, formData).pipe(
      catchError(this.handleError)
    );
  }

 LoadInvoiceTable(data){
          this.getUserData()
        data.loginmasterid = this.userData.logininfoid
    var url = this.baseUrl + "api/Invoice/LoadAllInvoiceList";
    return this.http.post<any>(url, data);
 }


  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Upload failed:', error);
    return throwError(() =>
      new Error(error.error?.message || 'Server error during upload')
    );
  }





  
  getUserData() {
    if (localStorage["userdata"]) {
      this.userData = JSON.parse(localStorage["userdata"]);
    }
  }

}
