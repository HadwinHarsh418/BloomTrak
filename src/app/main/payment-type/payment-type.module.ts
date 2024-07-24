import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentTypeComponent } from './payment-type.component';
import { AddPaymentTypeComponent } from './add-payment-type/add-payment-type.component';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgImageFullscreenViewModule } from 'ng-image-fullscreen-view';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { CoreCommonModule } from '@core/common.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';

const routes = [
  {
    path: '',
    component:PaymentTypeComponent,
  },
  {
    path: 'add-paymentType',
    component: AddPaymentTypeComponent,
  },
  {
    path: 'edit-paymentType/:id/:name',
    component: AddPaymentTypeComponent,
  },
];


@NgModule({
  declarations: [PaymentTypeComponent, AddPaymentTypeComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgbModule,
    NgImageFullscreenViewModule,
    PerfectScrollbarModule,
    CoreCommonModule,
    NgxDatatableModule,
    ContentHeaderModule,
  ]
})
export class PaymentTypeModule { }
