import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { id } from '@swimlane/ngx-datatable';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { log } from 'console';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-addroles',
  templateUrl: './addroles.component.html',
  styleUrls: ['./addroles.component.scss']
})
export class AddrolesComponent implements OnInit {
  @ViewChild('content') content: ElementRef;
  public contentHeader: any;
  formRoleData: any;
  formRoleNewAdd:any;
  loading:boolean = false;
  prmsUsrId: any;
  currentUser: any;
  allCommunity: any;
  data: any;
  sendValueTrak: any;
  ErrorCheck: boolean;
  SharedValue: any;
  showTrak: any;
  default_Role: any[]=[];
  rows: any[];
  bton : boolean;
  bton1 : boolean;
  hideContent: any;
  selectedRole: any;
  popup:any=" ";
  ShowAddRoleAgency: boolean;
  defaultRoleTrak: string= '';
  allAgency: any[]=[];
  isDisabled: any;
  isDisable: any;
  disableCom: boolean=false;

  constructor(
    private formBuilder : FormBuilder,
    private location : Location,
    private dataSrv : DataService,
    private toaster : ToastrManager,
    private aCtRoute : ActivatedRoute,
    private _router : Router,
    private auth :AuthenticationService,
    private modalService: NgbModal
  ) { 
    this.auth.currentUser.subscribe((x: any) => {
      this.currentUser = x;
      if(this.currentUser?.role == 'Agency' || this.currentUser?.user_role ==3){
        this.ShowAddRoleAgency = false;
      }else
      this.ShowAddRoleAgency = false;
      
      if(this.currentUser?.prmsnId == 6 || this.currentUser?.user_role == 3){
        this.getComId()
        this.getAgencyId()
        this.getAgencyForManagement()
      }
    })
    this.aCtRoute.params.subscribe(
      res => {
          this.prmsUsrId = res;          
      }
    )
  }

