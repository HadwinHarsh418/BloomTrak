import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from 'app/auth/helpers';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgImageFullscreenViewModule } from 'ng-image-fullscreen-view';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { CoreCommonModule } from '@core/common.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { TranslateModule } from '@ngx-translate/core';
import { AddVendorComponent } from './add-vendor/add-vendor.component';
import { VendorComponent } from './vendor.component';

const routes = [
  {
    path: '',
    component:VendorComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'add-Vendor',
    component: AddVendorComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'edit-Vendor/:id',
    component: AddVendorComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  declarations: [AddVendorComponent,VendorComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgbModule,
    NgImageFullscreenViewModule,
    PerfectScrollbarModule,
    CoreCommonModule,
    NgxDatatableModule,
    ContentHeaderModule,
    TranslateModule,
  ]
})
export class VendorModule { }
