import { Component, OnInit } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-navbar-news',
  templateUrl: './navbar-news.component.html'
})
export class NavbarNewsComponent implements OnInit {
  // Public
  public news:any = [];

  // Private
  private _unsubscribeAll: Subject<any>;
  constructor() {
    this._unsubscribeAll = new Subject();
  }
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    
  }
}
