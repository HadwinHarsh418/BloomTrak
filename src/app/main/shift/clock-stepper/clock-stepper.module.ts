import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { CoreCommonModule } from '@core/common.module';
import { ScheduleTimerModule } from 'app/main/schedule-timer/schedule-timer.module';
import { CustomDateTimePipeModule } from 'app/auth/helpers/custom-date-time.pipe';
import { ClockStepperComponent } from './clock-stepper.component';
import { AuthGuard } from 'app/auth/helpers/auth.guards';
import { PhoneMaskDirectiveModule } from 'app/auth/helpers/phone-mask.directive';
import { NgxMaskModule } from 'ngx-mask';

const routes = [
  {
    path: '',
    component: ClockStepperComponent,
    // canActivate: [AuthGuard],
  },
]

@NgModule({
  declarations: [
    ClockStepperComponent
  ],
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
export class ClockStepperModule { }
