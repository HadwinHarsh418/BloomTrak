import { Component, Inject, OnDestroy, OnInit, ElementRef, Renderer2, Output } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import * as Waves from 'node-waves';

import { CoreMenuService } from '@core/components/core-menu/core-menu.service';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { CoreConfigService } from '@core/services/config.service';
import { CoreLoadingScreenService } from '@core/services/loading-screen.service';
import { CoreTranslationService } from '@core/services/translation.service';
import { menu } from 'app/menu/menu';
import { locale as menuEnglish } from 'app/menu/i18n/en';
import { EncryptionService } from './utils/encryption/encryption.service';
import { CountriesService } from './auth/service/countries.service';
import { DataService } from './auth/service/data.service';
import StatesJson from '../assets/states.json';
import { AuthenticationService } from './auth/service';
import { Router } from '@angular/router';
import * as localforage from 'localforage';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  @Output() States: any = StatesJson;

  coreConfig: any;
  menu: any;
  defaultLanguage: 'en'; // This language will be used as a fallback when a translation isn't found in the current language
  appLanguage: 'en'; // Set application default language i.e fr

  // Private
  private _unsubscribeAll: Subject<any>;
  currentUser: any;
  dummyUrl: string;
  deviceToken: string;

  constructor(
    @Inject(DOCUMENT) private document: any,
    private _title: Title,
    private _renderer: Renderer2,
    private _elementRef: ElementRef,
    public _coreConfigService: CoreConfigService,
    private _coreSidebarService: CoreSidebarService,
    private _coreLoadingScreenService: CoreLoadingScreenService,
    private _coreMenuService: CoreMenuService,
    private _coreTranslationService: CoreTranslationService,
    private _translateService: TranslateService,
    private _encryptionService: EncryptionService,
    private _countriesService: CountriesService,
    private dataservice: DataService,
    private authService: AuthenticationService,
    private router:Router
  ) {
    // Get the application main menu;
    this.authService.currentUser.subscribe((x: any) => {
      this.currentUser = x;
      if(this.currentUser){
        if(this.currentUser?.user_role == '7'){
          this.router.navigate(['/clockin']);
          this.dummyUrl = window.location.pathname
        }
        if(window.location.pathname == '/clockin'){
          
          (this.currentUser) ? this.currentUser.user_role = '7' : '';
        }
      }else{
        this.dataservice.UserPermissions = null;
      }
    });
    
    this.menu = menu;

    // Register the menu to the menu service
    this._coreMenuService.register('main', this.menu);

    // Set the main menu as our current menu
    this._coreMenuService.setCurrentMenu('main');

    // Add languages to the translation service
    this._translateService.addLangs(['en']);

    // This language will be used as a fallback when a translation isn't found in the current language
    this._translateService.setDefaultLang('en');

    // Set the translations for the menu
    this._coreTranslationService.translate(menuEnglish);

    this._translateService.use('en');

    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    // Init wave effect (Ripple effect)
    Waves.init();
    localforage.getItem('logout-token');
    this.authService.logoutObservable$.subscribe(() => {
      localforage.removeItem(this.authService.logoutTokenKey);
    });
    // Subscribe to config changes
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;

      // Layout
      //--------

      // Remove default classes first
      this._elementRef.nativeElement.classList.remove(
        'vertical-layout',
        'vertical-menu-modern',
        'horizontal-layout',
        'horizontal-menu'
      );
      // Add class based on config options
      if (this.coreConfig.layout.type === 'vertical') {
        this._elementRef.nativeElement.classList.add('vertical-layout', 'vertical-menu-modern');
      } else if (this.coreConfig.layout.type === 'horizontal') {
        this._elementRef.nativeElement.classList.add('horizontal-layout', 'horizontal-menu');
      }

      // Navbar
      //--------

      // Remove default classes first
      this._elementRef.nativeElement.classList.remove(
        'navbar-floating',
        'navbar-static',
        'navbar-sticky',
        'navbar-hidden'
      );

      // Add class based on config options
      if (this.coreConfig.layout.navbar.type === 'navbar-static-top') {
        this._elementRef.nativeElement.classList.add('navbar-static');
      } else if (this.coreConfig.layout.navbar.type === 'fixed-top') {
        this._elementRef.nativeElement.classList.add('navbar-sticky');
      } else if (this.coreConfig.layout.navbar.type === 'floating-nav') {
        this._elementRef.nativeElement.classList.add('navbar-floating');
      } else {
        this._elementRef.nativeElement.classList.add('navbar-hidden');
      }

      // Footer
      //--------

      // Remove default classes first
      this._elementRef.nativeElement.classList.remove('footer-fixed', 'footer-static', 'footer-hidden');

      // Add class based on config options
      if (this.coreConfig.layout.footer.type === 'footer-sticky') {
        this._elementRef.nativeElement.classList.add('footer-fixed');
      } else if (this.coreConfig.layout.footer.type === 'footer-static') {
        this._elementRef.nativeElement.classList.add('footer-static');
      } else {
        this._elementRef.nativeElement.classList.add('footer-hidden');
      }

      // Blank layout
      if (
        this.coreConfig.layout.menu.hidden &&
        this.coreConfig.layout.navbar.hidden &&
        this.coreConfig.layout.footer.hidden
      ) {
        this._elementRef.nativeElement.classList.add('blank-page');
        // ! Fix: Transition issue while coming from blank page
        this._renderer.setAttribute(
          this._elementRef.nativeElement.getElementsByClassName('app-content')[0],
          'style',
          'transition:none'
        );
      } else {
        this._elementRef.nativeElement.classList.remove('blank-page');
        // ! Fix: Transition issue while coming from blank page
        setTimeout(() => {
          this._renderer.setAttribute(
            this._elementRef.nativeElement.getElementsByClassName('app-content')[0],
            'style',
            'transition:300ms ease all'
          );
        }, 0);
        // If navbar hidden
        if (this.coreConfig.layout.navbar.hidden) {
          this._elementRef.nativeElement.classList.add('navbar-hidden');
        }
        // Menu (Vertical menu hidden)
        if (this.coreConfig.layout.menu.hidden) {
          this._renderer.setAttribute(this._elementRef.nativeElement, 'data-col', '1-column');
        } else {
          this._renderer.removeAttribute(this._elementRef.nativeElement, 'data-col');
        }
        // Footer
        if (this.coreConfig.layout.footer.hidden) {
          this._elementRef.nativeElement.classList.add('footer-hidden');
        }
      }

      // Skin Class (Adding to body as it requires highest priority)
      if (this.coreConfig.layout.skin !== '' && this.coreConfig.layout.skin !== undefined) {
        this.document.body.classList.remove('default-layout', 'bordered-layout', 'dark-layout', 'semi-dark-layout');
        this.document.body.classList.add(this.coreConfig.layout.skin + '-layout');
      }
    });

    // Set the application page title
    this._title.setTitle(this.coreConfig.app.appTitle);

    if(!this.dataservice.geodata) {
      this.dataservice.getGeoDevData();
    } 
    if(!this.dataservice.devicedata) {
      this.dataservice.getDeviceData();
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
  toggleSidebar(key): void {
    this._coreSidebarService.getSidebarRegistry(key).toggleOpen();
  }
  
  
  // public throwTestError(): void {
  //   throw new Error("Sentry Test Error");
  // }
}
