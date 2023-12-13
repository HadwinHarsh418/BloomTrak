import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbDateStruct, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'app/auth/models';
import { AuthenticationService, UserService } from 'app/auth/service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit-community',
  templateUrl: './edit-community.component.html',
  styleUrls: ['./edit-community.component.scss']
})
export class EditCommunityComponent implements OnInit {
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
  allCommunity:any;

  tabChanged(ev:any) {
    this.activeTab = ev.nextId.replace('ngb-nav-','');
    if(this.activeTab == 1) {
      setTimeout(() => {
        this.Primary.get('primary_contact_phone').setValue(this.Primary.value.primary_contact_phone);
      }, 100)
    // } else if(this.activeTab == 2) {
    //   setTimeout(() => {
    //     this.Servey.get('survey_compliance_phone').setValue(this.Servey.value.survey_compliance_phone);
    //   }, 100)
    // } else if(this.activeTab == 3) {
      setTimeout(() => {
        this.managementServey.get('management_company_phone').setValue(this.managementServey.value.management_company_phone);
        this.managementServey.get('management_company_contact_person').setValue(this.managementServey.value.management_company_contact_person);
      }, 100)
    }
}

  constructor
  (
    private _authenticationService: AuthenticationService,
    public _userService: UserService,
    private modalService: NgbModal,
    public toastr: ToastrManager,
    private aCtRoute: ActivatedRoute,
    private loctn  : Location
  ) 
  {
    this.aCtRoute.params.subscribe(
      res => {
        if (res.id) {
          this.comunityId = res.cp_id || res.id ;
          this.getCommunityDetails();
        }
      }
    )
    this.subsAll.push(this._authenticationService.currentUser.subscribe(x => (this.currentUser = x)));
   
  }

  ngOnInit(): void {
    this.currentUser = this._authenticationService.currentUserValue;
    this.getCommunityDetails();
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
        ]
      }
    };
  }

  getCommunityDetails() {
    this.loading = true;
    this._userService.getcommunityDetails(this.comunityId).subscribe(response => {
      if (!response.error) {
          this.allCommunity = response.body;
        if (response.body && response.body[0] ) {
          this.curComDetails = response.body[0];
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

  ngOnDestroy() {
    this.subsAll.map(
      item => {
        item.unsubscribe();
        item = null;
      }
    )
  }

  closeEventHandler() {
    this.showFlag = false;
    this.imageObject = [];
    this.selectedImageIndex = -1;
    let b = document.body;
    b.style.overflow = 'unset';
  }

goBack(){
  this.loctn.back()
}

}
