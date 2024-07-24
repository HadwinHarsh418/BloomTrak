import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Role } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { ApiService } from 'app/auth/service/api.service';
import { DataService } from 'app/auth/service/data.service';
import { Page } from 'app/utils/models';
import { ToastrManager } from 'ng6-toastr-notifications';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

@Component({
  selector: 'app-agency-personel',
  templateUrl: './agency-personel.component.html',
  styleUrls: ['./agency-personel.component.scss']
})
export class AgencyPersonelComponent implements OnInit {
  searchSub: any = null;
  userRoles: any[] = [Role.Admin, Role.Community]
  userRoles2: any[] = [Role.Admin, Role.Agency]
  currenUserId: any;
  public page = new Page();
  loadingList: boolean;
  searchStr: string = '';
  currenttab: any = 'agency';
  workingUserHide: boolean =false;
  public rows: any
  btnShow: boolean = false;
  allAgenciesID: any = [];
  currentUser: any;
  id: { id: any; };
  minDate: string;
  public settings = {};
  addPrms: any;
  dltPrms: any;
  edtPrms: any;
  vwPrms: any;
  @ViewChild('deleteUser') deleteUser: ElementRef<any>;
  @ViewChild('permanentdeleteUser') permanentdeleteUser: ElementRef<any>;
  @ViewChild('reinstate') reinstate: ElementRef<any>;
  @ViewChild('define') define:ElementRef<any>;
  @ViewChild('Text') Text:ElementRef<any>;
  @ViewChild('searchStrInput', { static: true }) searchStrInput: ElementRef;
  comId: any;
  com_name:any;
  rows1: any = []
  datacommunity: any;
  submitId: any = []
  allCommunity:any[]=[]
  submitId2: any = []
  data: any;
  data1: any;
  data2: any;
  data3: any;
  crrntUsrId: any[] = []
  data4: any;
  userEdit: any;
  data5: any;
  data6: any;
  cols: string;
  mngmCommunity: any= [];
  mngmNames: any= [];
  selectedFile: any;
  name: string | Blob;
  addedImagePath: any;
  fileToUpload: any;
  roleData: any=[]
  allAgency: any=[]
  selectAgency:any
  allCommunity1: any;
  community_id: any;
  currentUrl: string;
  Id: any;
  phone_number: any;
  selectedData: any;
  rows2: any;
  rowdelete: any;

    constructor(
    private dataService: DataService,
    private _authenticationService: AuthenticationService,
    private modalService: NgbModal,
    private _toastr: ToastrManager,
    private tost: ToastrManager,
    private api: ApiService,
    private _router:Router
  ) {
    this.currentUrl = this._router.url;
    console.log(this.currentUrl,'cjhhfcheycecfhefjyv');
    
    this.page.size = 10;
    this._authenticationService.currentUser.subscribe((x: any) => {
      this.currentUser = x
      this.crrntUsrId.push(this.currentUser?.role == 'Admin' ?  x?._id : x?.id)
    });
    this.getRole()
    this.mngmCommunity = []
  }
  
