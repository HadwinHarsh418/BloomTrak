import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { AuthenticationService } from 'app/auth/service';
import { Role, User } from 'app/auth/models';

@Injectable({
  providedIn: 'root'
})
export class CoreMenuService {
  currentUser: User;
  onItemCollapsed: Subject<any>;
  onItemCollapseToggled: Subject<any>;

  // Private
  private _onMenuRegistered: BehaviorSubject<any>;
  private _onMenuUnregistered: BehaviorSubject<any>;
  private _onMenuChanged: BehaviorSubject<any>;
  private _currentMenuKey: string;
  private _registry: { [key: string]: any } = {};
  accMenu: any =[]
  accTo: any;

  /**
   * Constructor
   *
   * @param {Router} _router
   * @param {AuthenticationService} _authenticationService
   */
  constructor(private _router: Router, private _authenticationService: AuthenticationService) {
   

    // Set defaults
    this.onItemCollapsed = new Subject();
    this.onItemCollapseToggled = new Subject();

    // Set private defaults
    this._currentMenuKey = null;
    this._onMenuRegistered = new BehaviorSubject(null);
    this._onMenuUnregistered = new BehaviorSubject(null);
    this._onMenuChanged = new BehaviorSubject(null);

    this._authenticationService.currentUser.subscribe(x => { 
      this.currentUser = x; 
      if(x) {
        this.setCurrentMenu('main') 
        this.getCMAccessToByDate();
      } else {
        this._authenticationService.UserPermissions = [];
      }
    });
  }

  // Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * onMenuRegistered
   *
   * @returns {Observable<any>}
   */
  get onMenuRegistered(): Observable<any> {
    return this._onMenuRegistered.asObservable();
  }

  /**
   * onMenuUnregistered
   *
   * @returns {Observable<any>}
   */
  get onMenuUnregistered(): Observable<any> {
    return this._onMenuUnregistered.asObservable();
  }

  /**
   * onMenuChanged
   *
   * @returns {Observable<any>}
   */
  get onMenuChanged(): Observable<any> {
    return this._onMenuChanged.asObservable();
  }

  // Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Register the provided menu with the provided key
   *
   * @param key
   * @param menu
   */
  register(key, menu): void {
    // Confirm if the key already used
    if (this._registry[key]) {
      console.error(`Menu with the key '${key}' already exists. Either unregister it first or use a unique key.`);

      return;
    }

    // Add to registry
    this._registry[key] = menu;

    // Notify subject
    this._onMenuRegistered.next([key, menu]);
  }

  /**
   * Unregister the menu from the registry
   *
   * @param key
   */
  unregister(key): void {
    // Confirm if the menu exists
    if (!this._registry[key]) {
      console.warn(`Menu with the key '${key}' doesn't exist in the registry.`);
    }

    // Unregister sidebar
    delete this._registry[key];

    // Notify subject
    this._onMenuUnregistered.next(key);
  }

  /**
   * Get menu from registry by key
   *
   * @param key
   * @returns {any}
   */
  getMenu(key): any {
    // Confirm if the menu exists
    if (!this._registry[key]) {
      console.warn(`Menu with the key '${key}' doesn't exist in the registry.`);

      return;
    }

    // Return sidebar
    return this._registry[key];
  }

  /**
   * Get current menu
   *
   * @returns {any}
   */
  getCurrentMenu(): any {
    if (!this._currentMenuKey) {
      console.warn(`The current menu is not set.`);

      return;
    }
    let allMenus= JSON.parse(JSON.stringify(this.getMenu(this._currentMenuKey)));
    
    // !this.accMenu.length ||
    let filteredMenus = allMenus?.filter(item => {
      return !item.access_to || !item.access_to.length || item.access_to.includes(this.currentUser?.access_to)});

    let filteredMenusForChild = !this.accMenu.length ? filteredMenus.splice(0,1) :(this.currentUser.prmsnId =='6' || this.currentUser.user_role =='3') ? filteredMenus : filteredMenus.map(
      item => {
        if(["shiftrak","spendtrak", "Admin"].includes(item.title)) {
          if(item.children) {
            
            item.children = item.children.filter(chitem => this.accMenu.includes(chitem.title))
          }
        }
        return item;
      } 
    ).filter(mainItem => !mainItem.children || mainItem.children.length);
    return filteredMenusForChild;
  }

  /**
   * Set menu with the key as the current menu
   *
   * @param key
   */
  setCurrentMenu(key): void {
    // Confirm if the sidebar exists
    if (!this._registry[key]) {
      console.warn(`Menu with the key '${key}' doesn't exist in the registry.`);

      return;
    }

    // Set current menu key
    this._currentMenuKey = key;

    // Notify subject
    this._onMenuChanged.next(key);
  }

  getPrmsnData(){
    this._authenticationService.getPermissionByAdminRole().subscribe(
      (res:any) => {
        if (!res.error) {
          this.accMenu = [];
          res.body.forEach(i=>{ 
            if(i.view_permission == '1') this.accMenu.push(i.permission_name)
          });
          if(this.accTo.access_to == "spend_trak"){
            this.accMenu = this.accMenu.filter(i=>{
              if(i != 'Position'){
                return i
              }
            })
          }
          this.setCurrentMenu('main') 
        } 
    }
    )
  }

  getCMAccessToByDate(){
    this._authenticationService.getCMAccessToByDate(this._authenticationService.currentUserValue.com_id ? this._authenticationService.currentUserValue.com_id : this._authenticationService.currentUserValue.id).subscribe((res:any) => {
      if(!res.err){
        this.accTo = res.body
      }
      this.getPrmsnData()
    })
  }
}
