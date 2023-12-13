import { NgModule } from '@angular/core';

import { FilterPipe } from '@core/pipes/filter.pipe';

import { InitialsPipe } from '@core/pipes/initials.pipe';

import { SafePipe } from '@core/pipes/safe.pipe';
import { StripHtmlPipe } from '@core/pipes/stripHtml.pipe';
import { OtpTimerDisp } from './otp-timer-disp.pipe';
import { UserRolePipe } from './user-role.pipe';
import { GetUsernamePipe } from './username.pipe';

@NgModule({
  declarations: [InitialsPipe, FilterPipe, StripHtmlPipe, SafePipe, GetUsernamePipe, OtpTimerDisp, UserRolePipe],
  imports: [],
  exports: [InitialsPipe, FilterPipe, StripHtmlPipe, SafePipe, GetUsernamePipe, OtpTimerDisp, UserRolePipe]
})
export class CorePipesModule {}
