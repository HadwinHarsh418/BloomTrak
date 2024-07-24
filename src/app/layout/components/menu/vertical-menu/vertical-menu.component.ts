import { Component, OnInit, OnDestroy, ViewChild, HostListener, ViewEncapsulation } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { Subject } from 'rxjs';
import { take, takeUntil, filter } from 'rxjs/operators';
import { PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';

import { CoreConfigService } from '@core/services/config.service';
import { CoreMenuService } from '@core/components/core-menu/core-menu.service';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { DataService } from 'app/auth/service/data.service';
import { AuthenticationService } from 'app/auth/service';

@Component({
  selector: 'vertical-menu',
  templateUrl: './vertical-menu.component.html',
  styleUrls: ['./vertical-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VerticalMenuComponent implements OnInit, OnDestroy {
  coreConfig: any;
  menu: any;
  isCollapsed: boolean;
  isScrolled: boolean = false;
  public mainlogo = '';

  // Private
  private _unsubscribeAll: Subject<any>;
  myFileName = 'Agency-Shift-Variance-Form.pdf';
  fileUrl = 'assets/images/elements/bloomtrak_-_Agency_Shift_Variance_Form_-_v1.1 (4).pdf'
  accTo: any;
  currentUser:any;
  vwPrms: any;
  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   * @param {CoreMenuService} _coreMenuService
   * @param {CoreSidebarService} _coreSidebarService
   * @param {Router} _router
   */
  constructor(
    private _coreConfigService: CoreConfigService,
    private _coreMenuService: CoreMenuService,
    private _coreSidebarService: CoreSidebarService,
    private _router: Router,
    private dtSrv :DataService,
    private authService: AuthenticationService,
  ) {
    this.mainlogo = this._coreConfigService.mainLogo;
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  
    this.authService.currentUser.subscribe
    (x => {
      this.currentUser = x
      if(x) {
        this.getPrmsnData()
        this.dtSrv.getCMAccessToByDate(this.authService.currentUserValue?.com_id ? this.authService.currentUserValue?.com_id : this.authService.currentUserValue?.id).subscribe((res:any) => {
          if(!res.err){
            this.accTo = res.body 
          }
        })
      }  else {
        this.authService.UserPermissions = [];
      }
    }
    );

  }

  getPrmsnData(){
    this.dtSrv.getPermissionByAdminRole().subscribe(
      (res:any) => {
        if (!res.error) {
          res.body.map(i=>{
              if(i.permission_name == 'Shift Variance Form'){
              this.vwPrms  = i.view_permission
            }
          })
          
        } 
    }, (error:any) => {
      // this.dtSrv.genericErrorToaster()
    }
    )
  }

  @ViewChild(PerfectScrollbarDirective, { static: false }) directiveRef?: PerfectScrollbarDirective;

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On Init
   */
  ngOnInit(): void {
    // Subscribe config change
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });

    this.isCollapsed = this._coreSidebarService.getSidebarRegistry('menu').collapsed;

    // Close the menu on router NavigationEnd (Required for small screen to close the menu on select)
    this._router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(() => {
        if (this._coreSidebarService.getSidebarRegistry('menu')) {
          this._coreSidebarService.getSidebarRegistry('menu').close();
        }
      });

    // scroll to active on navigation end
    this._router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        take(1)
      )
      .subscribe(() => {
        setTimeout(() => {
          this.directiveRef.scrollToElement('.navigation .active', -180, 500);
        });
      });

    // Get current menu
    this._coreMenuService.onMenuChanged
      .pipe(
        filter(value => value !== null),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(() => {
        this.menu = this._coreMenuService.getCurrentMenu();
      });
  }

  /**
   * On Destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * On Sidebar scroll set isScrolled as true
   */
  onSidebarScroll(): void {
    if (Number(this.directiveRef.position(true).y) > 3) {
      this.isScrolled = true;
    } else {
      this.isScrolled = false;
    }
  }

  /**
   * Toggle sidebar expanded status
   */
  toggleSidebar(): void {
    this._coreSidebarService.getSidebarRegistry('menu').toggleOpen();
  }

  /**
   * Toggle sidebar collapsed status
   */
  toggleSidebarCollapsible(d?:any): void {
    this._coreConfigService
      .getConfig()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(config => {
        this.isCollapsed = config.layout.menu.collapsed;
      });

    if (this.isCollapsed) {
      this._coreConfigService.setConfig({ layout: { menu: { collapsed: false } } }, { emitEvent: true });
    } else {
      this._coreConfigService.setConfig({ layout: { menu: { collapsed: true } } }, { emitEvent: true });
    }
  }

  goToMail(){
    window.open('mailto:support@bloomtrak.com', '_blank');
  }
}
