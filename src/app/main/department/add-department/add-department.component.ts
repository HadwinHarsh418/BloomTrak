import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'app/auth/service';
import { Location } from '@angular/common';
import { DepartmentService } from '../department.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { DataService } from 'app/auth/service/data.service';

@Component({
  selector: 'app-add-department',
  templateUrl: './add-department.component.html',
  styleUrls: ['./add-department.component.scss']
})
export class AddDepartmentComponent implements OnInit {
  public contentHeader: any;
  currentUser:any;
  public formDepartmentData: FormGroup;
  loading:boolean = false;
  allCommunity: any =[]
  depatData: any=[]
  @ViewChild('Addnew') Addnew: ElementRef<any>;
  formData: any;

  constructor(private _authenticationService: AuthenticationService, 
    private formBuilder:FormBuilder,
    private location:Location,
    private dataService: DataService,
    private tost : ToastrManager,
    private modalService : NgbModal,
    private departmentService:DepartmentService) { 
    this._authenticationService.currentUser.subscribe((x: any) => {
      this.currentUser = x
      
    });
  }

  dropdownSettings: IDropdownSettings = {
    singleSelection: true,
    idField: 'id',
    textField: 'community_name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    closeDropDownOnSelection: true,
    itemsShowLimit: 3,
    allowSearchFilter: false
  };

  ngOnInit(): void {
    this.getHeaders()
    this.getCommunityId()
    this.getNewDepartment()
    this.formDepartmentData = this.formBuilder.group({
      community_name: ['', Validators.required],
      department_name: ['', Validators.required],
    })
    
    this.formData = this.formBuilder.group({
      newVendor: ['', Validators.required],
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
  }
  get FormData_Control() {
    return this.formDepartmentData.controls;
  }

  getHeaders(){
    this.contentHeader = {
      headerTitle: 'Add Department',
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
    let Data = {
      name  : this.formDepartmentData.value.department_name,
      community_id : this.currentUser.role=='SuperAdmin' ? this.formDepartmentData.value.community_name : this.currentUser.id,
      role_id : this.currentUser.prmsnId
    }
   
    this.departmentService.addDepartment(Data).subscribe((res:any)=>{
      if (!res.error) {
        this.tost.successToastr(res.msg)
        this.location.back()
      
      }
    })
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
        this.tost.errorToastr(response.msg);
      }
    }, (err) => {
      this.dataService.genericErrorToaster();

    })
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

  closeded(modal: NgbModalRef) {
    modal.dismiss();
  }


  openAddNew() {
    this.formData.reset()
    this.modalOpenOSE(this.Addnew, 'lg');
  }

  getNewDepartment(){
    this.dataService.getNewDepartment().subscribe((res:any)=>{
      if(!res.err){
        this.depatData = res.body.sort(function(a, b){
          if(a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
          if(a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
          return 0;
      })  ;;
      }
      else{
        this.tost.errorToastr('Something went wrong please try again leter')
      }
    },err=>{
        this.dataService.genericErrorToaster()
    })
  }
  get controls(){
    return this.formData.controls;
  }

  addNwVndr(modal){
    for (let item of Object.keys(this.controls)) {
      this.controls[item].markAsDirty()
    }
    if (this.formData.invalid) {
      return;
    }
    this.closeded(modal)
    // this.formRoleData.get('departList').setValue(this.formData.value.newVendor)
    let data ={
      name: this.formData.value.newVendor,
}
    this.dataService.addNewDepartment(data).subscribe((res:any)=>{
      if(!res.error){
          this.loading=  false;
        this.tost.successToastr(res.msg)
        // this.formRoleData.get('vendor').setValue('')
        this.getNewDepartment()
      }else{
        this.loading=  false;
        this.tost.errorToastr(res.msg)
      }
    },err=>{
      this.loading=  false;
      this.dataService.genericErrorToaster()
    })
  }

}
