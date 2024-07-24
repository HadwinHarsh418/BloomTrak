import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'app/auth/models';
import { AuthenticationService, UserService } from 'app/auth/service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { MyProfileService } from './my-profile.service';
import { ActivatedRoute} from '@angular/router';
import { Location } from '@angular/common';
import { DataService } from 'app/auth/service/data.service';

@Component({
  selector: 'app-profile-agency',
  templateUrl: './profile-agency.component.html',
  styleUrls: ['./profile-agency.component.scss']
})
export class ProfileAgencyComponent implements OnInit {


  public contentHeader: object;
  public updatePersonalInfo: FormGroup;
  public data: any;
  public subsAll: any[] = [];
  public currentUser: User;
  public dob: NgbDateStruct;
  filename:any;
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
  value: boolean = false;
  value2: boolean = false;
  formData!: FormGroup;
  budgetForm!: FormGroup;
  confirmForm!: FormGroup;
  Servey!: FormGroup;
  radioData!: FormGroup;
  managementServey!: FormGroup;
  id: any;
  btnShow: boolean = false;
  tempCmntyId: any;
  contractform!: FormGroup;
  activeTab: number = 1;
  userid: any;
  allAgency:any;
  getBgt: any;
  fileUrl:any;
  myFileName:any;
  rows:any[];
  fileToUpload: any;
  






  constructor(
    public MyProfileService: MyProfileService,
    private _authenticationService: AuthenticationService,
    public _userService: UserService,
    private formBuilder: FormBuilder,
    public toastr: ToastrManager,
    private aCtRoute: ActivatedRoute,
    private fb: FormBuilder,
    private loct : Location,
    private dtSrv :DataService
  ) {
    this.aCtRoute.params.subscribe(
      res => {
        if (res.id) {
          this.comunityId = res.id;
          this.getagencyDetails();
        }
      }
    )
    this.subsAll.push(this._authenticationService.currentUser.subscribe(x => (this.currentUser = x)));
    this.budgetForm = this.formBuilder.group({
      budget: ['', Validators.required],
    });

    // this.updatePersonalInfo = this.formBuilder.group({
    //   first_name: ['', Validators.required],
    //   last_name: ['', Validators.required],
    //   driving_licence: ['', Validators.required],
    //   address: ['',],
    //   phone: ['',],
    //   age: ['',],
    //   gender: ['', Validators.required],
    // });
    this.currentUser = this._authenticationService.currentUserValue;
  }

  get profileForm() {
    return this.updatePersonalInfo.controls;
  }

