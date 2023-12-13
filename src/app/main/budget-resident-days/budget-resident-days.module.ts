import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetResidentDaysComponent } from './budget-resident-days.component';
import { AddBudgetResidentComponent } from './add-budget-resident/add-budget-resident.component';
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
    component:BudgetResidentDaysComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'add-budget-resident',
    component: AddBudgetResidentComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'edit-budget-resident/:id',
    component: AddBudgetResidentComponent,
    canActivate: [AuthGuard],
  },
];


@NgModule({
  declarations: [BudgetResidentDaysComponent, AddBudgetResidentComponent],
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
export class BudgetResidentDaysModule { }
