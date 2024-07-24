import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockUserComponent } from './block-user.component';
import { AuthGuard } from 'app/auth/helpers/auth.guards';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { CoreCommonModule } from '@core/common.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { PhoneMaskDirectiveModule } from 'app/auth/helpers/phone-mask.directive';
import { SharedpipeModule } from 'app/auth/helpers/sharedpipe/sharedpipe.module';
import { CustomDateTimePipeModule } from 'app/auth/helpers/custom-date-time.pipe';

const routes = [
  {
      path: '',
      component: BlockUserComponent,
  },

];

@NgModule({
  declarations: [
    BlockUserComponent
  ],
  imports: [
    CommonModule,  
    RouterModule.forChild(routes),
    TranslateModule,
    NgbModule,
    PerfectScrollbarModule,
    CoreCommonModule,
    NgApexchartsModule,
    NgxDatatableModule,
    ContentHeaderModule,
    PhoneMaskDirectiveModule,
    SharedpipeModule,
    CustomDateTimePipeModule,

  ]
})
export class BlockUserModule { }
