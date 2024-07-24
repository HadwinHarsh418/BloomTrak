import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.scss']
})
export class BudgetComponent implements OnInit {
  rows:any=[];
  currentUser: any;
  fileToUpload: any;
  rl_id: any;
  addPrms: any;
  dltPrms: any;
  edtPrms: any;
  vwPrms: any;
  aplyPrms: any;
  roleData: any=[]
  @ViewChild('dltImprt') dltImprt : ElementRef<any>;
  dltForm: any;
  allCommunity: any=[];
  searchStr: string = '';
  @ViewChild('searchStrInput', { static: true }) searchStrInput: ElementRef<any>;
  selectCommunity: '';

  constructor(
    private dataSrv : DataService,
    private toaster : ToastrManager,
    private _authenticationService : AuthenticationService,
    private modalService: NgbModal,
    private fb: FormBuilder,
  ) { 
    this._authenticationService.currentUser.subscribe((x: any) => {
      this.currentUser = x;
      [3,8].includes(this.currentUser?.user_role) ? this.getMngComunity():this.getCommunityId()
      // this.getCommunityId()
    })
    this.getRole()
  }

  ngOnInit(): void {
    this.dltForm = this.fb.group({
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      community_name: ['', [Validators.required]],
    })

    fromEvent(this.searchStrInput.nativeElement, 'keyup').pipe(
      map((event: any) => {
        
        return event.target.value
        
      })
      , debounceTime(1000)
      , distinctUntilChanged()
    ).subscribe((text: string) => {
      this.getBudgetTable()
    });
  }

  getMngComunity(){
    if(this.currentUser?.id && this.currentUser?.com_id){
      let data = {
        userId : this.currentUser?.id,
        mangId : this.currentUser?.management
      }
      this.dataSrv.getManagementUserCommunities(data).subscribe((res: any) => {
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
          this.allCommunity = uniqueArray.sort(function(a, b){
            if(a.community_name.toUpperCase() < b.community_name.toUpperCase()) { return -1; }
            if(a.community_name.toUpperCase() > b.community_name.toUpperCase()) { return 1; }
            return 0;
        })  ;
        this.selectCommunity = this.allCommunity[0].community_id;
    this.getBudgetTable(this.selectCommunity)
        } else {
          this.toaster.errorToastr(res.msg);
        }
      },
        (err) => {
          this.dataSrv.genericErrorToaster();
        })
    }
    else{
      this.dataSrv.getMNMGcommunity(this.currentUser?.id).subscribe((response: any) => {
        if (response['error'] == false) {
          this.allCommunity = response.body.sort(function(a, b){
            if(a.community_name.toUpperCase() < b.community_name.toUpperCase()) { return -1; }
            if(a.community_name.toUpperCase() > b.community_name.toUpperCase()) { return 1; }
            return 0;
        })  ;
        this.selectCommunity = response.body[0].cp_id;
    this.getBudgetTable(this.selectCommunity)
          //this.toastr.successToastr(response.msg);
        } else if (response['error'] == true) {
          this.toaster.errorToastr(response.msg);
        }
      }, (err) => {
        this.dataSrv.genericErrorToaster();
  
      })
    }
  }
  chngCom(comId){
    this.selectCommunity = comId;
    this.getBudgetTable(comId)
  }

  getBudgetTable(id?){
    let data = {searchStr:this.searchStr,usrRole : this.currentUser?.prmsnId == '6' ? '6' : '', comId : this.selectCommunity ? this.selectCommunity : this.currentUser?.prmsnId == '6' ? '' : this.currentUser?.com_id ? this.currentUser?.com_id :this.currentUser?.id }
    this.dataSrv.getBudgetTable(data).subscribe((res:any)=>{
      if(!res.err){
        this.rows = res.body
        // this.rows.map(i=>{
        //   if(i.PRD_value == ("" || "  " || null || 'undefined')){
        //     i.PRD_value1 = "0"
        //   }
        // });
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
    this.dataSrv.deleteBudgetTable(data).subscribe((res:any)=>{
      
      if(!res.error){
        this.toaster.successToastr(res.msg)
        this.getBudgetTable();
      }else{
        this.toaster.errorToastr(res.msg)
      }
    },err=>{
      this.dataSrv.genericErrorToaster()
    })
  }

  @ViewChild('fileInput') elfile: ElementRef;
  onFileInput(files: any) {
    if (files && !['csv' ,'xls','text/csv'].includes(files[0].type)) {
      this.toaster.errorToastr('Invalid file type. Please select a CSV file.');
      return;
  
    }
    else {
      this.fileToUpload = files[0];
      this.uploadNow()
    }
      
        }

  uploadNow() {
    
    let formdata = new FormData();
    formdata.append('report',this.fileToUpload)

    this.dataSrv.importBudget(formdata).subscribe(
      (res:any) => {
        if (!res.error) {
          this.toaster.successToastr(res.msg)
          this.getBudgetTable()
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
          res.body.forEach(i=>{
            // 'community','agency administrator','employee', 'agenciesuser'
            
              if(i.role_id ==15){
                this.rl_id = i.role_id
              }
              if(i.permission_name == 'Budget'){
                this.addPrms  = i.add_permission
                this.dltPrms  = i.delete_permission
                this.edtPrms  = i.edit_permission
                this.vwPrms  = i.view_permission
                this.aplyPrms  = i.apply_permission
              }
          })
          this.getBudgetTable();
          
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

  openMdl(){
    this.modalOpenOSE(this.dltImprt)
  }

  deleteBudgerImport(){
    let data ={

    }
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

  modalOpenOSE(modalOSE:any) {
    this.modalService.open(modalOSE,
      {
        backdrop: false,
        size: 'md',
        centered: true,
      }
    );
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
      community_id : this.dltForm.value.community_name 
    }
    this.dataSrv.deleteBudgerImport(data).subscribe((res: any) => {
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

  getCommunityId() {
    this.dataSrv.getCommunityId().subscribe((response: any) => {
      if (response['error'] == false) {
        this.allCommunity = response.body.sort(function(a, b){
          if(a.community_name.toUpperCase() < b.community_name.toUpperCase()) { return -1; }
          if(a.community_name.toUpperCase() > b.community_name.toUpperCase()) { return 1; }
          return 0;
      });
      if(this.currentUser?.prmsnId == '1'){
        // this.slctCom(this.currentUser?.id)
        this.allCommunity =   this.allCommunity.filter(i=>{
          if(this.currentUser?.id == i.id){
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
