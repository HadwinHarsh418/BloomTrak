import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgDateComponent } from './ng-date.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {  NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';




@NgModule({
  declarations: [NgDateComponent],
  imports: [
    CommonModule,
    NgbModule,
    NgbDatepickerModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    NgDateComponent
  ]
})
export class NgDateModule { }
