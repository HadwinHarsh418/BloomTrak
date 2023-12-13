import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ProjectProfileComponent } from './project-profile.component';
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
import { CustomDateTimePipeModule } from 'app/auth/helpers/custom-date-time.pipe';
import { SharedpipeModule } from 'app/auth/helpers/sharedpipe/sharedpipe.module';
import { PhoneMaskDirectiveModule } from 'app/auth/helpers/phone-mask.directive';
import { NgxMaskModule } from 'ngx-mask';

const routes = [
  {
    path: '',
    component: ProjectProfileComponent,
    canActivate: [AuthGuard],
  },

];

@NgModule({
  declarations: [
    ProjectProfileComponent
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
    NgxPrintModule,
    CustomDateTimePipeModule,
    SharedpipeModule,
    PhoneMaskDirectiveModule,
    NgxMaskModule.forRoot()
  ],
  providers: [MyAccountService,DatePipe]
})
export class ProjectProfileModule { }
