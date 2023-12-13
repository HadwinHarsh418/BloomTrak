import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'app/auth/service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DepartmentService } from '../department.service';

@Component({
  selector: 'app-edit-department',
  templateUrl: './edit-department.component.html',
  styleUrls: ['./edit-department.component.scss']
})
export class EditDepartmentComponent implements OnInit {
  rows: any;
  public contentHeader: any;
  public formDepartmentData: FormGroup;
  loading:boolean = false;
  currentUser: any;
  data: any;


  constructor(
    private departmentApi:DepartmentService,
    private toaster:ToastrManager,
    private aCtRoute : ActivatedRoute,
    private formBuilder:FormBuilder,
    private location :Location,
    private _authenticationService : AuthenticationService
  ) {
    this.aCtRoute.params.subscribe(
      res => {
        if (res) {
          this.data = res
        }
      }
    )
    this._authenticationService.currentUser.subscribe((x: any) => {
      this.currentUser = x;
      
    });
   }

  ngOnInit(): void {
    this.getHeaders()
    this.formDepartmentData = this.formBuilder.group({
      department_name: ['', Validators.required],
    })
    this.formDepartmentData.patchValue({
      department_name : this.data.r
    })
  }

  get FormData_Control() {
    return this.formDepartmentData.controls;
  }

  getHeaders(){
    this.contentHeader = {
      headerTitle: 'Edit Department',
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
            name: 'Department',
            isLink: true,
            link: '/department'
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
    let data = {
      name : this.formDepartmentData.value.department_name,
      community_id :this.currentUser.id,
      role_id : this.currentUser.prmsnId,
      id:this.data.d
    }

    this.departmentApi.editDepartment(data).subscribe(
      (res:any) => {
        if (!res.err) {
          this.rows = res.body;
          this.toaster.successToastr(res.msg)
          this.location.back()
        
        } else {
          this.toaster.errorToastr('Something went wrong please try again leter')
        }
      }, error => {
      this.toaster.errorToastr('Something went wrong please try again leter')

      }
    )
  }
  goBack(){
    this.location.back()
  }

}
