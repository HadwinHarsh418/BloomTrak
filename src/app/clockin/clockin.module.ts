import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClockinComponent } from './clockin/clockin.component';
import { RouterModule } from '@angular/router';
import { CoreCommonModule } from '@core/common.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { CustomDateTimePipeModule } from 'app/auth/helpers/custom-date-time.pipe';
import { PhoneMaskDirectiveModule } from 'app/auth/helpers/phone-mask.directive';
import { ScheduleTimerModule } from 'app/main/schedule-timer/schedule-timer.module';
import { NgxMaskModule } from 'ngx-mask';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

const routes = [
  {
    path: '',
    component: ClockinComponent
  },
]

@NgModule({
  declarations: [ClockinComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    NgbModule,
    PerfectScrollbarModule,
    CoreCommonModule,
    ScheduleTimerModule,
    CustomDateTimePipeModule,
    PhoneMaskDirectiveModule,
    NgxMaskModule.forRoot(),
  ]
})
export class ClockinModule { }
