import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from "@angular/common";




const routes: Routes = [
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerMainRoutingModule { }
