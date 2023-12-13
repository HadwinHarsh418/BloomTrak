import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-span-track',
  templateUrl: './span-track.component.html',
  styleUrls: ['./span-track.component.scss']
})
export class SpanTrackComponent implements OnInit {
  rows: any;
  currentUser: import("../../auth/models/user").User;

  constructor(
    private dataSrv : DataService,
    private toaster : ToastrManager,
    private _authenticationService: AuthenticationService,

  ) { 
    this._authenticationService.currentUser.subscribe
      (x => {
        this.currentUser = x
      }
      );
  }

  ngOnInit(): void {
    this.getPermission()
  }

  getPermission(){
    // let comunity_id=this.currentUser.id
    let data ={
      is_for : this.currentUser.role == 'Agency' ? 'agency' : 'community'
    }
    this.dataSrv.getPermission(data).subscribe((res:any)=>{
      if(!res.err){
        this.rows = res.body.sort(function(a, b){
          if(a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
          if(a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
          return 0;
      })  ;
      }else{
      this.toaster.errorToastr('Something went wrong please try again leter')
      }
    },err=>{
      this.dataSrv.genericErrorToaster()
    })
}

dltPrmsnFctn(row){
  this.dataSrv.deletePermission({id:row.id}).subscribe((res:any)=>{
    if(!res.err){
      this.toaster.successToastr(res.msg)
      this.ngOnInit()
    }else{
    this.toaster.errorToastr('Something went wrong please try again leter')
    }
  },err=>{
    this.dataSrv.genericErrorToaster()
  })
}

}
