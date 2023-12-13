import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentTypeComponent } from './payment-type.component';
import { AddPaymentTypeComponent } from './add-payment-type/add-payment-type.component';
import { AuthGuard } from 'app/auth/helpers';
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
    canActivate: [AuthGuard],
  },
  {
    path: 'add-paymentType',
    component: AddPaymentTypeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'edit-paymentType/:id/:name',
    component: AddPaymentTypeComponent,
    canActivate: [AuthGuard],
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
