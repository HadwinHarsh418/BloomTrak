import { DatePipe, Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Patterns } from 'app/auth/helpers/patterns';
import { User } from 'app/auth/models';
import { AuthenticationService, UserService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-profile-user',
  templateUrl: './profile-user.component.html',
  styleUrls: ['./profile-user.component.scss']
})
export class ProfileUserComponent implements OnInit {
  formData!: FormGroup;
  usrRate!: FormGroup;
  editUsrRate!: FormGroup;
  forgotPassword!: FormGroup;
  btnShow: boolean = false;
  userId: any;
  loading: boolean;
  curComDetails: any;
  error: any;
  public contentHeader: object;
  public currentUser: User;
  imageObject: any[] = [];
  activeTab: any = 0;
  rows2: any;
  setPhone: any;
  pickedROle:any;
  @ViewChild('updateRole') updateRole: ElementRef<any>;
  @ViewChild('updateCom') updateCom: ElementRef<any>;
  data1: any[] = [];
  role: any;
  dt: any[]
  pushRole: any;
  ComId:any;
  rows: any;
  @ViewChild('addUsrRate') addUsrRate: ElementRef<any>;
  @ViewChild('edtUsrRate') edtUsrRate: ElementRef<any>;
  rowId: any;
  allCommunity: any;
  addUsrnm: FormGroup;
  slctSrtNm: any;
  allCommunity1: any=[];
  userNo: any;
  mangComs: any=[];
  exstMangComs: any=[];

