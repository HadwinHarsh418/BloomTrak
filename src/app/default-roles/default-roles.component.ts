import { Component,OnInit } from '@angular/core';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-default-roles',
  templateUrl: './default-roles.component.html',
  styleUrls: ['./default-roles.component.scss']
})
export class DefaultRolesComponent implements OnInit {
  rows: any;
  roleData: any[]=[];
  addPrms: any;
  dltPrms: any;
  edtPrms: any;
  vwPrms: any;
  assPrms: any;
  userName: any;
  currentUser: any;
  constructor(
    private dataSrv : DataService,
    private toaster : ToastrManager,
    private auth :AuthenticationService,
  ) {
    
    this.auth.currentUser.subscribe((x: any) => {
      this.currentUser = x
    })
   }

  ngOnInit(): void {
    this.getRoles()
  }

  getRoles(){
    this.dataSrv.getDefaultRole().subscribe((res:any)=>{
      if(!res.err){
        this.rows = res.body.sort(function(a, b){
          if(a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
          if(a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
          return 0;
      });
      }else{
      this.toaster.errorToastr('Something went wrong please try again leter')
      }
    },err=>{
      this.dataSrv.genericErrorToaster()
    })
}

}
