import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'app/auth/service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { BudgetServiceService } from '../budget-service.service';
import { Location } from '@angular/common';
import { DataService } from 'app/auth/service/data.service';
import { Page } from 'app/utils/models';


@Component({
  selector: 'app-add-budget',
  templateUrl: './add-budget.component.html',
  styleUrls: ['./add-budget.component.scss']
})
export class AddBudgetComponent implements OnInit {
  loading:boolean = false;
  RouteIdData:any;
  public contentHeader: any;
  public formBudgetData: FormGroup;
  months:string='';
  submit:boolean = false;
  currentUser: any;
  searchStr: string;
  public page = new Page();
  srt_endStts: any;
  getCurrentYear: number;
  listOfYears: number[];
  rows: any =[]
  
  constructor(private _authenticationService: AuthenticationService, private formBuilder:FormBuilder,private location:Location,
    private budgetService:BudgetServiceService,private toaster:ToastrManager, private _router:Router, private activatedRoute:ActivatedRoute,
    private dataSrv : DataService
    ) {
      this.activatedRoute.params.subscribe((res:any)=>{
        if(res){
          
          this.RouteIdData = res;
        }
      })
      this._authenticationService.currentUser.subscribe((x: any) => {
      this.currentUser = x
      
    }); }

  ngOnInit(): void {
   this.getBudget()
    this.formBudgetData = this.formBuilder.group({
      months: ['', Validators.required],
      year: ['', Validators.required],
      agency_shift: ['', Validators.required],
      // shift_length: ['', Validators.required],
      // avg_rate: ['', Validators.required],
      spend: ['', Validators.required],
      // agency_Id: ['', Validators.required],
      // agency_rate: ['', Validators.required],
      // ar_Feb: ['', Validators.required],
      // ar_Mar: ['', Validators.required],
      // ar_Apr: ['', Validators.required],
      // ar_May: ['', Validators.required],
      // ar_Jun: ['', Validators.required],
      // ar_Jul: ['', Validators.required],
      // ar_Aug: ['', Validators.required],
      // ar_Sep: ['', Validators.required],
      // ar_Oct: ['', Validators.required],
      // ar_Nov: ['', Validators.required],
      // ar_Dec: ['', Validators.required],
    })
    this.getAgncy()
    if(this.RouteIdData.id){
      this.formPatch()
    }

     this.getCurrentYear = new Date().getFullYear(); // current year
    this.listOfYears = Array.from({length: 51}, (_, i) => this.getCurrentYear + i);

  }
  formPatch(){
    this.budgetService.getBudgetById(this.RouteIdData.id).subscribe((res:any)=>{
      this.formBudgetData.patchValue({
      months: res.body[0].months ,
      agency_shift: res.body[0].agency_shift ,
      year: res.body[0].year ,
      spend: res.body[0].spend ,
      })
    })
  }
  get FormData_Control() {
    return this.formBudgetData.controls;
  }
  getHeaders(){
    this.contentHeader = {
      headerTitle: 'Add Certification',
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
            name: 'Certification',
            isLink: true,
            link: '/certification'
          }
        ]
      }
    };
  }
  submitted(){
    this.submit= true;
    for (let item of Object.keys(this.FormData_Control)) {
      this.FormData_Control[item].markAsDirty()
    }
    if (this.formBudgetData.invalid) {
      return;
    }

   let filtermn = []
   if(!this.RouteIdData.id){
    filtermn =  this.rows.filter(i=>{
      if(i.year == this.formBudgetData.value.year &&  i.months == this.formBudgetData.value.months){
      return i;
      }
    }
    )
   }
  

    if(filtermn?.length){
      this.toaster.errorToastr('Already have this month and year')
      return;
    }

    let data ={
      // agency_id:this.currentUser.id,
      months:this.formBudgetData.value.months,
      year:this.formBudgetData.value.year,
      agency_shift:this.formBudgetData.value.agency_shift,
      spend:this.formBudgetData.value.spend,
      id: this.RouteIdData?.id,
      community_id : this.currentUser.id
    }
    this.loading = true;
    if(this.RouteIdData.id){
      this.budgetService.updateBudget(data).subscribe((res:any)=>{
        
        if(!res.err){
            this.loading=  false;
          this.toaster.successToastr(res.msg)
          this._router.navigate(['/budget-agency'])
        }else{
          this.loading=  false;
          this.toaster.errorToastr(res.msg)
        }
      },err=>{
        this.loading=  false;
        this.toaster.errorToastr('Something went wrong please try again leter')
      })
    }else{
      this.budgetService.addBudget(data).subscribe((res:any)=>{
        
        if(!res.err){
            this.loading=  false;
          this.toaster.successToastr(res.msg)
          this._router.navigate(['/budget-agency'])
        }else{
          this.loading=  false;
          this.toaster.errorToastr(res.msg)
        }
      },err=>{
        this.loading=  false;
        this.toaster.errorToastr('Something went wrong please try again leter')
      })
    }
  }
  goBack(){
    this.location.back()
  }

  getAgncy(){
    let community_id = this.currentUser.id
    let is_for = 'community'
    let typeDrop = true
    this.dataSrv.getAgency(this.searchStr= '', this.page.pageNumber, this.page.size, community_id,is_for,typeDrop).subscribe(response => {
      if (!response.error) {
        this.srt_endStts = response.body
      } else {
        this._authenticationService.errorToaster(response);
      }
      this.loading = false;
    }, error => {
      this.loading = false;
    }
    );
  }

  
  getBudget(){
    this.budgetService.getBudget(this.currentUser.id).subscribe((res:any)=>{
    if(!res.err){
      this.rows = res.body;
    }else{
      this.toaster.errorToastr(res.msg)
    }
  },err=>{
    this.toaster.errorToastr('Something went wrong please try again leter')
  })
  }
  
}
