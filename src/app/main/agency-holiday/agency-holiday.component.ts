import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-agency-holiday',
  templateUrl: './agency-holiday.component.html',
  styleUrls: ['./agency-holiday.component.scss']
})
export class AgencyHolidayComponent implements OnInit {
  searchStr:any;
  currentUser: any;
  rows: any;
  addPrms: any;
  dltPrms: any;
  edtPrms: any;
  vwPrms: any;
  roleData: any=[];
  allCommunity1: any[];
  community_id: any;
  constructor(
    private dtsrv: DataService,
    private _authenticationService : AuthenticationService,
    private toaster : ToastrManager
  ) { 
    this._authenticationService.currentUser.subscribe((x: any) => {
      this.currentUser = x
      
    });
    this.getRole()
  }

  ngOnInit(): void {
    this.currentUser?.user_role == 3 || this.currentUser?.user_role == 8 ? this.getMngComunity() : this.currentUser?.user_role == 2 ? this.getCommunityByAgencyID() : '';

    this.currentUser?.user_role == 2 || this.currentUser?.user_role == 5  || this.currentUser?.user_role == 8 ? '' : this.getHoliday()
  
  }
  getHoliday(){
    let data = { 
      id:this.currentUser?.user_role == 2 || this.currentUser?.user_role == 5  || this.currentUser?.user_role == 8?this.community_id :this.currentUser?.user_role ==3 ?this.community_id: this.currentUser?.id
    }    
    this.dtsrv.getHoliday(data).subscribe((res:any)=>{
      this.rows = res.body.sort(function (a, b) {
        if (a.start_date.toUpperCase() < b.start_date.toUpperCase()) { return 1; }
        if (a.start_date.toUpperCase() > b.start_date.toUpperCase()) { return -1; }
        return 0;
      });
    },err=>{
      this.toaster.errorToastr('Something went wrong please try again leter')
    })
  }
  selectCommunity1(id:any){
    this.community_id=id;
    this.getHoliday()
  }

  getPrmsnData(){
    this.dtsrv.getPermissionByAdminRole().subscribe(
      (res:any) => {
        if (!res.error) {
          res.body.map(i=>{
            //comunity
            if(this.roleData.includes(i.role_id)){
              if(i.trak_type == '1')
              if(i.permission_name == 'Agency Holiday'){
                this.addPrms  = i.add_permission
              this.dltPrms  = i.delete_permission
              this.edtPrms  = i.edit_permission
              this.vwPrms  = i.view_permission
              }
            }
          })
          
        } 
    }, (error:any) => {
      this.dtsrv.genericErrorToaster()
    }
    )
  }

  getRole(){
    this.dtsrv.getAllRole( ).subscribe((res:any)=>{
      if(!res.err){
         res.body.filter(i=>{ this.roleData.push(i.id.toString())})
         this.getPrmsnData()

      }
    },err=>{
      this.dtsrv.genericErrorToaster()
    })
  }

  getCommunityByAgencyID() {
    this.dtsrv.getCommunityByAgencyID(this.currentUser?.user_role == 5 ? this.currentUser?.com_id : this.currentUser?.id).subscribe((response: any) => {
      if (response['error'] == false) {
        this.allCommunity1 = response.body.sort(function(a, b){
          if(a.community_name.toUpperCase() < b.community_name.toUpperCase()) { return -1; }
          if(a.community_name.toUpperCase() > b.community_name.toUpperCase()) { return 1; }
          return 0;
      }) 
      this.community_id = response.body[0].community_id;
      this.getHoliday()
    }
    },
      (err) => {
        this.dtsrv.genericErrorToaster();
      })
  }

  getMngComunity(){
    if(this.currentUser?.id && this.currentUser?.com_id){
      let data = {
        userId : this.currentUser?.id,
        mangId : this.currentUser?.management
      }
      this.dtsrv.getManagementUserCommunities(data).subscribe((res: any) => {
        if (!res.error) {
          // this.mangComs = res.body[1].userAvailableCommunities
          let d:any[] = res?.body[0].user_added_communities.concat(res?.body[1].userAvailableCommunities);
          const uniqueArray = d.filter((obj, index, self) =>
                index === self.findIndex((t) => (
                    t.community_id === obj.community_id &&
                    t.community_name === obj.community_name &&
                    t.community_short_name === obj.community_short_name
                ))
            );
          this.allCommunity1 = uniqueArray.sort(function(a, b){
            if(a.community_name.toUpperCase() < b.community_name.toUpperCase()) { return -1; }
            if(a.community_name.toUpperCase() > b.community_name.toUpperCase()) { return 1; }
            return 0;
        })  ;
        this.community_id = this.allCommunity1[0]?.community_id
      this.getHoliday();
        } else {
          this.toaster.errorToastr(res.msg);
        }
      },
        (err) => {
          this.dtsrv.genericErrorToaster();
        })
    }
    else{
      this.dtsrv.getMNMGcommunity(this.currentUser?.id).subscribe((response: any) => {
        if (response['error'] == false) {
          this.allCommunity1 = response.body.sort(function(a, b){
            if(a.community_name.toUpperCase() < b.community_name.toUpperCase()) { return -1; }
            if(a.community_name.toUpperCase() > b.community_name.toUpperCase()) { return 1; }
            return 0;
        })  ;
        this.community_id = response?.body[0]?.cp_id
      this.getHoliday();
          //this.toastr.successToastr(response.msg);
        } else if (response['error'] == true) {
          this.toaster.errorToastr(response.msg);
        }
      }, (err) => {
        this.dtsrv.genericErrorToaster();
  
      })
    }
  }
}
