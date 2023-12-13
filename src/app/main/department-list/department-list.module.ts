import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DepartmentListComponent } from './department-list.component';
import { AuthGuard } from 'app/auth/helpers';
import { AddDepartmentListComponent } from './add-department-list/add-department-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { CoreCommonModule } from '@core/common.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';

const routes: Routes = [
  {path:'', component:DepartmentListComponent,canActivate: [AuthGuard],},
 { path:'add-department-list',component:AddDepartmentListComponent,canActivate: [AuthGuard],},
 { path:'edit-department-list/:id',component:AddDepartmentListComponent,canActivate: [AuthGuard],}
];

@NgModule({
  declarations: [DepartmentListComponent,AddDepartmentListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgbModule,
    PerfectScrollbarModule,
    CoreCommonModule,
    NgxDatatableModule,
    ContentHeaderModule,
  ],
  
})
export class DepartmentListModule { }
