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
    this.getHeaders()
    this.getCommunityId()
    this.formPositionData = this.formBuilder.group({
      community_name: ['', this.currentUser.prmsnId == 2 ? '': Validators.required],
      position_name: ['', Validators.required],
    })

    if(this.currentUser.role == 'Community')
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
      community_id : this.currentUser.role=='SuperAdmin' ? this.formPositionData.value.community_name : this.currentUser.id

    }
       this.positionService.addPosition(formData).subscribe((res:any)=>{
        if(!res.invalid){
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
    this.datSrv.getCommunityId().subscribe((response: any) => {
      if (response['error'] == false) {
        this.allCommunity = response.body.sort(function(a, b){
          if(a.community_name.toUpperCase() < b.community_name.toUpperCase()) { return -1; }
          if(a.community_name.toUpperCase() > b.community_name.toUpperCase()) { return 1; }
          return 0;
      });
        //this.toastr.successToastr(response.msg);
      } else if (response['error'] == true) {
        this.toaster.errorToastr(response.msg);
      }
    }, (err) => {
      this.datSrv.genericErrorToaster();

    })
  }
}
