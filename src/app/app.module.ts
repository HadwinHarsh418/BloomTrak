import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Router, RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { FakeDbService } from '@fake-db/fake-db.service';
import 'hammerjs';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ContextMenuModule } from '@ctrl/ngx-rightclick';
import { CoreModule } from '@core/core.module';
import { CoreCommonModule } from '@core/common.module';
import { CoreSidebarModule, CoreThemeCustomizerModule } from '@core/components';
import { CardSnippetModule } from '@core/components/card-snippet/card-snippet.module';
import { coreConfig } from 'app/app-config';
import { AuthGuard } from 'app/auth/helpers/auth.guards';
import { fakeBackendProvider } from 'app/auth/helpers'; // used to create fake backend
import { JwtInterceptor, ErrorInterceptor } from 'app/auth/helpers';
import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { ContextMenuComponent } from 'app/main/extensions/context-menu/context-menu.component';
import { AnimatedCustomContextMenuComponent } from './main/extensions/context-menu/custom-context-menu/animated-custom-context-menu/animated-custom-context-menu.component';
import { BasicCustomContextMenuComponent } from './main/extensions/context-menu/custom-context-menu/basic-custom-context-menu/basic-custom-context-menu.component';
import { SubMenuCustomContextMenuComponent } from './main/extensions/context-menu/custom-context-menu/sub-menu-custom-context-menu/sub-menu-custom-context-menu.component';
import { ToastrModule } from 'ng6-toastr-notifications';
import { NgImageFullscreenViewModule } from 'ng-image-fullscreen-view';
import {FullCalendarModule} from '@fullcalendar/angular';
import { SharedpipeModule } from '../app/auth/helpers/sharedpipe/sharedpipe.module';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import {NgxPrintModule} from 'ngx-print';
// import * as Sentry from '@sentry/angular';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from 'environments/environment';
import { initializeApp } from "firebase/app";
import { NotificationSocketService } from './notification-socket.service';
initializeApp(environment.firebaseConfig);
// import { RequestedShiftsComponent } from './requested-shifts/requested-shifts.component';
// import { RequestShiftComponent } from './request-shift/request-shift.component';
// import { IntlInputPhoneModule } from 'intl-input-phone'; 