  ngOnInit(): void {
    this.getAgencyContractById()
    this.getagencyDetails();
    if(this.currentUser?.role == 'Community'){
      // this.getBudgetById()
    }
    this.contentHeader = {
      headerTitle: 'Agency ',
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
            name: 'Agency ',
            isLink: true,
            link: '/agency'
          },
          // {
          //   name: 'Profile',
          //   isLink: false
          // }
        ]
      }
    };

    // this.formData = this.fb.group({
    //   agency_name: ['', [Validators.required]],
    //   agency_phone: ['', [Validators.required, Validators.pattern(Patterns.number)]],
    //   agency_email: ['', [Validators.pattern(Patterns.email)]],
    //   agency_website: ['', [Validators.required]],
    //   state: ['',[ Validators.required]],
    //   address1: ['', [Validators.required]],
    //   address2: [''],
    //   city: ['',[ Validators.required]],
    //   zipcode: ['',[ Validators.required]],
    //   agency_contact_firstname: ['',[ Validators.required]],
    //   agency_contact_lastname: ['',[ Validators.required]],
    //   agency_contact_person_title: ['',[ Validators.required]],
    //   agency_contact_cell_number: ['', [Validators.required, Validators.pattern(Patterns.number)]],
    //   agency_contact_email_address: ['', [Validators.required, Validators.pattern(Patterns.email)]],
    //   // primary_contact_person: ['',[ Validators.required]],
    //   // primary_contact_phone: ['', [Validators.required, Validators.pattern(Patterns.number)]],
    //   // primary_contact_email: ['', [Validators.required, Validators.pattern(Patterns.email)]],
    //   // community_name: ['', Validators.required],
    // })

    // this.confirmForm = this.fb.group({
    //   id: this.id ? this.id : '',
    //   password: ['', [Validators.required, Validators.pattern(Patterns.password)]],
    //   newPassword: ['', [Validators.required, Validators.pattern(Patterns.password)]],
    //   confPassword: ['', [Validators.required]],
    // },
    //   {
    //     Validators: MustMatch('confPassword', 'newPassword' )
    //   })
    this.contractform = this.fb.group({
      contract_start_date:['',[Validators.required]],
      contract_end_date:['',[Validators.required]],
      fileToUpload:['',[Validators.required]]
    })
    

  }

  getagencyDetails() {
    this.loading = true;
    let id = this.comunityId;
    this._userService.getagencyDetails(id).subscribe(response => {
      if (!response.error) {
          this.allAgency = response.body;
          this.value = this.allAgency[0].sms_notification == 0 ? false : true
          this.value2 = this.allAgency[0].email_notification == 0 ? false : true
        // if (response.body && response.body[0] && response.body[0]) {
        //   this.curComDetails = response.body[0];
        //   this.mapFormValues();
        // }
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
      agency_name: this.curComDetails.agency_name,
      agency_phone: this.curComDetails.agency_phone,
      agency_email: this.curComDetails.agency_email,
      agency_website: this.curComDetails.agency_website,
      address1: this.curComDetails.address1,
      address2: this.curComDetails.address2,
      city: this.curComDetails.city,
      state: this.curComDetails.state,
      zipcode: this.curComDetails.zipcode,
      agency_contact_firstname: this.curComDetails.agency_contact_firstname,
      agency_contact_lastname: this.curComDetails.agency_contact_lastname,
      agency_contact_person_title: this.curComDetails.agency_contact_person_title,
      agency_contact_cell_number: this.curComDetails.agency_contact_cell_number,
      agency_contact_email_address: this.curComDetails.agency_contact_email_address,
      community_name: this.curComDetails.community_name,
    });
  }

  get bControls() {
     return this.budgetForm.controls
    }

    addBgt(){
      let data ={
        community_id : this.currentUser?.id,
        agency_id : this.comunityId,
        budget : this.budgetForm.value.budget
      }
      this._userService.createBudget(data).subscribe(response => {
        if (!response.error) {
            this.allAgency = response.body;
            this.toastr.successToastr(response.msg)
            this.loct.back()
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

    updtBgt(){
      let data ={
        community_id : this.currentUser?.id,
        agency_id : this.comunityId,
        budget : this.budgetForm.value.budget
      }
      this._userService.updateBudget(data).subscribe(response => {
        if (!response.error) {
            this.allAgency = response.body;
            this.toastr.successToastr(response.msg)
            this.loct.back()
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

    getBudgetById(){
      let data ={
        community_id : this.currentUser?.id,
        agency_id : this.comunityId,
      }
      this._userService.getBudgetById(data).subscribe(response => {
        if (!response.error) {
            this.getBgt = response.body[0];
            this.budgetForm.patchValue({
              budget: this.getBgt?.budget,
             
            });
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

    closeded(){
      this.loct.back()
    }

    forNoti() {
      this.value;
      let data ={
        sms_notification : this.value == false ? '1' : '0',
        email_notification : this.allAgency [0].email_notification,
        is_for : this.currentUser?.role == 'User' ? 'user' : this.currentUser?.role == 'SuperAdmin' ? 'superadmin' : 'agency',
        agency_id :  this.currentUser?.role == 'Agency' ? this.currentUser?.id : this.currentUser?.role == 'SuperAdmin' ? this.allAgency[0].id : '',
        user_id :  this.currentUser?.role == 'Agency' ?  '' : this.currentUser?.id 
      }
      this.dtSrv.notificationEnableDisable(data).subscribe((res: any) => {
      })
    }
    
    forEml() {
      this.value2;
      let data ={
        email_notification : this.value2 == false ? '1' : '0',
        sms_notification : this.allAgency [0].sms_notification,
        is_for : this.currentUser?.role == 'User' ? 'user' : this.currentUser?.role == 'SuperAdmin' ? 'superadmin' : 'agency',
        agency_id :  this.currentUser?.role == 'Agency' ? this.currentUser?.id : this.currentUser?.role == 'SuperAdmin' ? this.allAgency[0].id :  '',
        user_id :  this.currentUser?.role == 'Agency' ?  '' : this.currentUser?.id 
      }
      this.dtSrv.notificationEnableDisable(data).subscribe((res: any) => {
      })
    }
    download(){
      fetch(this.fileUrl)
    .then(response => response.blob())
    .then((blob:any) => {
      var url = window.URL.createObjectURL(blob);

      // Create a link element to trigger the download
      var a = document.createElement("a");
      a.href = url;
      a.download = this.myFileName; // Set the desired file name
      document.body.appendChild(a);

      // Trigger a click event on the link element to initiate the download
      a.click();

      // Clean up by revoking the blob URL and removing the link element
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    })
    
    }
   
    getAgencyContractById(){
      this.myFileName = 'Agency-Contract-Form.pdf';
      this.dtSrv.getAgencyContractById(this.comunityId, this.currentUser?.user_role == 1 ? this.currentUser?.id : this.currentUser?.user_role == 4 ? this.currentUser?.com_id : '').subscribe((response: any) => {
      this.rows = response.body.sort((a, b) => new Date(b.contract_start_date).getTime() - new Date(a.contract_start_date).getTime());
      this.fileUrl=response.body[0].contract;


    })
}

@ViewChild('fileInput') elfile: ElementRef;
onFileInput(files: any) {
  if (files.length === 0) {
    return;
  }
  this.filename= files[0].name;
  let type = files[0].type;
  this.fileToUpload = files[0];

}

uploadNow() {
      
  let formdata2 = new FormData();
  formdata2.append('docFile',this.fileToUpload)
  formdata2.append('agency_id',this.comunityId)
  formdata2.append('community_id',this.currentUser?.id)
  formdata2.append('contract_start_date',this.contractform.value.contract_start_date)
  formdata2.append('contract_end_date',this.contractform.value.contract_end_date)
  if (this.contractform.value.contract_start_date >=this.contractform.value.contract_end_date) {
   
    this.toastr.errorToastr('End Date must be after Start Date ')
    return
  }else{
  this.dtSrv.uploadAgencyContract(formdata2).subscribe(
    (res:any) => {
      if (!res.error) {
        this.toastr.successToastr("Contract Upload Successful")
        this.contractform.reset();
        this.getAgencyContractById()
        // this.getLedger()
      } else {
        this.toastr.errorToastr(res.msg)
      }
  }, (error:any) => {
    this.dtSrv.genericErrorToaster()
  }
  )}}
get contractform_Control() {
  return this.contractform.controls
}
delete(id){
  let data ={
    id: id,
  }
  this.dtSrv.deleteAgencyContract(data).subscribe((res:any)=>{
    if(!res.error){
      this.toastr.successToastr(res.msg)
      this.getAgencyContractById()
    }else{
      this.toastr.errorToastr(res.msg)
    }
  })

}
}
