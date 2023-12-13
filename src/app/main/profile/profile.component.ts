import { Component, ElementRef, Injectable, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbDateStruct, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'app/auth/models';
import { AuthenticationService, UserService } from 'app/auth/service';
import { EncryptionService } from 'app/utils/encryption/encryption.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { TranslateService } from '@ngx-translate/core';
import { MyAccountService } from './my-account.service';
import { DataService } from 'app/auth/service/data.service';
import { ActivatedRoute } from '@angular/router';
import { Patterns } from 'app/auth/helpers/patterns';
import { MustMatch } from 'app/auth/helpers';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Location } from '@angular/common';
import StatesJson from 'assets/states.json';
import { StaticServiceService } from 'app/utils/static-service.service';
import { NgbDate, NgbCalendar, NgbDateParserFormatter, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';


@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {
  readonly DELIMITER = '/';

  parse(value: string): NgbDateStruct | null {
    if (value) {
      const date = value.split(this.DELIMITER);
      return {
        day: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        year: parseInt(date[2], 10),
      };
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    return date
      ? date.month + this.DELIMITER + date.day + this.DELIMITER + date.year
      : '';
  }
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class UserProfileComponent implements OnInit {
  States:any = StatesJson;

  @ViewChild('enable2fa') enable2fa: ElementRef<any>;
  @ViewChild('disable2fa') disable2fa: ElementRef<any>;
  @ViewChild('antiPhishingModal') antiPhishingModal: ElementRef<any>;
  @ViewChild('file', { static: false }) fileupload: ElementRef;
  public contentHeader: object;
  public updatePersonalInfo: FormGroup;
  public data: any;
  public subsAll: any[] = [];
  public currentUser: User;
  public dob: NgbDateStruct;
  loading: boolean;
  error: any;
  success: any;
  file: File;
  isLoading: boolean;
  logLoading: boolean;
  logs: any[] = [];
  curComDetails: any;
  comunityId: any;
  uptingVerification: boolean;
  selectedImageIndex = 0;
  showFlag: boolean;
  imageObject: any[] = [];
	closeResult = '';
	hoveredDate: NgbDate | null = null;

	fromDate: NgbDate | null;
	toDate: NgbDate | null;

  dropdownSettings: IDropdownSettings = {
    singleSelection: true,
    idField: 'id',
    textField: 'mg_name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    closeDropDownOnSelection: true,
    itemsShowLimit: 3,
    allowSearchFilter: true
  };

  cancellation_period: any = [
    { hour: '02' },
    { hour: '03' },
    { hour: '04' },
    { hour: '06' },
    { hour: '12' },
    { hour: '24' },
  ]

  formData!: FormGroup;
  Primary!: FormGroup;
  Servey!: FormGroup;
  radioData!: FormGroup;
  managementServey!: FormGroup;
  id: any;
  btnShow: boolean = false;
  tempCmntyId: any;
  activeTab: number = 0;
  userid: any;

  confirmForm!: FormGroup;
  drpForm!: FormGroup;
  getMangemntId_names: any =[]
  manag: any =[]
  state:any;
  brdLbl: any;
  selectedDataValue  = "+1";
  phoneUsd: { name: string; flag: string; code: string; dial_code: string; }[];
  addAccTo!: FormGroup;
  errTru: boolean;
  selectedIndex: any;

  tabChanged(ev:any) {
    this.activeTab = ev.nextId.replace('ngb-nav-','');
    if(this.activeTab == 1) {
      setTimeout(() => {
        this.Primary.get('primary_contact_phone').setValue(this.Primary.value.primary_contact_phone);
      }, 1200)
    }
    else if(this.activeTab == 0) {
      setTimeout(() => {
        this.formData.get('state').setValue(this.formData.value.state);
      }, 1200)
      setTimeout(() => {
        this.managementServey.get('management_company_phone').setValue(this.managementServey.value.management_company_phone);
        this.managementServey.get('management_company_contact_person').setValue(this.managementServey.value.management_company_contact_person);
      }, 1200)
    }
  }


  constructor(
    public myAccountService: MyAccountService,
    private _authenticationService: AuthenticationService,
    public _userService: UserService,
    private encryptionService: EncryptionService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    public toastr: ToastrManager,
    private dataService: DataService,
    private aCtRoute: ActivatedRoute,
    private fb: FormBuilder,
    private loctn  : Location,
    private phoneService : StaticServiceService,
    private calendar: NgbCalendar,
     public formatter: NgbDateParserFormatter
  ) {
    this.phoneUsd = this.phoneService.phoneUsdCode

    this.aCtRoute.params.subscribe(
      res => {
        if (res.id) {
          this.comunityId = res.id;
          this.getCommunityDetails();
        }
      }
    )
    this.subsAll.push(this._authenticationService.currentUser.subscribe(x => (this.currentUser = x)));
    this.updatePersonalInfo = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      driving_licence: ['', Validators.required],
      address: ['',],
      phone: ['',],
      age: ['',],
      gender: ['', Validators.required],
    });
    this.fromDate = calendar.getToday();
		this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);

  }
  onDateSelection(date: NgbDate) {
		if (!this.fromDate && !this.toDate) {
			this.fromDate = date;
		} else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
			this.toDate = date;
		} else {
			this.toDate = null;
			this.fromDate = date;
		}
	}

	isHovered(date: NgbDate) {
		return (
			this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
		);
	}

	isInside(date: NgbDate) {
		return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
	}

	isRange(date: NgbDate) {
		return (
			date.equals(this.fromDate) ||
			(this.toDate && date.equals(this.toDate)) ||
			this.isInside(date) ||
			this.isHovered(date)
		);
	}

	validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
		const parsed = this.formatter.parse(input);
		return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
	}
  get profileForm() {
    return this.updatePersonalInfo.controls;
  }
  mapCountry_selected(data){
    return this.selectedDataValue = data.dial_code;
  }
  ngOnInit(): void {
    this.state = this.States
    this.currentUser = this._authenticationService.currentUserValue;
    this.getCmAcess();
    
    this.getCommunityDetails();
    // this.getLoginLogs();
    this.getMangemntId_name()
    // content header
   setTimeout(() => {
    this.contentHeader = {
      headerTitle: 'Community',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Home',
            isLink: true,
            link: '/'
          },
          {
            name: 'Communities',
            isLink: true,
            link: '/community'
          },
          {
            name: this.brdLbl,
            isLink: false,
            link: '/community'
          },
        ]
      }
    };
   }, 500);
   

    this.formData = this.fb.group({
      community_name: ['', Validators.required],
      community_address1: ['', Validators.required],
      community_address2: ['', ],
      community_website: ['', [Validators.required]],
      community_email: ['', [Validators.required,Validators.email]],
      city: ['', Validators.required],
      cancellation_period: ['', Validators.required],
      zipcode: ['', Validators.required],
      state: ['', Validators.required],
      community_phone_no: ['', [Validators.required, Validators.pattern(Patterns.number)]],
      id: this.comunityId ? this.comunityId : ''
    })

    this.Primary = this.fb.group({
      primary_contact_firstname: ['', Validators.required],
      primary_contact_lastname: ['', Validators.required],
      primary_contact_title: ['', Validators.required],
      primary_contact_phone: ['', [Validators.required]],
      primary_contact_email: ['', [Validators.required, Validators.email]],
      id: this.id ? this.id : ''
    })

    this.addAccTo = this.fb.group({
      trak_type: ['0'],
    })

    this.drpForm = this.fb.group({
      getMangemntId: ['', [Validators.required]]

    })

    // this.Servey = this.fb.group({
    //   survey_compliance_name: ['', Validators.required],
    //   survey_compliance_title: ['', Validators.required],
    //   survey_compliance_phone: ['', [Validators.required, Validators.pattern(Patterns.number)]],
    //   survey_compliance_email: ['', [Validators.required, Validators.pattern(Patterns.email)]],
    //   id: this.id ? this.id : ''

    // })

    this.managementServey = this.fb.group({
      management_company_name: ['', Validators.required],
      management_company_address1: ['', Validators.required],
      citymanagement: ['', Validators.required],
      statemanagement: ['', Validators.required],
      zipmanagement: ['', Validators.required],
      management_company_phone: ['', [Validators.required, Validators.pattern(Patterns.number)]],
      management_company_email: ['', [Validators.required, Validators.email]],
      management_company_contact_person: ['', [Validators.required,Validators.pattern(Patterns.number)]],
      id: this.id ? this.id : ''

    })

    this.radioData = this.fb.group({
      single_community: ['', [Validators.required]]
    })

    this.confirmForm = this.fb.group({
      id: this.id ? this.id : '',
      oldpassword: ['', [Validators.required, Validators.pattern(Patterns.password)]],
      newPassword: ['', [Validators.required, Validators.pattern(Patterns.password)]],
      confPassword: ['', [Validators.required]],
},{ Validators: MustMatch('newPassword', 'confPassword')})

