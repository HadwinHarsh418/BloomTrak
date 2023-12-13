import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrManager } from 'ng6-toastr-notifications';
import * as uuid from 'uuid'

@Component({
  selector: 'app-addspendforotherdprtmt',
  templateUrl: './addspendforotherdprtmt.component.html',
  styleUrls: ['./addspendforotherdprtmt.component.scss']
})
export class AddspendforotherdprtmtComponent implements OnInit {
  fileToUpload: any;
  public contentHeader: any;
  formRoleData: any;
  formData1: any;
  loading:boolean = false;
  prmsUsrId: any;
  imgFile: any;
  allCommunity: any;
  currentUser: any;
  ledgerData: any = []
  paymentType: any =[]
  vendorData: any;
  comName: any;
  submitId2: any =[]
  minDate: string;
  todaysDate: string;
  comId: any;
  formData: FormData;
  dprtmnt: any[];
  ledgerData1: any =[]
  nullDep: boolean= false
  nullDep1: any;
  @ViewChild('Addnew') Addnew: ElementRef<any>;
  err: boolean=false;
  venData: any=[];
  comId1: any;
  loadSpinner: boolean;
  roleData: any=[];
  roleData1: any=[];
  roleData2: any=[];
  ptchDprt: any;
  data: any;
  type: any[];
  userName: any;
  myId:any[] = []
  
  constructor(
    private formBuilder : FormBuilder,
    private location : Location,
    private dataSrv : DataService,
    private toaster : ToastrManager,
    private aCtRoute : ActivatedRoute,
    private _router : Router,
    private _authenticationService : AuthenticationService,
    private modalService: NgbModal,

  ) { 
    this.type = ['Set','Variable','Flat','Manual']
    this.getRole()
    this.aCtRoute.params.subscribe(
      res => {
          this.prmsUsrId = res;
      }
    )

    this._authenticationService.currentUser.subscribe((x: any) => {
      this.currentUser = x
    })
      this.getCommunityId()
    // if(this.prmsUsrId?.id){
    // this.loadSpinner = true;
    // }
  }

