import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'app/auth/service';
import { Location } from '@angular/common';
import { PositionService } from '../position.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ActivatedRoute } from '@angular/router';
import { Console } from 'console';
import { DataService } from 'app/auth/service/data.service';

@Component({
  selector: 'app-edit-position',
  templateUrl: './edit-position.component.html',
  styleUrls: ['./edit-position.component.scss']
})
export class EditPositionComponent implements OnInit {

  public contentHeader: any;
  currentUser:any;
  public formPositionData: FormGroup;
  loading:boolean = false;
  public rows: any;
  prmsUsrId: any;
  id: any;
  isGaleAgency: any;

  constructor(
    private _authenticationService: AuthenticationService, 
    private formBuilder:FormBuilder,
    private toaster:ToastrManager,
    private aCtRoute: ActivatedRoute,
    private location:Location,
    private positionService:PositionService,
    private dataService :  DataService

  ) { 
    this._authenticationService.currentUser.subscribe((x: any) => {
      this.currentUser = x
      
      
    });

    this.aCtRoute.params.subscribe(
      res => {
        this.prmsUsrId = res        
        // this.getDetails(this.prmsUsrId)
        
        
      }
    )
  }

  ngOnInit(): void {
    this.currentUser.user_role == 1 || this.currentUser.user_role == 4 ? this.getcommunityById() : ''
    this.getHeaders()
    this.formPositionData = this.formBuilder.group({
      position_name: ['', Validators.required],
      avg_rate: ['',Validators.required],
      gale_position_rate: ['',Validators.required],
      gale_position_name: ['',Validators.required],

    })

    this.formPositionData.patchValue({
      position_name: this.prmsUsrId.n,
      avg_rate: this.prmsUsrId.avg,
      gale_position_rate: this.prmsUsrId.gale_rate == "null" ? '' : this.prmsUsrId.gale_rate,
      gale_position_name: this.prmsUsrId.gale_name == "null" ? '' : this.prmsUsrId.gale_name,
    });
  }


  
  get FormData_Control() {
    return this.formPositionData.controls;
  }

  getHeaders(){
    this.contentHeader = {
      headerTitle: 'Edit Position',
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

//   getDetails(row:any){
//     let community_id= this.currentUser?.id
//     
//     this.id = row.id
//     this.positionService.getPosition(this.id).subscribe((res:any)=>{
//       this.rows = res.body;
      
//   },err=>{
//     this.toaster.errorToastr('Something went wrong please try again leter')
//   })
// }

submitted(){
    for (let item of Object.keys(this.FormData_Control)) {
      this.FormData_Control[item].markAsDirty()
    }
    if (this.formPositionData.invalid) {
      return;
    }
    let formData = {
      name : this.formPositionData.value.position_name,
      avg_rate:this.formPositionData.value.avg_rate,
      gale_position_name : this.formPositionData.value.gale_position_name,
      gale_position_rate : this.formPositionData.value.gale_position_rate,
      community_id:this.currentUser.user_role == 3 || this.currentUser.user_role == 8 || this.currentUser.user_role == 6 ? this.prmsUsrId.comid : this.currentUser.id,
      id: this.prmsUsrId.id,
    }
       this.positionService.editPosition(formData).subscribe((res:any)=>{
        if(!res.invalid){
          
          this.toaster.successToastr('Position Updated')
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
  getcommunityById()
{
  this.dataService.getcommunityById(this.currentUser.user_role == 4 ? this.currentUser.com_id : this.currentUser.id).subscribe(response => {
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
