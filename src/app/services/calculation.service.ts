import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CalculationService {

  userData: any = {};

  constructor(private http: HttpClient,

    private router: Router,
    @Inject('BASE_URL') private baseUrl: string) {

    if (localStorage["userdata"]) {
      this.userData = JSON.parse(localStorage["userdata"]);
    }

  }


  productDiscountTotalCalculation(data) {
    for (var i = 0; i < data.billProductDetails.length; i++) {
      data.billProductDetails[i].producttaxableamount = Math.round((data.billProductDetails[i].productrate * data.billProductDetails[i].productquantity)*100)/100
    }
    data.billdiscountamount = 0;

    if (data.billdiscountpercent) {
      console.log(data.billdiscountpercent)
      var discountvalue = data.billdiscountpercent / 100;
      data.billtaxableamount = 0
      for (var i = 0; i < data.billProductDetails.length; i++) {
        data.billProductDetails[i].producttaxableamount = data.billProductDetails[i].productrate * data.billProductDetails[i].productquantity
        data.billtaxableamount = data.billtaxableamount + data.billProductDetails[i].producttaxableamount;
        data.billProductDetails[i].producttaxableamount = Math.round((data.billProductDetails[i].producttaxableamount - (data.billProductDetails[i].producttaxableamount * discountvalue)) * 100) / 100;
      }

      data.billdiscountamount = Math.round((data.billtaxableamount * discountvalue) * 100) / 100;
    }

      return data.billdiscountamount;
    
  }


  subTotalCalculationAmount(data) {
    data.billtaxableamount = 0;
    var subTotal = 0;
    for (var a = 0; a < data.billProductDetails.length; a++) {
      subTotal = subTotal + +data.billProductDetails[a].producttaxableamount;
      data.billtaxableamount = subTotal;
    }
    return Math.round(data.billtaxableamount * 100) / 100;
  }



  calculateBillTotalTax(data) {
    for (var j = 0; j < data.billProductDetails.length; j++) {

      var taxamount = 0;
      var igstamount = 0;
      var sgstamount = 0;
      var cgstamount = 0;

      taxamount = Math.round((data.billProductDetails[j].producttaxableamount * data.billProductDetails[j].taxdata / 100) * 100) / 100;

      if (data.sourceofsupplyid == data.destinationsupplyid) {
        cgstamount = Math.round((taxamount / 2) * 100) / 100;
        sgstamount = Math.round((taxamount / 2) * 100) / 100;
      }
      else {
        igstamount = Math.round(taxamount * 100) / 100;
      }

      if (data.billtaxdetails.length > 0) {
        var isfound = false;
        for (var i = 0; i < data.billtaxdetails.length; i++) {
          if (data.billProductDetails[j].taxdata == data.billtaxdetails[i].taxkeydata) {
            isfound = true;
            data.billtaxdetails[i].taxamount = taxamount + data.billtaxdetails[i].taxamount;
            data.billtaxdetails[i].igstamount = Math.round((igstamount + data.billtaxdetails[i].igstamount) * 100) / 100;
            data.billtaxdetails[i].sgstamount = Math.round((sgstamount + data.billtaxdetails[i].sgstamount) * 100) / 100;
            data.billtaxdetails[i].cgstamount = Math.round((cgstamount + data.billtaxdetails[i].cgstamount) * 100) / 100;
            data.billtaxdetails[i].producttotal = data.billtaxdetails[i].producttotal + data.billProductDetails[j].producttaxableamount;

          }
        }
        if (!isfound) {
          var obj = {
            taxamount: taxamount, taxkeydata: data.billProductDetails[j].taxdata,
            sgstamount: Math.round(sgstamount * 100) / 100,
            igstamount: Math.round(igstamount * 100) / 100,
            cgstamount: Math.round(cgstamount * 100) / 100, producttotal: data.billProductDetails[j].producttaxableamount

          };
          data.billtaxdetails.push(obj);


        }
      }
      else {
        var newObj = {
          taxamount: taxamount, taxkeydata: data.billProductDetails[j].taxdata,
          sgstamount: Math.round(sgstamount * 100) / 100,
          igstamount: Math.round(igstamount * 100) / 100,
          cgstamount: Math.round(cgstamount * 100) / 100, producttotal: data.billProductDetails[j].producttaxableamount
        };
        data.billtaxdetails.push(newObj);

      }
    }

    return data.billtaxdetails;
  }

  addProductQuantity(event: any, item) {

    var Result = item.productrate * event.target.value;
    item.producttaxableamount = Result;
    return Result;
  }


  addProductRate(event: any, item) {
    var rate = event.target.value;
    item.producttaxableamount = rate * item.productquantity;
    return item.producttaxableamount;
  }

  calculateBillTotalAmount(data) {

    if (data.billtaxdetails.length == 0) {
      data.billdiscountpercent = 0;
      data.invoicefreightcharge = 0;
      data.billadjustmentamount = 0
      data.billtotalamount = 0;
      data.billtaxableamount=0;
    }

    data.billtotalamount = 0;
    var total = 0;
    total = data.billtaxableamount;

    for (var i = 0; i < data.billtaxdetails.length; i++) {
      total = total + data.billtaxdetails[i].sgstamount + data.billtaxdetails[i].cgstamount +
        data.billtaxdetails[i].igstamount;
    }

    if (data.invoicefreightcharge) {
      total = total + +data.invoicefreightcharge;
    }

    if (data.billadjustmentamount) {
      total = total + +data.billadjustmentamount;
      console.log(total + +data.billadjustmentamount);
    }

    data.billtotalamount = Math.round(total * 100) / 100;
    console.log(data.billtotalamount);

    data.amountdue = total;
    Math.round(data.amountdue * 100) / 100;

    return data.billtotalamount;
  }


  billTotalTaxAmount(data) {
    var total = 0;
    for (var i = 0; i < data.billtaxdetails.length; i++) {
      total = total + data.billtaxdetails[i].sgstamount + data.billtaxdetails[i].cgstamount +
        data.billtaxdetails[i].igstamount;
      data.billtotaltaxamount = Math.round(total * 100) / 100;
    }
    return data.billtotaltaxamount;
  }

  //------------------invoice calculation--------------------


  subTotalInvoiceCalculation(data) {
    var subTotal = 0;
    for (var a = 0; a < data.invoiceProductDetails.length; a++) {
      subTotal = subTotal + +data.invoiceProductDetails[a].producttaxableamount;
      data.invoicetaxableamount = Math.round(subTotal * 100) / 100;
      console.log(data.invoicetaxableamount);
    }
    return data.invoicetaxableamount;
  }



  invoiceProductCalculation(item) {

    item.producttaxableamount = item.productrate * item.productquantity;

    var discountvalue = 0;
    var totalDiscount = 0;
    if (item.productdiscountpercent) {
      discountvalue = item.productdiscountpercent / 100;
    }

    totalDiscount = Math.round((item.producttaxableamount * discountvalue) * 100) / 100;
    item.productdiscountamount = totalDiscount;
    item.producttaxableamount = item.producttaxableamount - totalDiscount;

    return Math.round(item.producttaxableamount*100)/100;
  }


  calculateInvoiceTotalAmount(data) {

    if (data.invoicetaxdetails.length == 0) {
      data.invoicediscountpercent = 0;
      data.invoicefreightcharge = 0;
      data.invoiceadjustmentamount = 0;
      data.invoicetotalamount = 0;
      data.invoicetaxableamount=0;
    }

    data.invoicetotalamount = 0;
    var total = 0;
    total = data.invoicetaxableamount;
    console.log(total);

    for (var i = 0; i < data.invoicetaxdetails.length; i++) {
      total = Math.round((total + data.invoicetaxdetails[i].sgstamount + data.invoicetaxdetails[i].cgstamount +
        data.invoicetaxdetails[i].igstamount) * 100) / 100;
    }

    if (data.invoicefreightcharge) {
      total = total + +Math.round(data.invoicefreightcharge * 100)/100;
    }

    if (data.invoiceadjustmentamount) {
      total = total + +Math.round(data.invoiceadjustmentamount * 100)/100;

    }

    data.invoicetotalamount = Math.round(total * 100) / 100;
    console.log(data.invoicetotalamount);

    data.amountdue = Math.round(total * 100) / 100;

    return data.invoicetotalamount;
  }


  calculateInvoiceTaxAmount(data) {

    console.log(data);

    for (var j = 0; j < data.invoiceProductDetails.length; j++) {

      var taxamount = 0;
      var igstamount = 0;
      var sgstamount = 0;
      var cgstamount = 0; 

      taxamount = data.invoiceProductDetails[j].producttaxableamount * data.invoiceProductDetails[j].taxdata / 100;
      if (data.productsupplyid == this.userData.companystateid) {
        cgstamount = Math.round((taxamount / 2) * 100) / 100;
        sgstamount = Math.round((taxamount / 2) * 100) / 100;
      }
      else {
        igstamount = Math.round(taxamount * 100) / 100;
      }

      if (data.invoicetaxdetails.length > 0) {
        var isfound = false;
        for (var i = 0; i < data.invoicetaxdetails.length; i++) {
          if (data.invoiceProductDetails[j].taxdata == data.invoicetaxdetails[i].taxkeydata) {
            isfound = true;
            data.invoicetaxdetails[i].taxamount = taxamount + data.invoicetaxdetails[i].taxamount;
            data.invoicetaxdetails[i].igstamount = Math.round((igstamount + data.invoicetaxdetails[i].igstamount) * 100) / 100;
            data.invoicetaxdetails[i].sgstamount = Math.round((sgstamount + data.invoicetaxdetails[i].sgstamount) * 100) / 100;
            data.invoicetaxdetails[i].cgstamount = Math.round((cgstamount + data.invoicetaxdetails[i].cgstamount) * 100) / 100;
            data.invoicetaxdetails[i].producttotal = data.invoicetaxdetails[i].producttotal + data.invoiceProductDetails[j].producttaxableamount;

          }
        }
        if (!isfound) {
          var obj = {
            taxamount: taxamount, taxkeydata: data.invoiceProductDetails[j].taxdata,
            sgstamount: Math.round(sgstamount * 100) / 100,
            igstamount: Math.round(igstamount * 100) / 100,
            cgstamount: Math.round(cgstamount * 100) / 100,
            producttotal: data.invoiceProductDetails[j].producttaxableamount

          };
          data.invoicetaxdetails.push(obj);
        }
      }
      else {
        var newObj = {
          taxamount: taxamount, taxkeydata: data.invoiceProductDetails[j].taxdata,
          sgstamount: Math.round(sgstamount * 100) / 100,
          igstamount: Math.round(igstamount * 100) / 100,
          cgstamount: Math.round(cgstamount * 100) / 100, producttotal: data.invoiceProductDetails[j].producttaxableamount
        };
        data.invoicetaxdetails.push(newObj);

      }
    }


    if (data.invoicefreightcharge) {
      var taxamount = 0;
      var igstamount = 0;
      var sgstamount = 0;
      var cgstamount = 0;

      taxamount = data.invoicefreightcharge * data.invoiceProductDetails[0].taxdata / 100;
      if (data.productsupplyid == this.userData.companystateid) {
        cgstamount = Math.round((taxamount / 2) * 100) / 100;
        sgstamount = Math.round((taxamount / 2) * 100) / 100;
      }
      else {
        igstamount = Math.round(taxamount * 100) / 100;
      }


       if (data.invoicetaxdetails.length > 0) {
        var isfound = false;
        for (var i = 0; i < data.invoicetaxdetails.length; i++) {
          if (data.invoiceProductDetails[0].taxdata == data.invoicetaxdetails[i].taxkeydata) {
            isfound = true;
            data.invoicetaxdetails[i].taxamount = taxamount + data.invoicetaxdetails[i].taxamount;
            data.invoicetaxdetails[i].igstamount = Math.round((igstamount + data.invoicetaxdetails[i].igstamount) * 100) / 100;
            data.invoicetaxdetails[i].sgstamount = Math.round((sgstamount + data.invoicetaxdetails[i].sgstamount) * 100) / 100;
            data.invoicetaxdetails[i].cgstamount = Math.round((cgstamount + data.invoicetaxdetails[i].cgstamount) * 100) / 100;
            data.invoicetaxdetails[i].producttotal = data.invoicetaxdetails[i].producttotal + data.invoicefreightcharge;

          }
        }
        if (!isfound) {
          var obj = {
            taxamount: taxamount, taxkeydata: data.invoiceProductDetails[j].taxdata,
            sgstamount: Math.round(sgstamount * 100) / 100,
            igstamount: Math.round(igstamount * 100) / 100,
            cgstamount: Math.round(cgstamount * 100) / 100,
            producttotal: data.invoiceProductDetails[j].producttaxableamount

          };
          data.invoicetaxdetails.push(obj);
        }
      }
      else {
        var newObj = {
          taxamount: taxamount, taxkeydata: data.invoiceProductDetails[j].taxdata,
          sgstamount: Math.round(sgstamount * 100) / 100,
          igstamount: Math.round(igstamount * 100) / 100,
          cgstamount: Math.round(cgstamount * 100) / 100, producttotal: data.invoiceProductDetails[j].producttaxableamount
        };
        data.invoicetaxdetails.push(newObj);

      }

    }

    return data.invoicetaxdetails;
  }


  invoiceTotalTaxAmount(data) {
    var total = 0;
    for (var i = 0; i < data.invoicetaxdetails.length; i++) {
      total = total + data.invoicetaxdetails[i].sgstamount + data.invoicetaxdetails[i].cgstamount +
        data.invoicetaxdetails[i].igstamount;
      data.invoicetotaltaxamount = Math.round(total * 100) / 100;
    }
    return data.invoicetotaltaxamount;
  }

  //--------------------------------------paymentsmade-------------------------------

  paymentsmadePaidValueAmount(data) {
    var total = 0;
    for (var i = 0; i < data.billpaymentdetails.length; i++) {
      total = total + +data.billpaymentdetails[i].billamountpaid;
    }
    data.billtotalamountpaid = Math.round(total * 100) / 100;

    return data.billtotalamountpaid;
  }

  //--------------------------------------payment-------------------------------

  paymentPaidValue(data) {
    var total = 0;
    for (var i = 0; i < data.invoicepaymentdetails.length; i++) {
      total = total + +data.invoicepaymentdetails[i].invoiceamountpaid;
    }
    data.totalamountpaid = Math.round(total * 100) / 100;
    return data.totalamountpaid;
  }


  //------------------debit calculation--------------------

  debitproductDiscount(data) {


    for (var i = 0; i < data.debitproductdetails.length; i++) {
      data.debitproductdetails[i].producttaxableamount = Math.round((data.debitproductdetails[i].productrate * data.debitproductdetails[i].productquantity)*100)/100
    }
    data.debitdiscountamount = 0;

    if (data.debitdiscountpercent) {
      console.log(data.debitdiscountpercent)
      var discountvalue = data.debitdiscountpercent / 100;
      data.debittaxableamount = 0
      for (var i = 0; i < data.debitproductdetails.length; i++) {
        data.debitproductdetails[i].producttaxableamount = data.debitproductdetails[i].productrate * data.debitproductdetails[i].productquantity
        data.debittaxableamount = data.debittaxableamount + data.debitproductdetails[i].producttaxableamount;
        data.debitproductdetails[i].producttaxableamount = Math.round((data.debitproductdetails[i].producttaxableamount - (data.debitproductdetails[i].producttaxableamount * discountvalue)) * 100) / 100;
      }

      data.debitdiscountamount = Math.round((data.debittaxableamount * discountvalue) * 100) / 100;
    }

    return data.debitdiscountamount;

  }



  calculateDebitTotalTax(data) {

    for (var j = 0; j < data.debitproductdetails.length; j++) {

      var taxamount = 0;
      var igstamount = 0;
      var sgstamount = 0;
      var cgstamount = 0;


      taxamount = Math.round((data.debitproductdetails[j].producttaxableamount * data.debitproductdetails[j].taxdata / 100) * 100) / 100;


      if (data.sourcesupplyid == data.destinationsupplyid) {
        cgstamount = Math.round((taxamount / 2) * 100) / 100;
        sgstamount = Math.round((taxamount / 2) * 100) / 100;
      }
      else {
        igstamount = Math.round(taxamount * 100) / 100;
      }

      if (data.debittaxdetails.length > 0) {
        var isfound = false;
        for (var i = 0; i < data.debittaxdetails.length; i++) {
          if (data.debitproductdetails[j].taxdata == data.debittaxdetails[i].taxkeydata) {
            isfound = true;
            data.debittaxdetails[i].taxamount = taxamount + data.debittaxdetails[i].taxamount;
            data.debittaxdetails[i].igstamount = Math.round((igstamount + data.debittaxdetails[i].igstamount) * 100) / 100;
            data.debittaxdetails[i].sgstamount = Math.round((sgstamount + data.debittaxdetails[i].sgstamount) * 100) / 100;
            data.debittaxdetails[i].cgstamount = Math.round((cgstamount + data.debittaxdetails[i].cgstamount) * 100) / 100;
            data.debittaxdetails[i].producttotal = data.debittaxdetails[i].producttotal + data.debitproductdetails[j].producttaxableamount;

          }
        }
        if (!isfound) {
          var obj = {
            taxamount: taxamount, taxkeydata: data.debitproductdetails[j].taxdata,
            sgstamount: Math.round(sgstamount * 100) / 100,
            igstamount: Math.round(igstamount * 100) / 100,
            cgstamount: Math.round(cgstamount * 100) / 100, producttotal: data.debitproductdetails[j].producttaxableamount

          };
          data.debittaxdetails.push(obj);


        }
      }
      else {
        var newObj = {
          taxamount: taxamount, taxkeydata: data.debitproductdetails[j].taxdata,
          sgstamount: Math.round(sgstamount * 100) / 100,
          igstamount: Math.round(igstamount * 100) / 100,
          cgstamount: Math.round(cgstamount * 100) / 100, producttotal: data.debitproductdetails[j].producttaxableamount
        };
        data.debittaxdetails.push(newObj);

      }
    }


    return data.debittaxdetails;
  }

  debitsubTotalCalculation(data) {
    data.debittaxableamount = 0;
    var subTotal = 0;
    for (var a = 0; a < data.debitproductdetails.length; a++) {
      subTotal = subTotal + +data.debitproductdetails[a].producttaxableamount;
      data.debittaxableamount = subTotal;
    }
    return Math.round(data.debittaxableamount*100)/100;
  }

  debitTaxAmount(data) {
    var total = 0;
    for (var i = 0; i < data.debittaxdetails.length; i++) {
      total = total + data.debittaxdetails[i].sgstamount + data.debittaxdetails[i].cgstamount +
        data.debittaxdetails[i].igstamount;
      data.debittotaltaxamount = Math.round(total * 100) / 100;
    }
    return data.debittotaltaxamount;
  }


  calculateDebitTotalAmount(data) {

    if (data.debittaxdetails.length == 0) {
      data.debitdiscountpercent = 0;
      data.debitshippingcharge = 0;
      data.debitadjustmentamount = 0;
      data.debittotalamount = 0;
      data.debittaxableamount=0;
    }

    data.debittotalamount = 0;
    var total = 0;
    total = data.debittaxableamount;

    
    for (var i = 0; i < data.debittaxdetails.length; i++) {
      total = total + data.debittaxdetails[i].sgstamount + data.debittaxdetails[i].cgstamount +
        data.debittaxdetails[i].igstamount;
    }

    if (data.debitshippingcharge) {
      total = total + +data.debitshippingcharge;
    }

    if (data.debitadjustmentamount) {
      total = total + +data.debitadjustmentamount;
      console.log(total + +data.debitadjustmentamount);
    }

    data.debittotalamount = Math.round(total * 100) / 100;
    console.log(data.debittotalamount);

    //data.amountdue = total;
    //Math.round(data.amountdue * 100) / 100;

    return data.debittotalamount;

  }





  //------------------credit calculation--------------------




  creditsubTotalCalculation(data) {
    var subTotal = 0;
    for (var a = 0; a < data.creditproductdetails.length; a++) {
      subTotal = subTotal + +data.creditproductdetails[a].producttaxableamount;
      data.credittaxableamount = Math.round(subTotal * 100) / 100;
      console.log(data.credittaxableamount);
    }
    return data.credittaxableamount;
  }



  creditProductCalculation(item)
  {
    item.producttaxableamount = item.productrate;
    item.producttaxableamount = item.productrate * item.productquantity;
    var discountvalue = 0;
    var totalDiscount = 0;
    if (item.productdiscountpercent) {
      discountvalue = item.productdiscountpercent / 100;
    }
    console.log(discountvalue);
    totalDiscount = Math.round((item.producttaxableamount * discountvalue) * 100) / 100;
    item.productdiscountamount = totalDiscount;
    item.producttaxableamount = item.producttaxableamount - totalDiscount;
    return Math.round(item.producttaxableamount*100)/100;
  }

  calculateCreditTotalAmount(data) {
    if (data.credittaxdetails.length == 0) {
      data.creditdiscountpercent = 0;
      data.creditshippingcharge = 0;
      data.creditadjustmentamount = 0;
      data.credittotalamount = 0;
      data.credittaxableamount=0;
    }


    data.credittotalamount = 0;
    var total = 0;
    total = data.credittaxableamount;
    console.log(total);

    for (var i = 0; i < data.credittaxdetails.length; i++) {
      total = Math.round((total + data.credittaxdetails[i].sgstamount + data.credittaxdetails[i].cgstamount +
        data.credittaxdetails[i].igstamount) * 100) / 100;
    }

    if (data.creditshippingcharge) {
      total = total + +data.creditshippingcharge;
    }

    if (data.creditadjustmentamount) {
      total = total + +data.creditadjustmentamount;

    }

    data.credittotalamount = total;
    Math.round(data.credittotalamount * 100) / 100;
    console.log(data.credittotalamount);

    data.amountdue = total;
    Math.round(data.amountdue * 100) / 100;

    return data.credittotalamount;
  }


  calculateCreditTaxAmount(data) {

    for (var j = 0; j < data.creditproductdetails.length; j++) {

      var taxamount = 0;
      var igstamount = 0;
      var sgstamount = 0;
      var cgstamount = 0;

      taxamount = data.creditproductdetails[j].producttaxableamount *
        data.creditproductdetails[j].taxdata / 100;

      if (data.productsupplyid == this.userData.companystateid) {
        cgstamount = Math.round((taxamount / 2) * 100) / 100;
        sgstamount = Math.round((taxamount / 2) * 100) / 100;
      }
      else {
        igstamount = Math.round(taxamount * 100) / 100;
      }

      if (data.credittaxdetails.length > 0) {
        var isfound = false;
        for (var i = 0; i < data.credittaxdetails.length; i++) {
          if (data.creditproductdetails[j].taxdata == data.credittaxdetails[i].taxkeydata) {
            isfound = true;
            data.credittaxdetails[i].taxamount = taxamount + data.credittaxdetails[i].taxamount;
            data.credittaxdetails[i].igstamount = Math.round((igstamount + data.credittaxdetails[i].igstamount) * 100) / 100;
            data.credittaxdetails[i].sgstamount = Math.round((sgstamount + data.credittaxdetails[i].sgstamount) * 100) / 100;
            data.credittaxdetails[i].cgstamount = Math.round((cgstamount + data.credittaxdetails[i].cgstamount) * 100) / 100;
            data.credittaxdetails[i].producttotal = data.credittaxdetails[i].producttotal + data.creditproductdetails[j].producttaxableamount;

          }
        }
        if (!isfound) {
          var obj = {
            taxamount: taxamount, taxkeydata: data.creditproductdetails[j].taxdata,
            sgstamount: Math.round(sgstamount * 100) / 100,
            igstamount: Math.round(igstamount * 100) / 100,
            cgstamount: Math.round(cgstamount * 100) / 100, producttotal: data.creditproductdetails[j].producttaxableamount

          };
          data.credittaxdetails.push(obj);
        }
      }
      else {
        var newObj = {
          taxamount: taxamount, taxkeydata: data.creditproductdetails[j].taxdata,
          sgstamount: Math.round(sgstamount * 100) / 100,
          igstamount: Math.round(igstamount * 100) / 100,
          cgstamount: Math.round(cgstamount * 100) / 100, producttotal: data.creditproductdetails[j].producttaxableamount
        };
        data.credittaxdetails.push(newObj);

      }
    }
    return data.credittaxdetails;
  }


  creditTotalTaxAmount(data) {
    var total = 0;
    for (var i = 0; i < data.credittaxdetails.length; i++) {
      total = total + data.credittaxdetails[i].sgstamount + data.credittaxdetails[i].cgstamount +
        data.credittaxdetails[i].igstamount;
      data.credittotaltaxamount = Math.round(total * 100) / 100;
    }
    return data.credittotaltaxamount;
  }


  /* ESTIMATE */


  subTotalEstimateCalculation(data) {
    var subTotal = 0;
    for (var a = 0; a < data.estimateProductDetails.length; a++) {
      subTotal = subTotal + +data.estimateProductDetails[a].producttaxableamount;
      data.estimatetaxableamount = Math.round(subTotal * 100) / 100;
    }

    return data.estimatetaxableamount;
  }



  estimateProductCalculation(item) {

    item.producttaxableamount = item.productrate;
    item.producttaxableamount = item.productrate * item.productquantity;

    var discountvalue = 0;
    var totalDiscount = 0;
    if (item.productdiscountpercent) {
      discountvalue = (item.productdiscountpercent / 100);
    }

    totalDiscount = Math.round((item.producttaxableamount * discountvalue) * 100) / 100;
    item.productdiscountamount = totalDiscount;
    item.producttaxableamount = item.producttaxableamount - totalDiscount;

    return Math.round(item.producttaxableamount*100)/100;
  }




  calculateEstimateTotalAmount(data) {

    if (data.estimatetaxdetails.length == 0) {
      data.estimatediscountpercent = 0;
      data.estimateshippingcharge = 0;
      data.estimateadjustmentamount = 0
     data.estimatetaxableamount=0;
    data.estimatetotalamount = 0;
    }

    data.estimatetotalamount = 0;
    var total = 0;
    total = data.estimatetaxableamount;

    for (var i = 0; i < data.estimatetaxdetails.length; i++) {
      total = Math.round((total + data.estimatetaxdetails[i].sgstamount + data.estimatetaxdetails[i].cgstamount + data.estimatetaxdetails[i].igstamount) * 100) / 100;
    }

    if (data.estimateshippingcharge) {
      total = total + +data.estimateshippingcharge;
    }

    if (data.estimateadjustmentamount) {
      total = total + +data.estimateadjustmentamount;

    }

    data.estimatetotalamount = Math.round(total * 100) / 100;


    data.amountdue = total;
    Math.round(data.amountdue * 100) / 100;

    return data.estimatetotalamount;
  }


  calculateEstimateTaxAmount(data) {

    for (var j = 0; j < data.estimateProductDetails.length; j++) {

      var taxamount = 0;
      var igstamount = 0;
      var sgstamount = 0;
      var cgstamount = 0;

      taxamount = data.estimateProductDetails[j].producttaxableamount * data.estimateProductDetails[j].taxdata / 100;

      if (data.placeofstatesupplyid == this.userData.companystateid) {
        cgstamount = Math.round((taxamount / 2) * 100) / 100;
        sgstamount = Math.round((taxamount / 2) * 100) / 100;
      }
      else {
        igstamount = Math.round(taxamount * 100) / 100;
      }

      if (data.estimatetaxdetails.length > 0) {
        var isfound = false;
        for (var i = 0; i < data.estimatetaxdetails.length; i++) {
          if (data.estimateProductDetails[j].taxdata == data.estimatetaxdetails[i].taxkeydata) {
            isfound = true;
            data.estimatetaxdetails[i].taxamount = taxamount + data.estimatetaxdetails[i].taxamount;
            data.estimatetaxdetails[i].igstamount = Math.round((igstamount + data.estimatetaxdetails[i].igstamount) * 100) / 100;
            data.estimatetaxdetails[i].sgstamount = Math.round((sgstamount + data.estimatetaxdetails[i].sgstamount) * 100) / 100;
            data.estimatetaxdetails[i].cgstamount = Math.round((cgstamount + data.estimatetaxdetails[i].cgstamount) * 100) / 100;
            data.estimatetaxdetails[i].producttotal = data.estimatetaxdetails[i].producttotal + data.estimateProductDetails[j].producttaxableamount;

          }
        }
        if (!isfound) {
          var obj = {
            taxamount: taxamount, taxkeydata: data.estimateProductDetails[j].taxdata,
            sgstamount: Math.round(sgstamount * 100) / 100,
            igstamount: Math.round(igstamount * 100) / 100,
            cgstamount: Math.round(cgstamount * 100) / 100, producttotal: data.estimateProductDetails[j].producttaxableamount

          };
          data.estimatetaxdetails.push(obj);
        }
      }
      else {
        var newObj = {
          taxamount: taxamount, taxkeydata: data.estimateProductDetails[j].taxdata,
          sgstamount: Math.round(sgstamount * 100) / 100,
          igstamount: Math.round(igstamount * 100) / 100,
          cgstamount: Math.round(cgstamount * 100) / 100, producttotal: data.estimateProductDetails[j].producttaxableamount
        };
        data.estimatetaxdetails.push(newObj);

      }
    }
    return data.estimatetaxdetails;
  }


  estimateTotalTaxAmount(data) {
    var total = 0;
    for (var i = 0; i < data.estimatetaxdetails.length; i++) {
      total = total + data.estimatetaxdetails[i].sgstamount + data.estimatetaxdetails[i].cgstamount +
        data.estimatetaxdetails[i].igstamount;
      data.estimatetotaltaxamount = Math.round(total * 100) / 100;
    }
    return data.estimatetotaltaxamount;
  }




  //------------------challan calculation--------------------


  subTotalChallanCalculation(data) {
    var subTotal = 0;
    for (var a = 0; a < data.deliveryproductdetails.length; a++) {
      subTotal = subTotal + +data.deliveryproductdetails[a].producttaxableamount;
      data.deliverytaxableamount = Math.round(subTotal * 100) / 100;
      console.log(data.deliverytaxableamount);
    }
    return data.deliverytaxableamount;
  }



  challanProductCalculation(item) {

    item.producttaxableamount = item.productrate;
    item.producttaxableamount = item.productrate * item.productquantity;

    var discountvalue = 0;
    var totalDiscount = 0;
    if (item.productdiscountpercent) {
      discountvalue = item.productdiscountpercent / 100;
    }
    console.log(discountvalue);

    totalDiscount = Math.round((item.producttaxableamount * discountvalue) * 100) / 100;
    item.productdiscountamount = totalDiscount;
    item.producttaxableamount = item.producttaxableamount - totalDiscount;

    return Math.round(item.producttaxableamount*100)/100;
  }


  calculateChallanTotalAmount(data) {

    if (data.deliverytaxdetails.length == 0) {
      data.deliverydiscountpercent = 0;
      data.deliveryshippingcharge = 0;
      data.deliveryadjustmentamount = 0;
      data.deliverytotalamount = 0;
      data.deliverytaxableamount=0;
    }

    data.deliverytotalamount = 0;
    var total = 0;
    total = data.deliverytaxableamount;
    console.log(total);

    for (var i = 0; i < data.deliverytaxdetails.length; i++) {
      total = Math.round((total + data.deliverytaxdetails[i].sgstamount + data.deliverytaxdetails[i].cgstamount +
        data.deliverytaxdetails[i].igstamount) * 100) / 100;
    }

    if (data.deliveryshippingcharge) {
      total = total + +data.deliveryshippingcharge;
    }

    if (data.deliveryadjustmentamount) {
      total = total + +data.deliveryadjustmentamount;

    }

    data.deliverytotalamount = total;
    Math.round(data.deliverytotalamount * 100) / 100;
    console.log(data.deliverytotalamount);

    data.amountdue = total;
    Math.round(data.amountdue * 100) / 100;

    return data.deliverytotalamount;
  }


  calculateChallanTaxAmount(data) {

    for (var j = 0; j < data.deliveryproductdetails.length; j++) {

      var taxamount = 0;
      var igstamount = 0;
      var sgstamount = 0;
      var cgstamount = 0;

      taxamount = data.deliveryproductdetails[j].producttaxableamount *
        data.deliveryproductdetails[j].taxdata / 100;

      if (data.placeofsupplyid == this.userData.companystateid) {
        cgstamount = Math.round((taxamount / 2) * 100) / 100;
        sgstamount = Math.round((taxamount / 2) * 100) / 100;
      }
      else {
        igstamount = Math.round(taxamount * 100) / 100;
      }

      if (data.deliverytaxdetails.length > 0) {
        var isfound = false;
        for (var i = 0; i < data.deliverytaxdetails.length; i++) {
          if (data.deliveryproductdetails[j].taxdata == data.deliverytaxdetails[i].taxkeydata) {
            isfound = true;
            data.deliverytaxdetails[i].taxamount = taxamount + data.deliverytaxdetails[i].taxamount;
            data.deliverytaxdetails[i].igstamount = Math.round((igstamount + data.deliverytaxdetails[i].igstamount) * 100) / 100;
            data.deliverytaxdetails[i].sgstamount = Math.round((sgstamount + data.deliverytaxdetails[i].sgstamount) * 100) / 100;
            data.deliverytaxdetails[i].cgstamount = Math.round((cgstamount + data.deliverytaxdetails[i].cgstamount) * 100) / 100;
            data.deliverytaxdetails[i].producttotal = data.deliverytaxdetails[i].producttotal + data.deliveryproductdetails[j].producttaxableamount;

          }
        }
        if (!isfound) {
          var obj = {
            taxamount: taxamount, taxkeydata: data.deliveryproductdetails[j].taxdata,
            sgstamount: Math.round(sgstamount * 100) / 100,
            igstamount: Math.round(igstamount * 100) / 100,
            cgstamount: Math.round(cgstamount * 100) / 100, producttotal: data.deliveryproductdetails[j].producttaxableamount

          };
          data.deliverytaxdetails.push(obj);
        }
      }
      else {
        var newObj = {
          taxamount: taxamount, taxkeydata: data.deliveryproductdetails[j].taxdata,
          sgstamount: Math.round(sgstamount * 100) / 100,
          igstamount: Math.round(igstamount * 100) / 100,
          cgstamount: Math.round(cgstamount * 100) / 100, producttotal: data.deliveryproductdetails[j].producttaxableamount
        };
        data.deliverytaxdetails.push(newObj);

      }
    }
    return data.deliverytaxdetails;
  }


  calculateTotaltaxamount(data) {
    var total = 0;
    for (var i = 0; i < data.deliverytaxdetails.length; i++) {
      total = total + data.deliverytaxdetails[i].sgstamount + data.deliverytaxdetails[i].cgstamount +
        data.deliverytaxdetails[i].igstamount;
      data.deliverytotaltaxamount = Math.round(total * 100) / 100;
    }
    return data.deliverytotaltaxamount;
  }


  //------------------salesorder calculation--------------------


  subTotalSalesorderCalculation(data) {
    var subTotal = 0;
    for (var a = 0; a < data.salesproductdetails.length; a++) {
      subTotal = subTotal + +data.salesproductdetails[a].producttaxableamount;
      data.salestaxableamount = Math.round(subTotal * 100) / 100;
      console.log(data.salestaxableamount);
    }
    return data.salestaxableamount;
  }



  SalesorderProductCalculation(item) {

    item.producttaxableamount = item.productrate;
    item.producttaxableamount = item.productrate * item.productquantity;

    var discountvalue = 0;
    var totalDiscount = 0;
    if (item.productdiscountpercent) {
      discountvalue = item.productdiscountpercent / 100;
    }
    console.log(discountvalue);

    totalDiscount = Math.round((item.producttaxableamount * discountvalue) * 100) / 100;
    item.productdiscountamount = totalDiscount;
    item.producttaxableamount = item.producttaxableamount - totalDiscount;

    return Math.round(item.producttaxableamount*100)/100;
  }


  calculateSalesorderTotalAmount(data) {

    if (data.salestaxdetails.length == 0) {
      data.salesdiscountpercent = 0;
      data.salesshippingcharge = 0;
      data.salesadjustmentamount = 0;
      data.salestotalamount = 0;
      data.salestaxableamount=0;
    }

    data.salestotalamount = 0;
    var total = 0;
    total = data.salestaxableamount;
    console.log(total);

    for (var i = 0; i < data.salestaxdetails.length; i++) {
      total = Math.round((total + data.salestaxdetails[i].sgstamount + data.salestaxdetails[i].cgstamount +
        data.salestaxdetails[i].igstamount) * 100) / 100;
    }

    if (data.salesshippingcharge) {
      total = total + +data.salesshippingcharge;
    }

    if (data.salesadjustmentamount) {
      total = total + +data.salesadjustmentamount;

    }

    data.salestotalamount = total;
    Math.round(data.salestotalamount * 100) / 100;
    console.log(data.salestotalamount);

    data.amountdue = total;
    Math.round(data.amountdue * 100) / 100;

    return data.salestotalamount;
  }


  calculateSalesorderTaxAmount(data) {

    for (var j = 0; j < data.salesproductdetails.length; j++) {

      var taxamount = 0;
      var igstamount = 0;
      var sgstamount = 0;
      var cgstamount = 0;

      taxamount = data.salesproductdetails[j].producttaxableamount *
        data.salesproductdetails[j].taxdata / 100;

      if (data.placeofsupplyid == this.userData.companystateid) {
        cgstamount = Math.round((taxamount / 2) * 100) / 100;
        sgstamount = Math.round((taxamount / 2) * 100) / 100;
      }
      else {
        igstamount = Math.round(taxamount * 100) / 100;
      }

      if (data.salestaxdetails.length > 0) {
        var isfound = false;
        for (var i = 0; i < data.salestaxdetails.length; i++) {
          if (data.salesproductdetails[j].taxdata == data.salestaxdetails[i].taxkeydata) {
            isfound = true;
            data.salestaxdetails[i].taxamount = taxamount + data.salestaxdetails[i].taxamount;
            data.salestaxdetails[i].igstamount = Math.round((igstamount + data.salestaxdetails[i].igstamount) * 100) / 100;
            data.salestaxdetails[i].sgstamount = Math.round((sgstamount + data.salestaxdetails[i].sgstamount) * 100) / 100;
            data.salestaxdetails[i].cgstamount = Math.round((cgstamount + data.salestaxdetails[i].cgstamount) * 100) / 100;
            data.salestaxdetails[i].producttotal = data.salestaxdetails[i].producttotal + data.salesproductdetails[j].producttaxableamount;

          }
        }
        if (!isfound) {
          var obj = {
            taxamount: taxamount, taxkeydata: data.salesproductdetails[j].taxdata,
            sgstamount: Math.round(sgstamount * 100) / 100,
            igstamount: Math.round(igstamount * 100) / 100,
            cgstamount: Math.round(cgstamount * 100) / 100, producttotal: data.salesproductdetails[j].producttaxableamount

          };
          data.salestaxdetails.push(obj);
        }
      }
      else {
        var newObj = {
          taxamount: taxamount, taxkeydata: data.salesproductdetails[j].taxdata,
          sgstamount: Math.round(sgstamount * 100) / 100,
          igstamount: Math.round(igstamount * 100) / 100,
          cgstamount: Math.round(cgstamount * 100) / 100, producttotal: data.salesproductdetails[j].producttaxableamount
        };
        data.salestaxdetails.push(newObj);

      }
    }
    return data.salestaxdetails;
  }


  SalesorderTotalTaxAmount(data) {
    var total = 0;
    for (var i = 0; i < data.salestaxdetails.length; i++) {
      total = total + data.salestaxdetails[i].sgstamount + data.salestaxdetails[i].cgstamount +
        data.salestaxdetails[i].igstamount;
      data.salestotaltaxamount = Math.round(total * 100) / 100;
    }
    return data.salestotaltaxamount;
  }

  //------------------customerportal salesorder calculation--------------------

  subTotalCustomerSalesCalculation(data) {
    var subTotal = 0;
    for (var a = 0; a < data.salesproductdetails.length; a++) {
      subTotal = subTotal + +data.salesproductdetails[a].producttaxableamount;
      data.salestaxableamount = Math.round(subTotal * 100) / 100;
      console.log(data.salestaxableamount);
    }
    return data.salestaxableamount;
  }

  CustomerSalesProductCalculation(item)
  {
    item.producttaxableamount = item.productrate;
    item.producttaxableamount = item.productrate * item.productquantity;
    return Math.round(item.producttaxableamount * 100) / 100;
  }

  calculateCustomerSalesTotalAmount(data) {

    if (data.salestaxdetails.length == 0) {
      data.salesdiscountpercent = 0;
      data.salesshippingcharge = 0;
      data.salesadjustmentamount = 0;
      data.salestotalamount = 0;
      data.salestaxableamount = 0;
    }

    data.salestotalamount = 0;
    var total = 0;
    total = data.salestaxableamount;
    console.log(total);

    for (var i = 0; i < data.salestaxdetails.length; i++) {
      total = Math.round((total + data.salestaxdetails[i].sgstamount + data.salestaxdetails[i].cgstamount +
        data.salestaxdetails[i].igstamount) * 100) / 100;
    }

    if (data.salesshippingcharge) {
      total = total + +data.salesshippingcharge;
    }

    if (data.salesadjustmentamount) {
      total = total + +data.salesadjustmentamount;
    }

    data.salestotalamount = total;
    Math.round(data.salestotalamount * 100) / 100;
    console.log(data.salestotalamount);

    data.amountdue = total;
    Math.round(data.amountdue * 100) / 100;

    return data.salestotalamount;
  }

  calculateCustomerSalesTaxAmount(data) {

    for (var j = 0; j < data.salesproductdetails.length; j++) {

      var taxamount = 0;
      var igstamount = 0;
      var sgstamount = 0;
      var cgstamount = 0;

      taxamount = data.salesproductdetails[j].producttaxableamount *
        data.salesproductdetails[j].taxdata / 100;
      if (data.placeofsupplyid == this.userData.companystateid) {
        cgstamount = Math.round((taxamount / 2) * 100) / 100;
        sgstamount = Math.round((taxamount / 2) * 100) / 100;
      }
      else {
        igstamount = Math.round(taxamount * 100) / 100;
      }

      if (data.salestaxdetails.length > 0) {
        var isfound = false;
        for (var i = 0; i < data.salestaxdetails.length; i++) {
          if (data.salesproductdetails[j].taxdata == data.salestaxdetails[i].taxkeydata) {
            isfound = true;
            data.salestaxdetails[i].taxamount = taxamount + data.salestaxdetails[i].taxamount;
            data.salestaxdetails[i].igstamount = Math.round((igstamount + data.salestaxdetails[i].igstamount) * 100) / 100;
            data.salestaxdetails[i].sgstamount = Math.round((sgstamount + data.salestaxdetails[i].sgstamount) * 100) / 100;
            data.salestaxdetails[i].cgstamount = Math.round((cgstamount + data.salestaxdetails[i].cgstamount) * 100) / 100;
            data.salestaxdetails[i].producttotal = data.salestaxdetails[i].producttotal + data.salesproductdetails[j].producttaxableamount;
          }
        }
        if (!isfound) {
          var obj = {
            taxamount: taxamount, taxkeydata: data.salesproductdetails[j].taxdata,
            sgstamount: Math.round(sgstamount * 100) / 100,
            igstamount: Math.round(igstamount * 100) / 100,
            cgstamount: Math.round(cgstamount * 100) / 100, producttotal: data.salesproductdetails[j].producttaxableamount

          };
          data.salestaxdetails.push(obj);
        }
      }
      else {
        var newObj = {
          taxamount: taxamount, taxkeydata: data.salesproductdetails[j].taxdata,
          sgstamount: Math.round(sgstamount * 100) / 100,
          igstamount: Math.round(igstamount * 100) / 100,
          cgstamount: Math.round(cgstamount * 100) / 100, producttotal: data.salesproductdetails[j].producttaxableamount
        };
        data.salestaxdetails.push(newObj);
      }
    }
    return data.salestaxdetails;
  }

  CustomerSalesTotalTaxAmount(data) {
    var total = 0;
    for (var i = 0; i < data.salestaxdetails.length; i++) {
      total = total + data.salestaxdetails[i].sgstamount + data.salestaxdetails[i].cgstamount +
        data.salestaxdetails[i].igstamount;
      data.salestotaltaxamount = Math.round(total * 100) / 100;
    }
    return data.salestotaltaxamount;
  }


  //-----------------expense--------------------------

  subTotalExpenseCalculation(data) {
    var subTotal = 0;
    for (var a = 0; a < data.expensedetails.length; a++) {
      subTotal = subTotal + +data.expensedetails[a].expenseamount;
      data.expensetaxableamount = Math.round(subTotal * 100) / 100;
      console.log(data.expensetaxableamount);
    }
    return data.expensetaxableamount;
  }

  // taxable invoice calculation

  taxableInvoiceCalculation(data) {
    var obj = {
      discountamount: 0,
      invoicetaxableamount: 0
    };

    var discountpercent = (data.invoicediscountpercent > 0) ? data.invoicediscountpercent : 0;
    obj.discountamount = data.invoicesubtotal * discountpercent / 100;
    console.log("discount",data.invoicesubtotal - (data.invoicesubtotal * discountpercent / 100))
    obj.invoicetaxableamount = data.invoicesubtotal - obj.discountamount;

    return obj;
  }


  //this is a new function created to calculate tax based on the common discount given. The only difference
  // is we are calculating product taxable amount here without chaning the model value. 
  calculateTotalInvoiceTaxAmount(data) {
    var discountpercent = 0.0;
    if (data.invoicediscountpercent && data.invoicediscountpercent > 0) {
      discountpercent = data.invoicediscountpercent;
    }

    for (var j = 0; j < data.invoiceProductDetails.length; j++) {

      var taxamount = 0;
      var igstamount = 0;
      var sgstamount = 0;
      var cgstamount = 0;
      var taxableamount = 0;
      var discountamount = 0;
      discountamount = data.invoiceProductDetails[j].producttaxableamount * (discountpercent / 100);
      taxableamount = data.invoiceProductDetails[j].producttaxableamount - discountamount;

      taxamount = taxableamount * data.invoiceProductDetails[j].taxdata / 100;
      if (data.productsupplyid == this.userData.companystateid) {
        cgstamount = Math.round((taxamount / 2) * 100) / 100;
        sgstamount = Math.round((taxamount / 2) * 100) / 100;
      }
      else {
        igstamount = Math.round(taxamount * 100) / 100;
      }

      if (data.invoicetaxdetails.length > 0) {
        var isfound = false;
        for (var i = 0; i < data.invoicetaxdetails.length; i++) {
          if (data.invoiceProductDetails[j].taxdata == data.invoicetaxdetails[i].taxkeydata) {
            isfound = true;
            data.invoicetaxdetails[i].taxamount = taxamount + data.invoicetaxdetails[i].taxamount;
            data.invoicetaxdetails[i].igstamount = Math.round((igstamount + data.invoicetaxdetails[i].igstamount) * 100) / 100;
            data.invoicetaxdetails[i].sgstamount = Math.round((sgstamount + data.invoicetaxdetails[i].sgstamount) * 100) / 100;
            data.invoicetaxdetails[i].cgstamount = Math.round((cgstamount + data.invoicetaxdetails[i].cgstamount) * 100) / 100;
            data.invoicetaxdetails[i].producttotal = data.invoicetaxdetails[i].producttotal + data.invoiceProductDetails[j].producttaxableamount;

          }
        }
        if (!isfound) {
          var obj = {
            taxamount: taxamount, taxkeydata: data.invoiceProductDetails[j].taxdata,
            sgstamount: Math.round(sgstamount * 100) / 100,
            igstamount: Math.round(igstamount * 100) / 100,
            cgstamount: Math.round(cgstamount * 100) / 100,
            producttotal: data.invoiceProductDetails[j].producttaxableamount

          };
          data.invoicetaxdetails.push(obj);
        }
      }
      else {
        var newObj = {
          taxamount: taxamount, taxkeydata: data.invoiceProductDetails[j].taxdata,
          sgstamount: Math.round(sgstamount * 100) / 100,
          igstamount: Math.round(igstamount * 100) / 100,
          cgstamount: Math.round(cgstamount * 100) / 100, producttotal: data.invoiceProductDetails[j].producttaxableamount
        };
        data.invoicetaxdetails.push(newObj);

      }
    }


    if (data.invoicefreightcharge) {
      var taxamount = 0;
      var igstamount = 0;
      var sgstamount = 0;
      var cgstamount = 0;

      taxamount = data.invoicefreightcharge * data.invoiceProductDetails[0].taxdata / 100;
      if (data.productsupplyid == this.userData.companystateid) {
        cgstamount = Math.round((taxamount / 2) * 100) / 100;
        sgstamount = Math.round((taxamount / 2) * 100) / 100;
      }
      else {
        igstamount = Math.round(taxamount * 100) / 100;
      }


      if (data.invoicetaxdetails.length > 0) {
        var isfound = false;
        for (var i = 0; i < data.invoicetaxdetails.length; i++) {
          if (data.invoiceProductDetails[0].taxdata == data.invoicetaxdetails[i].taxkeydata) {
            isfound = true;
            data.invoicetaxdetails[i].taxamount = taxamount + data.invoicetaxdetails[i].taxamount;
            data.invoicetaxdetails[i].igstamount = Math.round((igstamount + data.invoicetaxdetails[i].igstamount) * 100) / 100;
            data.invoicetaxdetails[i].sgstamount = Math.round((sgstamount + data.invoicetaxdetails[i].sgstamount) * 100) / 100;
            data.invoicetaxdetails[i].cgstamount = Math.round((cgstamount + data.invoicetaxdetails[i].cgstamount) * 100) / 100;
            data.invoicetaxdetails[i].producttotal = data.invoicetaxdetails[i].producttotal + data.invoicefreightcharge;

          }
        }
        if (!isfound) {
          var obj = {
            taxamount: taxamount, taxkeydata: data.invoiceProductDetails[j].taxdata,
            sgstamount: Math.round(sgstamount * 100) / 100,
            igstamount: Math.round(igstamount * 100) / 100,
            cgstamount: Math.round(cgstamount * 100) / 100,
            producttotal: data.invoiceProductDetails[j].producttaxableamount

          };
          data.invoicetaxdetails.push(obj);
        }
      }
      else {
        var newObj = {
          taxamount: taxamount, taxkeydata: data.invoiceProductDetails[j].taxdata,
          sgstamount: Math.round(sgstamount * 100) / 100,
          igstamount: Math.round(igstamount * 100) / 100,
          cgstamount: Math.round(cgstamount * 100) / 100, producttotal: data.invoiceProductDetails[j].producttaxableamount
        };
        data.invoicetaxdetails.push(newObj);

      }

    }

    return data.invoicetaxdetails;
  }


  checkPaymentAmountMatch(data):boolean {
    var total = data.paymentamount;
    var sumtotal = 0.0;
    data.invoicepaymentdetails.forEach(item => {
      sumtotal = sumtotal + parseFloat(item.paidamount);

    });


    console.log(total,'total');
    console.log(sumtotal,'sumtotal');
    if (total < sumtotal || total > sumtotal) {
      return false;
    } else {
      return true;
    }

  }


}

