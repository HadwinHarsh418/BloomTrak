import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreCommonModule } from '@core/common.module';
import { AuthLoginV2Component } from './auth-login-v2/auth-login-v2.component';
import { RecaptchaModule} from 'ng-recaptcha';
import { TranslateModule } from '@ngx-translate/core';
import { LangselectorComponent } from 'app/layout/components/langselector/langselector.component';
import { RegisterComponent } from './register/register.component';
import { SetupComponent } from './setup/setup.component';
import { AuthGuard } from 'app/auth/helpers';
import { ManagementComponent } from '../management/management.component';
import { SharedpipeModule } from 'app/auth/helpers/sharedpipe/sharedpipe.module';
import { PhoneMaskDirectiveModule } from 'app/auth/helpers/phone-mask.directive';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ForgotPassComponent } from './forgot-pass/forgot-pass.component';
import { ResetPassComponent } from './reset-pass/reset-pass.component';

// routing
const routes: Routes = [
  {
    path: '',
    component: AuthLoginV2Component
  },
  // {
  //   path: 'login',
  //   component: AuthLoginV2Component
  // },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'managament',
    component: ManagementComponent
  },
  {
    path: 'setup',
    component: SetupComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'forgotPassword',
    component: ForgotPassComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'resetPassword',
    component: ResetPassComponent,
    // canActivate: [AuthGuard]
  },
];

@NgModule({
  declarations: [
    // AuthLoginV1Component,
    AuthLoginV2Component,
    LangselectorComponent,
    RegisterComponent,
    ManagementComponent,
    SetupComponent,
    ForgotPassComponent,
    ResetPassComponent,
    ],
  imports: [CommonModule, RecaptchaModule, TranslateModule, RouterModule.forChild(routes), NgbModule, FormsModule, ReactiveFormsModule, 
    SharedpipeModule,
    PhoneMaskDirectiveModule,
    NgMultiSelectDropDownModule.forRoot(),
    CoreCommonModule,]
})
export class AuthenticationModule {}
