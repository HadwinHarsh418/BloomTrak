import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'app/auth/service';
import { Location } from '@angular/common';
import { PositionService } from '../position.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DataService } from 'app/auth/service/data.service';

@Component({
  selector: 'app-add-position',
  templateUrl: './add-position.component.html',
  styleUrls: ['./add-position.component.scss']
})
export class AddPositionComponent implements OnInit {

  public contentHeader: any;
  currentUser:any;
  public formPositionData: FormGroup;
  allCommunity: any=[];
  loading:boolean = false;
  community_id: any;
  isGaleAgency: any;
  constructor(
    private _authenticationService: AuthenticationService, 
    private formBuilder:FormBuilder,
    private toaster:ToastrManager,
    private location:Location,
    private datSrv :DataService,
    private positionService:PositionService
  ) {
    this._authenticationService.currentUser.subscribe((x: any) => {
      this.currentUser = x
      
    });
   }

  ngOnInit(): void {
    this.currentUser.user_role == 1 || this.currentUser.user_role == 4 ? this.getcommunityById() : ''
    this.getHeaders()
    this.currentUser?.user_role == 3 || this.currentUser?.user_role == 8 ? this.getMngComunity() : this.getCommunityId()
    this.formPositionData = this.formBuilder.group({
      community_name: ['', this.currentUser?.prmsnId == 2 ? '': Validators.required],
      position_name: ['', Validators.required],
      gale_position_name: ['', Validators.required],
      gale_position_rate: ['',Validators.required],
      avg_rate: ['',Validators.required]
    })

    if(this.currentUser?.role == 'Community' || this.currentUser?.user_role == 4)
    {
     this.formPositionData.controls['community_name'].clearValidators();
     this.formPositionData.updateValueAndValidity();
    }
    
    if(this.currentUser.role == 'SuperAdmin')
    {
     this.formPositionData.controls['community_name'].setValidators(Validators.required);
     this.formPositionData.updateValueAndValidity();
    }
  
 

  }

  get FormData_Control() {
    return this.formPositionData.controls;
  }

  getHeaders(){
    this.contentHeader = {
      headerTitle: 'Add Position',
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
            name: 'Position',
            isLink: true,
            link: '/position'
          }
        ]
      }
    };
  }

  submitted(){
    for (let item of Object.keys(this.FormData_Control)) {
      this.FormData_Control[item].markAsDirty()
    }
    if (this.formPositionData.invalid) {
      return;
    }
    let formData = {
      name : this.formPositionData.value.position_name,
      gale_position_name : this.formPositionData.value.gale_position_name,
      avg_rate : this.formPositionData.value.avg_rate,
      gale_position_rate : this.formPositionData.value.gale_position_rate,
      community_id : this.currentUser.role=='SuperAdmin' || this.currentUser.user_role == 3 || this.currentUser.user_role == 8 ? this.formPositionData.value.community_name : this.currentUser.user_role == 4 ? this.currentUser.com_id : this.currentUser.id

    }
       this.positionService.addPosition(formData).subscribe((res:any)=>{
        if(!res.error){
          this.toaster.successToastr(res.msg)
          this.goBack()
        }
        else{
          this.toaster.errorToastr(res.msg)
        }
    })
  }
  goBack(){
    this.location.back()
  }

  getCommunityId() {
    if(this.currentUser?.user_role==6)
    this.datSrv.getCommunityId().subscribe((response: any) => { 
          this.allCommunity = response.body.sort(function(a, b){
            if(a.community_name.toUpperCase() < b.community_name.toUpperCase()) { return -1; }
            if(a.community_name.toUpperCase() > b.community_name.toUpperCase()) { return 1; }
            return 0;
        })  ;
        })
 }
 getMngComunity(){
  if(this.currentUser?.id && this.currentUser?.com_id){
    let data = {
      userId : this.currentUser?.id,
      mangId : this.currentUser?.com_id
    }
    this.datSrv.getManagementUserCommunities(data).subscribe((res: any) => {
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
      } else {
        this.toaster.errorToastr(res.msg);
      }
    },
      (err) => {
        this.datSrv.genericErrorToaster();
      })
  }
  else{
    this.datSrv.getMNMGcommunity(this.currentUser?.id).subscribe((response: any) => {
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
      this.datSrv.genericErrorToaster();

    })
  }
}
getcommunityById()
{
  this.datSrv.getcommunityById(this.currentUser.user_role == 4 ? this.currentUser.com_id : this.currentUser.id).subscribe(response => {
    if (!response.error) {
      if (response.body && response.body[0] && response.body[0]) {
        this.isGaleAgency = response.body[0].gale_flag;
        if (this.isGaleAgency !== 1) {
          this.formPositionData.controls['gale_position_name'].clearValidators();
        } else {
          this.formPositionData.controls['gale_position_name'].setValidators(Validators.required);
        }
        this.formPositionData.controls['gale_position_name'].updateValueAndValidity();
      }

      if (this.isGaleAgency !== 1) {
        this.formPositionData.controls['gale_position_rate'].clearValidators();
      } else {
        this.formPositionData.controls['gale_position_rate'].setValidators(Validators.required);
      }
      this.formPositionData.controls['gale_position_rate'].updateValueAndValidity();
    
    }
  });

}
}