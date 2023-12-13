import { OnInit, OnDestroy, Component } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CoreConfigService } from '@core/services/config.service';
import { AuthenticationService } from 'app/auth/service';
import { User } from 'app/auth/models';
import { DataService } from 'app/auth/service/data.service';

@Component({
  selector: 'footer',
  templateUrl: './footer.component.html'
})
export class FooterComponent implements OnInit, OnDestroy {
  public coreConfig: any;
  public year: number = new Date().getFullYear();
  public currentUser: User;
  public subsAll:any[] = [];

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   */
  constructor(
    public _coreConfigService: CoreConfigService,
    private _authService: AuthenticationService,
    private _dataService: DataService
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
    this.subsAll.push(this._authService.currentUser.subscribe(x => (this.currentUser = x)));
  }

  // Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.currentUser = this._authService.currentUserValue;
    // Subscribe to config changes
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
    this.subsAll.map(
      item => { 
        item.unsubscribe();
        item = null;
        return item;
      }
    )
  }

  openDepositModal(){
    this._dataService.openModal.next(true);
  }
}
