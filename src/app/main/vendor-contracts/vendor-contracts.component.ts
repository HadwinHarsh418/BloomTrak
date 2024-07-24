import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Page } from 'app/utils/models';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-vendor-contracts',
  templateUrl: './vendor-contracts.component.html',
  styleUrls: ['./vendor-contracts.component.scss'],
  providers : [DatePipe]

})
export class VendorContractsComponent implements OnInit {
  rows:any=[];
  currentUser: any;
  fileToUpload: any;
  @ViewChild('searchStrInput', { static: true }) searchStrInput: ElementRef<any>;
  @ViewChild('Addnew') Addnew: ElementRef<any>;
  @ViewChild('dltImprt') dltImprt: ElementRef<any>;
  searchStr: string = '';
  searchSub: any = null;
  public page = new Page();
  loadingList: boolean;
  rl_id: any;
  aplyPrms: any;
  addPrms: any;
  dltPrms: any;
  edtPrms: any;
  vwPrms: any;
  roleData: any=[]
  dataID: any;
  dprtmnt: any=[];
  filterDep: any=[];
  filterDep1: any;
  roleData1: any=[];
  roleData2: any=[];
  allCommunity: any=[];
  dltForm: any;
  allCommunity1:any;
  community_id:any;
  

  constructor(
    private dataSrv : DataService,
    private toaster : ToastrManager,
    private _authenticationService : AuthenticationService,
    private modalService: NgbModal,
    private datePipe : DatePipe,
    private fb : FormBuilder
  ) { 
    this._authenticationService.currentUser.subscribe((x: any) => {
      this.currentUser = x
    })
    this.page.size = 10;
    this.getRole()
    this.getCommunityId()
    this.getCommunityByMangmentId();
 
  }

  ngOnInit(): void {
     fromEvent(this.searchStrInput.nativeElement, 'keyup').pipe(
      map((event: any) => {
        
        return event.target.value
        
      })
      , debounceTime(1000)
      , distinctUntilChanged()
    ).subscribe((text: string) => {
      this.setPage({ offset: 0 })
    });
    this.dltForm = this.fb.group({
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      community_name: ['', [Validators.required]],
    })
  }

  // getvendors(){
  //   this.dataSrv.getVendorContract(this.searchStr='',this.page.pageNumber,this.page.size).subscribe((res:any)=>{
  //     if(!res.err){
  //       this.rows = res.body;
  //       if (!res.pagination) {
  //         this.page.size = res.body.length;
  //         this.page.totalElements = res.body.length;
  //         this.page.pageNumber = res.pagination.pageNumber;
  //         this.page.totalPages = res.pagination.totalPages;
  //       } else {
  //         this.page = res.pagination
  //         this.page.pageNumber = res.pagination.pageNumber
  //       }
  //       this.rows.map(i=>{
  //         if(i.entered != null){
  //           i.entered1 = i.entered
  //         }else{
  //           i.entered1 = i.entered_by_community
  //         }
  //       })
  //     }
  //     else{
  //       this.toaster.errorToastr('Something went wrong please try again leter')
  //     }
  //   },err=>{
  //       this.dataSrv.genericErrorToaster()
  //   })
  // }