if(this.currentUser.role == 'SuperAdmin')
{
 this.confirmForm.controls['oldpassword'].clearValidators();
 this.confirmForm.updateValueAndValidity();
}
else
{
 this.confirmForm.controls['oldpassword'].setValidators(Validators.required);
 this.confirmForm.updateValueAndValidity();
}

  }

  getCommunityDetails() {
    this.loading = true;
    let id = this.comunityId;
    this._userService.getcommunityDetails(id).subscribe(response => {
      if (!response.error) {

        if (response.body && response.body[0] && response.body[0]) {
          this.curComDetails = response.body[0];
          this.brdLbl = this.curComDetails.community_name
          this.mapFormValues();
        }
      } else {
        this.error = response.msg;
        this._authenticationService.errorToaster(response);
      }
      this.loading = false;
    }, error => {
      this.error = error;
      this.loading = false;
    }
    );
  }

  mapFormValues() {
 setTimeout(() => {
  this.formData.patchValue({
    community_name: this.curComDetails.community_name,
    community_phone_no: this.curComDetails.community_phone_no,
    community_address1: this.curComDetails.community_address1,
    community_address2: this.curComDetails.community_address2,
    community_website: this.curComDetails.community_website,
    cancellation_period: this.curComDetails.cancellation_period,
    community_email: this.curComDetails.community_email,
    state: this.curComDetails.state,
    city: this.curComDetails.city,
    zipcode: this.curComDetails.zipcode,
  });

 }, 1200);
  
    setTimeout(() => {
      this.Primary.patchValue({
        primary_contact_firstname: this.curComDetails.primary_contact_firstname,
        primary_contact_lastname: this.curComDetails.primary_contact_lastname,
        primary_contact_title: this.curComDetails.primary_contact_title,
        primary_contact_phone: this.curComDetails.primary_contact_phone,
        primary_contact_email: this.curComDetails.primary_contact_email,
        id: this.id ? this.id : ''
      });
    }, 1200);
   

    // this.Servey.patchValue({
    //   survey_compliance_name: this.curComDetails.survey_compliance_name,
    //   survey_compliance_title: this.curComDetails.survey_compliance_title,
    //   survey_compliance_phone: this.curComDetails.survey_compliance_phone,
    //   survey_compliance_email: this.curComDetails.survey_compliance_email,
    //   id: this.id ? this.id : ''
    // });

    // this.managementServey.patchValue({
    //   management_company_name: this.curComDetails.management_company_name,
    //   management_company_address1: this.curComDetails.management_company_address1,
    //   management_company_phone: this.curComDetails.management_company_phone,
    //   citymanagement: this.curComDetails.city,
    //   zipmanagement: this.curComDetails.zipcode,
    //   management_company_email: this.curComDetails.management_company_email,
    //   management_company_contact_person: this.curComDetails.management_company_contact_person,
    //   id: this.id ? this.id : ''
    // });

    this.radioData.patchValue({
      single_community: this.curComDetails.single_community,
    });

    // this.addAccTo.patchValue({
    //   shift_type1: this.curComDetails.access_to == 0 ? '0' : false,
    //   shift_type2: this.curComDetails.access_to == 1 ? '1' : false,
    //   shift_type3: this.curComDetails.access_to == 2 ? '2' : false,
    // });

    let mgNm =  this.getMangemntId_names.filter(d => d.mg_name === this.curComDetails.mg_name);
    this.drpForm.patchValue({
      getMangemntId: mgNm,
    })
  }

  changeDatetoNgStructr(date: any): NgbDateStruct {
    let da = new Date(date);
    da = !isNaN(da.getTime()) ? da : new Date();
    return {
      year: da.getFullYear(),
      month: da.getMonth() + 1,
      day: da.getDate(),
    }
  }

  changeNgStructrToDate(date: any) {
    let dt = new Date();
    return (date && date.year)
      ? `${date.year}-${date.month}-${date.day}`
      : `${dt.getFullYear()}-${dt.getMonth() + 1}-${dt.getDate()}`;
  }
  save(modal:any){
    
     modal.close();
   
  }

  submitProfile() {
    this.success = '';
    this.error = '';
    for (const key in this.updatePersonalInfo.controls) {
      if (Object.prototype.hasOwnProperty.call(this.updatePersonalInfo.controls, key)) {
        this.updatePersonalInfo.controls[key].markAsDirty();
      }
    }

    if (this.updatePersonalInfo.invalid) {
      return;
    }

    let data = {
      user_id: this.comunityId,
      first_name: this.updatePersonalInfo.value.first_name,
      last_name: this.updatePersonalInfo.value.last_name,
      gender: this.updatePersonalInfo.value.gender,
      address: this.updatePersonalInfo.value.address || '',
      age: this.updatePersonalInfo.value.age || '',
      phone: this.updatePersonalInfo.value.phone || '',
      driving_licence: this.updatePersonalInfo.value.driving_licence,
    }
    let enc_Data = { enc: this.encryptionService.encode(JSON.stringify(data)) };
    this.loading = true;
    this._userService.updateUserDetails(enc_Data).subscribe(
      res => {
        if (!res.error) {
          this.getCommunityDetails();
          this.success = res.msg;
          this.loctn.back()
          setTimeout(() => { this.success = ''; }, 2000)
        } else {
          this.loading = false;
          this.error = res.msg;
          this._authenticationService.errorToaster(res, false);
        }
      }, error => {
        this.error = error;
        this.loading = false;
      }
    )

  }

  modalOpenOSE(modalOSE) {
    this.modalService.open(modalOSE,
      {
        backdrop: false,
        centered: true,
      }
    );
  }

  closed(modal: NgbModalRef) {
    modal.dismiss();
  }


	open(content) {
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
			(result) => {
				this.closeResult = `Closed with: ${result}`;
			},
			(reason) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
		);
	}

	private getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
			return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return 'by clicking on a backdrop';
		} else {
			return `with: ${reason}`;
		}
	}
  fileChange(file) {
    this.file = file.target.files[0];
    if (this.file != undefined && this.file != null) {
      var strFileName = this.getFileExtension1(this.file.name);
      if (strFileName != 'jpeg' && strFileName != 'png' && strFileName != 'jpg') {
        this.toastr.errorToastr('Please select correct image format', '', {
          position: 'bottom-right'
        });
        return;
      }
    } else {
      this.toastr.errorToastr('Please select image', '', {
        position: 'bottom-right'
      });
      return;
    }
    var input_data = {
      "profile_pic": this.file == undefined ? "" : this.file
    }

    const formData = new FormData();
    formData.append('profilePic', input_data.profile_pic);
    formData.append('id', this.comunityId);

    //const httpOptions = { headers: new HttpHeaders({'token': this.token})};
    this.isLoading = true;
    this._userService.uploadProfilePic(formData).subscribe((res) => {
      if (!res['error']) {
        this.curComDetails.profile_pic = res['body'][0].profilePic;
        this.fileupload.nativeElement.value = "";
        this.isLoading = false;
        this.toastr.successToastr('Profile picture updated successfully');
      } else {
        this.isLoading = false;
        this.fileupload.nativeElement.value = "";
        this.toastr.errorToastr(res['msg']);
      }
    }, error => {
      this.isLoading = false;
      this.fileupload.nativeElement.value = "";
      this.toastr.errorToastr(error);
    })

  }

  getFileExtension1(filename) {
    return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename)[0] : undefined;
  }
  /**
   * Clear all subscriptions
  */
  ngOnDestroy() {
    this.subsAll.map(
      item => {
        item.unsubscribe();
        item = null;
      }
    )
  }


  // getLoginLogs() {
  //   this.logLoading = true
  //   this.dataService.getLoginLogs(this.currentUser._id).subscribe((res) => {
  //     if (!res['error']) {
  //       this.logs = res['body']
  //       this.logLoading = false
  //     }
  //   })
  // }

  updateVerificationStatus(status, msg = '') {
    if (this.curComDetails && this.curComDetails.drivingLicense
      && this.curComDetails.secondaryDocument && this.curComDetails.picWithDL) {
      let encDat = this.encryptionService.encode(JSON.stringify({ user_id: this.comunityId, status: status }));
      this.uptingVerification = true;
      this._userService.verfifyDocument({ enc: encDat }).subscribe(
        res => {
          let data = this.encryptionService.getDecode(res);
          if (!data.error) {
            this.curComDetails.documentStatus = status ? '2' : '3';
            this.toastr.successToastr(data.msg);
          } else {
            this._authenticationService.errorToaster(data);
          }
          this.uptingVerification = false;
        }, error => {
          this.uptingVerification = false;
          this.toastr.errorToastr('Something went wrong while updating status, please try again later');
        }
      )
    } else {
      return;
    }
  }

  showLightbox(img) {
    this.imageObject = [{ image: img }];
    this.selectedImageIndex = 0;
    this.showFlag = true;
  }

  closeEventHandler() {
    this.showFlag = false;
    this.imageObject = [];
    this.selectedImageIndex = -1;
    let b = document.body;
    b.style.overflow = 'unset';
  }

  get controls() {
    return this.formData.controls;
  }

  get pControls() {
    return this.Primary.controls
  }



  submitted() {
    for (let item of Object.keys(this.controls)) {
      this.controls[item].markAsDirty()
    }
    if (this.formData.invalid) {
      return;
    }
    else {
      
      
      this.btnShow = true;
      let body1={
        community_name: this.formData.value.community_name,
        community_phone_no: this.formData.value.community_phone_no.replace(/\D/g, ''),
        community_address1: this.formData.value.community_address1,
        community_address2: this.formData.value.community_address2,
        cancellation_period: this.formData.value.cancellation_period,
        city: this.formData.value.city,
        zipcode: this.formData.value.zipcode,
        state: this.formData.value.state,
        id: this.comunityId  ? this.comunityId : ''
      }
      this.dataService.editCommunity(body1).subscribe((res: any) => {
        if (!res.error) {
          this.toastr.successToastr(res.msg);
          this.tempCmntyId = res.body[0].id
        } else {
          this.toastr.errorToastr(res.msg);
        }
        this.btnShow = false;
      },
      (err) => {
        this.btnShow = false;
        this.dataService.genericErrorToaster();
        
      })
    }
  }

  primarySubmit() {
    for (let item of Object.keys(this.pControls)) {
      this.pControls[item].markAsDirty()
    }
    if (this.Primary.invalid) {
      return;
    }
    else {
      let data = { ...this.Primary.value, ...{ id: this.comunityId } }
      this.btnShow = true;
      let body1={
        primary_contact_firstname: this.Primary.value.primary_contact_firstname,
        primary_contact_lastname: this.Primary.value.primary_contact_lastname,
        primary_contact_title: this.Primary.value.primary_contact_title,
        primary_contact_email: this.Primary.value.primary_contact_email,
        primary_contact_phone: this.Primary.value.primary_contact_phone.replace(/\D/g, ''),
        id: this.comunityId ? this.comunityId : ''
      }
      this.dataService.updatePrimaryContact(body1).subscribe((res: any) => {
        if (!res.error) {
          this.toastr.successToastr(res.msg);
          this.btnShow = false;
        }else{
          this.toastr.errorToastr(res.msg);
          this.btnShow = false;
        }
      }, (err: any) => {
        this.dataService.genericErrorToaster()
        this.btnShow = false;
      })
    }
  }

  // serveySubmit() {
  //   this.btnShow = true;
  //   for (let item of Object.keys(this.psc)) {
  //     this.psc[item].markAsDirty()
  //   }
  //   if(this.Servey.invalid){
  //   this.btnShow = false;
  //     return;
  //   }
  //   let data = { ...this.Servey.value, ...{ id: this.comunityId } }
  //   let body1={
  //     survey_compliance_email: this.Servey.value.survey_compliance_email,
  //     survey_compliance_name: this.Servey.value.survey_compliance_name,
  //     survey_compliance_title: this.Servey.value.survey_compliance_title,
  //     survey_compliance_phone: this.Servey.value.survey_compliance_phone.replace(/\D/g, ''),
  //     id: this.comunityId ? this.comunityId : ''

  //   }
  //   
  //   this.dataService.updateSurveyCompliance(body1).subscribe((res: any) => {
  //     if (!res.error) {
  //       this.toastr.successToastr(res.msg);
  //       this.btnShow = false;
  //     }
  //   },
  //     (err: any) => {
  //       this.dataService.genericErrorToaster()
  //       this.btnShow = false;
  //     })
  // }

  managementSubmit() {
    this.btnShow = true;
    for (let item of Object.keys(this.mc)) {
      this.mc[item].markAsDirty()
    }
    if(this.managementServey.invalid){
    this.btnShow = false;
      return;
    }
    let data = { ...this.managementServey.value, ...{ id: this.comunityId } }
    this.btnShow = true;
    let body1={
      management_company_name: this.managementServey.value.management_company_name,
      management_company_address1: this.managementServey.value.management_company_address1,
      management_company_phone: this.managementServey.value.management_company_phone.replace(/\D/g, ''),
      management_company_email: this.managementServey.value.management_company_email,
      management_company_contact_person: this.managementServey.value.management_company_contact_person.replace(/\D/g, ''),
      id: this.comunityId ? this.comunityId : ''
    }
    this.dataService.updateManagementCompany(body1).subscribe((res: any) => {
      if (!res.error) {
        this.toastr.successToastr(res.msg);
      }
      this.btnShow = false;

    },
      (err: any) => {
        this.dataService.genericErrorToaster()
      })
    this.btnShow = false;

  }

  radioData1() {
    let data = { ...this.radioData.value, ...{ id: this.comunityId } }
    this.btnShow = true;
    this.dataService.updateSinleCOm(data).subscribe((res: any) => {
      if (!res.error) {
        this.toastr.successToastr(res.msg);
        this.ngOnInit();
      }
      this.btnShow = false;

    },
      (err: any) => {
        this.dataService.genericErrorToaster()
      })
    this.btnShow = false;

  }

  get fControls() {
    return this.confirmForm.controls
  }

  // get psc() {
  //   return this.Servey.controls
  // }

  get mc() {
    return this.managementServey.controls
  }



  confirmSubmit() {
    for (let item of Object.keys(this.fControls)) {
      this.fControls[item].markAsDirty()
    }
    if (this.confirmForm.invalid) {
      return;
    }
    else {
      if(this.currentUser.role == 'SuperAdmin'){
        this.data = {
          confPassword : this.confirmForm.value.confPassword,
          newPassword : this.confirmForm.value.newPassword,
          password:'',
          id : this.comunityId
        }

      }
      else{
        this.data = this.confirmForm.value;
        this.data.id = this.comunityId;
      }
      this.btnShow = true;
      this.dataService.updateCommunityPassword(this.data).subscribe((res: any) => {
        if (!res.error) {
          this.toastr.successToastr(res.msg);         
          this.btnShow = false;
          this.confirmForm.reset();
        }else{
          this.toastr.errorToastr(res.msg);         
          this.btnShow = false;
        }
      }, (err: any) => {
        this.dataService.genericErrorToaster()
        this.btnShow = false;
      })
    }
  }

  getMangemntId_name() {
    this.dataService.getManagementNames().subscribe(res => {
      if (!res.error) {
        this.getMangemntId_names = res.body.sort(function(a, b){
          if(a.mg_name.toUpperCase() < b.mg_name.toUpperCase()) { return -1; }
          if(a.mg_name.toUpperCase() > b.mg_name.toUpperCase()) { return 1; }
          return 0;
      })
      } else {
        this._authenticationService.errorToaster(res);
      }
      this.btnShow = false;
    }, error => {
      this.dataService.genericErrorToaster();
      this.btnShow = false;
    });
  }

  get dp() {
    return this.drpForm.controls
  }

  get FormData_Control() {
    return this.addAccTo.controls
  }
  

  drpForm1(){
  for (let item of Object.keys(this.dp)) {
    this.dp[item].markAsDirty()
  }
  if (this.drpForm.invalid) {
    return;
  }
  this.drpForm.value.getMangemntId.forEach(element => {
    this.manag.push(element.id)
  });
  let data ={ id  : this.comunityId , management_id: this.manag}
  this.dataService.updateManagementId(data).subscribe((res: any) => {
    if (!res.error) {
      this.btnShow = false;
      this.toastr.successToastr(res.msg);
    }
  },
    (err: any) => {
      this.btnShow = false;
      this.dataService.genericErrorToaster()
    })

}

