import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CoreCommonModule } from '@core/common.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { QuillModule } from 'ngx-quill';
import { AuthGuard } from 'app/auth/helpers';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SettingsComponent } from './settings/settings.component';
import { SettingsService } from './settings.service';
import { SharedpipeModule } from 'app/auth/helpers/sharedpipe/sharedpipe.module';
import { PhoneMaskDirectiveModule } from 'app/auth/helpers/phone-mask.directive';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { NgxMaskModule } from 'ngx-mask';
import { SwithButtonModule } from '../switch-button/swith-button/swith-button.module';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../dashboard/dashboard.service';
const routes: Routes = [
  // {
  //   path: '',
  //   component: SettingsComponent,
  //   canActivate: [AuthGuard],
  // },
  {
    path: '',
    component: UserProfileComponent,
    canActivate: [AuthGuard],
  }
]

@NgModule({
  declarations: [SettingsComponent, UserProfileComponent],
  imports: [
    CommonModule,
    CoreCommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    NgxDatatableModule,
    PhoneMaskDirectiveModule,
    SharedpipeModule,
    ContentHeaderModule,
    QuillModule.forRoot(),
    NgbModule,
    NgxMaskModule,
    SwithButtonModule,
    FormsModule,
  ],
  providers: [SettingsService,DashboardService],
  exports: [SettingsComponent]
  
})
export class SettingsModule { }
