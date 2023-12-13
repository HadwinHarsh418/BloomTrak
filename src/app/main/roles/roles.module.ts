import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolesComponent } from './roles.component';
import { AddrolesComponent } from './addroles/addroles.component';
import { AuthGuard } from 'app/auth/helpers';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgImageFullscreenViewModule } from 'ng-image-fullscreen-view';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { CoreCommonModule } from '@core/common.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { DefaultRolesModule } from 'app/default-roles/default-roles.module';

const routes = [
  {
    path: '',
    component: RolesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'add-role',
    component: AddrolesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'edit-role/:id/:name/:trak_type/:community_id',
    component: AddrolesComponent,
    canActivate: [AuthGuard],
  },

];

@NgModule({
  declarations: [
    RolesComponent,
    AddrolesComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgbModule,
    NgImageFullscreenViewModule,
    PerfectScrollbarModule,
    CoreCommonModule,
    NgxDatatableModule,
    ContentHeaderModule,
  ],
  providers:[]
})
export class RolesModule { }
