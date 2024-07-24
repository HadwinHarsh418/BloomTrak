import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'app/auth/helpers/auth.guards';
import { AddDepartmentComponent } from './add-department/add-department.component';
import { DepartmentComponent } from './department.component';
import { EditDepartmentComponent } from './edit-department/edit-department.component';

const routes: Routes = [
  {path:'', component:DepartmentComponent,canActivate: [AuthGuard],},
 { path:'add-department',component:AddDepartmentComponent,canActivate: [AuthGuard],},
 { path:'edit-department/:d/:r/:id',component:EditDepartmentComponent,canActivate: [AuthGuard],}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepartmentRoutingModule { }
