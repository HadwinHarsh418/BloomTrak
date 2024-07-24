import { Component,ElementRef,OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';



@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  @ViewChild('deleteShift') deleteShift: ElementRef<any>;
  rows: any;
  tableRoleData:any[]=[]
  roleData: any[]=[];
  prmsUsrId: any;
  addPrms: any;
  dltPrms: any;
  allCommunity:any;
  selectedRole:any;
  formRoleNewAdd:any;
  edtPrms: any;
  vwPrms: any;
  assPrms: any;
  userName: any;
  formRoleData:any;
  popup:any=" ";
  data: any;
  loading:boolean = false;
  currentUser: any;
  editRole: any;
  allAgency: any[]=[];
  community_id: any;
  comid: any;
  Agid: any;
  isDisable: boolean;
  isDisabled: boolean;
  allAgency1: any;
  row: any;
  constructor(
    private dataSrv : DataService,
    private toaster : ToastrManager,
    private auth :AuthenticationService,
    private modalService: NgbModal,
    private _router : Router,
    private formBuilder : FormBuilder,


  ) {      
    this.auth.currentUser.subscribe((x: any) => {
      this.currentUser = x
    })
    // this.getMNMGcommunity()
    this.getAgencyForManagement()
    this.getPrmsnData()  
   }

  ngOnInit(): void {
    if(this.currentUser?.user_role == 6)
    this.getRole()
  else
  this.getRoles()
  if(this.currentUser?.prmsnId == 6 || this.currentUser?.user_role == 3){
    this.getComId();
    this.getAgencyId()
  }
  this.Formvalues()

};
Formvalues(){
this.formRoleNewAdd = this.formBuilder.group({
  role_name: ['', Validators.required],
  trak_type: ['',Validators.required],
  community_id: this.currentUser?.prmsnId == 1 || 2 ? ['']: [''],
  agency_id: this.currentUser?.prmsnId == 1 || 2 ? ['']: [''],

})


// if(this.prmsUsrId?.id){
//   this.patchVal()
// }
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
   
      //this.toastr.successToastr(response.msg);
    } else if (response['error'] == true) {
      this.toaster.errorToastr(response.msg);
    }
  }, (err) => {
    this.dataSrv.genericErrorToaster();

  })
}
}


  getRoles(){
    // let comunity_id=this.currentUser?.id
    let data = {
      prms : (this.currentUser?.prmsnId == '1' ||(this.currentUser?.user_role == 3 && this.isDisable == true)) ? 'community_id' : this.currentUser?.prmsnId == '2' || (this.currentUser?.user_role == 3 && this.isDisabled == true) ? 'agency_id' : 'management_id',
       id : this.currentUser?.prmsnId == '6' ? '' : (this.currentUser?.user_role == 3 && this.isDisable == true) ? this.comid : (this.currentUser?.user_role == 3 && this.isDisabled == true) ? this.Agid : this.currentUser?.id
    }
    
    this.dataSrv.getRole(data).subscribe((res:any)=>{
      if(!res.err){
        this.rows =this.tableRoleData= res.body.sort(function(a, b){
          if(a?.name?.toUpperCase() < b?.name?.toUpperCase()) { return -1; }
          if(a?.name?.toUpperCase() > b?.name?.toUpperCase()) { return 1; }
          return 0;
      });
      }else{
      this.toaster.errorToastr('Something went wrong please try again leter')
      }
    },err=>{
      this.dataSrv.genericErrorToaster()
    })
}
change(w:any){
  
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

deleterole(row){
  this.row =row
  this.modalOpenOSE(this.deleteShift, 'lg');
}
closeded(modal: NgbModalRef) {
  modal.dismiss();
}

dltRoleFctn(){
  this.dataSrv.deleteRole({id:this.row.id}).subscribe((res:any)=>{
    if(!res.err){
      this.toaster.successToastr(res.msg)
      this.getRoles()
    this.getRole()
    this.modalService.dismissAll()
    }else{
    this.toaster.errorToastr('Something went wrong please try again leter')
    }
  },err=>{
    this.dataSrv.genericErrorToaster()
  })
}


getPrmsnData(){
  let post=[];
  this.dataSrv.getPermissionByAdminRole().subscribe(
    (res:any) => {
      if (!res.error) {
        res.body.map(i=>{
          //comunity
          if(this.roleData.includes(i.role_id)){
            // if(i.permission_name == 'Department'){
            //     this.dprtmnt=JSON.parse(i.row_data);
            //     this.frstDp = this.dprtmnt[0]?.name
            //  }
             if(i.permission_name == 'Roles'){
              this.addPrms  = i.add_permission
              this.dltPrms  = i.delete_permission
              this.edtPrms  = i.edit_permission
              this.vwPrms  = i.view_permission
              this.assPrms  = i.assignResidentCount_permission
           }
          }
        })
      } 
  }, (error:any) => {
    this.dataSrv.genericErrorToaster()
  }
  )
}

getAgencyId(){
  if(this.currentUser?.user_role == 6 || this.currentUser?.user_role == 3){
    this.dataSrv.agenciesID().subscribe((response: any) => {
      if (response['error'] == false) {
        this.allAgency = response.body.sort(function(a, b){
          if(a.agency_name.toUpperCase() < b.agency_name.toUpperCase()) { return -1; }
          if(a.agency_name.toUpperCase() > b.agency_name.toUpperCase()) { return 1; }
          return 0;
      });
    }
  }
    )}
}

getAgencyForManagement() {
  this.dataSrv.getAgencyForManagement().subscribe((response: any) => {
    if (response['error'] == false) {
      this.allAgency1 = response?.body;
    } 
  },
    (err) => {
      this.dataSrv.genericErrorToaster();
    })
}
SelectAgency(id:any){ 
  if(id == 'undefined'){
    this.isDisabled = false;
  }else{
    this.isDisabled = true;
  }
 this.Agid = id
 this.getRoles()
 


}
selectCommunity(id:any){ 
    if(id == 'undefined'){
      this.isDisable = false;
    }else{
      this.isDisable = true;
    }
    this.comid = id
    this.getRoles() 
}

getRole(){
  
  this.dataSrv.getAllRole().subscribe((res:any)=>{
    if(!res.err){
    if(this.currentUser?.prmsnId == '6'){
       this.rows = this.tableRoleData= res.body.sort(function(a, b){
        if(a?.name?.toUpperCase() < b?.name?.toUpperCase()) { return -1; }
        if(a?.name?.toUpperCase() > b?.name?.toUpperCase()) { return 1; }
        return 0;
    });
    }else{
      this.rows=res.body.filter(i=>{ this.roleData.push(i.id.toString())})
    }
    
            // this.roleData.map(i=>{
            //  if(i != 2  && i != 3 && i != 4  && i != 5 && i != 6 ){
            //    this.roleData1.push(i)
            //  }
            // })
      
    }
  },err=>{
    this.dataSrv.genericErrorToaster()
  })
}
open(content,rows?:any,type?:any) {
  if(type == 'Edit') {
    this.formRoleNewAdd.patchValue({
      role_name : rows?.name,
      trak_type:rows?.trak_type,
      community_id : rows?.community_id ?? '',
      agency_id : rows?.agency_id ?? '',
    })
  }
  this.popup=type
  this.editRole = rows
  this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
    (result) => {
      // this.closeResult = `Closed with: ${result}`;
    },
    (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    },
  );

};

