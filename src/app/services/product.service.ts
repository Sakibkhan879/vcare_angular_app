import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
declare var $;

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  userData: any = {};
  yearData: any = {};

  constructor(private http: HttpClient,
    private router: Router,
    @Inject('BASE_URL') private baseUrl: string,
    private toastr: ToastrService,) {
  
  }


  productAddPromise(param) {
    this.getUserData();
    this.yearData = localStorage["yeardata"];
    param.financialyearid = this.yearData;
    param.companyid = this.userData.companyid;
    var url = this.baseUrl + "api/product/CreateNewProduct";
    return this.http.post<any>(url, param);
  }


  productListPromise() {
    this.getUserData();
    this.yearData = localStorage["yeardata"];
    var obj = { companyid: this.userData.companyid, financialyearid: this.yearData };
    var url = this.baseUrl + "api/product/LoadProductList";
    return this.http.post<any>(url, obj);
  }


  productLoadDetailsPromise(data) {
    this.getUserData();
    var obj = { productmasterid: data, companyid: this.userData.companyid };
    var url = this.baseUrl + "api/product/LoadProductDetailsById";
    return this.http.post<any>(url, obj);
  }


  productUpdatePromise(obj) {
    var url = this.baseUrl + "api/product/UpdateProductDetails";
    return this.http.post<any>(url, obj); 
  }


  productDeletePromise(data)
  {
   var url = this.baseUrl + "api/product/RemoveProduct";
    return this.http.post<any>(url, data);
  }

  productListForBillPromise() {
    this.getUserData();
    this.yearData = localStorage["yeardata"];
    var obj = { companyid: this.userData.companyid, financialyearid: this.yearData };
    var url = this.baseUrl + "api/product/LoadProductListForBill";
    return this.http.post<any>(url, obj);
  }

  getProductList(param)
  {
    var obj = { columndomain:param };
    var url = this.baseUrl + "api/product/MapColumnName";
      return this.http.post<any>(url, obj);
  }

  submitProductPromise(data) {
    this.getUserData();
    this.yearData = localStorage["yeardata"];
    data.financialyearid = this.yearData;
    data.companyid = this.userData.companyid;
    var url = this.baseUrl + "api/product/UploadProductData";
    return this.http.post<any>(url,data);
  }

  fetchRecommendedProduct(data) {
    this.getUserData();
    var obj = { companyid: this.userData.companyid, financialyearid: this.yearData, antecedents : data };
    var urlfinal = this.baseUrl + "api/recommendation/FetchRecommendedProduct";

    $.ajax({
      type: 'POST',
      url: urlfinal,
      data: obj,
      headers: {
        Authorization: localStorage["stockmtoken"]
      }, success: (result) => {

        if (result && result.status && result.data && result.data.length > 0) {
          var _list = [];
          result.data.forEach(x => {
            _list.push(x.productname);
          });
          var displaytext = "There is a good chance that customers will also buy " + _list.join(", ") + ". Try asking if they would also like to buy these.";
          this.toastr.success(displaytext,'New Message', {timeOut:9500});
        }

      },
      error: (result2) => {
      }
    })


  }

  fetchRecommendedPurchaseQuantity(data) {
    this.getUserData();
    var obj = { companyid: this.userData.companyid, financialyearid: this.yearData, productmasterid: data.productmasterid };
    var urlfinal = this.baseUrl + "api/recommendation/FetchRecommendedPurchaseQuantity";

    $.ajax({
      type: 'POST',
      url: urlfinal,
      data: obj,
      headers: {
        Authorization: localStorage["stockmtoken"]
      }, success: (result) => {

        if (result && result.status && result.data && result.data.length > 0) {
          var qty = result.data[0].idealpurchasequantity;
          var primary = "";
          if (data.productstock) {
            primary = "Your current stock in bizman is " + data.productstock.toString() + ". "
          }
          var displaytext = primary +"Based on bizman analysis, the ideal purchase quantity for " + data.productname + " should be around " + qty.toString() + ". Considering holding cost as 10% of per unit sell price " ;
          this.toastr.success(displaytext);
        }

      },
      error: (result2) => {
      }
    })


  }

  getUserData() {
    if (localStorage["userdata"]) {
      this.userData = JSON.parse(localStorage["userdata"]);
    }
  }
}
