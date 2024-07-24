import { ChangeDetectionStrategy, Component, ElementRef, OnInit, Pipe, PipeTransform, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbDateStruct, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'app/auth/models';
import { AuthenticationService, UserService } from 'app/auth/service';
import { EncryptionService } from 'app/utils/encryption/encryption.service';
import { ToastrManager } from 'ng6-toastr-notifications';
// import jspdf from 'jspdf';
import { TranslateService } from '@ngx-translate/core';
import { MyContractService } from './my-contract.service';
import { DataService } from 'app/auth/service/data.service';
import { ActivatedRoute } from '@angular/router';
import { interval } from 'rxjs';



@Component({
  selector: 'app-contract-profile',
  templateUrl: './contract-profile.component.html',
  styleUrls: ['./contract-profile.component.scss'],
})
export class ContractProfileComponent implements OnInit {

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
  formData!: FormGroup;
  assignData: FormGroup;
  confirmForm!: FormGroup;
  Servey!: FormGroup;
  radioData!: FormGroup;
  managementServey!: FormGroup;
  id: any;
  btnShow: boolean = false;
  tempCmntyId: any;
  activeTab: number = 1;
  userid: any;

  allAgency: any = [];
  allUsers: any = [];
  hideCalendar1: boolean;
  hideTimer: boolean;

  startDateTime: number;
  runTime: any;
  fromTime: number = new Date().getTime();workId: any;
;
  intrvl: any = null;




  constructor(
    public MyContractService: MyContractService,
    private _authenticationService: AuthenticationService,
    public _userService: UserService,
    private encryptionService: EncryptionService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    public toastr: ToastrManager,
    private translateService: TranslateService,
    private dataService: DataService,
    private aCtRoute: ActivatedRoute,
    private fb: FormBuilder,


  ) {
    this.aCtRoute.params.subscribe(
      res => {
        if (res.id) {
          this.comunityId = res.id;
          this.getcontractDetails();
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
  }


  ngOnInit(): void {




    this.currentUser = this._authenticationService.currentUserValue;
    this.getcontractDetails();
    this.getLoginLogs();
    this.getAgencyId();
    this.getUserId();
    this.hideCalendar();
    // content header
    this.contentHeader = {
      headerTitle: 'Contracts ',
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
            name: 'Contracts ',
            isLink: true,
            link: '/contracts'
          },
          {
            name: 'Profile',
            isLink: false
          }
        ]
      }
    };

    this.formData = this.fb.group({
      project_name: ['', Validators.required],
      community_name: ['', Validators.required],
      agency_name: ['', Validators.required],
      email: ['', Validators.required],
      budget: ['', Validators.required],
      estimate: ['', Validators.required],
      status: ['', Validators.required],

    })

    this.assignData = this.fb.group({
      id: this.id ? this.id : '',
      assigned_to_agency: ['', Validators.required],
      assigned_to_user: ['', Validators.required],
    })
  }



  startTime() {
    this.startDateTime = new Date().getTime();
    if (this.intrvl)
      clearInterval(this.intrvl)
    this.intrvl = setInterval(() => { this.setTime() }, 10000)
    let data = { user_id: this.currentUser?.id, contract_id: this.comunityId }
    this._userService.startWork(data).subscribe((res: any) => {
      this.workId = res.body
    })

    this.hideTimer = true;

  }

  endTime()
{
  // clearInterval(this.intrvl)
    this._userService.endWork(this.workId).subscribe((res:any) =>{

    })
    this.hideTimer = false;
}

  setTime() {

    this.startDateTime = new Date().getTime();
  }
  hideCalendar() {
    if (this.currentUser && this.currentUser?.role == 'User') {
      this.hideCalendar1 = true;
    } else {
      this.hideCalendar1 = false;
    }
  }

  getcontractDetails() {
    this.loading = true;
    let id = this.comunityId;
    this._userService.getcontractDetails(id).subscribe(response => {
      if (!response.error) {

        if (response.body && response.body[0] && response.body[0]) {
          this.curComDetails = response.body[0];
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
    this.formData.patchValue({
      project_name: this.curComDetails.project_name,
      community_name: this.curComDetails.community_name,
      agency_name: this.curComDetails.agency_name,
      email: this.curComDetails.email,
      budget: this.curComDetails.budget,
      estimate: this.curComDetails.estimate,
      status: this.curComDetails.status,

    });

    this.assignData.patchValue({
      assigned_to_agency: this.curComDetails.assigned_to_agency,
      assigned_to_user: this.curComDetails.assigned_to_user

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
          this.getcontractDetails();
          this.success = res.msg;
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
    if (this.intrvl)
      clearInterval(this.intrvl)
  }


  getLoginLogs() {
    this.logLoading = true
    this.dataService.getLoginLogs(this.currentUser?._id).subscribe((res) => {
      if (!res['error']) {
        this.logs = res['body']
        this.logLoading = false
      }
    })
  }

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

  get dcontrols() {
    return this.assignData.controls;
  }

  assignSubmitted() {
    for (let item of Object.keys(this.dcontrols)) {
      this.dcontrols[item].markAsDirty()
    }
    if (this.assignData.invalid) {
      return;
    }
    else {
      let data: any = this.assignData.value;
      data.id = this.comunityId;
      this.btnShow = true;
      // this.toastr.successToastr('Assign Succesfully');
      this.dataService.assignContract(this.assignData.value).subscribe((res: any) => {
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

  getAgencyId() {
    this.dataService.getAgencyId().subscribe((response: any) => {
      if (response['error'] == false) {
        this.allAgency = response.body;
        //this.toastr.successToastr(response.msg);
      } else if (response['error'] == true) {
        this.toastr.errorToastr(response.msg);
      }
    })
  }

  getUserId() {
    this.dataService.getUserId().subscribe((response: any) => {
      if (response['error'] == false) {
        this.allUsers = response.body;
        //this.toastr.successToastr(response.msg);
      } else if (response['error'] == true) {
        this.toastr.errorToastr(response.msg);
      }
    })
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
      this.dataService.register(this.formData.value).subscribe((res: any) => {
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

}

@Pipe({
  name: "formatTime"
})

export class FormatTimePipe implements PipeTransform {
  transform(value: number): string {
    const hours: number = Math.floor(value / 3600);
    const minutes: number = Math.floor((value % 3600) / 60);
    return (
      ("00" + hours).slice(-2) +
      ":" +
      ("00" + minutes).slice(-2) +
      ":" +
      ("00" + Math.floor(value - minutes * 60)).slice(-2)
    );
  }
}
