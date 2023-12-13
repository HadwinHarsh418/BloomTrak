import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSettingsComponent } from './admin-settings.component';
import { AddAdminSettingsComponent } from './add-admin-settings/add-admin-settings.component';
import { AuthGuard } from 'app/auth/helpers';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgImageFullscreenViewModule } from 'ng-image-fullscreen-view';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { CoreCommonModule } from '@core/common.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';

const routes = [
  {
    path: '',
    component: AdminSettingsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'add-admin-settings',
    component: AddAdminSettingsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'edit-admin-settings/:id',
    component: AddAdminSettingsComponent,
    canActivate: [AuthGuard],
  },
];


@NgModule({
  declarations: [AdminSettingsComponent, AddAdminSettingsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgbModule,
    NgImageFullscreenViewModule,
    PerfectScrollbarModule,
    CoreCommonModule,
    NgxDatatableModule,
    ContentHeaderModule,
   ]
})
export class AdminSettingsModule { }
