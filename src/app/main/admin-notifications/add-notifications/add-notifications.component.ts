import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-add-notifications',
  templateUrl: './add-notifications.component.html',
  styleUrls: ['./add-notifications.component.scss']
})
export class AddNotificationsComponent implements OnInit {
  prmsUsrId: any;
  allUsers: any=[]
  fullNm: any=[]
  flterUser: any=[]
  dprtmnt: any[];
  frstDp: any;
  timeslots: any[] = [
    { value: { hour: 0, minute: 0 }, label: '00:00', },
    { value: { hour: 0, minute: 30 }, label: '00:30', },
    { value: { hour: 1, minute: 0 }, label: '01:00', },
    { value: { hour: 1, minute: 30 }, label: '01:30', },
    { value: { hour: 2, minute: 0 }, label: '02:00', },
    { value: { hour: 2, minute: 30 }, label: '02:30', },
    { value: { hour: 3, minute: 0 }, label: '03:00', },
    { value: { hour: 3, minute: 30 }, label: '03:30', },
    { value: { hour: 4, minute: 0 }, label: '04:00', },
    { value: { hour: 4, minute: 30 }, label: '04:30', },
    { value: { hour: 5, minute: 0 }, label: '05:00', },
    { value: { hour: 5, minute: 30 }, label: '05:30', },
    { value: { hour: 6, minute: 0 }, label: '06:00', },
    { value: { hour: 6, minute: 30 }, label: '06:30', },
    { value: { hour: 7, minute: 0 }, label: '07:00', },
    { value: { hour: 7, minute: 30 }, label: '07:30', },
    { value: { hour: 8, minute: 0 }, label: '08:00', },
    { value: { hour: 8, minute: 30 }, label: '08:30', },
    { value: { hour: 9, minute: 0 }, label: '09:00', },
    { value: { hour: 9, minute: 30 }, label: '09:30', },
    { value: { hour: 10, minute: 0 }, label: '10:00', },
    { value: { hour: 10, minute: 30 }, label: '10:30', },
    { value: { hour: 11, minute: 0 }, label: '11:00', },
    { value: { hour: 11, minute: 30 }, label: '11:30', },
    { value: { hour: 12, minute: 0 }, label: '12:00', },
    { value: { hour: 12, minute: 30 }, label: '12:30', },
    { value: { hour: 13, minute: 0 }, label: '13:00', },
    { value: { hour: 13, minute: 30 }, label: '13:30', },
    { value: { hour: 14, minute: 0 }, label: '14:00', },
    { value: { hour: 14, minute: 30 }, label: '14:30', },
    { value: { hour: 15, minute: 0 }, label: '15:00', },
    { value: { hour: 15, minute: 30 }, label: '15:30', },
    { value: { hour: 16, minute: 0 }, label: '16:00', },
    { value: { hour: 16, minute: 30 }, label: '16:30', },
    { value: { hour: 17, minute: 0 }, label: '17:00', },
    { value: { hour: 17, minute: 30 }, label: '17:30', },
    { value: { hour: 18, minute: 0 }, label: '18:00', },
    { value: { hour: 18, minute: 30 }, label: '18:30', },
    { value: { hour: 19, minute: 0 }, label: '19:00' },
    { value: { hour: 19, minute: 30 }, label: '19:30' },
    { value: { hour: 20, minute: 0 }, label: '20:00' },
    { value: { hour: 20, minute: 30 }, label: '20:30' },
    { value: { hour: 21, minute: 0 }, label: '21:00' },
    { value: { hour: 21, minute: 30 }, label: '21:30' },
    { value: { hour: 22, minute: 0 }, label: '22:00' },
    { value: { hour: 22, minute: 30 }, label: '22:30' },
    { value: { hour: 23, minute: 0 }, label: '23:00' },
    { value: { hour: 23, minute: 30 }, label: '23:30' },
    { value: { hour: 24, minute: 0 }, label: '24:00' },
  ]
  flterDay: any[];
  constructor(
    private _authenticationService: AuthenticationService, 
    private formBuilder:FormBuilder,
    private tost : ToastrManager,
    private dataService:DataService,
    private location: Location,
    private aCtRoute : ActivatedRoute,
    private _router : Router,

  ) { 
    this.aCtRoute.params.subscribe(
      res => {
          this.prmsUsrId = res;
      }
    )
    this._authenticationService.currentUser.subscribe((x: any) => {
      this.currentUser = x
      
    });
   
  }
  public contentHeader: object;
   formNotification: any;
  currentUser:any;
  loading:boolean = false;
  dropdownList:any = [];
  dropdownSettings = {};
  dropdownSettings1 = {};
  allDays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];
  
  ngOnInit(): void {
   
    this.getUserId()
    this.formNotification = this.formBuilder.group({
      user_name: ['', Validators.required],
      frequency: ['', Validators.required],
      timing: ['', Validators.required],
      // template_name: ['', Validators.required],
      group_name: ['', Validators.required],
      seltDepart: ['', Validators.required],
    })
    this.contentHeader = {
      headerTitle: this.prmsUsrId?.id ? 'Edit Notification' : 'Add Notification',
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
            name: 'Notification',
            isLink: true,
            link: '/management'
          }
        ]
      }
    };

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'first_name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

    this.dropdownSettings1 = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

    if(this.currentUser.prmsnId == 1){
      this.getDepartment()
    }
  }

  getNotificationById(){
    let data = {
      id : this.prmsUsrId.id,
    }
    this.dataService.getNotificationById(data).subscribe((res:any)=>{
      if(!res.err){
       let usrId =  JSON.parse( res.body[0].user_id)
       let dyas =  JSON.parse( res.body[0].frequency)
        
       for(let i = 0; i < usrId.length; i++){
        this.flterUser= this.allUsers.filter(p=>{if(usrId.includes( p.id)){ return p}})
        } 
        for(let i = 0; i < dyas.length; i++){
          this.flterDay= this.allDays.filter(p=>{if(dyas.includes( p)){ return p}})
          }
        
        
        this.formNotification.patchValue({
          frequency:this.flterDay,
          timing:res.body[0].timing,
          // template_name:res.body[0].template_name,
          group_name:res.body[0].group_name,
          seltDepart:res.body[0].department,
          user_name:this.flterUser,
               })
    
       }
      else{
        this.tost.errorToastr('Something went wrong please try again leter')
      }
    },err=>{
        this.dataService.genericErrorToaster()
    })
  }

  onItemSelect(item: any) {
    
  }
  onSelectAll(items: any) {
    
  }

  get FormData_Control() {
    return this.formNotification.controls;
  }

  
  goBack(){
    this.location.back()
  }

  submitted(){
    for (let item of Object.keys(this.FormData_Control)) {
      this.FormData_Control[item].markAsDirty()
    }
    if (this.formNotification.invalid) {
      return;
    }
    if(this.prmsUsrId?.id){
      let comId=[] 
      this.formNotification.value.user_name.filter(i=> comId.push(i.id))
      this.loading=  true;
      let data ={
        user_id :comId,
        community_id : this.currentUser.id,
        // template_name : this.formNotification.value.template_name,
        group_name :  this.formNotification.value.group_name,
        frequency :  this.formNotification.value.frequency,
        timing :  this.formNotification.value.timing,
        department :  this.formNotification.value.seltDepart,
          id:this.prmsUsrId.id
      }
        this.dataService.editNotification(data).subscribe((res:any)=>{
          
          if(!res.error){
              this.loading=  false;
            this.tost.successToastr(res.msg)
            this._router.navigate(['/admin-notifications'])
          }else{
            this.loading=  false;
            this.tost.errorToastr(res.msg)
          }
        },err=>{
          this.loading=  false;
          this.dataService.genericErrorToaster()
        })
    }else{
      let comId=[] 
       this.formNotification.value.user_name.filter(i=> comId.push(i.id))
      let data ={
        user_id : comId,
        community_id : this.currentUser.id,
        // template_name : this.formNotification.value.template_name,
        group_name :  this.formNotification.value.group_name,
        frequency :  this.formNotification.value.frequency,
        timing :  this.formNotification.value.timing,
        department :  this.formNotification.value.seltDepart
      }
      this.loading=  true;
        this.dataService.addNotification(data).subscribe((res:any)=>{
          
          if(!res.error){
              this.loading=  false;
            this.tost.successToastr(res.msg)
            this._router.navigate(['/admin-notifications'])
          }else{
            this.loading=  false;
            this.tost.errorToastr(res.msg)
          }
        },err=>{
          this.loading=  false;
          this.dataService.genericErrorToaster()
        })
    }

  }

  getUserId() {
    let data = {
      comId : this.currentUser.id,
      is_for : 'community',
      searchStr : ''
    }
    this.dataService.getUserById(data.searchStr,data.comId, data.is_for).subscribe((res: any) => {
      this.allUsers = res.body.sort(function(a, b){
        if(a.first_name.toUpperCase() < b.first_name.toUpperCase()) { return -1; }
        if(a.first_name.toUpperCase() > b.first_name.toUpperCase()) { return 1; }
        return 0;
    })  ;;
    if(this.prmsUsrId.id){this.getNotificationById()}
    
      this.allUsers.map(i=>{
        if(i.first_name && i.last_name){
        i.first_name =  i.first_name +' '+ i.last_name
        }
      })
    }
    )
  }

  getDepartment(){
    this.dprtmnt =[]
    let isfor =  6
    let for_other = null
    this.dataService.getDepartmentListing(this.currentUser.id,isfor,for_other).subscribe((res:any)=>{
      this.dprtmnt = res.body.sort(function(a, b){
        if(a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
        if(a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
        return 0;
    });
    // this.frstDp = this.dprtmnt[0]?.name
    // 
    
    },err=>{
      this.tost.errorToastr('Something went wrong please try again leter')
    })
  }

}
