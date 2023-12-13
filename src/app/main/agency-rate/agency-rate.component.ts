import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

@Component({
  selector: 'app-agency-rate',
  templateUrl: './agency-rate.component.html',
  styleUrls: ['./agency-rate.component.scss']
})
export class AgencyRateComponent implements OnInit {
  searchStr:string='';
  currentUser: any;
  @ViewChild('searchStrInput', { static: true }) searchStrInput: ElementRef;
  rows: any;
  fileToUpload: any;
  addPrms: any;
  dltPrms: any;
  edtPrms: any;
  vwPrms: any;
  roleData: any=[]

  constructor(
    private dtsrv : DataService,
    private _authenticationService : AuthenticationService,
    private toaster : ToastrManager
  ) { 
    this._authenticationService.currentUser.subscribe((x: any) => {
      this.currentUser = x
      
    });
    this.getRole()
  }

  ngOnInit(): void {
    this.getAgencyRates()
    fromEvent(this.searchStrInput.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      })
      , debounceTime(1000)
      , distinctUntilChanged()
    ).subscribe((text: string) => {
      this.getAgencyRates()
    });

  }

  getAgencyRates(){
      let cpType = {cpType2 :  null}
      let slctCpType = {cpType2 : null }
      let role =this.currentUser.role
    this.dtsrv.getAgencyRates(this.searchStr, cpType ? cpType : slctCpType,role,this.currentUser.id).subscribe((res:any)=>{
      this.rows = res.body;
    },err=>{
      this.toaster.errorToastr('Something went wrong please try again leter')
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

    this.dtsrv.importAgencyRates(formdata).subscribe((res:any) => {
          if (!res.error) {
        this.toaster.successToastr(res.msg)
        // this.setPage({ offset: 0 })

      } else {
        this.toaster.errorToastr(res.msg)
      }
    }, error => {
      this.toaster.errorToastr('Something went wrong please try again')
    }
    )
  }

  getPrmsnData(){
    this.dtsrv.getPermissionByAdminRole().subscribe(
      (res:any) => {
        if (!res.error) {
          res.body.map(i=>{
            //comunity , agency
            if(this.roleData.includes(i.role_id)){
              if(i.trak_type == '1')
              if(i.permission_name == 'Agency Rates'){
                this.addPrms  = i.add_permission
              this.dltPrms  = i.delete_permission
              this.edtPrms  = i.edit_permission
              this.vwPrms  = i.view_permission
              }
            }
          })
          
        } 
    }, (error:any) => {
      this.dtsrv.genericErrorToaster()
    }
    )
  }

  getRole(){
    this.dtsrv.getAllRole( ).subscribe((res:any)=>{
      if(!res.err){
        // console.log("Roles------",res.body);
         res.body.filter(i=>{ this.roleData.push(i.id.toString())})
         this.getPrmsnData()
        
      }
    },err=>{
      this.dtsrv.genericErrorToaster()
    })
  }
}
