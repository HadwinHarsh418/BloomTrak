import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

@Component({
  selector: 'app-general-ledger',
  templateUrl: './general-ledger.component.html',
  styleUrls: ['./general-ledger.component.scss']
})
export class GeneralLedgerComponent implements OnInit {
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
  roleData1: any=[];
  roleData2: any=[];
  @ViewChild('searchStrInput', { static: true }) searchStrInput: ElementRef<any>;
  searchStr: string = '';

  constructor(
    private dataSrv : DataService,
    private toaster : ToastrManager,
    private _authenticationService : AuthenticationService
  ) {
    this._authenticationService.currentUser.subscribe((x: any) => {
      this.currentUser = x
    })
    this.getRole()
   }

  ngOnInit(): void {
    fromEvent(this.searchStrInput.nativeElement, 'keyup').pipe(
      map((event: any) => {
        
        return event.target.value
        
      })
      , debounceTime(1000)
      , distinctUntilChanged()
    ).subscribe((text: string) => {
      this.getLedger()
    });
  }

  getLedger(){
    let data = {searchStr:this.searchStr,usrRole : this.currentUser.prmsnId == '6' ? '6' : '', comId : this.currentUser.prmsnId == '6' ? '' : this.roleData2.includes(this.currentUser.prmsnId) ? this.currentUser.com_id  : this.currentUser.id }
    this.dataSrv.getLedger(data).subscribe((res:any)=>{
      if(!res.err){
        this.rows = res.body.sort(function(a, b){
          if(a.gl_acc < b.gl_acc) { return -1; }
          if(a.gl_acc > b.gl_acc) { return 1; }
          return 0;
      });
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
    this.dataSrv.deleteLedger(data).subscribe((res:any)=>{
      
      if(!res.error){
        this.toaster.successToastr(res.msg)
        this.getLedger();
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

    this.dataSrv.importGeneralLedger(formdata).subscribe(
      (res:any) => {
        if (!res.error) {
          this.toaster.successToastr(res.msg)
          this.getLedger()
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
              if(i.permission_name == 'General Ledger'){
                this.addPrms  = i.add_permission
                this.dltPrms  = i.delete_permission
                this.edtPrms  = i.edit_permission
                this.vwPrms  = i.view_permission
                this.aplyPrms  = i.apply_permission
              }
            }
          })
          this.getLedger();
          
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
         this.roleData.map(i=>{
          if(i != 2 && i != 3  && i != 4 && i != 5 && i != 6 ){
            this.roleData1.push(i)
          }
          if(i != 1 && i != 2 && i != 3  && i != 4 && i != 5 && i != 6 ){
            this.roleData2.push(i)
          }
         })
         this.getPrmsnData();
        
      }
    },err=>{
      this.dataSrv.genericErrorToaster()
    })
  }
}