  ngOnInit(): void {
    this.cols = this.currentUser?.role == 'Admin' ? 'col-12' : 'col-6';
    this.getDate()
    this.currenUserId = '';
     if(this.currentUser?.user_role !=3 && this.currentUser?.user_role != 8)
     setTimeout(() => {
      this.currenttab == 'block' ? this.getDeletedagencyUser() : this.setPage({ offset: 0 });
     }, 300);
     
     fromEvent(this.searchStrInput.nativeElement, 'keyup').pipe(
       map((event: any) => {
         return event.target.value;
        })
        , debounceTime(1000)
        , distinctUntilChanged()
        ).subscribe((text: string) => {
          this.currenttab == 'block' ? this.getDeletedagencyUser() : this.setPage({ offset: 0 });
        });
        this.getCommunityId()
        this.getAllAgency()
        this.currentUser?.user_role == 8 ? this.getCommunityByMangmentId():''
      }
      getDate() {
        let todayDate: any = new Date();
        let toDate: any = todayDate.getDate();
    if (toDate < 10) {
      toDate = '0' + toDate
    }
    let month = todayDate.getMonth() + 1;
    if (month < 10) {
      month = '0' + month;
    }
    let year = todayDate.getFullYear();
    this.minDate = year + '-' + month + '-' + toDate
  }
  getAllAgency(){
    if(this.currentUser?.user_role== 3)
    this.dataService.getAgencyForManagement().subscribe(res=>{
      console.log(res,'')
      this.allAgency = res.body;
      this.selectAgency=res.body[0].id;
      this.currenttab == 'block' ? this.getDeletedagencyUser() : this.setPage({ offset: 0 });
    })
  else{
 this.dataService.getAgenciesByID(this.community_id).subscribe(res=>{
      console.log(res,'')
      this.allAgency = res.body;
      //  this.setPage({ offset: 0 });
  })
  }
} 
  setPage(pageInfo) {
    this.currenttab = 'agency'
    this.workingUserHide = false
    if (this.searchSub) {
      this.searchSub.unsubscribe();
      this.searchSub = null;
    }
    this.page.pageNumber = pageInfo.offset;
    this.loadingList = true;
    if (this.currentUser?.user_role == 2 || this.currentUser?.role == 'Community' || this.currentUser?.role == 'User' || this.currentUser?.user_role ==3 || this.currentUser?.user_role == 8) {
      let is_for = this.currentUser?.role == Role.Agency ? 'agency' : 'agency'
      this.getUserById(this.currentUser?.user_role ==3 || this.currentUser?.user_role == 8 ? this.selectAgency:this.currentUser?.user_role == 2 ? this.currentUser?.id : this.currentUser?.com_id, is_for)
    } else if(this.currentUser?.role == 'Admin'){
      this.dataService.getMNGTUser(this.searchStr, this.page.pageNumber, this.page.size,).subscribe(res => {
        if (!res.error) {
          this.rows1 = res.body;
        } else {
          this.dataService.genericErrorToaster()
        }
        this.loadingList = false;
      }, error => {
        this.loadingList = false;
        this.dataService.genericErrorToaster(error)
      }
      )
    }
    else {
      let is_for = this.currentUser?.role == 'User' ? 'user' : this.currentUser?.user_role == 6 ? 'agency' : 'agency'
      this.searchSub = this.dataService.getUser(this.searchStr, this.page.pageNumber, this.page.size,is_for).subscribe(res => {
        if (!res.error) {
          this.rows = res.body;
          this.rows.map(rw => {
            if (this.currentUser?.role == 'Agency') {
              rw.phone = rw.agency_phone
              rw.emails = rw.agency_email
            }
            else {
              rw.phone = rw.phone_number
              rw.emails = rw.email
            }
          })
          if (!res.pagination) {
            this.page.size = res.body.length;
            this.page.totalElements = res.body.length;
            this.page.totalPages = res.body.length/10;
          } else {
            this.page = res.pagination
            this.page.pageNumber = res.pagination.pageNumber
          }
        } else {
          this.dataService.genericErrorToaster()
        }
        this.loadingList = false;
      }, error => {
        this.loadingList = false;
        this.dataService.genericErrorToaster(error)
      }
      )
    }
  }
  openDropdownItem() {
    this.modalService.open(this.Text,
      {
        backdrop: true,
        size: 'sm',
        centered: true,
      }
    );
  }

  getEnableNotifyUser(){
    this.api.getSchedularNotification(this.currentUser?.id).subscribe((res:any)=>{
      if(res){
        this.rows =this.rows.map(i=>{
          res?.body.forEach(im=>{
            if(i.id == im.user_id){
              i.switch = true;
            }
          });
          return i;
        })
    this.loadingList=false;
      }
    },error=>{
    this.loadingList=false;
    })
  }
  toggle(row: any) {
    this.selectedData = row;
    this.selectedData.switch = !row.switch
     this.modalOpenOSE(this.define, 'lg');
  }

  toggle1(){
    // this.loadingList=true;
    let body={};
    if(this.selectedData.switch){
      body={
        agency_id:this.currentUser?.id,
        user_id : this.selectedData.id,
        phone_number: this.selectedData.phone_number
      }
      this.dataService.addSchedularNotification(body).subscribe((res)=>{
        // this.loadingList=false;
    if(!res.error){
       this._toastr.successToastr(res.msg)
      this.modalService.dismissAll();
    }else{
  
      this._toastr.errorToastr(res.msg);
    }
      });

    }else{
      body={
        agency_id:this.currentUser?.id,
        user_id : this.selectedData.id,
      }
      this.dataService.removeSchedularNotification(body).subscribe((res)=>{
        if(!res.error){
           this._toastr.successToastr(res.msg)
          this.modalService.dismissAll();
          this.loadingList=false;
        }else{
      
          this._toastr.errorToastr(res.msg);
        }
          });
    }

  }
  closededApply(modal: NgbModalRef) {
    this.getUserById(this.currentUser?.user_role ==3 || this.currentUser?.user_role == 8 ? this.selectAgency:this.currentUser?.user_role == 2 ? this.currentUser?.id : this.currentUser?.com_id, 'agency')
    modal.dismiss();
    
  }