  tabChanged(ev:any) {
    this.activeTab = ev.nextId.replace('ngb-nav-','');
    this.activeTabLi(this.activeTab)
    if(this.activeTab == 0){
      this.getuserDetails();
      // setTimeout(() => {
      //     this.formData.get('phone_number').setValue(this.formData.value.phone_number);
      //   }, 1100)
    }
  }
  constructor(
    private fb: FormBuilder,
    private aCtRoute: ActivatedRoute,
    private _userService: UserService,
    private auth: AuthenticationService,
    private toastr: ToastrManager,
    private modalService: NgbModal,
    private dataService: DataService,
    private datePipe:DatePipe,
    private loct :Location

  ) {
    this.auth.currentUser.subscribe(x => (this.currentUser = x));
    this.aCtRoute.params.subscribe(
      res => {
        if (res.id) {
          this.userId = res.id;
         this.userNo = res.no
        }
      }
    )
    if( this.userNo == '1'){
      this.getManagementUserCommunities()
    }
   this.getusercommunityById(this.userId)
   this.getRoles()
  }
 
  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    closeDropDownOnSelection: true,
    itemsShowLimit: 2,
    allowSearchFilter: true
  };

  dropdownSettings1: IDropdownSettings = {
    singleSelection: false,
    idField: 'community_id',
    textField: 'community_name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    closeDropDownOnSelection: true,
    itemsShowLimit: 2,
    allowSearchFilter: true
  };

  // dropdownSettings2: IDropdownSettings = {
  //   singleSelection: false,
  //   idField: 'cp_id',
  //   textField: 'community_name',
  //   selectAllText: 'Select All',
  //   unSelectAllText: 'UnSelect All',
  //   closeDropDownOnSelection: true,
  //   itemsShowLimit: 3,
  //   allowSearchFilter: true
  // };
  
  ngOnInit(): void {
    this.getCommunityId()
    // setTimeout(() => {
    //   this.formData.get('phone_number').setValue(this.formData.value.phone_number);
    // }, 1100)

    this.getUserRoles()



    this.contentHeader = {
      headerTitle: this.currentUser.role == 'Agency' ? 'Agency Personnel' : this.userNo == '1' ? 'Management User' : 'User',
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
            name: this.currentUser.role == 'Agency' ? 'Agency Personnel' : this.userNo == '1' ? 'Management User' : 'User',
            isLink: true,
            link: this.userNo == '1' ? '/management-user' : '/user'
          }
        ]
      }
    };

    this.formData = this.fb.group({
      DOB: [''],
      email: [''],
      phone_number: [''],
      username: [''],
      community_name: [''],
      first_name: [''],
      last_name: [''],
      agency_name: [''],
    })

    this.usrRate = this.fb.group({
      rate: ['', Validators.required],
      community_id: ['', Validators.required],
    })

    this.addUsrnm = this.fb.group({
      community_name: ['', Validators.required],
      username: ['', Validators.required],
    })

    this.editUsrRate = this.fb.group({
      rate: ['', Validators.required],
    })
    // this.forgotPassword = this.fb.group({
    //   password: ['', Validators.required],
    //   confPassword: ['', [Validators.required]],
    //   newPassword: ['', [Validators.required]],
    //   id: this.userId
    // })
    if(this.currentUser.role == 'Community')
    {
     this.usrRate.controls['community_id'].clearValidators();
     this.usrRate.updateValueAndValidity();
    }
    if(this.currentUser.role == 'SuperAdmin')
    {
     this.usrRate.controls['community_id'].setValidators(Validators.required);
     this.usrRate.updateValueAndValidity();
    }
    this.getAllCAUserRates()
  }

  activeTabLi(_activeTab){
  this.getuserDetails()
  }

  get controls() {
    return this.formData.controls;
  }

  get controls1() {
    return this.addUsrnm.controls;
  }
  
  get urC() {
   return this.usrRate.controls;
 }
 get eurC() {
  return this.editUsrRate.controls;
}

  submitted() {

  }

  usrRatesubmitted(){
    for (let item of Object.keys(this.urC)) {
      this.urC[item].markAsDirty()
    }
    if (this.usrRate.invalid) {
      return;
    }
    this.btnShow = true
    let data ={
      user_id : this.userId,
      assigned_by : this.currentUser.role == 'SuperAdmin' ? this.usrRate.value.community_id : this.currentUser.id,
      rate : this.usrRate.value.rate
    }
    this.dataService.addUserRated(data).subscribe((res: any) => {
      if(!res.err){
      this.btnShow = false
      let indx = this.allCommunity.findIndex(product => product.id == this.usrRate.value.community_id);
      this.allCommunity = this.allCommunity.splice(indx == 0 ? 1 : indx,1)
      this.toastr.successToastr(res.msg)
      this.modalService.dismissAll()
      this.usrRate.reset()
      this.getAllCAUserRates()
      }
    },(err) => {
      this.dataService.genericErrorToaster()
      this.btnShow = false
    })
  }

  editUsrRatesubmitted(){
    for (let item of Object.keys(this.eurC)) {
      this.eurC[item].markAsDirty()
    }
    if (this.editUsrRate.invalid) {
      return;
    }
    const cmid =  JSON.parse( this.curComDetails.community_id)
    this.btnShow = true
    let data ={
      id :this.curComDetails.id,
      community_id : cmid != null ? cmid[0] : this.currentUser.com_id,
      price : this.editUsrRate.value.rate
    }
    this.dataService.updateUserRated(data).subscribe((res: any) => {
      if(!res.err){
        this.btnShow = false
      this.toastr.successToastr(res.msg)
      this.modalService.dismissAll()
      this.getAllCAUserRates()
      }else{
        this.btnShow = false
      }
    },(err) => {
      this.dataService.genericErrorToaster()
      this.btnShow = false
    })
  }


  // upadtePassword() {
  //   for (let item of Object.keys(this.fp)) {
  //     this.fp[item].markAsDirty()
  //   }
  //   if (this.forgotPassword.invalid) {
  //     return;
  //   }
  //   this.btnShow = true;
  //   this._userService.updateUserPassword(this.forgotPassword.value).subscribe(response => {
  //     if (!response.error) {
  //       this.toastr.successToastr(response.msg)
  //       this.btnShow = false;
  //       this.forgotPassword.reset()
  //     } else {
  //       this.error = response.msg;
  //       this.auth.errorToaster(response);
  //       this.btnShow = false;

  //     }
  //     this.loading = false;
  //   }, error => {
  //     this.error = error;
  //     this.btnShow = false;
  //   }
  //   );
  // }

  getuserDetails() {
    this.loading = true;
    let id = this.userId;
    let is_for = 'user'
    this._userService.getUserById(id, is_for).subscribe(response => {
      if (!response.error) {
        if (response.body && response.body[0] && response.body[0]) {
          this.curComDetails = response.body[0];
          let allAssigned = [];
          this.rows.forEach(rate => {allAssigned.push(rate.assigned_by)});
          this.allCommunity = this.curComDetails.linked_with.filter(item => !allAssigned.includes(item.id));
          this.setPhone = this.curComDetails?.phone_number
          this.mapFormValues(true);
        }
      } else {
        this.error = response.msg;
        this.auth.errorToaster(response);
      }
      this.loading = false;
    }, error => {
      this.error = error;
      this.loading = false;
    }
    );

  }

  mapFormValues(val) {
    if(val){
      // let date3:any = this.datePipe.transform(this.curComDetails.DOB, 'MM-dd-yyyy')
        this.formData.patchValue({
          DOB: this.curComDetails.DOB,
          email: this.curComDetails.email,
          username: this.curComDetails.username,
          phone_number: this.curComDetails.phone_number,
          community_name: this.curComDetails.community_name,
          first_name: this.curComDetails.first_name,
          last_name: this.curComDetails.last_name,
          agency_name: this.curComDetails.agency_name
        })
    }
    this.editUsrRate.patchValue({
      rate : this.curComDetails.hourly_rate
    })
  }

  getusercommunityById(id) {
    this.dataService.getusercommunityById(id).subscribe((res: any) => {
      this.rows2 = res.body;
      this.getRoles()
    },(err) => {
      this.dataService.genericErrorToaster()
    })
  }

  getRoles(body?){
    let data = {
      prms : this.currentUser.role =='SuperAdmin' ? null :this.currentUser.prmsnId == '1' ? 'community_id' : this.currentUser.prmsnId == '2' ? 'agency_id' : 'agency_id',
       id : this.currentUser.prmsnId == '6' ? null : this.currentUser.id
    }
    this.dataService.getRole(data).subscribe((res:any)=>{
      if(!res.error){
        this.data1 = res.body.sort(function(a, b){
          if(a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
          if(a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
          return 0;
      });
      }else{
      this.toastr.errorToastr('Something went wrong please try again later')
      }
    },err=>{
      this.dataService.genericErrorToaster()
    })
}

getUserRoles(){
  this.dataService.getUserRoles(this.userId).subscribe((res:any) =>{
    if(!res.error){
      this.role = res.body;
      this.pickedROle = this.role.map(i=>{i.id = Number(i.id); return i;});      
    }
    else{
      this.toastr.errorToastr('Something went wrong please try again later')
    }
  },err=>{
    this.dataService.genericErrorToaster()
    return;
  })
}
  getAllCAUserRates(){
    this.dataService.getAllCAUserRates(this.currentUser.id,this.currentUser.role,this.userId).subscribe((res: any) => {
      this.rows = res.body
      this.getuserDetails();
      if(this.currentUser.role == 'Community'){
        this.rows =this.rows.filter(i =>{
          if(i.user_id == this.userId)
            return i
        })
      }
    },(err) => {
      this.dataService.genericErrorToaster()
    })
  }

  openAddUsrModl(){
    let allAssigned = [];
    this.rows.forEach(rate => {allAssigned.push(rate.assigned_by)});
    this.allCommunity = this.curComDetails.linked_with.filter(item => !allAssigned.includes(item.id));
    
    this.modalOpenOSE(this.addUsrRate, 'lg');
  }

  closeded(modal: NgbModalRef) {
    modal.dismiss();
  }

 

  modalOpenOSE(modalOSE, size = 'md') {
    this.modalService.open(modalOSE,
      {
        backdrop: false,
        size: size,
        centered: true,
      }
    );
  }


  openUpdateRole() {
    this.modalOpenOSE(this.updateRole, 'lg');
  }

  openUpdateCom() {
    this.modalOpenOSE(this.updateCom, 'lg');
  }

  Update(){
  //   console.log(this.pickedROle);
  //   let ids:any[] = [];
  //  this.pickedROle.map(i=>{
  //     if(i.id){
  //       ids.push(i.id)
  //     }
  //   })
    let body={
      user_id: this.userId,
      roles:this.pickedROle
    }
    this.dataService.updateUserRoles(body).subscribe((res:any) =>{
      if (!res.error) {
        this.toastr.successToastr(res.msg)
        this.modalService.dismissAll();
        this.getUserRoles()
      }
    })
  }

  UpdateComSub(){
    let cm = []
    // if(this.currentUser.user_role =='3'){
    //   this.ComId.map(i=>{
    //     cm.push(i.cp_id)
    //   })
    // }
    // else{
      this.ComId.map(i=>{
        cm.push(i.community_id)
      })
    // }
    console.log(cm);
    let body={
      user_id: this.userId,
      community_id:cm
    }
    this.dataService.addManagementUserCommunities(body).subscribe((res:any) =>{
      if (!res.error) {
        this.toastr.successToastr(res.msg)
        this.modalService.dismissAll();
        this.getManagementUserCommunities()
      }
    })
  }

  deleteUserRated(row){
    this.dataService.deleteUserRated({id:row.id}).subscribe((res: any) => {
      if(!res.err){
        this.toastr.successToastr(res.msg)
        this.getAllCAUserRates()
        this.getuserDetails()
      }
    },(err) => {
      this.dataService.genericErrorToaster()
    })
  }

  updateUserRated(row){
    this.rowId = row.id
    this.modalOpenOSE(this.edtUsrRate, 'lg');
    this.editUsrRate.patchValue({
      rate : row.price
    })
  }

  addUsrnmsubmitted(){
    for (let item of Object.keys(this.controls1)) {
      this.controls1[item].markAsDirty()
    }
    if(this.addUsrnm.invalid){
      return;
    }
    let data ={
      username: this.slctSrtNm +'-'+ this.addUsrnm.value.username,
      id : this.currentUser.id
    }
    this.dataService.updateUsername(data).subscribe((res: any) => {
      if (!res.error) {
        this.toastr.successToastr(res.msg);
        this.ngOnInit()
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

  goBack(){
    this.loct.back()
  }

  getCommunityId() {
    this.dataService.getCommunityId().subscribe((response: any) => {
      if (response['error'] == false) {
        this.allCommunity1 = response.body.sort(function(a, b){
          if(a.community_name.toUpperCase() < b.community_name.toUpperCase()) { return -1; }
          if(a.community_name.toUpperCase() > b.community_name.toUpperCase()) { return 1; }
          return 0;
      });
      if(this.currentUser.prmsnId == '1'){
        this.slctCom(this.currentUser.id)
        this.allCommunity1 =   this.allCommunity1.filter(i=>{
          if(this.currentUser.id == i.id){
            return i
          }
        })
      }
        //this.toastr.successToastr(response.msg);
      } else if (response['error'] == true) {
        this.toastr.errorToastr(response.msg);
      }
    }, (err) => {
      this.dataService.genericErrorToaster();

    })
  }

  slctCom(e){
    this.allCommunity1.filter(i=>{
         if(e == i.id){
           this.slctSrtNm =   i.sort_name
         }
       })
  }

  getManagementUserCommunities(){
    let data = {
      userId : this.userId,
      mangId : this.currentUser.id
    }
    this.dataService.getManagementUserCommunities(data).subscribe((res: any) => {
      if (!res.error) {
        this.mangComs = res.body[1].userAvailableCommunities
        this.exstMangComs = res.body[0].user_added_communities
        // this.toastr.successToastr(res.msg);
        // this.ngOnInit()
        this.ComId = res.body[0].user_added_communities
      } else {
        this.toastr.errorToastr(res.msg);
      }
      this.btnShow = false;
    },
      (err) => {
        this.btnShow = false;
        this.dataService.genericErrorToaster();
      })




      // if(this.currentUser.id && this.currentUser.com_id){
      //   let data = {
      //     userId : this.currentUser.id,
      //     mangId : this.currentUser.com_id
      //   }
      //   this.dataService.getManagementUserCommunities(data).subscribe((res: any) => {
      //     if (!res.error) {
      //       this.mangComs = res.body[1].userAvailableCommunities
      //       this.exstMangComs = res.body[0].user_added_communities
      //       // this.toastr.successToastr(res.msg);
      //       // this.ngOnInit()
      //       this.ComId = res.body[0].user_added_communities
      //     } else {
      //       this.toastr.errorToastr(res.msg);
      //     }
      //   },
      //     (err) => {
      //       this.dataService.genericErrorToaster();
      //     })
      // }
      // else{
      //   this.dataService.getMNMGcommunity(this.currentUser.id).subscribe((response: any) => {
      //     if (response['error'] == false) {
      //       this.mangComs = response.body.sort(function(a, b){
      //         if(a.community_name.toUpperCase() < b.community_name.toUpperCase()) { return -1; }
      //         if(a.community_name.toUpperCase() > b.community_name.toUpperCase()) { return 1; }
      //         return 0;
      //     })  ;
      //       //this.toastr.successToastr(response.msg);
      //     } else if (response['error'] == true) {
      //       this.toastr.errorToastr(response.msg);
      //     }
      //   }, (err) => {
      //     this.dataService.genericErrorToaster();
    
      //   })
      // }
  }
}
