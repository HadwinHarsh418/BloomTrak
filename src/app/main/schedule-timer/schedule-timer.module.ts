import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleTimerComponent } from './schedule-timer.component';
import { SharedModule } from 'app/auth/helpers/timer.pipe';


@NgModule({
  declarations: [
    ScheduleTimerComponent
  ],
  imports: [
    CommonModule,
    SharedModule

  ],
  exports:[
    ScheduleTimerComponent
  ]
})
export class ScheduleTimerModule { }
