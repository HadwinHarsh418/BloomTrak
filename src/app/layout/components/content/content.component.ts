import { Component, ViewEncapsulation } from '@angular/core';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';

@Component({
  selector: 'content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ContentComponent {
  unsubscribeAllModals: any = [];
  currentUser: User;
  user_id :any = '';
  constructor(
    private _dataService: DataService,
    private _authenticationService: AuthenticationService,
  ) {
    this.unsubscribeAllModals.push(
      this._authenticationService.currentUser.subscribe(x => {
        (this.currentUser = x);
        if (x) { this.user_id = this.currentUser._id }
      })
    );
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  ngOnInit(): void {
    this.currentUser = this._authenticationService.currentUserValue;
    this.user_id = this.currentUser ? this.currentUser._id  :  '';
  }
}
