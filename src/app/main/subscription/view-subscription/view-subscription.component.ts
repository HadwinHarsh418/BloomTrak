import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-view-subscription',
  templateUrl: './view-subscription.component.html',
  styleUrls: ['./view-subscription.component.scss']
})
export class ViewSubscriptionComponent implements OnInit {
  public contentHeader: object;
  currentUser: any;
  ViewEditCheck:boolean=true;
  noData: boolean;
  subsData: any;
  constructor(
    private _authenticationService: AuthenticationService,
    private modalService: NgbModal,
    private toastr: ToastrManager,
    private dataService: DataService,
    private route:ActivatedRoute
  ) {
    this._authenticationService.currentUser.subscribe((x: any) => {
      this.currentUser = x
    })
    this.route.params.subscribe((res:any)=>{
      if(res.d == 1){
        this.ViewEditCheck = false
      }else{
        this.ViewEditCheck = true
        
      }
    })
  }

  ngOnInit(): void {
    this.getCmAcess()
  }
  
getCmAcess(){
  this.dataService.getCMAccessTo().subscribe((res: any) => {
    if (!res.error) {
        this.subsData = res;
     }else{
      this.noData = true;
   }
  }, (err: any) => {
    this.dataService.genericErrorToaster()
  })
}

}
