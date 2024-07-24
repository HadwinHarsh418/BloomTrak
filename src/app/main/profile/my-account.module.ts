import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { CoreCommonModule } from '@core/common.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MyAccountService } from './my-account.service';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { NgxPrintModule } from 'ngx-print';
import { UserProfileComponent } from './profile.component';
import { NgImageFullscreenViewModule } from 'ng-image-fullscreen-view';
import { SharedpipeModule } from 'app/auth/helpers/sharedpipe/sharedpipe.module';
import { PhoneMaskDirectiveModule } from "app/auth/helpers/phone-mask.directive";
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxMaskModule } from 'ngx-mask';

const routes = [
  {
    path: '',
    component: UserProfileComponent,
  },
];

@NgModule({
  declarations: [UserProfileComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    NgbModule,
    NgImageFullscreenViewModule,
    PerfectScrollbarModule,
    CoreCommonModule,
    NgxDatatableModule,
    ContentHeaderModule,
    Ng2FlatpickrModule,
    SharedpipeModule,
    PhoneMaskDirectiveModule,
    NgxPrintModule,    
    NgxMaskModule.forRoot(),
    NgMultiSelectDropDownModule
  ],
  providers: [MyAccountService,SharedpipeModule],
  exports: [UserProfileComponent]
})
export class MyAccountModule { }
