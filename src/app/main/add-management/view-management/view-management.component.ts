import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbCalendar, NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-view-management',
  templateUrl: './view-management.component.html',
  styleUrls: ['./view-management.component.scss']
})
export class ViewManagementComponent implements OnInit {
  btnShow: boolean = false;
  currenUserId: any;
  prmsUsrId: any;
  allManagement: any;
  public contentHeader: object;
  managementDtls: any;
  addAccTo!: FormGroup;
  comunityId: any;
	hoveredDate: NgbDate | null = null;
	fromDate: NgbDate | null;
	toDate: NgbDate | null;
  errTru: boolean;

  constructor
  (
    private dataService: DataService,
    public toastr: ToastrManager,
    private loctn: Location,
    private aCtRoute: ActivatedRoute,
    private fb: FormBuilder,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter
  ) 
  { 
    this.aCtRoute.params.subscribe(
      res => {
        if (res.id) {
          this.prmsUsrId = res;
          this.getManagementById()
          this.EditUser()
        }
      }
    )
    this.fromDate = calendar.getToday();
		this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
  }

  onDateSelection(date: NgbDate) {
		if (!this.fromDate && !this.toDate) {
			this.fromDate = date;
		} else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
			this.toDate = date;
		} else {
			this.toDate = null;
			this.fromDate = date;
		}
	}

	isHovered(date: NgbDate) {
		return (
			this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
		);
	}

	isInside(date: NgbDate) {
		return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
	}

	isRange(date: NgbDate) {
		return (
			date.equals(this.fromDate) ||
			(this.toDate && date.equals(this.toDate)) ||
			this.isInside(date) ||
			this.isHovered(date)
		);
	}
	validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
		const parsed = this.formatter.parse(input);
		return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
	}
  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'View Management Company ',
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
            name: 'Management Company ',
            isLink: true,
            link: '/management'
          }
        ]
      }
    };
    this.addAccTo = this.fb.group({
      trak_type: ['0'],
    })
  }

  get FormData_Control() {
    return this.addAccTo.controls
  }
  
  getManagementById() {
    this.dataService.getManagementById(this.prmsUsrId?.id).subscribe((res: any) => {
      if (!res.error) {
        this.managementDtls= res.body;
      }
    },
      (err) => {
        this.dataService.genericErrorToaster()
      })
  }

  EditUser() {
    this.dataService.getMNMGcommunity(this.prmsUsrId?.id).subscribe((res: any) => {
      if (!res.error) {
        this.allManagement= res.body;
      }
    },
      (err) => {
        this.dataService.genericErrorToaster()
      })
  }

  goBack(){
    this.loctn.back()
  }

  addAccToSubmit(){
    // if(!this.FormData_Control.shift_type1.value && !this.FormData_Control.shift_type2.value && !this.FormData_Control.shift_type3.value){
    //     this.errTru =true
    //   return;
    // }
    let data ={
      access_to:this.addAccTo.value.shift_type1 == true ? '0' : this.addAccTo.value.shift_type2 == true ? '1' : '2' ,
      id: this.comunityId
    }
    
    const input_data={
      community_id:this.prmsUsrId.id,
      access_to:this.addAccTo.value.trak_type ,
      start_date:new Date(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day),
      end_date:new Date(this.toDate.year, this.toDate.month - 1, this.toDate.day),
     }
     
     this.dataService.addCMAccessTo(input_data).subscribe((res: any) => {
      if (!res.error) {
        this.toastr.successToastr(res.msg);
  
        // this.getCmAcess();
        this.btnShow = false;
      }else{
        this.toastr.errorToastr(res.msg);
        this.btnShow = false;
      }
    }, (err: any) => {
      this.dataService.genericErrorToaster()
      this.btnShow = false;
    })
    // this.dataService.addAccessTo(data).subscribe((res:any)=>{
    //   
    //   if(!res.error){
    //       this.loading=  false;
    //     this.toastr.successToastr(res.msg)
    //     // this._router.navigate(['/menu'])
    //   }else{
    //     this.loading=  false;
    //     this.toastr.errorToastr(res.msg)
    //   }
    // },err=>{
    //   this.loading=  false;
    //   this.dataService.genericErrorToaster()
    // })
  }

  chckBx(e,index){
    if(e.target.checked){
      this.errTru =false
    }
    // if(!this.FormData_Control.shift_type1.value && !this.FormData_Control.shift_type2.value && !this.FormData_Control.shift_type3.value){
    //   this.errTru =true
    // }
  }
  
}
