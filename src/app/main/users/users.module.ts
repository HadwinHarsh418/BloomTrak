import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { CoreCommonModule } from '@core/common.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { UsersComponent } from './users.component';
import { DataService } from 'app/auth/service/data.service';
import { SharedModule } from 'app/auth/helpers/timer.pipe';
import { PhoneMaskDirectiveModule } from 'app/auth/helpers/phone-mask.directive';
import { SharedpipeModule } from 'app/auth/helpers/sharedpipe/sharedpipe.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AddCommunityComponent } from './add-community/add-community.component';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { EditCommunityComponent } from './edit-community/edit-community.component';

const routes = [
  {
    path: '',
    component: UsersComponent,
  },
  {
    path: 'add-community',
    component: AddCommunityComponent,
  },
  {
    path: 'profile',
    component: EditCommunityComponent,
  },
];

@NgModule({
  declarations: [UsersComponent, AddCommunityComponent,EditCommunityComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    NgbModule,
    PerfectScrollbarModule,
    CoreCommonModule,
    NgApexchartsModule,
    NgxDatatableModule,
    SharedModule,
    SharedpipeModule,
    PhoneMaskDirectiveModule,
    ContentHeaderModule,
    NgMultiSelectDropDownModule
  ],
  providers: [DataService],
  exports: [UsersComponent]
})
export class UsersModule { }