  ngOnInit(): void {
    this.getRole()
    this.contentHeader = {
      headerTitle: this.prmsUsrId?.id ? 'Edit Roles' : 'Add Roles',
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
            name: 'Roles',
            isLink: true,
            link: '/roles'
          }
        ]
      }
    };
    this.showTrakAccToRole()
    this.formRoleData = this.formBuilder.group({
      role_name: [''],
      // trak_type: ['',this.currentUser?.prmsnId == 1 || 2 ? [] :Validators.required],
      community_id: this.currentUser?.prmsnId == 1 || 2 ? ['']: [{value: 'undefined', disabled: this.isDisabled}],
      agency_id :this.currentUser?.prmsnId == 1 || 2 ? ['']: [{value: 'undefined', disabled: this.isDisable}],
      default_Role: ['', Validators.required],
    })
    this.setValidator()
    this.formRoleNewAdd = this.formBuilder.group({
      role_name: ['', Validators.required],
      trak_type: ['',this.ShowAddRoleAgency ? '' :Validators.required],
      community_id: this.currentUser?.prmsnId == 1 || 2 ? ['']: ['', Validators.required],

    })
      if(this.prmsUsrId?.id){
        this.patchVal()
      }
  }

  setValidator(){
    this.formRoleData.controls['community_id'].setValue('undefined');
    this.formRoleData.controls['agency_id'].setValue('undefined');
    this.formRoleData.controls['community_id'].setValidators(Validators.required);
    this.formRoleData.get('community_id').updateValueAndValidity();
   this.formRoleData.controls['agency_id'].setValidators(Validators.required);
    this.formRoleData.get('agency_id').updateValueAndValidity();

  }

  get FormData_Control(){
    return this.formRoleData.controls;
  }
  get formRoleNew(){
    return this.formRoleNewAdd.controls;
  }
  selectMng(value){
    if(value == 'Yes'){
      this.formRoleData.controls['community_id'].setValue('');
      this.formRoleData.controls['community_id'].clearValidators();
      this.formRoleData.get('community_id').updateValueAndValidity();
      this.disableCom = true;
    }else{
    this.formRoleData.controls['community_id'].setValue('');
      this.formRoleData.controls['community_id'].setValidators(Validators.required);
      this.formRoleData.get('community_id').updateValueAndValidity();
      this.disableCom = false;
    }
  }
  submittedNew(){
    for (let item of Object.keys(this.formRoleNew)) {
      this.formRoleNew[item].markAsDirty()
    }
    if (this.formRoleNewAdd.invalid) {
      return;
    }
    if(this.currentUser?.prmsnId ==2){
      this.data ={
        name:this.formRoleNewAdd.value.role_name,
        id:this.prmsUsrId.id ? this.prmsUsrId.id : '',
        agency_id : this.formRoleNewAdd.value.community_id || this.currentUser?.id,
        trak_type:'1',
        default_Role:this.formRoleNewAdd.value.default_Role
      }
    
    }else if(this.currentUser?.user_role==1){
      this.data ={
        name:this.formRoleNewAdd.value.role_name,
        id:this.prmsUsrId.id ? this.prmsUsrId.id : '',
        community_id:this.formRoleNewAdd.value.community_id || this.currentUser?.id,
        agency_id:this.formRoleNewAdd.value.agency_id || this.currentUser?.id,
        trak_type:this.formRoleNewAdd.value.trak_type,
        default_Role:this.formRoleNewAdd.value.default_Role
      }
    }
    else if (this.currentUser?.role == 'Admin'){
      this.data ={
        name:this.formRoleNewAdd.value.role_name,
        id:this.prmsUsrId.id ? this.prmsUsrId.id : '',
        community_id:this.disableCom == true ? '' : this.formRoleNewAdd.value.community_id || this.currentUser?.id,
        trak_type:this.formRoleNewAdd.value.trak_type,
        default_Role:this.formRoleNewAdd.value.default_Role,
        management_id:this.currentUser?.id
      }
    }else{
        this.data ={
          name:this.formRoleNewAdd.value.role_name,
          id:this.prmsUsrId.id ? this.prmsUsrId.id : '',
          community_id:this.formRoleNewAdd.value.community_id || this.currentUser?.id,
          trak_type:this.formRoleNewAdd.value.trak_type,
          default_Role:this.formRoleNewAdd.value.default_Role,
        }
    }
      this.loading=  true;
      if(this.prmsUsrId?.id){
        this.dataSrv.editRole(this.data).subscribe((res:any)=>{
          if(!res.error){
              this.loading=  false;
              this.getRole()
            this.toaster.successToastr(res.msg)
            this.modalService.dismissAll()
            this._router.navigate(['/roles'])
          }else{
            this.loading=  false;
            this.toaster.errorToastr(res.msg)
          }
        },err=>{
          this.loading=  false;
          this.dataSrv.genericErrorToaster()
        })
      }else{
        this.dataSrv.addRole(this.data).subscribe((res:any)=>{
          if(!res.error){
              this.loading=  false;
              this.getRole()
            this.toaster.successToastr("New Role Created Successfully")
            this.modalService.dismissAll()
            this._router.navigate(['/roles'])
          }else{
            this.loading=  false;
            this.toaster.errorToastr(res.msg)
          }
        },err=>{
          this.loading=  false;
          this.dataSrv.genericErrorToaster()
        })
      }
        
  }

  submitted(){
    for (let item of Object.keys(this.FormData_Control)) {
      this.FormData_Control[item].markAsDirty()
    }
    if (this.formRoleData.invalid) {
      return;
    }
    if(this.currentUser?.prmsnId ==2){
      this.data ={
        name:this.selectedRole,
        agency_id : this.formRoleNewAdd.value.community_id || this.currentUser?.id,
        id:this.prmsUsrId.id || this.currentUser?.id,
        trak_type:'1',
        default_Role:this.formRoleData.value.default_Role
      }
    }else if(this.currentUser?.user_role == 3)
    this.data ={
      name:this.selectedRole,
      community_id:this.currentUser?.user_role == 3 ? this.formRoleData.value.community_id : this.currentUser?.id,
      id:this.prmsUsrId.id,
      trak_type:this.formRoleData.value.trak_type || this.defaultRoleTrak,
      default_Role:this.formRoleData.value.default_Role,
      management_id:this.currentUser?.id
    }
    else{
      if((this.currentUser?.user_role == 6 && this.formRoleData.value.community_id) || (this.currentUser?.user_role != 2&&this.currentUser?.user_role != 5 && this.currentUser?.user_role != 6)){
        this.data ={
          name:this.selectedRole,
          community_id:this.currentUser?.user_role == 6 ? this.formRoleData.value.community_id : this.currentUser?.id,
          id:this.prmsUsrId.id || this.currentUser?.id,
          trak_type:this.formRoleData.value.trak_type || this.defaultRoleTrak,
          default_Role:this.formRoleData.value.default_Role
        }
      }else{
        this.data ={
          name:this.selectedRole,
          agency_id:this.formRoleData.value.agency_id,
          id:this.prmsUsrId.id || this.currentUser?.id,
          trak_type:this.formRoleData.value.trak_type || this.defaultRoleTrak,
          default_Role:this.formRoleData.value.default_Role
        }
      }
    }
    if((this.formRoleData.value.community_id == 'undefined' || this.formRoleData.value.agency_id == 'undefined')&& this.currentUser?.user_role == 6){
      this.toaster.errorToastr('Please select community or agency name')
      return;
    }
    if(this.prmsUsrId?.id){
      this.loading=  true;
        this.dataSrv.editRole(this.data).subscribe((res:any)=>{
          if(!res.error){
              this.loading=  false;
            this.toaster.successToastr(res.msg)
            this._router.navigate(['/roles'])
          }else{
            this.loading=  false;
            this.toaster.errorToastr(res.msg)
          }
        },err=>{
          this.loading=  false;
          this.dataSrv.genericErrorToaster()
        })
    }else{
      this.loading=  true;
        this.dataSrv.addRole(this.data).subscribe((res:any)=>{
          if(!res.error){
              this.loading=  false;
            this.toaster.successToastr(res.msg)
            this._router.navigate(['/roles'])
          }else{
            this.loading=  false;
            this.toaster.errorToastr(res.msg)
          }
        },err=>{
          this.loading=  false;
          this.dataSrv.genericErrorToaster()
        })
    }
  }
  SelectAgency(e:any){
    if(e == 'undefined'){
      this.isDisabled = false;
      this.formRoleData.get('community_id').enable();
      this.formRoleData.controls['community_id'].setValue('undefined');
      this.formRoleData.controls['community_id'].setValidators(Validators.required);
      this.formRoleData.get('community_id').updateValueAndValidity();
      this.formRoleData.updateValueAndValidity();
    }else{
      this.isDisabled = true;
      this.formRoleData.get('community_id').disable();
      this.formRoleData.controls['community_id'].setValue('undefined');
      this.formRoleData.controls['community_id'].clearValidators();
      this.formRoleData.updateValueAndValidity();
      this.formRoleData.get('community_id').updateValueAndValidity();
    }

  }
  selectCommunity(e:any){
    if(e == 'undefined'){
      this.isDisable = false;
      this.formRoleData.get('agency_id').enable();
      this.formRoleData.controls['agency_id'].setValue('undefined');
     this.formRoleData.controls['agency_id'].setValidators(Validators.required);
      this.formRoleData.get('agency_id').updateValueAndValidity();
    }else{
      this.isDisable = true;
      this.formRoleData.get('agency_id').disable();
      this.formRoleData.controls['agency_id'].setValue('undefined');
      this.formRoleData.controls['agency_id'].clearValidators();
      this.formRoleData.get('agency_id').updateValueAndValidity();
    }


  }

  getRoles(){
    // let comunity_id=this.currentUser?.id
    let data = {
      prms : this.currentUser?.prmsnId == '1' ? 'community_id' : this.currentUser?.prmsnId == '2' ? 'agency_id' : 'agency_id',
       id : this.currentUser?.prmsnId == '6' ? null : this.currentUser?.id
    }
    this.dataSrv.getRole(data).subscribe((res:any)=>{
      if(!res.err){
        this.rows = res.body.sort(function(a, b){
          if(a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
          if(a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
          return 0;
      })  ;;
      }else{
      this.toaster.errorToastr('Something went wrong please try again leter')
      }
    },err=>{
      this.dataSrv.genericErrorToaster()
    })
}
  getRole(){
  
    this.dataSrv.getDefaultRole( ).subscribe((res:any)=>{
      if(!res.err){
        this.rows=[]
      this.rows=  res.body.sort((a, b) => (a.name?.trim().toLowerCase() > b.name?.trim().toLowerCase()) ? 1 : ((b.name?.trim().toLowerCase() > a.name?.trim() .toLowerCase()) ? -1 : 0));
      }
    },err=>{
      this.dataSrv.genericErrorToaster()
    })
  }

  

  patchVal(){
    
    this.formRoleData.patchValue({
      default_Role:this.prmsUsrId?.default_Role ?? '',
      community_id : this.prmsUsrId?.community_id ?? '',
      agency_id : this.prmsUsrId?.agency_id ?? '',
    })
  }

  AllChange(e:any){
    let index:any  = this.rows.filter(i=>i.id == e.target.value)
    this.selectedRole = index[0].name;
    this.defaultRoleTrak = index[0]?.trak_type
  }
  
  

  goBack(){
    this.modalService.dismissAll()
    this.location.back();
  }
  getAgencyId(){
    if(this.currentUser?.user_role == 6){
      this.dataSrv.agenciesID().subscribe((response: any) => {
        if (response['error'] == false) {
          this.allAgency = response.body.sort(function(a, b){
            if(a.agency_name.toUpperCase() < b.agency_name.toUpperCase()) { return -1; }
            if(a.agency_name.toUpperCase() > b.agency_name.toUpperCase()) { return 1; }
            return 0;
        })  ;
      }
    }
      )}
}
getAgencyForManagement() {
  this.dataSrv.getAgencyForManagement().subscribe((response: any) => {
    if (response['error'] == false) {
      this.allAgency  = response?.body;
    } 
  },
    (err) => {
      this.dataSrv.genericErrorToaster();
    })
}


  

  getComId(){
    if(this.currentUser?.user_role =='6'){
    this.dataSrv.getCommunityId().subscribe((response: any) => {
      if (response['error'] == false) {
        this.allCommunity = response.body.sort(function(a, b){
          if(a.community_name.toUpperCase() < b.community_name.toUpperCase()) { return -1; }
          if(a.community_name.toUpperCase() > b.community_name.toUpperCase()) { return 1; }
          return 0;
      })  ;
      
        //this.toastr.successToastr(response.msg);
      } else if (response['error'] == true) {
        this.toaster.errorToastr(response.msg);
      }
    }, (err) => {
      this.dataSrv.genericErrorToaster();

    })
  }
  else{
    this.dataSrv.getMNMGcommunity(this.currentUser?.id).subscribe((response: any) => {
      if (response['error'] == false) {
        this.allCommunity = response.body.sort(function(a, b){
          if(a.community_name.toUpperCase() < b.community_name.toUpperCase()) { return -1; }
          if(a.community_name.toUpperCase() > b.community_name.toUpperCase()) { return 1; }
          return 0;
      })  ;
     
      } else if (response['error'] == true) {
        this.toaster.errorToastr(response.msg);
      }
    }, (err) => {
      this.dataSrv.genericErrorToaster();

    })
  }
  }


  chckBx(e){
    this.ErrorCheck = false;

    if(e.target.value == '0'){
      const checkboxElement: HTMLInputElement | null = document.getElementById('flexRadioDefault2') as HTMLInputElement;

      if (checkboxElement) {
        checkboxElement.checked = false;
      }
    }else{
      const checkboxElement: HTMLInputElement | null = document.getElementById('flexRadioDefault1') as HTMLInputElement;

      if (checkboxElement) {
        checkboxElement.checked = false;
      }
    }
    this.formRoleData.value.trak_type = e.target.value;
    this.SharedValue = ''
    this.SharedValue = e.target.value;
  }

  showTrakAccToRole(){
    this.dataSrv.getCMAccessToByDate(this.auth.currentUserValue.com_id ? this.auth.currentUserValue.com_id : this.auth.currentUserValue.id).subscribe((res:any) => {
      this.showTrak = res.body.access_to
    })
  }

  open(content) {
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
			(result) => {
				// this.closeResult = `Closed with: ${result}`;
			},
			(reason) => {
				// this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
		);
    this.formRoleNewAdd.patchValue({
      role_name : this.prmsUsrId.name,
      trak_type:this.prmsUsrId?.trak_type,
      community_id : this.prmsUsrId?.community_id ?? '',

    })
	}

}
