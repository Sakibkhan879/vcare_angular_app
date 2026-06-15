import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PaymentService } from '../../../services/payment.service'; // Updated Service

import { NgxSmartModalService } from 'ngx-smart-modal';
 
declare var $: any;

@Component({
  selector: 'app-paymentlist',
  templateUrl: './paymentlist.component.html',
  styleUrls: ['./paymentlist.component.css']
})
export class PaymentlistComponent implements AfterViewInit {

  paymentList: any[] = [];
  currentPayment: any[] = [];
  companymasterid: number = 0

  constructor(
    private router: Router,
    private paymentService: PaymentService, // Injected PaymentService
    private toastr: ToastrService,
    public ngxSmartModalService: NgxSmartModalService
  ) { }



  ngAfterViewInit() {
    this.loadPayments();
  }


  refreshPage() {
    this.loadPayments();
  }

  loadPayments() {
    // Destroy old datatable instance if it exists
    if ($.fn.DataTable.isDataTable('.erp-datatable')) {
      $('.erp-datatable').DataTable().destroy();
    }

    // Using paymentListPromise from PaymentService
    this.paymentService.paymentListPromise().subscribe(result => {
      if (result?.status && result?.data?.length > 0) {
        this.paymentList = result.data;

        // Re-initialize DataTable after DOM updates
        setTimeout(() => {
          $('.erp-datatable').DataTable({
            ordering: false,
            pageLength: 10,
            retrieve: true
          });
        }, 0);

      } else {
        this.paymentList = [];
        if (result?.status === false) {
          this.toastr.warning(result.message || "No Data Found");
        }
      }
    }, error => {
      this.toastr.error("Failed to load payments");
    });
  }

  openMakePayment() {
    this.router.navigate(['app/payment/add']);
  }

  viewPayment(item: any) {
    // Updated to use paymentmasterid based on your service logic
    this.router.navigate(['app/payment/view'], {
      queryParams: { id: item.paymentmasterid }
    });
  }
   

  




  // ==========================================
  // DELETE LOGIC
  // ==========================================

  openDeleteModel(data: any) {
    this.currentPayment = data;
    this.ngxSmartModalService.getModal('deleteModalPopup').open();
  }

  closeRecord() {
    this.ngxSmartModalService.getModal('deleteModalPopup').close();
  }

  deleteData() {
    var deleteProm = this.paymentService.paymentDeletePromise(this.currentPayment);
    deleteProm.subscribe(result => {
      if (result && result.status && result.data) {
        this.toastr.success("Deleted successfully");
        this.closeRecord();
        this.refreshPage();
      } else {
        this.toastr.error(result.message);
      }
    });
  }


}