get formRoleNew(){
  return this.formRoleNewAdd.controls;
};


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
      id:this.popup == "Edit" ? this.editRole?.id : '',
      agency_id : this.formRoleNewAdd.value.community_id || this.currentUser?.id,
      trak_type:'1',
      default_Role:this.formRoleNewAdd.value.default_Role
    }
  }else if(this.currentUser?.prmsnId == 3){
    this.data ={
      name:this.formRoleNewAdd.value.role_name,
      id:this.popup == "Edit" ? this.editRole?.id : this.currentUser?.id,
      community_id : this.formRoleNewAdd.value.community_id || this.currentUser?.id,
      trak_type:'1',
      default_Role:this.formRoleNewAdd.value.default_Role
    }
  }
  else if(this.editRole?.agency_id){
    this.data ={
      name:this.selectedRole || this.formRoleNewAdd.value.role_name,
      agency_id:this.formRoleNewAdd.value.agency_id,
      id:this.popup == "Edit" ? this.editRole?.id : '',
      trak_type:this.formRoleNewAdd.value.trak_type,
      default_Role:this.formRoleNewAdd.value.default_Role,
      

    }
  }else{
    this.data ={
      name:this.selectedRole || this.formRoleNewAdd.value.role_name,
      community_id:this.formRoleNewAdd.value.community_id || this.currentUser?.id,
      id:this.popup == "Edit" ? this.editRole?.id : '',
      trak_type:this.formRoleNewAdd.value.trak_type,
      default_Role:this.formRoleNewAdd.value.default_Role
    }
  }
    this.loading=  true;
    if(this.popup == "Edit"){
      this.dataSrv.editRole(this.data).subscribe((res:any)=>{
        if(!res.error){
            this.loading=  false;
            this.getRole()
          this.toaster.successToastr('Edit Role Successfully')
          this.modalService.dismissAll()
          this._router.navigate(['/roles'])
          this.getRoles()
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
          this.toaster.successToastr('New Role Created Successfully')
          this.modalService.dismissAll()
          this._router.navigate(['/roles'])
          this.getRoles()
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
AllChange(e:any){
  let index:any  = this.rows.filter(i=>i.id == e.target.value)
  this.selectedRole = index[0].name
}
 close(){
  this.modalService.dismissAll()
}


}
