import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-add-budget',
  templateUrl: './add-budget.component.html',
  styleUrls: ['./add-budget.component.scss'],
  providers : [DatePipe]
})
export class AddBudgetComponent implements OnInit {
  public contentHeader: any;
  formRoleData: any;
  loading:boolean = false;
  prmsUsrId: any;
  allCommunity: any;
  currentUser: any;
  ledgerData: any = []
  dprtmnt: any = []
  comName: any;
  submitId2: any=[]
  comid: any;
  ledgerData1: any[];
  ptchDrpt: any;
  minDate: any;
  deptDsbl: boolean;
  type: any[];
  vwPrms: any;
  roleData: any;
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
    private datePipe : DatePipe

  ) { 
    this.type = ['Set','Variable','Flat','Manual','PRD']
    this.aCtRoute.params.subscribe(
      res => {
          this.prmsUsrId = res;
          // console.log(this.prmsUsrId)
      }
    )
    this._authenticationService.currentUser.subscribe((x: any) => {
      this.currentUser = x
    })
    this.currentUser?.user_role == 3||this.currentUser?.user_role == 8?this.getCmmntNm():this.getCommunityId()
  }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: this.prmsUsrId?.id ? 'Edit Budget' : 'Add Budget',
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
            name: 'Budget',
            isLink: true,
            link: '/budget'
          }
        ]
      }
    
    };
    this.getPrmsnData()
    
    this.formRoleData = this.formBuilder.group({
      community_name: ['', Validators.required],
      GLA_id: ['', Validators.required],
      labor_type:['',Validators.required],
      description: ['', Validators.required],
      department: [''],
      type:['',Validators.required],
      currency: [''],
      PRD_value: [''],
      january:['',Validators.required],
      february: ['', Validators.required],
      march: ['', Validators.required],
      april:['',Validators.required],
      may: ['', Validators.required],
      june: ['', Validators.required],
      july:['',Validators.required],
      august: ['', Validators.required],
      september: ['', Validators.required],
      october:['',Validators.required],
      november: ['', Validators.required],
      december: ['', Validators.required],
      YE_total: ['', Validators.required],
      budget_version: [''],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
    })

    if(this.prmsUsrId?.id){
      this.deptDsbl = true
      this.getBudgetTableById();
    }
    if(['6'].includes(this.currentUser?.prmsnId)){
      this.getCommunityId()
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
  }

  ngAfterContentInit(){
    if(['1'].includes(this.currentUser?.prmsnId)){
      this.getCommunityDetails()
     this.slctCom(this.currentUser?.id,2)
    }
  }

 
  goBack(){
    this.location.back()
  }

  get FormData_Control(){
    return this.formRoleData.controls;
  }
  // appendZero (data:any) {
  //   return data < 10 ? `0${data}` : data
  // }
