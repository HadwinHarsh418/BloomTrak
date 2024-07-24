import { Component, OnDestroy, OnInit, ViewEncapsulation, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CoreConfigService } from '@core/services/config.service';
import { AuthenticationService } from 'app/auth/service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'vertical-layout',
  templateUrl: './vertical-layout.component.html',
  styleUrls: ['./vertical-layout.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VerticalLayoutComponent implements OnInit, OnDestroy {
  coreConfig: any;
  dummyUrl:any;
  // Private
  private _unsubscribeAll: Subject<any>;
  currentUser: any;
  showCss: boolean=false;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   */
  constructor(private _coreConfigService: CoreConfigService,
     private _authenticationService: AuthenticationService,private router:Router) {
      this.dummyUrl=''
      if(this.currentUser?.id){
        this.dummyUrl = window.location.pathname
      }
    // Set the private defaults
    this._unsubscribeAll = new Subject();
    this._authenticationService.currentUser.subscribe((x: any) => {
      this.currentUser = x;
    });
    if(this.currentUser?.user_role == '7' || JSON.parse(localStorage.getItem('ClockIn'))== 'Yes'){
      this.router.navigate(['/clockin']);
      this.dummyUrl = '/clockin'
    }
    if(this.dummyUrl == '/clockin'){
      localStorage.setItem('ClockIn', JSON.stringify('Yes'));
      (this.currentUser) ? this.currentUser.user_role = '7' : '';
    }
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to config changes
    this.dummyUrl=''
    if(this.currentUser?.id){
      this.dummyUrl = window.location.pathname
    }
    if(this.dummyUrl == '/clockin' || this.currentUser?.user_role == '7'){
      this.showCss = true;
    }
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      if(this.dummyUrl == '/clockin' || this.currentUser?.user_role == '7'){
        config.layout.menu.hidden = true;
        config.layout.menu.collapsed = true;
        this.coreConfig = config;
      }else{
        // config.layout.menu.hidden = false;
        // config.layout.menu.collapsed = false;
        this.coreConfig = config;
      }
    });
  }
  /**
   * On destroy
   */
  ngOnDestroy(): void {
    this.dummyUrl = ''
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
