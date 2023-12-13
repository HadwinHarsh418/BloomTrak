import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'app/auth/service';
import { Location } from '@angular/common';
import { CertificationService } from '../certification.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'app/auth/service/data.service';


@Component({
  selector: 'app-add-certification',
  templateUrl: './add-certification.component.html',
  styleUrls: ['./add-certification.component.scss']
})
export class AddCertificationComponent implements OnInit {
  public contentHeader: any;
  currentUser:any;
  public formDepartmentData: FormGroup;
  loading:boolean = false;
  RouteIdData:any;
  allCommunity: any=[];

  constructor(private _authenticationService: AuthenticationService, private formBuilder:FormBuilder,private location:Location,
    private dataService: DataService,private certificationService:CertificationService,private toaster:ToastrManager, private _router:Router, private activatedRoute:ActivatedRoute
    ) {
      this.activatedRoute.params.subscribe((res:any)=>{
        if(res){
          
          this.RouteIdData = res;
        }
      })
    this._authenticationService.currentUser.subscribe((x: any) => {
      this.currentUser = x
      
      
    });
  }

  ngOnInit(): void {
    this.getHeaders()
    this.getCommunityId()
    this.formDepartmentData = this.formBuilder.group({
      department_name: ['', Validators.required],
      community_name: ['', Validators.required],
    })
    if(this.currentUser.role == 'Community')
    {
     this.formDepartmentData.controls['community_name'].clearValidators();
     this.formDepartmentData.updateValueAndValidity();
    }
    if(this.currentUser.role == 'SuperAdmin')
    {
     this.formDepartmentData.controls['community_name'].setValidators(Validators.required);
     this.formDepartmentData.updateValueAndValidity();
    }
    
    if(this.RouteIdData){
      this.formPatch()
    }
    if(this.currentUser.role == 'Community')
    {
     this.formDepartmentData.controls['community_name'].clearValidators();
     this.formDepartmentData.updateValueAndValidity();
    }
    if(this.currentUser.role == 'SuperAdmin')
    {
     this.formDepartmentData.controls['community_name'].setValidators(Validators.required);
     this.formDepartmentData.updateValueAndValidity();
    }
  }
  get FormData_Control() {
    return this.formDepartmentData.controls;
  }

  formPatch(){
    this.formDepartmentData.patchValue({
      "department_name":this.RouteIdData.r,
      // "community_name":this.RouteIdData.r
    })

  }

  getHeaders(){
    this.contentHeader = {
      headerTitle: this.RouteIdData.id ? 'Edit Certification': 'Add Certification',
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
            name: 'Certification',
            isLink: true,
            link: '/certification'
          }
        ]
      }
    };
  }

  submitted(){
    for (let item of Object.keys(this.FormData_Control)) {
      this.FormData_Control[item].markAsDirty()
    }
    if (this.formDepartmentData.invalid) {
      return;
    }
    let data ={
      "name":this.formDepartmentData.value.department_name,
     "community_id" : this.currentUser.role=='SuperAdmin' ? this.formDepartmentData.value.community_name : this.currentUser.id,
      "id":this.RouteIdData.id ?this.RouteIdData.id : ''
    }
    this.loading=  true;
    if(this.RouteIdData.id){
      this.certificationService.editCertifications(data).subscribe((res:any)=>{
        
        if(!res.error){
            this.loading=  false;
          this.toaster.successToastr(res.msg)
          this._router.navigate(['/certification'])
        }else{
          this.loading=  false;
          this.toaster.errorToastr(res.msg)
        }
      },err=>{
        this.loading=  false;
        this.toaster.errorToastr('Something went wrong please try again leter')
      })
    }else{
      this.certificationService.addCertifications(data).subscribe((res:any)=>{
        
        if(!res.error){
            this.loading=  false;
          this.toaster.successToastr(res.msg)
          this._router.navigate(['/certification'])
        }else{
          this.loading=  false;
          this.toaster.errorToastr(res.msg)
        }
      },err=>{
        this.loading=  false;
        this.toaster.errorToastr('Something went wrong please try again leter')
      })
    }
  }
  goBack(){
    this.location.back()
  }
  getCommunityId() {
    this.dataService.getCommunityId().subscribe((response: any) => {
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
      this.dataService.genericErrorToaster();

    })
  }
}