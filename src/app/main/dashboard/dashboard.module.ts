import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { AuthGuard } from 'app/auth/helpers';
import { CoreCommonModule } from '@core/common.module';
import { DashboardService } from 'app/main/dashboard/dashboard.service';
import { PhoneMaskDirectiveModule } from 'app/auth/helpers/phone-mask.directive';
import { AnalyticsComponent } from 'app/main/dashboard/analytics/analytics.component';
import { EcommerceComponent } from 'app/main/dashboard/ecommerce/ecommerce.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FullCalendarModule } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { ScheduleTimerModule } from '../schedule-timer/schedule-timer.module';
import { CustomDateTimePipeModule } from 'app/auth/helpers/custom-date-time.pipe';
import { AllNotificationComponent } from 'app/all-notification/all-notification.component';

FullCalendarModule.registerPlugins([
  interactionPlugin,
  dayGridPlugin
]);

const routes = [
  {
    path: '',
    component: EcommerceComponent,
    resolve: {
      css: DashboardService
    }
  },
  // {
  //   path: 'analytics',
  //   component: AnalyticsComponent,
  //   canActivate: [AuthGuard],
  //   // data: { roles: [Role.Admin] },
  //   resolve: {
  //     css: DashboardService,
  //   }
  // },
  {
    path: 'ecommerce',
    component: EcommerceComponent,
    resolve: {
      css: DashboardService
    }
    
  },
  {
    path: 'allnotify',
    component: AllNotificationComponent,
  },
];

@NgModule({
  declarations: [AnalyticsComponent, EcommerceComponent,AllNotificationComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    NgbModule,
    PerfectScrollbarModule,
    CoreCommonModule,
    NgApexchartsModule,
    NgxDatatableModule,
    FullCalendarModule,
    PhoneMaskDirectiveModule,
    ScheduleTimerModule,
    CustomDateTimePipeModule,
  ],
  providers: [DashboardService],
  exports: [EcommerceComponent]
})
export class DashboardModule { }
