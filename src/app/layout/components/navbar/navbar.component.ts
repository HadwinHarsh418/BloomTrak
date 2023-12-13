import { Component, OnDestroy, OnInit, HostBinding, HostListener, ViewEncapsulation, Input } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from 'app/auth/service';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { CoreConfigService } from '@core/services/config.service';
import { CoreMediaService } from '@core/services/media.service';
import { Role, User } from 'app/auth/models';
import { DataService } from 'app/auth/service/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NavbarComponent implements OnInit, OnDestroy {
  public horizontalMenu: boolean;
  public hiddenMenu: boolean;
  public coreConfig: any;
  public currentSkin: string;
  public prevSkin: string;
  public currentUser: User;
  public languageOptions: any;
  public navigation: any;
  public selectedLanguage: any;
  mainlogo = '';
  @HostBinding('class.fixed-top')
  public isFixed = false;
  @HostBinding('class.navbar-static-style-on-scroll')
  public windowScrolled = false;
  defaulAvtar: string;
  portal: any;
  portalName: string;
  portalName2: any;
  fromTime: number = new Date().getTime(); workId: any;
  startDateTime: number;
  roleData: any=[]
  roleData1: any=[]
  dummyUrl: boolean;


  // Add .navbar-static-style-on-scroll on scroll using HostListener & HostBinding
  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (
      (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop > 100) &&
      this.coreConfig.layout.navbar.type == 'navbar-static-top'
    ) {
      this.windowScrolled = true;
    } else if (
      (this.windowScrolled && window.pageYOffset) ||
      document.documentElement.scrollTop ||
      document.body.scrollTop < 10
    ) {
      this.windowScrolled = false;
    }
  }

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {Router} _router
   * @param {AuthenticationService} _authenticationService
   * @param {CoreConfigService} _coreConfigService
   * @param {CoreSidebarService} _coreSidebarService
   * @param {CoreMediaService} _coreMediaService
   * @param {MediaObserver} _mediaObserver
   * @param {TranslateService} _translateService
   */
  constructor(
    private _authenticationService: AuthenticationService,
    private _coreConfigService: CoreConfigService,
    private _coreMediaService: CoreMediaService,
    private _coreSidebarService: CoreSidebarService,
    private _mediaObserver: MediaObserver,
    public _translateService: TranslateService,
    public datasrv: DataService,
    private router:Router,

  ) {
    this._authenticationService.profilePicUpdate.subscribe(res => {
      if (res) {
        this.currentUser = this._authenticationService.currentUserValue;
      }
    })
    if(this.currentUser?.user_role == '7' || JSON.parse(localStorage.getItem('ClockIn'))== 'Yes'){
      this.router.navigate(['/clockin']);
      this.dummyUrl = JSON.parse(localStorage.getItem('ClockIn'))== 'Yes'
    }
    this.mainlogo = this._coreConfigService.mainLogo;
    this._authenticationService.currentUser.subscribe(x => (this.currentUser = x));
    this.currentUser = this._authenticationService.currentUserValue;

    this.languageOptions = {
      en: {
        title: 'English',
        flag: 'us'
      },
      es: {
        title: 'Español',
        flag: 'es'
      },
      fr: {
        title: 'French',
        flag: 'fr'
      },
      de: {
        title: 'German',
        flag: 'de'
      },
      pt: {
        title: 'Portuguese',
        flag: 'pt'
      }
    };

    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle sidebar open
   *
   * @param key
   */
  toggleSidebar(key): void {
    this._coreSidebarService.getSidebarRegistry(key).toggleOpen();
  }

  /**
   * Set the language
   *
   * @param language
   */
  setLanguage(language): void {
    // Set the selected language for the navbar on change
    this.selectedLanguage = language;

    // Use the selected language id for translations
    this._translateService.use(language);
  }

  /**
   * Toggle Dark Skin
   */
  toggleDarkSkin() {
    // Get the current skin
    this._coreConfigService
      .getConfig()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(config => {
        this.currentSkin = config.layout.skin;
      });

    // Toggle Dark skin with prevSkin skin
    this.prevSkin = localStorage.getItem('prevSkin');

    if (this.currentSkin === 'dark') {
      this._coreConfigService.setConfig(
        { layout: { skin: this.prevSkin ? this.prevSkin : 'default' } },
        { emitEvent: true }
      );
    } else {
      localStorage.setItem('prevSkin', this.currentSkin);
      this._coreConfigService.setConfig({ layout: { skin: 'dark' } }, { emitEvent: true });
    }
  }

  /**
   * Logout method
   */
  logout() {
    this._authenticationService.logout();
  }

  getCurrentUserDetail() {
   console.log(this.currentUser,'dddfdfdf');
   
    if (['1',1].includes(this.currentUser.prmsnId)|| this.currentUser.user_role == "7" ) {
      // if(this.currentUser.role == "Community"){
      //   let searchStr = ''
      //   this.datasrv.getUserById(searchStr ,this.currentUser.id ,'user').subscribe((res: any) => {
      //     if (res.body[0]?.first_name) {
      //       this.portalName2 = res.body[0].first_name +' '+ res.body[0].last_name
      //       this.portal = 'Community Portal'
      //     } 
      //   })
      // }
      // else{
        this.datasrv.getcommunityById(this.currentUser.id).subscribe((res: any) => {
          if (res.body[0]?.single_community == '0' && res.body[0]?.community_name) {
            this.portal = this.currentUser.user_role == "7" ? 'Clock In-Out' : 'Community Portal'
            this.portalName = this.currentUser.user_role == "7" ? 'Community' :  'Community Portal'
            this.portalName2 = res.body[0]?.community_name
          } else {
            this.portal = 'Community Portal'
            this.portalName = 'Community Portal'
            this.portalName2 = res.body[0]?.community_name
          }
        })
      // }
     
    } else if (this.currentUser.user_role== '3' || this.currentUser.user_role == '8' ) {
      this.datasrv.getManagementById(this.currentUser.id).subscribe((res: any) => {
        if (res.body[0]?.mg_name) {
          if(this.currentUser.user_role == '8'){
            this.portalName2 = res.body[0].first_name +' '+ res.body[0].last_name
            this.portal = 'Management Company'
            this.portalName = 'Management Company User'
          }else{
            this.portalName2 = res.body[0].first_name ?? res.body[0].contact_person_firstname ?? '' +' '+ res.body[0].last_name ?? res.body[0].last_name ?? res.body[0].contact_person_lastname ?? ''
          this.portal = 'Management Company'
          this.portalName = 'Management Company'
          }
        } 
        else{
          let searchStr = ''
        this.datasrv.getUserById(searchStr ,this.currentUser.id ,'user').subscribe((res: any) => {
          if (res.body[0]?.first_name) {
            if(this.currentUser.user_role == '8'){
              this.portalName2 = res.body[0].first_name +' '+ res.body[0].last_name
              this.portal = 'Management Company'
              this.portalName = 'Management Company User'
            }else{
              this.portalName2 = res.body[0].first_name +' '+ res.body[0].last_name
            this.portal = 'Management Company'
            this.portalName = 'Management Company'
            }
            
          } 
        })
        }
      })
    }
    else if (this.roleData1.includes(this.currentUser.prmsnId)) {
    let searchStr = ''
        this.datasrv.getUserById(searchStr ,this.currentUser.id ,'user').subscribe((res: any) => {
          if (res.body[0]?.first_name) {
            this.portalName2 = res.body[0].first_name +' '+ res.body[0].last_name
            this.portal = 'Community Portal'
          } 
        })
    }
    else if (['2',2].includes(this.currentUser.prmsnId)) {
      this.datasrv.getAgenciesByID(this.currentUser.id).subscribe((res: any) => {
        if (res.body[0]?.agency_name) {
          this.portalName2 = res.body[0].agency_name
        } 
      })
    }
    else if (['4','5'].includes(this.currentUser.prmsnId) || ['4','5',4,5].includes(this.currentUser.user_role)) {
      let searchStr = ''
      this.datasrv.getUserById(searchStr ,this.currentUser.id ,'user').subscribe((res: any) => {
        if (res.body[0]?.first_name) {
          this.portalName2 = res.body[0].first_name +' '+ res.body[0].last_name
        } 
      })
    } else {
      this.portalName2 = 'Admin'
    }
  }

  getRole(){
    this.datasrv.getAllRole().subscribe((res:any)=>{
       res.body.filter(i=>{ this.roleData.push(i.id.toString())})
       this.roleData.map(i=>{
        if(i != 1 &&i != 2 && i != 3  && i != 4 && i != 5 && i!= 6 ){
          this.roleData1.push(i)
        }
       })
       if(this.roleData1){
        this.getCurrentUserDetail()
      }
       
    })
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // /assets/images/avatars/10.png
    // get the currentUser details from localStorage

    // Subscribe to the config changes

    // this.startTime()

    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
      this.horizontalMenu = config.layout.type === 'horizontal';
      this.hiddenMenu = config.layout.menu.hidden === true;
      this.currentSkin = config.layout.skin;

      // Fix: for vertical layout if default navbar fixed-top than set isFixed = true
      if (this.coreConfig.layout.type === 'vertical') {
        setTimeout(() => {
          if (this.coreConfig.layout.navbar.type === 'fixed-top') {
            this.isFixed = true;
          }
        }, 0);
      }
    });

    // Horizontal Layout Only: Add class fixed-top to navbar below large screen
    if (this.coreConfig.layout.type == 'horizontal') {
      // On every media(screen) change
      this._coreMediaService.onMediaUpdate.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
        const isFixedTop = this._mediaObserver.isActive('bs-gt-xl');
        if (isFixedTop) {
          this.isFixed = false;
        } else {
          this.isFixed = true;
        }
      });
    }

    // Set the selected language from default languageOptions
    this.selectedLanguage = _.find(this.languageOptions, {
      id: this._translateService.currentLang
    });

      if(this.currentUser && this.currentUser.role){
        this.portal = this.currentUser.role == 'SuperAdmin' ? 'bloomtrak' :
          this.currentUser.role == 'Agency' ? 'Agency Portal ' :  this.currentUser.role == "Admin" ? 'Management Company' : this.currentUser.role == 'Community' ? 'Community  Portal' : 'User Portal ';
    
        this.portalName = this.currentUser.role == 'SuperAdmin' ? 'bloomtrak' :
          this.currentUser.role == 'Community' ? 'Community  ' :
            this.currentUser.role == 'Agency' ? 'Agency Portal' :  this.currentUser.role == "Admin" ? 'Management Company' : this.currentUser.role == 'Community User' ? 'Community User' : 'User';
            this.getRole()
           
      }else if(this.currentUser && this.currentUser?.user_role =='7'){
        this.datasrv.getcommunityById(this.currentUser.id).subscribe((res: any) => {
          if (res.body[0]?.single_community == '0' && res.body[0]?.community_name) {
            this.portal = this.currentUser.user_role == "7" ? 'Clock In-Out' : 'Community Portal'
            this.portalName = this.currentUser.user_role == "7" ? 'Community' :  'Community Portal'
            this.portalName2 = res.body[0]?.community_name
          } else {
            this.portal = 'Community Portal'
            this.portalName = 'Community Portal'
            this.portalName2 = res.body[0]?.community_name
          }
        })
      }

  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
    this._authenticationService.profilePicUpdate.complete();
  }
}
