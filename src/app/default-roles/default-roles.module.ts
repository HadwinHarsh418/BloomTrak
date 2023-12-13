import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultRolesComponent } from './default-roles.component';
import { RouterModule } from '@angular/router';
import { AddDefaultRoleComponent } from './add-default-role/add-default-role.component';
import { CoreCommonModule } from '@core/common.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

const routes = [
  {
    path: '',
    component: DefaultRolesComponent,
  },
  {
    path: 'add-default',
    component: AddDefaultRoleComponent,
  },
  {
    path: 'edit-role/:id/:name/:trak_type',
    component: AddDefaultRoleComponent,
  },
];

@NgModule({
  declarations: [DefaultRolesComponent,AddDefaultRoleComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CoreCommonModule,
    NgxDatatableModule,
    ContentHeaderModule,
    NgbModule,
    PerfectScrollbarModule,
  ],
  exports:[
    AddDefaultRoleComponent
  ]
})
export class DefaultRolesModule { }