export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;
const appRoutes: Routes = [
  {
    path: '',
    loadChildren: () => import('./main/authentication/authentication.module').then(m => m.AuthenticationModule),
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./main/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'clockin',
    loadChildren: () => import('./main/shift/clock-stepper/clock-stepper.module').then(m => m.ClockStepperModule),
    canActivate: [AuthGuard]
  },
  // {
  //   path: 'clockin',
  //   loadChildren: () => import('./clockin/clockin.module').then(m => m.ClockinModule),
  //   // canActivate: [AuthGuard]
  // },
  {
    path: 'components',
    loadChildren: () => import('./main/components/components.module').then(m => m.ComponentsModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'user-profile',
    loadChildren: () => import('./main/settings/settings.module').then(m => m.SettingsModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'community',
    loadChildren: () => import('./main/users/users.module').then(m => m.UsersModule),
    canActivate: [AuthGuard]
  },


  {
    path: 'agency',
    loadChildren: () => import('./main/agency/agency.module').then(m => m.AgencyModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'contracts',
    loadChildren: () => import('./main/contracts/contracts.module').then(m => m.ContractsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'user',
    loadChildren: () => import('./main/user/user.module').then(m => m.UserModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'emp_user',
    loadChildren: () => import('./main/user/user.module').then(m => m.UserModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'project',
    loadChildren: () => import('./main/project/project.module').then(m => m.ProjectModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'agency-personnel',
    loadChildren: () => import('./main/user/agency-personel/agency-personel.module').then(m => m.AgencyPersonelModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'edit-community/:id',
    loadChildren: () => import('./main/profile/my-account.module').then(m => m.MyAccountModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'projectProfile/:id/:d',
    loadChildren: () => import('./main/project-profile/project-profile.module').then(m => m.ProjectProfileModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'userProfile/:id/:no',
    loadChildren: () => import('./main/profile-user/profile-user.module').then(m => m.ProfileUserModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'department',
    loadChildren: () => import('./main/department/department.module').then(m => m.DepartmentModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'certification',
    loadChildren: () => import('./main/certification/certification.module').then(m => m.CertificationModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'position',
    loadChildren: () => import('./main/position/position.module').then(m => m.PositionModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'agencyProfile/:id',
    loadChildren: () => import('./main/profile-agency/my-profile.module').then(mp => mp.MyProfileModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'contractProfile/:id',
    loadChildren: () => import('./main/contract-profile/my-contract.module').then(mp => mp.MyContractModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'calender',
    loadChildren: () => import('./main/shared-calender/shared-calender.module').then(mp => mp.SharedCalenderModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'department-list',
    loadChildren: () => import('./main/department-list/department-list.module').then(mp => mp.DepartmentListModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'shift',
    loadChildren: () => import('./main/shift/shift.module').then(mp => mp.ShiftModule),
    canActivate: [AuthGuard]
  },
  {
    path: 're_shift',
    loadChildren: () => import('./main/shift/shift.module').then(mp => mp.ShiftModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'req_shift',
    loadChildren: () => import('./main/shift/shift.module').then(mp => mp.ShiftModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'shift/:d',
    loadChildren: () => import('./main/shift/shift.module').then(mp => mp.ShiftModule),
    canActivate: [AuthGuard]
  },
  
  {
    path: 'management',
    loadChildren: () => import('./main/add-management/add-management.module').then(mp => mp.AddManagementModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'management-user',
    loadChildren: () => import('./main/management-user/management-user.module').then(mp => mp.ManagementUserModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'reports',
    loadChildren: () => import('./reports/reports/reports.module').then(mp => mp.ReportsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'spendtrak-reports',
    loadChildren: () => import('./main/spendtrak-reports/spendtrak-reports.module').then(mp => mp.SpendtrakReportsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'blockUser',
    loadChildren: () => import('./main/block-user/block-user.module').then(mp => mp.BlockUserModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'agencyRate',
    loadChildren: () => import('./main/agency-rate/agency-rate.module').then(mp => mp.AgencyRateModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'agency-holiday',
    loadChildren: () => import('./main/agency-holiday/agency-holiday.module').then(mp => mp.AgencyHolidayModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'budget-agency',
    loadChildren: () => import('./main/agency-comunity-budget/agency-comunity-budget.module').then(mp => mp.AgencyComunityBudgetModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'roles',
    loadChildren: () => import('./main/roles/roles.module').then(mp => mp.RolesModule),
    // canActivate: [AuthGuard]
  },
  {
    path: 'default-roles',
    loadChildren: () => import('./default-roles/default-roles.module').then(mp => mp.DefaultRolesModule),
    // canActivate: [AuthGuard]
  },
  {
    path: 'menu',
    loadChildren: () => import('./main/span-track/span-track.module').then(mp => mp.SpanTrackModule),
    // canActivate: [AuthGuard]
  },
  {
    path: 'permission',
    loadChildren: () => import('./main/permissions/permissions.module').then(mp => mp.PermissionsModule),
    // canActivate: [AuthGuard]
  },
  {
    path: 'subscriptions',
    loadChildren: () => import('./main/subscription/subscription.module').then(mp => mp.SubscriptionModule),
    // canActivate: [AuthGuard]
  },
  {
    path: 'currency',
    loadChildren: () => import('./main/currency/currency.module').then(mp => mp.CurrencyModule),
    // canActivate: [AuthGuard]
  },
  {
    path: 'expense_type',
    loadChildren: () => import('./main/expense-type/expense-type.module').then(mp => mp.ExpenseTypeModule),
    // canActivate: [AuthGuard]
  },
  {
    path: 'fixed-expence-table',
    loadChildren: () => import('./main/fixed-expence-tab/fixed-expence-tab.module').then(mp => mp.FixedExpenceTabModule),
    // canActivate: [AuthGuard]
  },
  {
    path: 'general_ledger',
    loadChildren: () => import('./main/general-ledger/general-ledger.module').then(mp => mp.GeneralLedgerModule),
    // canActivate: [AuthGuard]
  },
  {
    path: 'budget',
    loadChildren: () => import('./main/budget/budget.module').then(mp => mp.BudgetModule),
    // canActivate: [AuthGuard]
  },
  {
    path: 'budget-resident-days',
    loadChildren: () => import('./main/budget-resident-days/budget-resident-days.module').then(mp => mp.BudgetResidentDaysModule),
    // canActivate: [AuthGuard]
  },
  {
    path: 'vendor_contracts',
    loadChildren: () => import('./main/vendor-contracts/vendor-contracts.module').then(mp => mp.VendorContractsModule),
    // canActivate: [AuthGuard]
  },
  {
    path: 'department-summary',
    loadChildren: () => import('./main/department-summary/department-summary.module').then(mp => mp.DepartmentSummaryModule),
    // canActivate: [AuthGuard]
  },

  {
    path: 'spend_down',
    loadChildren: () => import('./main/spend-down/spend-down.module').then(mp => mp.SpendDownModule),
    // canActivate: [AuthGuard]
  },
  {
    path: 'vendor',
    loadChildren: () => import('./main/vendor/vendor.module').then(mp => mp.VendorModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'payment_type',
    loadChildren: () => import('./main/payment-type/payment-type.module').then(mp => mp.PaymentTypeModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'spend-for-other-department',
    loadChildren: () => import('./main/spendforotherdprtmt/spendforotherdprtmt.module').then(mp => mp.SpendforotherdprtmtModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'admin-settings',
    loadChildren: () => import('./main/admin-settings/admin-settings.module').then(m => m.AdminSettingsModule),
    canActivate: [AuthGuard]
  },  
  {
    path: 'admin-notifications',
    loadChildren: () => import('./main/admin-notifications/admin-notifications.module').then(m => m.AdminNotificationsModule),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    loadChildren: () => import('./main/miscellaneous/miscellaneous.module').then(m => m.MiscellaneousModule),
  }

];

@NgModule({
  declarations: [
    AppComponent,
    ContextMenuComponent,
    BasicCustomContextMenuComponent,
    AnimatedCustomContextMenuComponent,
    SubMenuCustomContextMenuComponent,
    // RequestedShiftsComponent,
  ],
  imports: [
    BrowserModule,
    FullCalendarModule,
    NgxPrintModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgImageFullscreenViewModule,
    SharedpipeModule,
    HttpClientInMemoryWebApiModule.forRoot(FakeDbService, {
      delay: 0,
      passThruUnknownUrl: true
    }),
    RouterModule.forRoot(appRoutes, {
      scrollPositionRestoration: 'enabled', // Add options right here
      relativeLinkResolution: 'legacy'
    }),
    NgbModule,
    ToastrModule.forRoot(),
    TranslateModule.forRoot(),
    ContextMenuModule,
    CoreModule.forRoot(coreConfig),
    CoreCommonModule,
    CoreSidebarModule,
    CoreThemeCustomizerModule,
    CardSnippetModule,
    LayoutModule,
    ContentHeaderModule,
    NgxMaskModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: true,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],

  providers: [
    NotificationSocketService,
    // {
    //   provide: ErrorHandler,
    //   useValue: Sentry.createErrorHandler({
    //     showDialog: true,
    //   }),
    // },
    // {
    //   provide: Sentry.TraceService,
    //   deps: [Router],
    // },
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: () => () => {},
    //   deps: [Sentry.TraceService],
    //   multi: true,
    // },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

    // provider used to create fake backend, comment while using real api
    fakeBackendProvider
  ],
  entryComponents: [BasicCustomContextMenuComponent, AnimatedCustomContextMenuComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
  // constructor(trace: Sentry.TraceService) {} 
}
