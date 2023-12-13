import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ProfileUserComponent } from './profile-user.component';
import { AuthGuard } from 'app/auth/helpers';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgImageFullscreenViewModule } from 'ng-image-fullscreen-view';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { CoreCommonModule } from '@core/common.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { NgxPrintModule } from 'ngx-print';
import { MyAccountService } from '../profile/my-account.service';
import { PhoneMaskDirectiveModule } from 'app/auth/helpers/phone-mask.directive';
import { SharedpipeModule } from 'app/auth/helpers/sharedpipe/sharedpipe.module';
import { NgxMaskModule } from 'ngx-mask';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

const routes = [
  {
    path: '',
    component: ProfileUserComponent,
    canActivate: [AuthGuard],
  },

];

@NgModule({
  declarations: [
    ProfileUserComponent
  ],
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
    NgMultiSelectDropDownModule,
    PhoneMaskDirectiveModule,
    SharedpipeModule,
    NgxPrintModule,
    NgxMaskModule.forRoot(),

  ],
  providers: [MyAccountService,DatePipe],
  exports: []
})
export class ProfileUserModule { }
