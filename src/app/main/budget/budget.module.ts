import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetComponent } from './budget.component';
import { AddBudgetComponent } from './add-budget/add-budget.component';
import { AuthGuard } from 'app/auth/helpers';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgImageFullscreenViewModule } from 'ng-image-fullscreen-view';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { CoreCommonModule } from '@core/common.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { TranslateModule } from '@ngx-translate/core';

const routes = [
  {
    path: '',
    component:BudgetComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'add-budget',
    component: AddBudgetComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'edit-budget/:id',
    component: AddBudgetComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  declarations: [BudgetComponent, AddBudgetComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgbModule,
    NgImageFullscreenViewModule,
    PerfectScrollbarModule,
    CoreCommonModule,
    NgxDatatableModule,
    ContentHeaderModule,
    TranslateModule
  ]
})
export class BudgetModule { }
