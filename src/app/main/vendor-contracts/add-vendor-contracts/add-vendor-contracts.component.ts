import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-add-vendor-contracts',
  templateUrl: './add-vendor-contracts.component.html',
  styleUrls: ['./add-vendor-contracts.component.scss']
})
export class AddVendorContractsComponent implements OnInit {
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
  community_id: any;
  community_name: any;
  
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
    this.currentUser?.user_role == 3||this.currentUser?.user_role == 8 ?this.getMngComunity():this.getCommunityId()
    if(this.prmsUsrId?.id){
    this.loadSpinner = true;
    }
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
      headerTitle: this.prmsUsrId?.id ? 'Edit Vendor Contracts' : 'Add Vendor Contracts',
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
            name: 'Vendor Contracts',
            isLink: true,
            link: '/vendor_contracts'
          }
        ]
      }
    };
    this.formRoleData = this.formBuilder.group({
      community_name: this.currentUser?.prmsnId == '6' ? ['',Validators.required] : [''],
      department: ['', Validators.required],
      contract_amount: ['', Validators.required],
      vendor: ['', Validators.required],
      description: ['', Validators.required],
      gl_account: ['', Validators.required],
      periods:['', Validators.required],
      monthly_amount: ['', Validators.required],
      type: ['', Validators.required],
      pmt_type: ['Contract'],
      start_date: ['', Validators.required],
      end_date:['', Validators.required],
      cencellation_date: ['', Validators.required],
      renewal_date:[''],
      renewal_amount: [''],
      contract_required: ['', Validators.required],
      contract_uploaded: ['', Validators.required],
      // contract_file:['', Validators.required],
      entered_by: [''],
      entered_date:[''],
     })

     this.formData1 = this.formBuilder.group({
      newVendor: ['', Validators.required],
      description: ['', Validators.required],
    })
    
    // this.formRoleData.controls['pmt_type'].setValue('Contract', {onlySelf: true});
    this.getType()
    
      if(this.prmsUsrId?.id){
        this.getVendorList()
     }

      if(['1'].includes(this.currentUser?.prmsnId))
      {
       this.formRoleData.controls['community_name'].clearValidators();
       this.formRoleData.updateValueAndValidity();
      }
      if(['6'].includes(this.currentUser?.prmsnId))
      {
       this.formRoleData.controls['community_name'].setValidators(Validators.required);
       this.formRoleData.updateValueAndValidity();
      }

      let today = new Date();
      this.todaysDate = this.getDate(today)
      if(this.roleData2.includes(this.currentUser?.prmsnId)){
        if(!this.prmsUsrId?.id){
          this.slctCom(this.currentUser?.id,2)
        }
      }
      else{
        this.getDepartment(this.currentUser?.user_role == 4 ? this.currentUser?.com_id : this.currentUser?.id)
      }
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
    let data = {
      id : this.prmsUsrId.id,
      community_id : 'id'
    }
    this.dataSrv.getVendorContractById(data).subscribe((res:any)=>{
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
            contract_amount: res.body[0].contract_amount,
            vendor: this.venData,
            description: res.body[0].description,
            gl_account: res.body[0].gl_account,
            periods:res.body[0].periods,
            monthly_amount: res.body[0].monthly_amount,
            type: res.body[0].type,
            pmt_type: res.body[0].pmt_type = 'Contract',
            start_date: res.body[0].start_date,
            end_date:res.body[0].end_date,
            cencellation_date: res.body[0].cencellation_date,
            renewal_date:res.body[0].renewal_date,
            renewal_amount: res.body[0].renewal_amount,
            contract_required: res.body[0].contract_required == ("N" || "1") ? "1" : "0" ,
            contract_uploaded: res.body[0].contract_uploaded == ("N" || "1") ? "1" : "0",
            contract_file:null,
            // entered_by: res.body[0].entered_by,
            // entered_date:res.body[0].entered_date,
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
   
    if(!this.prmsUsrId?.id){
      if(this.formRoleData.value.contract_required != '1'&& !this.fileToUpload){
        this.onFileInput('err')
        if(this.err){
          return;
        }
      }
    }
    if (this.formRoleData.invalid) {
      return;
    }

    if(this.prmsUsrId?.id){
      this.allCommunity?.forEach(element => {
        if(element.id == this.comId  ) this.submitId2.push( element)
      });
    
      this.loading=  true;
      let data ={
        community_name:this.currentUser?.prmsnId == '1' ? this.submitId2[0].community_name: this.submitId2[0].community_name,
        contract_amount: !this.formRoleData.value.contract_amount?this.formRoleData.value.contract_amount: this.formRoleData.value.contract_amount.toFixed(2),
        vendor: this.formRoleData.value.vendor[0].vendor_name,
        department: this.formRoleData.value.department,
        description: this.formRoleData.value.description,
        gl_account: this.formRoleData.value.gl_account,
        periods:Number(this.formRoleData.value.periods),
        monthly_amount:!this.formRoleData.value.monthly_amount?this.formRoleData.value.monthly_amount: this.formRoleData.value.monthly_amount.toFixed(2),
        type: this.formRoleData.value.type,
        pmt_type: 'Contract',
        start_date: this.formRoleData.value.start_date,
        end_date:this.formRoleData.value.end_date,
        cencellation_date: this.formRoleData.value.cencellation_date,
        renewal_date:this.formRoleData.value.renewal_date,
        renewal_amount:!this.formRoleData.value.renewal_amount?this.formRoleData.value.renewal_amount: this.formRoleData.value.renewal_amount.toFixed(2),
        contract_required: this.formRoleData.value.contract_required,
        contract_uploaded: this.formRoleData.value.contract_required == '0' ? 'Y' : 'N',
        // docUpload:this.formRoleData.value.contract_file,
        entered_by: this.currentUser?.id,
        entered_date:this.minDate,
          id:this.prmsUsrId.id
      }
        this.dataSrv.editVendorContract(data).subscribe((res:any)=>{
          if(!res.error){
              this.loading=  false;
            this.toaster.successToastr(res.msg)
            this._router.navigate(['/vendor_contracts'])
          }else{
            this.loading=  false;
            this.toaster.errorToastr(res.msg)
          }
        },err=>{
          this.loading=  false;
          this.dataSrv.genericErrorToaster()
        })
    }else{
    let d:any = null
    let comId =  this.currentUser?.prmsnId == '6' ? this.formRoleData.value.community_name : this.currentUser?.com_id
    d = Number(this.formRoleData.value.periods);
    this.allCommunity?.forEach(element => {
      if(element.id == comId ) this.submitId2.push( element)
    });
    this.formData = new FormData();
    if(this.formRoleData.value.contract_required == '0'){
      this.formData.append('docUpload',this.fileToUpload)
      this.formData.append("community_name", this.currentUser?.prmsnId == '1' ? this.comName.community_name :this.currentUser?.user_role == 3?this.community_name: this.submitId2[0].community_name)
          this.formData.append("contract_amount", this.formRoleData.value.contract_amount.toFixed(2))
          this.formData.append("vendor", this.formRoleData.value.vendor[0].vendor_name)
          this.formData.append("department", this.formRoleData.value.department)
          this.formData.append("description", this.formRoleData.value.description)
          this.formData.append("gl_account", this.formRoleData.value.gl_account)
          this.formData.append("periods",d)
          this.formData.append("monthly_amount", this.formRoleData.value.monthly_amount.toFixed(2))
          this.formData.append("type", this.formRoleData.value.type)
          this.formData.append("pmt_type", this.formRoleData.value.pmt_type)
          this.formData.append("start_date", this.formRoleData.value.start_date)
          this.formData.append("end_date",this.formRoleData.value.end_date)
          this.formData.append("cencellation_date", this.formRoleData.value.cencellation_date)
          this.formData.append("renewal_date",this.formRoleData.value.renewal_date)
          this.formData.append("renewal_amount", this.formRoleData.value?.renewal_amount == '' ? this.formRoleData.value?.renewal_amount: this.formRoleData.value?.renewal_amount.toFixed(2))
          this.formData.append("contract_required", this.formRoleData.value.contract_required)
          this.formData.append("contract_uploaded", this.formRoleData.value.contract_uploaded)
          this.formData.append("entered_by", this.currentUser?.id)
          this.formData.append("entered_date", this.minDate)
    }
    else{
      this.formData.append("community_name", this.currentUser?.prmsnId == '1' ? this.comName.community_name : this.submitId2[0].community_name)
          this.formData.append("contract_amount", this.formRoleData.value.contract_amount.toFixed(2))
          this.formData.append("vendor", this.formRoleData.value.vendor[0].vendor_name)
          this.formData.append("department", this.formRoleData.value.department)
          this.formData.append("description", this.formRoleData.value.description)
          this.formData.append("gl_account", this.formRoleData.value.gl_account)
          this.formData.append("periods",d)
          this.formData.append("monthly_amount", this.formRoleData.value.monthly_amount.toFixed(2))
          this.formData.append("type", this.formRoleData.value.type)
          this.formData.append("pmt_type", this.formRoleData.value.pmt_type)
          this.formData.append("start_date", this.formRoleData.value.start_date)
          this.formData.append("end_date",this.formRoleData.value.end_date)
          this.formData.append("cencellation_date", this.formRoleData.value.cencellation_date)
          this.formData.append("renewal_date",this.formRoleData.value.renewal_date)
          this.formData.append("renewal_amount", this.formRoleData.value?.renewal_amount =='' ? this.formRoleData.value?.renewal_amount : this.formRoleData.value?.renewal_amount.toFixed(2))
          this.formData.append("contract_required", this.formRoleData.value.contract_required)
          this.formData.append("contract_uploaded", this.formRoleData.value.contract_uploaded)
          this.formData.append("entered_by", this.currentUser?.id)
          this.formData.append("entered_date", this.minDate)
    }
      
  //     let data ={
  //       community_name: this.currentUser?.prmsnId == '1' ? this.comName.community_name : this.submitId2[0].community_name,
  //       contract_amount: this.formRoleData.value.contract_amount.toFixed(2),
  //       vendor: this.formRoleData.value.vendor,
  //       description: this.formRoleData.value.description,
  //       gl_account: this.formRoleData.value.gl_account,
  //       periods:Number(this.formRoleData.value.periods),
  //       monthly_amount: this.formRoleData.value.monthly_amount.toFixed(2),
  //       type: this.formRoleData.value.type,
  //       pmt_type: this.formRoleData.value.pmt_type,
  //       start_date: this.formRoleData.value.start_date,
  //       end_date:this.formRoleData.value.end_date,
  //       cencellation_date: this.formRoleData.value.cencellation_date,
  //       renewal_date:this.formRoleData.value.renewal_date,
  //       renewal_amount: this.formRoleData.value.renewal_amount.toFixed(2),
  //       contract_required: this.formRoleData.value.contract_required,
  //       contract_uploaded: this.formRoleData.value.contract_uploaded,
  //       // docUpload:this.formRoleData.value.contract_file,
  //       // entered_by: this.currentUser?.id,
  //       // entered_date:this.minDate,
  // }
      this.loading=  true;
      // console.log("else",data);
      if(this.formRoleData.value.start_date >= this.formRoleData.value.end_date){
        this.toaster.errorToastr("Vendor contracts End Date must be after Vendor contracts Start Date")
        this.loading=  false;
      }else if(this.formRoleData.value.start_date >= this.formRoleData.value.cencellation_date){
        this.toaster.errorToastr("Vendor contracts Cencellation Date must be after Vendor contracts Start Date")
        this.loading=  false;
      }
      else{
        this.dataSrv.addVendorContract(this.formData).subscribe((res:any)=>{
          if(!res.error){
              this.loading=  false;
            this.toaster.successToastr(res.msg)
            this._router.navigate(['/vendor_contracts'])
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
  getMngComunity(){
    if(this.currentUser?.id && this.currentUser?.com_id){
      let data = {
        userId : this.currentUser?.id,
        mangId : this.currentUser?.com_id
      }
      this.dataSrv.getManagementUserCommunities(data).subscribe((res: any) => {
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
        this.community_id = d.community_id
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

        
        this.community_id = response?.body[0]?.cp_id
        this.community_name= response?.body[0]?.community_name
        } else if (response['error'] == true) {
          this.toaster.errorToastr(response.msg);
        }
      }, (err) => {
        this.dataSrv.genericErrorToaster();
  
      })
    }
  }

  slctCom(e,no){
    this.ledgerData =[]
    this.submitId2 = []
    this.comId1 = (e?.target?.value ? e?.target?.value : e)
    this.community_id=(e?.target?.value ? e?.target?.value : e)

    this.getvendors(this.comId1)
    this.allCommunity?.forEach(element => {
      if(element.id == this.comId1  ) this.submitId2.push( element)
    });
    // if(this.currentUser?.prmsnId == '6'){
    //   this.getPrmsnData()
    // }else{
      this.getDepartment(e)
    // }
    if(this.nullDep1 == '0'){
        this.chngdprt(this.nullDep1)
    }
    else{
      let data = {
        id : no == 2 ? this.currentUser?.id :no==3 ? e : e.target.value,
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

  getType(){
    this.paymentType = []
    this.dataSrv.getPaymentType().subscribe((res:any)=>{
      if(!res.err){
      res.body.filter(i=>{
        if ( i.name) {this.paymentType.push(i.name)}
       });
         
        this.paymentType.sort(function(a, b){
            if(a.toUpperCase() < b.toUpperCase()) { return -1; }
            if(a.toUpperCase() > b.toUpperCase()) { return 1; }
            return 0;
        })  ;
      }
      else{
        this.toaster.errorToastr('Something went wrong please try again leter')
      }
    },err=>{
        this.dataSrv.genericErrorToaster()
    })
  }

  getCommunityDetails() {
    this.dataSrv.getcommunityById(this.roleData2.includes(this.currentUser?.prmsnId) ? this.currentUser?.com_id : this.currentUser?.id).subscribe(response => {
      if (!response.error) {
          this.comName = response.body[0]
      } else {
        this._authenticationService.errorToaster(response);
      }
    }, error => {
      this.dataSrv.genericErrorToaster()
    }
    );
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

  con_req(val){
    val == '1' ? this.formRoleData.get('contract_uploaded').setValue('1') : this.formRoleData.get('contract_uploaded').setValue('0');
    if(val == '1'){
      this.err=false;
    }
  }

  chngdprt(e){
    this.ledgerData1 = []
   this.formRoleData.controls['gl_account'].setValue("")
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
          id : this.currentUser?.prmsnId == '1' ? this.currentUser?.id :  this.currentUser?.prmsnId == '6' ? this.comId1 :this.currentUser?.user_role == 3?this.community_id:this.currentUser?.user_role== 1?this.community_id:this.currentUser?.com_id,
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
    let for_other = null;
    let d = e?.target?.value || e
   this.getDepartmentForRolle(d,isfor,for_other)
  }
  getDepartmentForRolle(e,isfor,for_other){
    this.dataSrv.getPermissionByAdminRole().subscribe(
      (res: any) => {
        if (!res.error) {
          res.body.map(i => {
            // if (this.roleData.includes(i.role_id)) {
              if (i.permission_name == 'Department') {
                if(i.view_permission == '1'){
                  this.dataSrv.getDepartmentListing(e, isfor, for_other).subscribe((res: any) => {
                    this.dprtmnt = res.body.sort(function (a, b) {
                      if (a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
                      if (a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
                      return 0;
                    });;
                  }, err => {
                    this.toaster.errorToastr('Something went wrong please try again leter')
                  })
                }
                if(i.trak_type == '0'){
                this.dprtmnt = JSON.parse(i.row_data);
                }
                this.dprtmnt = this.dprtmnt.sort(function (a, b) {
                  if (a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
                  if (a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
                  return 0;
                });
              }
            // }
          })
          if(this.currentUser?.user_role == 6){
            this.dataSrv.getDepartmentListing(e, isfor, for_other).subscribe((res: any) => {
              this.dprtmnt = res.body.sort(function (a, b) {
                if (a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
                if (a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
                return 0;
              });;
            }, err => {
              this.toaster.errorToastr('Something went wrong please try again leter')
            })
          }
        }
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
      community_id: this.currentUser?.prmsnId == '6' ? this.formData1.value.community_name : this.currentUser?.prmsnId == '1' ? this.currentUser?.id  :this.currentUser?.com_id ,
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
      this.data = {usrRole : this.currentUser?.prmsnId == '6' ? '6' : '', comId : this.currentUser?.prmsnId == '6' ? '' : this.roleData2.includes(this.currentUser?.prmsnId) ? this.currentUser?.com_id  :this.currentUser?.id }
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
       if(!this.prmsUsrId?.id){
         this.getPrmsnData()
       }
      }
    },err=>{
      this.dataSrv.genericErrorToaster()
    })
  }

  getPrmsnData(){
    let post=[];
    this.dataSrv.getPermissionByAdminRole().subscribe(
      (res:any) => {
        if(this.roleData2.includes(this.currentUser?.prmsnId )){
        if (!res.error) {
          res.body.map(i=>{
            //comunity
            if(this.roleData.includes(i.role_id)){
              if(i.permission_name == 'Department'){
                if(i.trak_type == '0'){
                  this.dprtmnt=JSON.parse(i.row_data);
                  this.dprtmnt =  this.dprtmnt.sort(function(a, b){
                    if(a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
                    if(a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
                    return 0;
                });
              }
                  // this.frstDp = this.dprtmnt[0]?.name
                  this.ptchDprt = this.dprtmnt[0]?.name
                 
               }
            }
          })
        } 
      }
        this.getCommunityDetails()
        this.getvendors(this.currentUser?.prmsnId == '6' ? '' : this.roleData2.includes(this.currentUser?.prmsnId) ? this.currentUser?.com_id  :this.currentUser?.id)
    }, (error:any) => {
      this.dataSrv.genericErrorToaster()
    }
    )
  }


  
}