  getDeletedagencyUser(){
    this.currenttab = 'block'
    this.workingUserHide = true
    this.dataService.getDeletedagencyUser(this.searchStr ?? '', this.currentUser?.id).subscribe(res => {
      if (!res.error) {
        this.rows2 = res.body; 
      }
    });
}
  
reinstatefn(row){
  this.id = { id: row.id }
  this.modalOpenOSE(this.reinstate, 'lg');
}


  modalOpenOSE(modalOSE, size = 'sm') {
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

  deletesUser(modal: NgbModalRef) {
    this.btnShow = true;
    this.dataService.deleteUserById(this.id).subscribe((res: any) => {
      if (!res.error) {
        this.setPage({ offset: 0 });
        this.tost.successToastr(res.msg)
        this.closeded(modal)
        this.btnShow = false;
      } else {
        this.btnShow = false;
        this.tost.errorToastr(res.msg)
      }
    },
      (err) => {
        this.btnShow = false;
        this.api.genericErrorToaster()
      })
  }

  reinstateUser(modal: NgbModalRef) {
    this.btnShow = true;
    this.dataService.reinstateDeletedUser(this.id).subscribe((res: any) => {
      if (!res.error) {
        this.getDeletedagencyUser()
        this.tost.successToastr(res.msg)
        this.closeded(modal)
        this.btnShow = false;
      } else {
        this.btnShow = false;
        this.tost.errorToastr(res.msg)
      }
    },
      (err) => {
        this.btnShow = false;
        this.api.genericErrorToaster()
      })
  }

  openDeleteUser(row: any, modal) {
    this.id = { id: row.id }
    this.modalOpenOSE(this.deleteUser, 'lg');
  }

  getUserById(id, is_for) {
    this.loadingList=true;
    this.dataService.getUserById(this.searchStr,id, is_for).subscribe((res: any) => {
      this.rows = res.body;
      this.Id = res.body.id;
      this.phone_number=res.body.phone_number;
    this.getEnableNotifyUser()

      // this.rows.map(rw => {
      //   if (this.currentUser?.role == 'Agency') {
      //     rw.phone = rw.agency_phone
      //     rw.emails = rw.agency_email
      //   }
      //   else {
      //     rw.phone = rw.phone_number
      //     rw.emails = rw.email
      //   }
      // })
      if (!res.pagination) {
        this.page.size = res.body.length;
        this.page.totalElements = res.body.length;
        this.page.pageNumber = 0;
        this.page.totalPages = res.pagination?.totalPages;
      } else {
        this.page = res.pagination
        this.page.pageNumber = res.pagination?.pageNumber
      }
      this.loadingList = false;
    }, error => {
      this.loadingList = false;
    this.loadingList=false;

    }
    )
  }

  permanentdelete(row){
    this.rowdelete =row
    this.modalOpenOSE(this.permanentdeleteUser, 'lg');
  }

  terminateUsr(modal: NgbModalRef){
    let cmntyData = {
      user_id : this.rowdelete?.id,
      community_id : this.currentUser?.id,
      is_for : 'community'
    }
    let agncyData = {
      user_id : this.rowdelete?.id,
      agency_id : this.currentUser?.id,
      is_for : ''
    }
    this.dataService.terminateUser(this.currentUser?.role == 'Agency' ? agncyData : cmntyData).subscribe((res:any) => {
      if (!res.err) {
        this.tost.successToastr("User Deleted Successfully")
        this.closeded(modal)
        this.setPage({ offset: 0 })

      } else {
        this.dataService.genericErrorToaster()
      }
    }, error => {
      this.dataService.genericErrorToaster(error)
    }
    )
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

    this.dataService.importUsers(formdata).subscribe((res:any) => {
          if (!res.error) {
        this.tost.successToastr(res.msg)
        this.setPage({ offset: 0 })

      } else {
        this.tost.errorToastr(res.msg)
      }
    }, error => {
      this.tost.errorToastr('Something went wrong please try again')
    }
    )
  }

  getPrmsnData(){
    this.dataService.getPermissionByAdminRole().subscribe(
      (res:any) => {
        if (!res.error) {
        res.body.map(i=>{
          // comunity , agency
            if(this.roleData.includes(i.role_id)){
              if(i.trak_type == '1')
              if(i.permission_name == 'User'|| i.permission_name == 'Agency Personnel'){
                this.addPrms  = i.add_permission
              this.dltPrms  = i.delete_permission
              this.edtPrms  = i.edit_permission
              this.vwPrms  = i.view_permission
              this.vwPrms  = i.view_permission
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
        // console.log("Roles------",res.body);
         res.body.filter(i=>{ this.roleData.push(i.id.toString())})
         this.getPrmsnData()
        
      }
    },err=>{
      this.dataService.genericErrorToaster()
    })
  }
  
  getCommunityId() {
    if(['6'].includes(this.currentUser?.prmsnId) ){
    this.dataService.getCommunityId().subscribe((response: any) => {
      if (response['error'] == false) {
        this.allCommunity = response.body.sort(function(a, b){
          if(a.community_name.toUpperCase() < b.community_name.toUpperCase()) { return -1; }
          if(a.community_name.toUpperCase() > b.community_name.toUpperCase()) { return 1; }
          return 0;
      })  ;
      this.comId =  this.allCommunity[0]?.id
        //this.toastr.successToastr(response.msg);
      } else if (response['error'] == true) {
        this._toastr.errorToastr(response.msg);
      }
    }, (err) => {
      this.dataService.genericErrorToaster();

    })
  }else{
    if(this.currentUser?.id && this.currentUser?.com_id){
      let data = {
        userId : this.currentUser?.id,
        mangId : this.currentUser?.management
      }
      this.dataService.getManagementUserCommunities(data).subscribe((res: any) => {
        if (!res.error) {
          let d = res?.body[0].user_added_communities.concat(res?.body[1].userAvailableCommunities);
          // this.mangComs = res.body[1].userAvailableCommunities
          let e=[]
          let c =[]
          d.forEach(element => {
            if(!e.includes(element.community_id)){
              e.push(element.community_id)
              c.push(element)
            }
          });
          this.allCommunity = c.sort(function(a, b){
            if(a.community_name.toUpperCase() < b.community_name.toUpperCase()) { return -1; }
            if(a.community_name.toUpperCase() > b.community_name.toUpperCase()) { return 1; }
            return 0;
        })  ;
        this.com_name =  this.allCommunity[0]?.community_id
        this.comId =  this.allCommunity[0]?.community_id
        
        } else {
          this._toastr.errorToastr(res.msg);
        }
      },
        (err) => {
          this.dataService.genericErrorToaster();
        })
    }
    else{
      this.dataService.getMNMGcommunity(this.currentUser?.id).subscribe((response: any) => {
        if (response['error'] == false) {
          this.allCommunity = response.body.sort(function(a, b){
            if(a.community_name.toUpperCase() < b.community_name.toUpperCase()) { return -1; }
            if(a.community_name.toUpperCase() > b.community_name.toUpperCase()) { return 1; }
            return 0;
        })  ;
        this.com_name =  this.allCommunity[0]?.cp_id
        this.comId =  this.allCommunity[0]?.cp_id
          //this.toastr.successToastr(response.msg);
        } else if (response['error'] == true) {
          this._toastr.errorToastr(response.msg);
        }
      }, (err) => {
        this.dataService.genericErrorToaster();
  
      })
    }
  }
  }

  chngCom(comId){
    this.selectAgency = comId;
    this.setPage({ offset: 0 });

  }
  selectCommunity1(id:any){
    this.community_id=id;
    this.getAllAgency();
  }
  getCommunityByMangmentId(){
    let data = {
    userId:this.currentUser?.id,
    mangId: this.currentUser?.com_id
    }
    this.dataService.getManagementUserCommunities(data).subscribe((response: any) => {
      console.log(response,'')
      if (!response.error) {
        // this.mangComs = res.body[1].userAvailableCommunities
        let d = response?.body[0].user_added_communities.concat(response?.body[1].userAvailableCommunities);
        this.allCommunity1 = d.sort(function(a, b){
          if(a.community_name.toUpperCase() < b.community_name.toUpperCase()) { return -1; }
          if(a.community_name.toUpperCase() > b.community_name.toUpperCase()) { return 1; }
          return 0;
      })  ;
      this.community_id = d.community_id;
      this.setPage({ offset: 0 });
      }
    })
  }
}