  dropdownSettings: IDropdownSettings = {
    singleSelection: true,
    idField: 'vendor_name',
    textField: 'vendor_name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    closeDropDownOnSelection: true,
    itemsShowLimit: 3,
    allowSearchFilter: true
  };

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: this.prmsUsrId?.id ? 'Edit Spend For Other Department' : 'Add Spend For Other Department',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Home',
            isLink: true,
            link: '/'
          },
          {
            name: 'Spend For Other Department',
            isLink: true,
            link: '/spend-for-other-department'
          }
        ]
      }
    };
    this.formRoleData = this.formBuilder.group({
      community_name: this.currentUser.prmsnId == '6' ? ['',Validators.required] : [''],
      department: ['', Validators.required],
      vendor: ['', Validators.required],
      description: ['', Validators.required],
      gl_account: ['', Validators.required],
      amount: ['', Validators.required],
      pmt_type: ['', Validators.required],
      final: ['', Validators.required],
      receipt_id: ['', Validators.required],
      purchage_date:[this.minDate, Validators.required],
      entered_by: [''],
      invoice_number: [''],
      entered_date:[this.minDate],
     })

     this.formData1 = this.formBuilder.group({
      newVendor: ['', Validators.required],
      description: ['', Validators.required],
    })
    
    // this.formRoleData.controls['pmt_type'].setValue('Contract', {onlySelf: true});
    
      if(this.prmsUsrId?.id){
        this.getVendorList()
     }

      if(['1'].includes(this.currentUser.prmsnId))
      {
       this.formRoleData.controls['community_name'].clearValidators();
       this.formRoleData.updateValueAndValidity();
      }
      if(['6'].includes(this.currentUser.prmsnId))
      {
       this.formRoleData.controls['community_name'].setValidators(Validators.required);
       this.formRoleData.updateValueAndValidity();
      }

      let today = new Date();
      this.todaysDate = this.getDate(today)
      this.crtRec()
      // if(this.roleData2.includes(this.currentUser.prmsnId)){
      //   if(!this.prmsUsrId?.id){
      //     this.slctCom(this.currentUser.id,2)
      //   }
      // }
      // else{
      //   this.getDepartment(this.currentUser.id)
      // }
  }

  @ViewChild('fileInput') elfile: ElementRef;
  
  onFileInput(files: any) {
    if(files == 'err'){
      this.err = true
      return ;
    }
    else{
      if (files.length === 0) {
        return;
      }else{
        this.fileToUpload = files[0];
        this.err=false;
      }
    }
  }
  
  getVendorList(){
    // let data = {
    //   id : this.prmsUsrId.id,
    //   community_id : 'id'
    // }
    this.loadSpinner = true
    this.dataSrv.getSpendDownOthersTableById(this.prmsUsrId.id).subscribe((res:any)=>{
      if(!res.err){
        this.comId = res.body[0].community_id
        this.nullDep1 = res.body[0].department
        this.slctCom(res.body[0].community_id,3)
        // console.log(res.body[0])
        // this.vendorData.filter(element => {
        //   if(res.body[0].vendor == element.vendor_name){
        //     this.venData.push(element)
        //   }
        // });
        setTimeout(() => {
          this.venData =  this.vendorData.filter(i=>i.vendor_name.includes( res.body[0].vendor) )
          this.formRoleData.patchValue({
            community_name: res.body[0].community_id,
            department: res.body[0].department,
            amount: res.body[0].amount,
            invoice_number: res.body[0].invoice_number,
            purchage_date: res.body[0].purchage_date,
            final: res.body[0].final,
            receipt_id: res.body[0].receipt_id,
            vendor: this.venData,
            description: res.body[0].description,
            gl_account: res.body[0].gl_account,
            pmt_type: res.body[0].pmt_type,
            entered_by: res.body[0].entered_by,
            entered_date:res.body[0].entered_date,
         })
        }, 1500);
    }
      else{
        this.toaster.errorToastr('Something went wrong please try again leter')
      }
    },err=>{
        this.dataSrv.genericErrorToaster()
    })
  }


  goBack(){
    this.location.back()
  }

  get FormData_Control(){
    return this.formRoleData.controls;
  }

  submitted(){
    for (let item of Object.keys(this.FormData_Control)) {
      this.FormData_Control[item].markAsDirty()
    }
   
    if (this.formRoleData.invalid) {
      return;
    }

    if(!this.prmsUsrId.id){
      this.loading=  true;
      let data =[{
        community_name:this.currentUser.prmsnId == '1' || this.roleData2.includes(this.currentUser.prmsnId) ? this.comName.community_name: this.submitId2[0].community_name,
        vendor: this.formRoleData.value.vendor[0].vendor_name,
        department: this.formRoleData.value.department,
        invoice_number: this.formRoleData.value.invoice_number,
        final: this.formRoleData.value.final,
        purchage_date: this.formRoleData.value.purchage_date,
        amount: this.formRoleData.value.amount,
        receipt_id: this.formRoleData.value.receipt_id,
        description: this.formRoleData.value.description,
        gl_account: this.formRoleData.value.gl_account,
        pmt_type: this.formRoleData.value.pmt_type,
        entered_by: this.currentUser.id,
        entered_date:this.minDate,
      }]
        this.dataSrv.addSpendDownOthersTable(data).subscribe((res:any)=>{
          if(!res.error){
              this.loading=  false;
            this.toaster.successToastr(res.msg)
            this._router.navigate(['/spend-for-other-department'])
          }else{
            this.loading=  false;
            this.toaster.errorToastr(res.msg)
          }
        },err=>{
          this.loading=  false;
          this.dataSrv.genericErrorToaster()
        })
      }
      else{
        this.loading=  true;
        let data ={
          community_name:this.currentUser.prmsnId == '1' || this.roleData2.includes(this.currentUser.prmsnId) ? this.comName.community_name: this.submitId2[0].community_name,
          vendor: this.formRoleData.value.vendor[0].vendor_name,
          department: this.formRoleData.value.department,
          invoice_number: this.formRoleData.value.invoice_number,
          final: this.formRoleData.value.final,
          receipt_id: this.formRoleData.value.receipt_id,
          purchage_date: this.formRoleData.value.purchage_date,
          amount: this.formRoleData.value.amount,
          description: this.formRoleData.value.description,
          gl_account: this.formRoleData.value.gl_account,
          pmt_type: this.formRoleData.value.pmt_type,
          entered_by: this.currentUser.id,
          entered_date:this.minDate,
          id : this.prmsUsrId.id
        }
          this.dataSrv.editSpendDownOthersTableById(data).subscribe((res:any)=>{
            if(!res.error){
                this.loading=  false;
              this.toaster.successToastr(res.msg)
              this._router.navigate(['/spend-for-other-department'])
            }else{
              this.loading=  false;
              this.toaster.errorToastr(res.msg)
            }
          },err=>{
            this.loading=  false;
            this.dataSrv.genericErrorToaster()
          })
      }
  
  }

  getCommunityId() {
    this.dataSrv.getCommunityId().subscribe((response: any) => {
      if (response['error'] == false) {
        this.allCommunity = response.body.sort(function(a, b){
          if(a.community_name.toUpperCase() < b.community_name.toUpperCase()) { return -1; }
          if(a.community_name.toUpperCase() > b.community_name.toUpperCase()) { return 1; }
          return 0;
      })  ;
        //this.toastr.successToastr(response.msg);
      } else if (response['error'] == true) {
        this.toaster.errorToastr(response.msg);
      }
    }, (err) => {
      this.dataSrv.genericErrorToaster();

    })
  }

  slctCom(e,no){
    this.ledgerData =[]
    this.submitId2 = []
    this.comId1 = (e?.target?.value ? e?.target?.value : e)
    this.getvendors(this.comId1)
    this.allCommunity?.forEach(element => {
      if(element.id == this.comId1  ) this.submitId2.push( element)
    });
    // if(this.currentUser.prmsnId == '6'){
    //   this.getPrmsnData()
    // }else{
      this.getDepartment(e)
    // }
    if(this.nullDep1 == '0'){
        this.chngdprt(this.nullDep1)
    }
    else{
      let data = {
        id : no == 2 ? this.currentUser.id :no==3 ? e : e.target.value,
        community_id : 'community_id'
      }
      this.dataSrv.getLedgerById( data).subscribe((res:any)=>{
            if(!res.err){
              this.ledgerData =  res.body
              this.ledgerData1 = this.ledgerData.filter(i=>i.department == this.nullDep1)
             this.loadSpinner = false;

              // .filter(i=>{
              //       if ( i.gl_and_description) {this.ledgerData.push(i.gl_and_description)}
              //       });
              
                    //   this.ledgerData.sort(function(a, b){
                    //     if(a.toUpperCase() < b.toUpperCase()) { return -1; }
                    //     if(a.toUpperCase() > b.toUpperCase()) { return 1; }
                    //     return 0;
                    // })  ;
                
            }
            else{
              this.loadSpinner = false;
              this.toaster.errorToastr('Something went wrong please try again leter')
            }
          },err=>{
              this.dataSrv.genericErrorToaster()
              this.loadSpinner = false;

          })
    }
   
  }


  getCommunityDetails() {
    this.dataSrv.getcommunityById(this.roleData2.includes(this.currentUser.prmsnId) ? this.currentUser.com_id : this.currentUser.id).subscribe(response => {
      if (!response.error) {
          this.comName = response.body[0]
          if(this.roleData2.includes(this.currentUser.prmsnId)){
            this.getUserDtl()
          }
      } else {
        this._authenticationService.errorToaster(response);
      }
    }, error => {
      this.dataSrv.genericErrorToaster()
    }
    );
  }

  con_req(val){
    val == '1' ? this.formRoleData.get('contract_uploaded').setValue('1') : this.formRoleData.get('contract_uploaded').setValue('0');
    if(val == '1'){
      this.err=false;
    }
  }

  chngdprt(e){
      let d = e?.target?.value || e
      if(d == '0'){
        this.nullDep = true
        this.dataSrv.getGlDepartment().subscribe((res:any)=>{
          this.ledgerData1 = res.body
         this.loadSpinner = false;
        },err=>{
          this.toaster.errorToastr('Something went wrong please try again leter')
          this.loadSpinner = false;
  
        })
      }
      else{
        this.nullDep = false
        // this.nullDep1 =  d
        let data = {
          id : this.currentUser.prmsnId == '1' ? this.currentUser.id :  this.currentUser.prmsnId == '6' ? this.comId1 : this.currentUser.com_id,
          community_id : 'community_id'
        }
        this.dataSrv.getLedgerById( data).subscribe((res:any)=>{
              if(!res.err){
                this.ledgerData =  res.body
                this.loadSpinner = false; 
        this.ledgerData1 = this.ledgerData.filter(i=>i.department == d)
              }
              else{
                this.toaster.errorToastr('Something went wrong please try again leter')
                this.loadSpinner = false;

              }
            },err=>{
                this.loadSpinner = false;
                this.dataSrv.genericErrorToaster()
            })
      }
  }

  getDepartment(e){
    this.dprtmnt =[]
    let isfor = 6 
    let for_other = 'other'
    this.dataSrv.getDepartmentListing(['1'].includes(this.currentUser.prmsnId) ? this.currentUser.id : e?.target?.value || e,isfor,for_other).subscribe((res:any)=>{
      this.dprtmnt = res.body.sort(function(a, b){
        if(a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
        if(a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
        return 0;
    })  ;;
    },err=>{
      this.toaster.errorToastr('Something went wrong please try again leter')
    })
  }

  get controls() {
    return this.formData1.controls;
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
  closeded(modal: NgbModalRef) {
    modal.dismiss();
  }

  openAddNew() {
    this.formData1.reset()
    this.modalOpenOSE(this.Addnew, 'lg');
  }

  addNwVndr(modal){
    for (let item of Object.keys(this.controls)) {
      this.controls[item].markAsDirty()
    }
    if (this.formData1.invalid) {
      return;
    }
    this.closeded(modal)
    this.formRoleData.get('vendor').setValue(this.formData1.value.newVendor)
    let data ={
      vendor_name: this.formData1.value.newVendor,
      community_id: this.currentUser.prmsnId == '6' ? this.formData1.value.community_name : this.currentUser.prmsnId == '1' ? this.currentUser.id  :this.currentUser.com_id ,
      description: this.formData1.value.description,
}
    this.dataSrv.addVendor(data).subscribe((res:any)=>{
      if(!res.error){
          this.loading=  false;
        this.toaster.successToastr(res.msg)
        this.formRoleData.get('vendor').setValue('')
        this.getvendors(this.formRoleData.value.community_name)
      }else{
        this.loading=  false;
        this.toaster.errorToastr(res.msg)
      }
    },err=>{
      this.loading=  false;
      this.dataSrv.genericErrorToaster()
    })
  }

  getvendors(comId2){
    this.vendorData = []
    if(comId2){
      this.data = {usrRole : !comId2 ? '6' : 'xyz', comId : !comId2 ? '' : comId2 }
    }else{
      this.data = {usrRole : this.currentUser.prmsnId == '6' ? '6' : '', comId : this.currentUser.prmsnId == '6' ? '' : this.roleData2.includes(this.currentUser.prmsnId) ? this.currentUser.com_id  :this.currentUser.id }
    }this.dataSrv.getVendor(this.data).subscribe((res:any)=>{
      if(!res.err){
        this.vendorData=    res.body.sort(function(a, b){
          if(a.vendor_name.toUpperCase() < b.vendor_name.toUpperCase()) { return -1; }
          if(a.vendor_name.toUpperCase() > b.vendor_name.toUpperCase()) { return 1; }
          return 0;
      })  ;
      // if(!this.vendorData.length){
      //   this.vendorData.map(i=>{
      //       i.push('---No Record Founded---')
      //   })
      // }
      
        //  .filter(i=>{
        //   if ( i.vendor_name) {this.vendorData.push(i.vendor_name)}
        //   });

          
          
      }
      else{
        this.toaster.errorToastr('Something went wrong please try again leter')
      }
    },err=>{
        this.dataSrv.genericErrorToaster()
    })
  }

  getRole(){
    this.dataSrv.getAllRole( ).subscribe((res:any)=>{
      if(!res.err){
       
       res.body.filter(i=>{ this.roleData.push(i.id.toString())})
       this.roleData.map(i=>{
        if(i != 2 && i != 3  && i != 4 && i != 5 && i!= 6 ){
          this.roleData1.push(i)
        }
        if(i != 1 && i != 2 && i != 3  && i != 4 && i != 5 && i!= 6 ){
          this.roleData2.push(i)
        }
       })
         this.getPrmsnData()
      }
    },err=>{
      this.dataSrv.genericErrorToaster()
    })
  }

  getPrmsnData(){
        this.getCommunityDetails()
        this.getvendors(this.currentUser.prmsnId == '6' ? '' : this.roleData2.includes(this.currentUser.prmsnId) ? this.currentUser.com_id  :this.currentUser.id)
        this.getDepartment( this.currentUser.prmsnId == '6' ? this.formData1.value.community_name : this.currentUser.prmsnId == '1' ? this.currentUser.id  :this.currentUser.com_id )
        this.getType()
        if(this.roleData1.includes(this.currentUser.prmsnId)){
          if(this.currentUser.user_role != 8){
           this.getCommunityDetails()
          }else{
           this.getUserDtl()
          }
          }
      }

  getDate(today) {
    // let todayDate: any = new Date();
    let toDate: any = today.getDate();
    if (toDate < 10) {
      toDate = '0' + toDate
    }
    let month = today.getMonth() + 1;
    if (month < 10) {
      month = '0' + month;
    }
    let year = today.getFullYear();
    this.minDate = year + '-' + month + '-' + toDate
    return this.minDate
  }
  
  getType(){
    this.paymentType = []
    this.dataSrv.getPaymentType().subscribe((res:any)=>{
      if(!res.err){
      res.body.filter(i=>{
        if ( i.name != 'Reconciliation') {this.paymentType.push(i.name)}
       });
         
        this.paymentType.sort(function(a, b){
            if(a.toUpperCase() < b.toUpperCase()) { return -1; }
            if(a.toUpperCase() > b.toUpperCase()) { return 1; }
            return 0;
        })  ;
        // console.log(this.paymentType);
        
      }
      else{
        this.toaster.errorToastr('Something went wrong please try again leter')
      }
    },err=>{
        this.dataSrv.genericErrorToaster()
    })
  }

  getUserDtl(){
    let is_for = 'user'
    let searchStr = ''
    this.dataSrv.getUserById(searchStr = '',this.currentUser.id,is_for).subscribe(response => {
      if (!response.error) {
          this.userName = response.body[0]
      } else {
        this._authenticationService.errorToaster(response);
      }
    }, error => {
      this.dataSrv.genericErrorToaster()
    }
    );
    this.loadSpinner = false

}

crtRec(){
  this.myId.push(uuid.v4())
  this.formRoleData.get('receipt_id').setValue(this.myId[0])
}
}