  setPage(pageInfo) {
    if (this.searchSub) {
      this.searchSub.unsubscribe();
      this.searchSub = null;
    }
    this.page.size = 10;
    this.page.pageNumber = pageInfo.offset;
    this.dataSrv.getVendorContract(this.searchStr.trim(),this.community_id?this.community_id:this.currentUser?.user_role == 3 ? this.currentUser?.id:this.roleData2.includes(this.currentUser?.prmsnId) ? this.currentUser?.com_id :this.currentUser?.id,this.page.pageNumber,this.page.size,this.filterDep1,).subscribe((res:any)=>{
      if(!res.err){
        this.rows = res.body;
        this.rows.map(i=>{
          if(i.entered != null){
            i.entered1 = i.entered
          }else{
            i.entered1 = i.entered_by_community
          }
        })
        if (!res.pagination) {
          this.page.size = res.body.length;
          this.page.totalElements = res.body.length;
          this.page.pageNumber = res.pagination.pageNumber;
          this.page.totalPages = res.pagination.totalPages;
        } else {
          this.page = res.pagination
          this.page.pageNumber = res.pagination.pageNumber
        }
      
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
    this.dataSrv.deleteVendorContract(data).subscribe((res:any)=>{
      
      if(!res.error){
        this.toaster.successToastr(res.msg)
        this.setPage({ offset: 0 })
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
    formdata.append('entered_by',this.currentUser?.id)

    this.dataSrv.importVonderCont(formdata).subscribe(
      (res:any) => {
        if (!res.error) {
          this.toaster.successToastr(res.msg)
          this.setPage({ offset: 0 })
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
              if(i.permission_name == 'Vendor Contracts'){
                this.addPrms  = i.add_permission
                this.dltPrms  = i.delete_permission
                this.edtPrms  = i.edit_permission
                this.vwPrms  = i.view_permission
                this.aplyPrms  = i.apply_permission
              }
               if(this.roleData.includes(i.role_id)){
                if(i.permission_name == 'Department'){
                  if(i.trak_type == '0'){
                    this.dprtmnt=JSON.parse(i.row_data);
                  this.dprtmnt.filter(i=>{this.filterDep.push(i.name)})
                  this.filterDep1=  this.filterDep.join(',')
                  }
                  
                    // this.ptchDprt = this.dprtmnt[0]?.name
                    
                    
                   
                 }
              }
            }
          })
          this.setPage({ offset: 0 })
          
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
         this.getPrmsnData()
        
      }
    },err=>{
      this.dataSrv.genericErrorToaster()
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
  
  openAddNew(data) {
    
    this.dataID = data
    // this.formData.reset()
    this.modalOpenOSE(this.Addnew, 'lg');
  }

  closeded(modal: NgbModalRef) {
    modal.dismiss();
  }

  @ViewChild('fileInput1') elfile1: ElementRef;
  onFileInput1(files: any) {
    if (files.length === 0) {
      return;
    }
    let type = files[0].type;
    this.fileToUpload = files[0];
      // this.uploadNow1(this.fileToUpload)    
  }

  uploadNow1(modal) {
    if(!this.fileToUpload){
      this.toaster.errorToastr(' Please Select file')
      return;
    }
    if (this.fileToUpload && !['csv' ,'xls','text/csv'].includes(this.fileToUpload[0]?.type)) {
      this.toaster.errorToastr('Invalid file type. Please select a CSV file.');
      return;
  
    }
 
      
    
    let formdata = new FormData();
    formdata.append('id',this.dataID)
    formdata.append('docUpload',this.fileToUpload)

    this.dataSrv.uploadVenderContract(formdata).subscribe(
      (res:any) => {
        this.closeded(modal)
        if (!res.error) {
          this.toaster.successToastr(res.msg)
          this.setPage({ offset: 0 })
        } else {
          this.toaster.errorToastr(res.msg)
        }
    }, (error:any) => {
      this.dataSrv.genericErrorToaster()
    }
    )
  }

  // parseDate(date) {
  //   const parseDate = date.split('-');
  //   // const parseTime = parseDate[2].split(' ');
  //   const parsedDate = `${parseDate[0]}-${parseDate[1]}-${parseDate[2]}`
  //   return parsedDate
  // }

  openMdl(){
    this.modalOpenOSE(this.dltImprt)
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
      else if(!['1','6'].includes(this.currentUser?.prmsnId)){
        this.allCommunity =   this.allCommunity.filter(i=>{
          if(this.currentUser?.com_id == i.id){
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

  get FormData_Control() {
    return this.dltForm.controls;
  }

  dltFormSub(modal){
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
    this.dataSrv.deleteImportVendorContracts(data).subscribe((res: any) => {
      if (!res.error) {
        this.toaster.successToastr(res.msg);
        this.closeded(modal)
        this.ngOnInit()
      } else {
        this.toaster.errorToastr(res.msg);
      }
    },
      (err) => {
        this.dataSrv.genericErrorToaster();
  
      })
  }

  selectCommunity1(id:any){
    this.community_id=id;
    this.setPage({ offset: 0 });
  }

  getCommunityByMangmentId(){
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
          this.allCommunity1 = uniqueArray.sort(function(a, b){
            if(a.community_name.toUpperCase() < b.community_name.toUpperCase()) { return -1; }
            if(a.community_name.toUpperCase() > b.community_name.toUpperCase()) { return 1; }
            return 0;
        })  ;
        this.community_id = this.allCommunity1[0]?.community_id
       this.setPage({ offset: 0 })
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
          this.allCommunity1 = response.body.sort(function(a, b){
            if(a.community_name.toUpperCase() < b.community_name.toUpperCase()) { return -1; }
            if(a.community_name.toUpperCase() > b.community_name.toUpperCase()) { return 1; }
            return 0;
        })  ;
        this.community_id = response?.body[0]?.cp_id
       this.setPage({ offset: 0 })
          //this.toastr.successToastr(response.msg);
        } else if (response['error'] == true) {
          this.toaster.errorToastr(response.msg);
        }
      }, (err) => {
        this.dataSrv.genericErrorToaster();
  
      })
    }
  }
}
