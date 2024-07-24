import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CertificationService } from './certification.service';

@Component({
  selector: 'app-certification',
  templateUrl: './certification.component.html',
  styleUrls: ['./certification.component.scss']
})
export class CertificationComponent implements OnInit {
  public rows: any;
  searchStr:string='';
  currentUser: any;
  addPrms: any;
  dltPrms: any;
  edtPrms: any;
  vwPrms: any;
  roleData: any=[]
  roleData1: any=[];
  roleData2: any=[];
  allCommunity: any;
  community_id: any;
  constructor(private _authenticationService:AuthenticationService,
     private toaster:ToastrManager, private certificationService:CertificationService,
     private _router:Router,
     private dataService : DataService
     ) {
    this._authenticationService.currentUser.subscribe((x: any) => {
      this.currentUser = x
      this.currentUser?.user_role == 8 || this.currentUser?.user_role == 3 ? this.getMngComunity() : '' 
    });
    this.getRole()
   }

  ngOnInit(): void {
    this.currentUser?.user_role !=3 && this.currentUser?.user_role != 8 ? this.getCertification() :''
    
  }
  getCertification(){
    let community_id= this.currentUser?.user_role == 4 ? this.currentUser?.com_id : this.currentUser?.user_role == 3 || this.currentUser?.user_role == 8 ? this.community_id : this.currentUser?.id

    let data = {usrRole : this.currentUser?.prmsnId == '6' ? '6' : '', comId : this.currentUser?.user_role == 3 || this.currentUser?.user_role == 8 ? this.community_id : community_id}
    this.certificationService.getCertificationListing(data).subscribe((res:any)=>{
      if(!res.err){
        this.rows = res.body.sort(function (a, b) {
          if (a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
          if (a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
          return 0;
        });;
      }else{
      this.toaster.errorToastr('Something went wrong please try again leter')
      }
    },err=>{
      this.toaster.errorToastr('Something went wrong please try again leter')
    })
}

dltCrtfctn(row){
  this.certificationService.deletedCertification(row.id).subscribe((res:any)=>{
    if(!res.err){
      this.toaster.successToastr(res.msg)
      this.ngOnInit()
      this.getCertification()
    }else{
    this.toaster.errorToastr('Something went wrong please try again leter')
    }
  },err=>{
    this.toaster.errorToastr('Something went wrong please try again leter')
  })
}


getMngComunity(){
  if(this.currentUser?.id && this.currentUser?.com_id){
    let data = {
      userId : this.currentUser?.id,
      mangId : this.currentUser?.com_id
    }
    this.dataService.getManagementUserCommunities(data).subscribe((res: any) => {
      if (!res.error) {
        let d = res?.body[0].user_added_communities.concat(res?.body[1].userAvailableCommunities);
        // this.mangComs = res.body[1].userAvailableCommunities
        let e=[]
        let c =[]
        d.forEach(element => {
          if(!e.includes(element.community_id)){
            e.push(element.community_id)
            c.push(element)
          }
        });
        this.allCommunity = c.sort(function(a, b){
          if(a.community_name.toUpperCase() < b.community_name.toUpperCase()) { return -1; }
          if(a.community_name.toUpperCase() > b.community_name.toUpperCase()) { return 1; }
          return 0;
      })  ;
      this.community_id = this.allCommunity[0]?.community_id
      this.getCertification()
      } else {
        this.toaster.errorToastr(res.msg);
      }
    },
      (err) => {
        this.dataService.genericErrorToaster();
      })
  }
  else{
    this.dataService.getMNMGcommunity(this.currentUser?.id).subscribe((response: any) => {
      if (response['error'] == false) {
        this.allCommunity = response.body.sort(function(a, b){
          if(a.community_name.toUpperCase() < b.community_name.toUpperCase()) { return -1; }
          if(a.community_name.toUpperCase() > b.community_name.toUpperCase()) { return 1; }
          return 0;
      })  ;
      this.community_id = this.allCommunity[0]?.cp_id
      this.getCertification()
      } else if (response['error'] == true) {
        this.toaster.errorToastr(response.msg);
      }
    }, (err) => {
      this.dataService.genericErrorToaster();

    })
  }
}


selectCommunity(id:any){
  this.community_id = id
  this.getCertification()  
}

getPrmsnData(){
  this.dataService.getPermissionByAdminRole().subscribe(
    (res:any) => {
      if (!res.error) {
        res.body.map(i=>{
          //comunity
          // if(this.roleData.includes(i.role_id)){
            if(i.permission_name == 'Certification'){
              this.addPrms  = i.add_permission
            this.dltPrms  = i.delete_permission
            this.edtPrms  = i.edit_permission
            this.vwPrms  = i.view_permission
            }
          // }
        })
        
      } 
  }, (error:any) => {
    this.dataService.genericErrorToaster()
  }
  )
}

getRole(){
  this.dataService.getAllRole().subscribe((res:any)=>{
    if(!res.err){
       res.body.filter(i=>{ this.roleData.push(i.id.toString())})
       this.roleData.map(i=>{
        if(i != 2 && i != 3  && i != 4 && i != 5 && i != 6 ){
          this.roleData1.push(i)
        }
        if(i != 1 && i != 2 && i != 3  && i != 4 && i != 5 && i != 6 ){
          this.roleData2.push(i)
        }
       })
       this.getPrmsnData()
      
    }
  },err=>{
    this.dataService.genericErrorToaster()
  })
}

}
