import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-add-fixed-expence-tab',
  templateUrl: './add-fixed-expence-tab.component.html',
  styleUrls: ['./add-fixed-expence-tab.component.scss']
})
export class AddFixedExpenceTabComponent implements OnInit {
  public contentHeader: any;
  formRoleData: any;
  loading:boolean = false;
  prmsUsrId: any;
  allCommunity: any;
  currentUser: any;
  vendorData: any =[]
  ledgerData: any = []
  paymentType: any =[]
  comName: any;
  submitId2: any = []
  dprtmnt: any =[]
  ledgerData1: any=[]
  ptchDprt: any;

  constructor(
    private formBuilder : FormBuilder,
    private location : Location,
    private dataSrv : DataService,
    private toaster : ToastrManager,
    private aCtRoute : ActivatedRoute,
    private _router : Router,
    private _authenticationService : AuthenticationService,
  ) { 
    this.aCtRoute.params.subscribe(
      res => {
          this.prmsUsrId = res;
          
      }
    )
    this._authenticationService.currentUser.subscribe((x: any) => {
      this.currentUser = x
    })
  }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: this.prmsUsrId?.id ? 'Edit Fixed Expense' : 'Add Fixed Expense',
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
            name: 'Fixed Expense Table',
            isLink: true,
            link: '/fixed-expence-table'
          }
        ]
      }
    };
    this.formRoleData = this.formBuilder.group({
      com_name: ['', Validators.required],
      pur_date: ['', Validators.required],
      vendor: ['', Validators.required],
      desc: ['', Validators.required],
      gl_acc: ['', Validators.required],
      amount: ['', Validators.required],
      pay_type: ['', Validators.required],
      department: ['', Validators.required],
      entered_by: [''],
      start_date:['', Validators.required],
      end_date:['', Validators.required],
      exp_date:['', Validators.required],
      invoice_date:['', Validators.required],
      invoice_number:['', Validators.required]
    })
 
    if(['6'].includes(this.currentUser?.prmsnId)){
      this.getCommunityId()
    }

    if(this.prmsUsrId?.id){
      this.getCommunityDetails()
      this.getFixeExpensesTableById()
    }

    if(['1'].includes(this.currentUser?.prmsnId))
    {
     this.formRoleData.controls['com_name'].clearValidators();
     this.formRoleData.updateValueAndValidity();
    }
    if(['6'].includes(this.currentUser?.prmsnId))
    {
     this.formRoleData.controls['com_name'].setValidators(Validators.required);
     this.formRoleData.updateValueAndValidity();
    }
  }

  ngAfterContentInit(){
    if(this.prmsUsrId.id == null){
      if(['1'].includes(this.currentUser?.prmsnId)){
        this.getCommunityDetails()
        this.slctCom(this.currentUser?.id,2)
      }
    }
  }

  
  getFixeExpensesTableById(){
    let data = {
      id : this.prmsUsrId.id,
      community_id : 'id'
    }
    this.dataSrv.getFixeExpensesTableById(data).subscribe((res:any)=>{
      if(!res.err){
        
        this.ptchDprt = res.body[0].department
        this.slctCom(res.body[0].community_id,3)
        this.formRoleData.patchValue({
          com_name:res.body[0].community_id,
          pur_date:res.body[0].purchage_date,
          vendor:res.body[0].vendor,
          department:res.body[0].department,
          desc:res.body[0].description,
          gl_acc:res.body[0].gl_account,
          amount:res.body[0].amount,
          pay_type:res.body[0].pmt_type,
          entered_by:res.body[0].entered_by,
          start_date:res.body[0].start_date,
          exp_date:res.body[0].expenses_date,
          end_date:res.body[0].end_date,
          invoice_number:res.body[0].invoice_number,
          invoice_date:res.body[0].invoice_date
               })
    
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
    let data ={
      community_name: this.currentUser?.prmsnId == '1' ? this.comName.community_name:this.submitId2[0].community_name,
      purchage_date:this.formRoleData.value.pur_date,
      vendor: this.formRoleData.value.vendor,
      description:this.formRoleData.value.desc,
      gl_account:this.formRoleData.value.gl_acc,
      amount:this.formRoleData.value.amount,
      department:this.formRoleData.value.department,
      pmt_type: this.formRoleData.value.pay_type,
      entered_by:this.currentUser?.id,
      start_date:this.formRoleData.value.start_date,
      expenses_date:this.formRoleData.value.exp_date,
      end_date:this.formRoleData.value.end_date,
      invoice_date:this.formRoleData.value.invoice_date,
      invoice_number:this.formRoleData.value.invoice_number
      
    }
    if(this.prmsUsrId?.id){
      this.loading=  true;
      let data ={
        id:this.prmsUsrId.id,
        community_name:this.currentUser?.prmsnId == '1' ? this.comName.community_name:this.submitId2[0].community_name,
        purchage_date:this.formRoleData.value.pur_date,
        vendor: this.formRoleData.value.vendor,
        description:this.formRoleData.value.desc,
        gl_account:this.formRoleData.value.gl_acc,
        amount:this.formRoleData.value.amount,
        department:this.formRoleData.value.department,
        pmt_type: this.formRoleData.value.pay_type,
        entered_by:this.currentUser?.id,
        start_date:this.formRoleData.value.start_date,
        expenses_date:this.formRoleData.value.exp_date,
        end_date:this.formRoleData.value.end_date,
        invoice_date:this.formRoleData.value.invoice_date,
        invoice_number:this.formRoleData.value.invoice_number
      
      }
      

        this.dataSrv.editFixeExpensesTable(data).subscribe((res:any)=>{
          
          if(!res.error){
              this.loading=  false;
            this.toaster.successToastr(res.msg)
            this._router.navigate(['/fixed-expence-table'])
          }else{
            this.loading=  false;
            this.toaster.errorToastr(res.msg)
          }
        },err=>{
          this.loading=  false;
          this.dataSrv.genericErrorToaster()
        })
    }else{
      this.loading=  true;
      
        this.dataSrv.addFixeExpensesTable(data).subscribe((res:any)=>{
          
          if(!res.error){
              this.loading=  false;
            this.toaster.successToastr(res.msg)
            this._router.navigate(['/fixed-expence-table'])
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
    this.submitId2 = []
    this.dprtmnt = []
    this.ledgerData1 = []
    this.dprtmnt=[]
   let comId = (e?.target?.value ? e?.target?.value : e)
    this.allCommunity?.forEach(element => {
      if(element.id == comId ) this.submitId2.push( element)
    });
    
    
    this.getvendors()
    this.getType()
    this.getDepartment(no == 2 ? this.currentUser?.id : no==3 ? e : e.target.value)
    let data = {
      id : no == 2 ? this.currentUser?.id : no==3? e : e.target.value,
      community_id : 'community_id'
    }
    this.dataSrv.getLedgerById(data).subscribe((res:any)=>{
          if(!res.err){
            this.ledgerData=  res.body
            if(this.prmsUsrId.id){
              this.chngD(this.ptchDprt)
             }
            // .filter(i=>{
            //       if ( i.gl_acc) {this.ledgerData.push(i.gl_acc)}
            //       });
            
                  //   .sort(function(a, b){
                  //     if(a.toUpperCase() < b.toUpperCase()) { return -1; }
                  //     if(a.toUpperCase() > b.toUpperCase()) { return 1; }
                  //     return 0;
                  // })  ;
              
          }
          else{
            this.toaster.errorToastr('Something went wrong please try again leter')
          }
        },err=>{
            this.dataSrv.genericErrorToaster()
        })
  }

  getvendors(){
    this.vendorData = []
    let data = {usrRole : this.currentUser?.prmsnId == '6' ? '6' : '', comId : this.currentUser?.prmsnId == '6' ? '' :  this.currentUser?.id }
    this.dataSrv.getVendor(data).subscribe((res:any)=>{
      if(!res.err){
         res.body.filter(i=>{
          if ( i.vendor_name) {this.vendorData.push(i.vendor_name)}
          });

           this.vendorData.sort(function(a, b){
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
    this.dataSrv.getcommunityById(this.currentUser?.id).subscribe(response => {
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

  getDepartment(e){
    this.dprtmnt = []
    let isfor =  6;
    let for_other = null
    this.dataSrv.getDepartmentListing(e,isfor,for_other).subscribe((res:any)=>{
      this.dprtmnt = res.body.sort(function(a, b){
        if(a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
        if(a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
        return 0;
    })  ;;
    },err=>{
      this.toaster.errorToastr('Something went wrong please try again leter')
    })
  }

  chngD(e){
    let d = e?.target?.value || e
    this.ledgerData1 = this.ledgerData.filter(i=>i.department == d)
  }

}
