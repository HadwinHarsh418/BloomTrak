import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddBudgetComponent } from './add-budget/add-budget.component';
import { ComunityBudgetComponent } from './comunity-budget/comunity-budget.component';

const routes: Routes = [
  {path:'', component:ComunityBudgetComponent},
  {path:'add-budget', component:AddBudgetComponent},
  {path:'edit-budget/:id', component:AddBudgetComponent},


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgencyComunityBudgetRoutingModule { }
