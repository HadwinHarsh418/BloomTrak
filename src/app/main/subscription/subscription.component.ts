import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { Page } from 'app/utils/models';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { debounceTime, map, distinctUntilChanged } from "rxjs/operators";
import { fromEvent } from 'rxjs';


@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {
  @ViewChild('deleteSubscription') deleteSubscription: ElementRef<any>;
  currentUser: any;
  public page = new Page();
  public rows = [];
  loadingList: boolean;
  searchStr: string = '';
  searchSub: any = null;
  fileToUpload: any;
  roleData: any[]=[];
  addPrms: any;
  dltPrms: any;
  edtPrms: any;
  vwPrms: any;
  assPrms: any;
  userName: any;
  id: { id: any; };

  constructor(
    private _authenticationService: AuthenticationService,
    private modalService: NgbModal,
    private dataService: DataService,
    private toastr: ToastrManager,
  ) {
    this.page.size = 10;
    this._authenticationService.currentUser.subscribe((x: any) => {
      this.currentUser = x
    })
    this.getRole()
    this.getPrmsnData()
  }
  ngOnInit(): void {
    this.getCmAcess()
  }
  
getCmAcess(){
  this.dataService.getCMAccessTo().subscribe((res: any) => {
    if (!res.error) {
        
        this.rows=res['body'];
          
     }else{
      
   }
  }, (err: any) => {
    this.dataService.genericErrorToaster()
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

openDeleteShift(row: any,) {
  this.id = row.id 
  this.modalOpenOSE(this.deleteSubscription, 'lg');
}

closeded(modal: NgbModalRef) {
  modal.dismiss();
}

  delete(modal: NgbModalRef){
    let body= {
      id:this.id
    }
    this.dataService.deleteCMAccess(body).subscribe((res:any)=>{
      if(!res.err){
        this.toastr.successToastr(res.msg)
        this.getCmAcess()
        this.closeded(modal)
      }else{
      this.toastr.errorToastr('Something went wrong please try again leter')
      }
    },err=>{
      this.dataService.genericErrorToaster()
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

    this.dataService.importAgencies(formdata).subscribe(
      (res:any) => {
        if (!res.error) {
          this.toastr.successToastr(res.msg)
          this.getCmAcess()
        } else {
          this.toastr.errorToastr(res.msg)
        }
    }, (error:any) => {
      this.dataService.genericErrorToaster()
    }
    )
  }

  getPrmsnData(){
    let post=[];
    this.dataService.getPermissionByAdminRole().subscribe(
      (res:any) => {
        if (!res.error) {
          res.body.map(i=>{
            //comunity
            if(this.roleData.includes(i.role_id)){
              // if(i.permission_name == 'Department'){
              //     this.dprtmnt=JSON.parse(i.row_data);
              //     this.frstDp = this.dprtmnt[0]?.name
              //  }
               if(i.permission_name == 'Subscriptions'){
                this.addPrms  = i.add_permission
                this.dltPrms  = i.delete_permission
                this.edtPrms  = i.edit_permission
                this.vwPrms  = i.view_permission
                this.assPrms  = i.assignResidentCount_permission
             }
            }
          })
        } 
    }, (error:any) => {
      this.dataService.genericErrorToaster()
    }
    )
  }

  getRole(){
    this.dataService.getAllRole().subscribe((res:any)=>{
      if(!res.err){
      
         res.body.filter(i=>{ this.roleData.push(i.id.toString())})
              // this.roleData.map(i=>{
              //  if(i != 2  && i != 3 && i != 4  && i != 5 && i != 6 ){
              //    this.roleData1.push(i)
              //  }
              // })
        
      }
    },err=>{
      this.dataService.genericErrorToaster()
    })
  }

}
