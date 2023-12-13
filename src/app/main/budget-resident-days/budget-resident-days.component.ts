import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-budget-resident-days',
  templateUrl: './budget-resident-days.component.html',
  styleUrls: ['./budget-resident-days.component.scss']
})
export class BudgetResidentDaysComponent implements OnInit {
  rows:any=[];
  currentUser: any;
  fileToUpload: any;
  rl_id: any;
  addPrms: any;
  dltPrms: any;
  edtPrms: any;
  vwPrms: any;
  aplyPrms: any;
  roleData: any =[]
  @ViewChild('dltImprt') dltImprt : ElementRef<any>;
  dltForm: any;
  allCommunity: any=[];

  constructor(
    private dataSrv : DataService,
    private toaster : ToastrManager,
    private _authenticationService : AuthenticationService,
    private modalService: NgbModal,
    private fb: FormBuilder,
  ) { 
    this._authenticationService.currentUser.subscribe((x: any) => {
      this.currentUser = x
    })
    this.getRole()
    this.getCommunityId()
  }

  ngOnInit(): void {
    this.dltForm = this.fb.group({
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      community_name: ['', [Validators.required]],
    })
  }

  getBudgetList(){
    let data = {usrRole : this.currentUser.prmsnId == '6' ? '6' : '', comId : this.currentUser.prmsnId == '6' ? '' : this.currentUser.id }
    this.dataSrv.getBudgetResidentDays(data).subscribe((res:any)=>{
      if(!res.err){
        this.rows = res.body;
        
      }
      else{
        this.toaster.errorToastr('Something went wrong please try again leter')
      }
    },err=>{
        this.dataSrv.genericErrorToaster()
    })
  }

  delete(id){
    
    let data ={
      id: id,
    }
    this.dataSrv.deleteBudgetResidentDays(data).subscribe((res:any)=>{
      
      if(!res.error){
        this.toaster.successToastr(res.msg)
        this.getBudgetList();
      }else{
        this.toaster.errorToastr(res.msg)
      }
    },err=>{
      this.dataSrv.genericErrorToaster()
    })
  }

  @ViewChild('fileInput') elfile: ElementRef;
  onFileInput(files: any) {
    if (files.length === 0) {
      return;
    }
    let type = files[0].type;
    this.fileToUpload = files[0];
    this.uploadNow()
  }

  uploadNow() {
    
    let formdata = new FormData();
    formdata.append('report',this.fileToUpload)

    this.dataSrv.importBudgetResident(formdata).subscribe(
      (res:any) => {
        if (!res.error) {
          this.toaster.successToastr(res.msg)
          this.getBudgetList()
        } else {
          this.toaster.errorToastr(res.msg)
        }
    }, (error:any) => {
      this.dataSrv.genericErrorToaster()
    }
    )
  }

  getPrmsnData(){
    this.dataSrv.getPermissionByAdminRole().subscribe(
      (res:any) => {
        if (!res.error) {
          res.body.map(i=>{
            // 'community','agency administrator','employee', 'agenciesuser'
            if(this.roleData.includes(i.role_id)){
              if(i.role_id ==15){
                this.rl_id = i.role_id
              }
              if(i.trak_type == '0')
              if(i.permission_name == 'Budget Resident Days'){
                this.addPrms  = i.add_permission
                this.dltPrms  = i.delete_permission
                this.edtPrms  = i.edit_permission
                this.vwPrms  = i.view_permission
                this.aplyPrms  = i.apply_permission
              }
            }
          })
          this.getBudgetList();
          
        } 
    }, (error:any) => {
      this.dataSrv.genericErrorToaster()
    }
    )
  }

  getRole(){
    this.dataSrv.getAllRole( ).subscribe((res:any)=>{
      if(!res.err){
        // 
         res.body.filter(i=>{ this.roleData.push(i.id.toString())})
         this.getPrmsnData();

      }
    },err=>{
      this.dataSrv.genericErrorToaster()
    })
  }

  closeVerificationModal(){
    this.modalService.dismissAll()
  }

  get FormData_Control() {
    return this.dltForm.controls;
  }

  dltFormSub(){
    for (let item of Object.keys(this.FormData_Control)) {
      this.FormData_Control[item].markAsDirty()
    }
    if(this.dltForm.invalid){
      return;
    }
   
    let data ={
      start_date:this.dltForm.value.start_date,
      end_date : this.dltForm.value.end_date,
      community_id :this.dltForm.value.community_name
    }
    this.dataSrv.deleteImportBudgerResidentDay(data).subscribe((res: any) => {
      if (!res.error) {
        this.toaster.successToastr(res.msg);
        this.closeVerificationModal()
        this.ngOnInit()
      } else {
        this.toaster.errorToastr(res.msg);
      }
    },
      (err) => {
        this.dataSrv.genericErrorToaster();
  
      })
  }

  openMdl(){
    this.modalOpenOSE(this.dltImprt)
  }

  modalOpenOSE(modalOSE:any) {
    this.modalService.open(modalOSE,
      {
        backdrop: false,
        size: 'md',
        centered: true,
      }
    );
  }

  getCommunityId() {
    this.dataSrv.getCommunityId().subscribe((response: any) => {
      if (response['error'] == false) {
        this.allCommunity = response.body.sort(function(a, b){
          if(a.community_name.toUpperCase() < b.community_name.toUpperCase()) { return -1; }
          if(a.community_name.toUpperCase() > b.community_name.toUpperCase()) { return 1; }
          return 0;
      });
      if(this.currentUser.prmsnId == '1'){
        // this.slctCom(this.currentUser.id)
        this.allCommunity =   this.allCommunity.filter(i=>{
          if(this.currentUser.id == i.id){
            return i
          }
        })
      }
        //this.toastr.successToastr(response.msg);
      } else if (response['error'] == true) {
        this.toaster.errorToastr(response.msg);
      }
    }, (err) => {
      this.dataSrv.genericErrorToaster();

    })
  }
}
