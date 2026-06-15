 


import { AfterViewInit, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LogService } from '../../../services/log.service'; // Updated Service
import { NgxSmartModalService } from 'ngx-smart-modal';
 
declare var $: any;

@Component({
  selector: 'app-loglist',
  templateUrl: './loglist.component.html',
  styleUrls: ['./loglist.component.css']
})
export class LoglistComponent implements AfterViewInit {

  logList: any[] = [];
  currentLog: any = {};



  constructor(
    private router: Router,
    public ngxSmartModalService: NgxSmartModalService,
    private logService: LogService, // Injected PaymentService
    private toastr: ToastrService
  ) { }

  ngAfterViewInit() {
    this.loadLog();
  }


  refreshPage() {
    this.loadLog();

  }
  loadLog() {
    // Destroy old datatable instance if it exists
    if ($.fn.DataTable.isDataTable('.erp-datatable')) {
      $('.erp-datatable').DataTable().destroy();
    }

    // Using paymentListPromise from PaymentService
    this.logService.logListPromise().subscribe(result => {
      if (result?.status && result?.data?.length > 0) {
        this.logList = result.data;

        // Re-initialize DataTable after DOM updates
        setTimeout(() => {
          $('.erp-datatable').DataTable({
            ordering: false,
            pageLength: 10,
            retrieve: true
          });
        }, 0);

      } else {
        this.logList = [];
        if (result?.status === false) {
          this.toastr.warning(result.message || "No Data Found");
        }
      }
    }, error => {
      this.toastr.error("Failed to load payments");
    });
  }

  createLog() {
    this.router.navigate(['app/log/add']);
  }
   





  // ==========================================
  // DELETE LOGIC
  // ==========================================


  openDeleteModel(data: any) {
    this.currentLog = data;
    this.ngxSmartModalService.getModal('deleteModalPopup').open();
  }

  closeRecord() {
    this.ngxSmartModalService.getModal('deleteModalPopup').close();
  }

  deleteData() {
    debugger;
    console.log('Delete clicked');
    console.log(this.currentLog);
    const deleteProm = this.logService.RemoveLogListByIdPromise(this.currentLog);
    deleteProm.subscribe(
      result => {
        console.log('Success Response:', result);

        if (result && result.status) {
          this.toastr.success('Deleted successfully');
          this.closeRecord();
          this.refreshPage();
        } else {
          this.toastr.error(result.message);
        }
      },
      error => {
        console.log('API Error:', error);
        this.toastr.error('Delete failed');
      }
    );


  }

  //openDeleteModel(data: any) {
  //  this.currentLog = data;
  //  this.ngxSmartModalService.getModal('deleteModalPopup').open();
  //}

  //closeRecord() {
     
  //  this.ngxSmartModalService.getModal('deleteModalPopup').close();
  //}

  //deleteData() {
  //  debugger
  //  var deleteProm = this.logService.RemoveLogPromise(this.currentLog);
  //  deleteProm.subscribe(result => {
  //    if (result && result.status && result.data) {
  //      this.toastr.success("Deleted successfully");
  //      this.closeRecord();
  //      this.refreshPage();
  //    } else {
  //      this.toastr.error(result.message);
  //    }
  //  });
  //}


  //editlog(item: any) {
  //  this.router.navigate(['app/log/list'], {
  //    queryParams: { id: item.paymentmasterid }
  //  });
  //}

  //deleteLog(item: any) {
  //  if (confirm("Are you sure you want to delete this payment?")) {
  //    this.logService.RemoveLogPromise(item.logmasterid).subscribe(res => {
  //      if (res.status) {
  //        this.toastr.success("Payment deleted successfully");
  //        this.loadPayments(); // Refresh list
  //      } else {
  //        this.toastr.error(res.message);
  //      }
  //    });
  //  }
  //}
}