//   formatDate(dateData: any){
//       let todayDate: any = new Date(dateData);
//       let toDate: any = todayDate.getDate();
//       if (toDate < 10) {
//         toDate = '0' + toDate
//       }
//       let month = todayDate.getMonth() + 1;
//       if (month < 10) {
//         month = '0' + month;
//       }
//       let year = todayDate.getFullYear();
//       this.minDate =  month + '-' + toDate  + '-' + year
//     console.log(dateData, typeof dateData);
//     const date = new Date(dateData);
//     return `${date.getFullYear()}-${this.appendZero(date.getMonth()+1)}-${this.appendZero(date.getDate())}`
// }
  
  getBudgetTableById(){
    this.dataSrv.getBudgetTableById(this.prmsUsrId.id).subscribe((res:any)=>{      
      if(!res.err){
        if(this.prmsUsrId.id){
          this.ptchDrpt = res.body[0].department
          this.comid = res.body[0].community_id
          if(this.currentUser?.user_role == '6'){
          this.slctCom(res.body[0].community_id,3)
        }
          this.formRoleData.patchValue({
           community_name: res.body[0].community_id,
            GLA_id: res.body[0].GLA_id,
            labor_type:res.body[0].labor_type,
            description: res.body[0].description,
            department: res.body[0].department,
            type:res.body[0].type,
            currency: res.body[0].currency,
            PRD_value: res.body[0].PRD_value,
            january:res.body[0].january,
            february: res.body[0].february,
            march: res.body[0].march,
            april:res.body[0].april,
            may: res.body[0].may,
            june: res.body[0].june,
            july:res.body[0].july,
            august: res.body[0].august,
            september: res.body[0].september,
            october:res.body[0].october,
            november: res.body[0].november,
            december: res.body[0].december,
            YE_total: res.body[0].YE_total,
            budget_version: res.body[0].budget_version,
            start_date: this.datePipe.transform( res.body[0].start_date, 'yyyy-MM-dd') ,
            end_date: this.datePipe.transform( res.body[0].end_date, 'yyyy-MM-dd') ,
        
          })
        }
   
     
      }
      else{
        this.toaster.errorToastr('Something went wrong please try again leter')
      }
    },err=>{
        this.dataSrv.genericErrorToaster()
    })
  }


  submitted(){
    if(!this.prmsUsrId.id){
      for (let item of Object.keys(this.FormData_Control)) {
        this.FormData_Control[item].markAsDirty()
      }
      if(!this.prmsUsrId.id){
            if (this.formRoleData.invalid) {
        return;
      }

    }
    
  }
    if(this.prmsUsrId?.id){
      this.allCommunity?.forEach(element => {
        if(element.id == this.comid) this.submitId2.push( element)
      });
      this.loading=  true;
      let data ={
        community_name:this.currentUser?.prmsnId == '1' ? this.comName.community_name : this.submitId2[0].community_name,
        GLA_id: this.formRoleData.value.GLA_id,
        labor_type:this.formRoleData.value.labor_type,
        description: this.formRoleData.value.description,
        department: this.formRoleData.value.department,
        type:this.formRoleData.value.type,
        currency: this.formRoleData.value.currency,
        PRD_value: this.formRoleData.value.PRD_value,
        january:this.formRoleData.value.january,
        february: this.formRoleData.value.february,
        march: this.formRoleData.value.march,
        april:this.formRoleData.value.april,
        may: this.formRoleData.value.may,
        june: this.formRoleData.value.june,
        july:this.formRoleData.value.july,
        august: this.formRoleData.value.august,
        september: this.formRoleData.value.september,
        october:this.formRoleData.value.october,
        november: this.formRoleData.value.november,
        december: this.formRoleData.value.december,
        YE_total: this.formRoleData.value.YE_total,
        budget_version: this.formRoleData.value.budget_version,
        start_date: this.formRoleData.value.start_date,
        end_date: this.formRoleData.value.end_date,
        id : this.prmsUsrId.id
      }
      if(this.formRoleData.value.end_date<=this.formRoleData.value.start_date){
        this.toaster.errorToastr("End Date must be after Start Date")
        this.loading=  false;
      }else{
        this.dataSrv.editBudgetTable(data).subscribe((res:any)=>{
          // console.log(res)
          if(!res.error){
              this.loading=  false;
            this.toaster.successToastr(res.msg)
            this._router.navigate(['/budget'])
          }else{
            this.loading=  false;
            this.toaster.errorToastr(res.msg)
          }
        },err=>{
          this.loading=  false;
          this.dataSrv.genericErrorToaster()
        })}
    }else{
       let data ={
      community_name: this.currentUser?.prmsnId == '1' ? this.comName.community_name :this.currentUser?.user_role ==3 ?this.community_name:this.submitId2[0].community_name,
      GLA_id: this.formRoleData.value.GLA_id,
      labor_type:this.formRoleData.value.labor_type,
      description: this.formRoleData.value.description,
      department: this.formRoleData.value.department,
      type:this.formRoleData.value.type,
      currency: this.formRoleData.value.currency,
      PRD_value: this.formRoleData.value.PRD_value,
      january:this.formRoleData.value.january,
      february: this.formRoleData.value.february,
      march: this.formRoleData.value.march,
      april:this.formRoleData.value.april,
      may: this.formRoleData.value.may,
      june: this.formRoleData.value.june,
      july:this.formRoleData.value.july,
      august: this.formRoleData.value.august,
      september: this.formRoleData.value.september,
      october:this.formRoleData.value.october,
      november: this.formRoleData.value.november,
      december: this.formRoleData.value.december,
      YE_total: this.formRoleData.value.YE_total,
      budget_version: this.formRoleData.value.budget_version,
      start_date: this.formRoleData.value.start_date,
      end_date: this.formRoleData.value.end_date,
    }
    if(this.formRoleData.value.end_date<=this.formRoleData.value.start_date){
      this.toaster.errorToastr('End date will be after start date')
    }else{
      this.loading=  true;
        this.dataSrv.addBudgetTable(data).subscribe((res:any)=>{
          // console.log(res)
          if(!res.error){
              this.loading=  false;
            this.toaster.successToastr(res.msg)
           this._router.navigate(['/budget'])
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

  slctCom(e,no){
    this.ledgerData = []
    this.submitId2 = []
    this.allCommunity?.forEach(element => {
      if(element.id == e.target.value  ) this.submitId2.push( element)
    });
    this.getDepartment(no == 2 ? this.currentUser?.id : no==3? e : e.target.value)
    let data = {
      id : no == 2 ? this.currentUser?.id : no==3? e : e.target.value,
      community_id : 'community_id'
    }
    this.dataSrv.getLedgerById(data).subscribe((res:any)=>{
          if(!res.err){
            this.ledgerData= res.body
            this.chngD(this.ptchDrpt)
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

  chngD(e){
    let d = e?.target?.value || e
      this.ledgerData1 = this.ledgerData.filter(i=>i.department == d).sort()
      if(d == 'no'){ // used to bind all gl values if no department is selected
        this.ledgerData1 = this.ledgerData.sort(function(a, b){
          if(a.gl_acc < b.gl_acc) { return -1; }
          if(a.gl_acc > b.gl_acc) { return 1; }
           return 0;
        })  ;
      }
  }
  getCmmntNm(){
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
        this.community_id=response.body[0].cp_id,
        this.community_name= response?.body[0]?.community_name

        } else if (response['error'] == true) {
          this.toaster.errorToastr(response.msg);
        }
      }, (err) => {
        this.dataSrv.genericErrorToaster();
  
      })
    }
}

  getDepartment(e){
    let isfor = this.currentUser?.user_role == 6 ? 6 :'';
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

  getPrmsnData(){
    this.dataSrv.getPermissionByAdminRole().subscribe(
      (res:any) => {
        if (!res.error) {
          // this.rows=[]
          res.body.map(i=>{
            //comunity User
            if(this.roleData?.includes(i.role_id)){
              if(i.permission_name == 'Department'){              
              this.vwPrms  = i.view_permission
              this.dprtmnt=JSON.parse(i.row_data);
              this.dprtmnt =  this.dprtmnt.sort(function(a, b){
                if(a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
                if(a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
                return 0;
            });
              }
              
            }
          })
          
        } 
    }, (error:any) => {
      this.dataSrv.genericErrorToaster()
    }
    )
  }


}
