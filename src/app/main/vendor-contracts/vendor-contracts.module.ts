import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorContractsComponent } from './vendor-contracts.component';
import { AddVendorContractsComponent } from './add-vendor-contracts/add-vendor-contracts.component';
import { AuthGuard } from 'app/auth/helpers';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgImageFullscreenViewModule } from 'ng-image-fullscreen-view';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { CoreCommonModule } from '@core/common.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

const routes = [
  {
    path: '',
    component:VendorContractsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'add-vendorContracts',
    component: AddVendorContractsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'edit-vendorContracts/:id',
    component: AddVendorContractsComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  declarations: [VendorContractsComponent, AddVendorContractsComponent],
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
    NgMultiSelectDropDownModule
  ]
})
export class VendorContractsModule { }
