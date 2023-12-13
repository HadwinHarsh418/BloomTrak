import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from 'app/auth/service/data.service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-add-department-list',
  templateUrl: './add-department-list.component.html',
  styleUrls: ['./add-department-list.component.scss']
})
export class AddDepartmentListComponent implements OnInit {

  @ViewChild('Addnew') Addnew: ElementRef<any>;
  formData: any;
  depatData: any=[]


  constructor(
    private aCtRoute : ActivatedRoute,
    private formBuilder : FormBuilder,
    private location: Location,
    private dataSrv :DataService,
    private toaster : ToastrManager,
    private _router : Router,
    private modalService : NgbModal
  ) { 
    this.aCtRoute.params.subscribe(
      res => {
          this.prmsUsrId = res;
          if(this.prmsUsrId.id){
          }
      }
    )
  }
  public contentHeader: any;
  prmsUsrId: any;
  formRoleData: any;
  loading:boolean = false;

  ngOnInit(): void {
    this.getNewDepartment()
    this.contentHeader = {
      headerTitle: this.prmsUsrId?.id ? 'Edit Department List' : 'Add Department List',
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
            name: 'Department List',
            isLink: true,
            link: '/department-list'
          }
        ]
      }
    };

    this.formRoleData = this.formBuilder.group({
      departList: ['', Validators.required],
     })

     this.formData = this.formBuilder.group({
      newVendor: ['', Validators.required],
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

  goBack(){
    this.location.back()
  }

  get FormData_Control(){
    return this.formRoleData.controls;
  }

  get controls(){
    return this.formData.controls;
  }


  submitted(){
    for (let item of Object.keys(this.FormData_Control)) {
      this.FormData_Control[item].markAsDirty()
    }
    if (this.formRoleData.invalid) {
      return;
    }
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
    this.dataSrv.addNewDepartment(data).subscribe((res:any)=>{
      if(!res.error){
          this.loading=  false;
        this.toaster.successToastr(res.msg)
        // this.formRoleData.get('vendor').setValue('')
        this.getNewDepartment()
      }else{
        this.loading=  false;
        this.toaster.errorToastr(res.msg)
      }
    },err=>{
      this.loading=  false;
      this.dataSrv.genericErrorToaster()
    })
  }

  getNewDepartment(){
    this.dataSrv.getNewDepartment().subscribe((res:any)=>{
      if(!res.err){
        this.depatData = res.body.sort(function(a, b){
          if(a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
          if(a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
          return 0;
      })  ;;
      }
      else{
        this.toaster.errorToastr('Something went wrong please try again leter')
      }
    },err=>{
        this.dataSrv.genericErrorToaster()
    })
  }

}
