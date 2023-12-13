import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { AuthGuard } from 'app/auth/helpers';
import { Role } from 'app/auth/models';

import { CoreCommonModule } from '@core/common.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NotificationsComponent } from './notifications.component';
import { NotificationsService } from './notifications.service';

const routes = [
  {
    path: '',
    component: NotificationsComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  declarations: [NotificationsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    NgbModule,
    PerfectScrollbarModule,
    CoreCommonModule,
    NgApexchartsModule,
    NgxDatatableModule
  ],
  providers: [NotificationsService],
  exports: [NotificationsComponent]
})
export class NotificationsModule { }