goBack(){
  this.loctn.back()
}

getCmAcess(){
  this.dataService.getCMAccessByID(this.comunityId).subscribe((res: any) => {
    if (!res.error) {
        
        if(res['body']['0']){
          let last:any = res['body'][res['body'].length-1];
          this.addAccTo.patchValue({
            trak_type: last.access_to,
          });
          let validDate = new Date(last.start_date * 1000).toISOString(); 
          let d = new Date(validDate);
           
          let endDate  = new Date(last.end_date * 1000).toISOString(); 
          let e = new Date(endDate);
           this.fromDate.year=d.getFullYear();
           this.fromDate.month=d.getMonth()+1;
           this.fromDate.day=d.getDate();
           this.toDate.year=e.getFullYear();
           this.toDate.month=e.getMonth()+1;
           this.toDate.day=e.getDate();
        }
       
     }else{
      
   }
  }, (err: any) => {
    this.dataService.genericErrorToaster()
    this.btnShow = false;
  })
}
addAccToSubmit(){
  // if(!this.FormData_Control.shift_type1.value && !this.FormData_Control.shift_type2.value && !this.FormData_Control.shift_type3.value){
  //     this.errTru =true
  //   return;
  // }
  let data ={
    access_to:this.addAccTo.value.shift_type1 == true ? '0' : this.addAccTo.value.shift_type2 == true ? '1' : '2' ,
    id: this.comunityId
  }
  
  const input_data={
    community_id:this.comunityId,
    access_to:this.addAccTo.value.trak_type ,
    start_date:new Date(Date.UTC(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day)),
    end_date:new Date(Date.UTC(this.toDate.year, this.toDate.month - 1, this.toDate.day)),
   }
  
   this.loading=  true;
   this.dataService.addCMAccessTo(input_data).subscribe((res: any) => {
    if (!res.error) {
      this.toastr.successToastr(res.msg);
      this.loading=  false;

      this.getCmAcess();
      this.btnShow = false;
    }else{
      this.loading=  false;
      this.toastr.errorToastr(res.msg);
      this.btnShow = false;
    }
  }, (err: any) => {
    this.loading=  false;
    this.dataService.genericErrorToaster()
    this.btnShow = false;
  })
  // this.dataService.addAccessTo(data).subscribe((res:any)=>{
  //   
  //   if(!res.error){
  //       this.loading=  false;
  //     this.toastr.successToastr(res.msg)
  //     // this._router.navigate(['/menu'])
  //   }else{
  //     this.loading=  false;
  //     this.toastr.errorToastr(res.msg)
  //   }
  // },err=>{
  //   this.loading=  false;
  //   this.dataService.genericErrorToaster()
  // })
}

chckBx(e,index){
  

  if(e.target.checked){
    this.errTru =false
  }
  // if(!this.FormData_Control.shift_type1.value && !this.FormData_Control.shift_type2.value && !this.FormData_Control.shift_type3.value){
  //   this.errTru =true
  // }
}

}
