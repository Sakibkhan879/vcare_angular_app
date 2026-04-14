import { Injectable, EventEmitter, Output } from "@angular/core";
import { Subject, Observable } from "rxjs";
import { filter } from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})
export class EventQueueService {
public loadMainDashboardData = new EventEmitter<any>();
public loadCustomerDashboardSales = new EventEmitter<any>();

}
