import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'app/auth/service';
import { Location } from '@angular/common';
import { PositionService } from '../position.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ActivatedRoute } from '@angular/router';

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

  constructor(
    private _authenticationService: AuthenticationService, 
    private formBuilder:FormBuilder,
    private toaster:ToastrManager,
    private aCtRoute: ActivatedRoute,
    private location:Location,
    private positionService:PositionService
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
    this.getHeaders()
    this.formPositionData = this.formBuilder.group({
      position_name: ['', Validators.required],
    })

    this.formPositionData.patchValue({
      position_name: this.prmsUsrId.n
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
//     let community_id= this.currentUser.id
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
      community_id:this.currentUser.id,
      id: this.prmsUsrId.id,
    }
       this.positionService.editPosition(formData).subscribe((res:any)=>{
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
}
