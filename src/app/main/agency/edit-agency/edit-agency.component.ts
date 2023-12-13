import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDateStruct, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'app/auth/models';
import { AuthenticationService, UserService } from 'app/auth/service';
import { EncryptionService } from 'app/utils/encryption/encryption.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DataService } from 'app/auth/service/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Patterns } from 'app/auth/helpers/patterns';
import { MustMatch } from 'app/auth/helpers';
import { Location } from '@angular/common';
import StatesJson from 'assets/states.json';
import { StaticServiceService } from 'app/utils/static-service.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-edit-agency',
  templateUrl: './edit-agency.component.html',
  styleUrls: ['./edit-agency.component.scss']
})
export class EditAgencyComponent implements OnInit {
  States:any = StatesJson;
  @ViewChild('enable2fa') enable2fa: ElementRef<any>;
  @ViewChild('disable2fa') disable2fa: ElementRef<any>;
  @ViewChild('antiPhishingModal') antiPhishingModal: ElementRef<any>;
  @ViewChild('file', { static: false }) fileupload: ElementRef;
  public contentHeader: object;
  public updatePersonalInfo: FormGroup;
  public data: any;
  public subsAll: any[] = [];
  public currentUser: User;
  public dob: NgbDateStruct;
  loading: boolean;
  error: any;
  success: any;
  file: File;
  isLoading: boolean;
  logLoading: boolean;
  logs: any[] = [];
  curComDetails: any;
  comunityId: any;
  uptingVerification: boolean;
  selectedImageIndex = 0;
  showFlag: boolean;
  imageObject: any[] = [];
  formData!: FormGroup;
  confirmForm!: FormGroup;
  Servey!: FormGroup;
  radioData!: FormGroup;
  managementServey!: FormGroup;
  addAccTo!: FormGroup;
  contractform!: FormGroup;
  id: any;
  btnShow: boolean = false;
  tempCmntyId: any;
  activeTab: number = 1;
  userid: any;
  state:any;
  brdLbl: any;
  fileToUpload: any;
  selectedDataValue  = "+1";
  phoneUsd: { name: string; flag: string; code: string; dial_code: string; }[];
  allCommunity: any;
	fromDate: NgbDate | null;
	toDate: NgbDate | null;
	hoveredDate: NgbDate | null = null;
	closeResult = '';
  errTru: boolean;
  comId:any;
  updateCom!: FormGroup;
  AgncyCommunity: any =[]
  submitId2: any[] =[]

  constructor(
    private _authenticationService: AuthenticationService,
    public _userService: UserService,
    private encryptionService: EncryptionService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    public toastr: ToastrManager,
    private dataService: DataService,
    private aCtRoute: ActivatedRoute,
    private fb: FormBuilder,
    private rout :Router,
    private loctn : Location,
    private phoneService : StaticServiceService,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private dataSrv : DataService,
    private toaster : ToastrManager,
    ) 
    {
      this.phoneUsd = this.phoneService.phoneUsdCode
      this.aCtRoute.params.subscribe(
        res => {
          if (res) {
            this.comunityId = res.id
            // this.getCommunityId()
            this.getagencyDetails(res);
          }
        }
      )
      this.subsAll.push(this._authenticationService.currentUser.subscribe(x => (this.currentUser = x)));
      this.updatePersonalInfo = this.formBuilder.group({
        first_name: ['', Validators.required],
        last_name: ['', Validators.required],
        driving_licence: ['', Validators.required],
        address: ['',],
        phone: ['',],
        age: ['',],
        gender: ['', Validators.required],
      });

      this.addAccTo = this.fb.group({
        trak_type: ['0'],
      });
      this.updateCom = this.formBuilder.group({
        com_id: ['', Validators.required],
      });

      this.currentUser = this._authenticationService.currentUserValue;
      this.getCommunityId()
      this.getAgncyCom()
      this.fromDate = calendar.getToday();
      this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
  
  }
    dropdownSettings: IDropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'community_name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      closeDropDownOnSelection: true,
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

    mapCountry_selected(data){
      return this.selectedDataValue = data.dial_code;
    }
    get profileForm() {
      return this.updatePersonalInfo.controls;
    }

    ngOnInit(): void {
      this.comId = this.currentUser.id
      this.state = this.States
     

      setTimeout(() => {
        this.formData.get('agency_phone').setValue(this.formData.value.agency_phone);
        this.formData.get('agency_contact_cell_number').setValue(this.formData.value.agency_contact_cell_number);
      }, 1100)
      // content header
      setTimeout(() => {
        this.contentHeader = {
          headerTitle: 'Agency ',
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
                name: 'Agency ',
                isLink: true,
                link: '/agency'
              },
              {
                name: this.brdLbl,
                isLink: false,
                link: '/agency'
              },
            ]
          }
        };
      }, 500);

      this.contractform = this.fb.group({
        contract_start_date:['',[Validators.required]],
        contract_end_date:['',[Validators.required]],
        fileToUpload:['',[Validators.required]]
      })
  
      this.formData = this.fb.group({
        agency_name: ['', [Validators.required]],
        agency_phone: ['', [Validators.required, Validators.pattern(Patterns.number)]],
        agency_email: ['', [Validators.email]],
        agency_website: ['', [Validators.required]],
        state: ['',[ Validators.required]],
        show_shift_user: ['',[ Validators.required]],
        address1: ['', [Validators.required]],
        username: [''],
        sort_name: [''],
        address2: [''],
        city: ['',[ Validators.required]],
        // community_id: ['',[ Validators.required]],
        zipcode: ['',[ Validators.required]],
        agency_contact_firstname: ['',[ Validators.required]],
        agency_contact_lastname: ['',[ Validators.required]],
        agency_contact_person_title: ['',[ Validators.required]],
        agency_contact_cell_number: ['', [Validators.required, Validators.pattern(Patterns.number)]],
        agency_contact_email_address: ['', [Validators.required, Validators.email]],
        // primary_contact_person: ['',[ Validators.required]],
        // primary_contact_phone: ['', [Validators.required, Validators.pattern(Patterns.number)]],
        // primary_contact_email: ['', [Validators.required, Validators.pattern(Patterns.email)]],
        // community_name: ['', Validators.required],
      })
  
      this.confirmForm = this.fb.group({
        id: this.id ? this.id : '',
        password: ['', [Validators.required, Validators.pattern(Patterns.password)]],
        newPassword: ['', [Validators.required, Validators.pattern(Patterns.password)]],
        confPassword: ['', [Validators.required]],
      },
        {
          Validators: MustMatch('confPassword', 'newPassword' )
        })

        if(this.currentUser.role == 'SuperAdmin')
         {
          this.confirmForm.controls['password'].clearValidators();
          this.confirmForm.updateValueAndValidity();
        }
        else
        {
          this.confirmForm.controls['password'].setValidators(Validators.required);
           this.confirmForm.updateValueAndValidity();
        }
        if(this.currentUser.prmsnId == '1'){
          this.updateCom.controls['com_id'].clearValidators()
        }
        else if(this.currentUser.prmsnId != '1')
        {
          this.updateCom.controls['com_id'].setValidators(Validators.required);
           this.updateCom.updateValueAndValidity();
        }
        this.getCmAccess();
    }

   

    @ViewChild('fileInput') elfile: ElementRef;
    onFileInput(files: any) {
      if (files.length === 0) {
        return;
      }
      let type = files[0].type;
      this.fileToUpload = files[0];

    }
  
    uploadNow() {
      
      let formdata2 = new FormData();
      formdata2.append('docFile',this.fileToUpload)
      formdata2.append('agency_id',this.comunityId)
      formdata2.append('community_id',this.comId)
      formdata2.append('contract_start_date',this.contractform.value.contract_start_date)
      formdata2.append('contract_end_date',this.contractform.value.contract_end_date)
    
  
      this.dataSrv.uploadAgencyContract(formdata2).subscribe(
        (res:any) => {
          if (!res.error) {
            this.toaster.successToastr("Contract Upload Successful")
            // this.getLedger()
          } else {
            this.toaster.errorToastr(res.msg)
          }
      }, (error:any) => {
        this.dataSrv.genericErrorToaster()
      }
      )}
    get contractform_Control() {
      return this.contractform.controls
    }

    getCmAccess(){
      this.dataService.getCMAccessByID(this.comunityId).subscribe((res: any) => {
        if (!res.error) {
            
            if(res['body']['0']){
              let last:any = res['body'][res['body'].length-1];
              this.addAccTo.patchValue({
                trak_type: last.access_to,
              });
              let validDate = new Date(last.start_date * 1000).toISOString(); 
              let d = new Date(validDate);
               
              let endDate  = new Date(last.end_date * 1000).toISOString(); 
              let e = new Date(endDate);
               this.fromDate.year=d.getFullYear();
               this.fromDate.month=d.getMonth()+1;
               this.fromDate.day=d.getDate();
               this.toDate.year=e.getFullYear();
               this.toDate.month=e.getMonth()+1;
               this.toDate.day=e.getDate();
            }
           
         }else{
          
       }
      }, (err: any) => {
        this.dataService.genericErrorToaster()
        this.btnShow = false;
      })
      
    }
    get FormData_Control() {
      return this.addAccTo.controls
    }

    getagencyDetails(data) {
      this.loading = true;
      // let id = this.comunityId;
      this._userService.getagencyDetails(data.id).subscribe(response => {
        if (!response.error) {
  
          if (response.body && response.body[0] && response.body[0]) {
            this.curComDetails = response.body[0];
          this.mapFormValues();
          this.brdLbl = this.curComDetails.agency_name
          this.mapFormValues();
          }
        } else {
          this.error = response.msg;
          this._authenticationService.errorToaster(response);
        }
        this.loading = false;
      }, error => {
        this.error = error;
        this.loading = false;
      }
      );
    }
  
    mapFormValues() {
      if(this.curComDetails){
        // let departmentArr = this.allCommunity.filter(d => d.id == this.curComDetails.community_id);
      this.formData.patchValue({
        agency_name: this.curComDetails.agency_name,
        agency_phone: this.curComDetails.agency_phone,
        agency_email: this.curComDetails.agency_email,
        agency_website: this.curComDetails.agency_website,
        address1: this.curComDetails.address1,
        address2: this.curComDetails.address2,
        city: this.curComDetails.city,
        show_shift_user: this.curComDetails.show_shift_user,
        state: this.curComDetails.state,
        // community_id: departmentArr,
        zipcode: this.curComDetails.zipcode,
        agency_contact_firstname: this.curComDetails.agency_contact_firstname,
        agency_contact_lastname: this.curComDetails.agency_contact_lastname,
        agency_contact_person_title: this.curComDetails.agency_contact_person_title,
        username: this.curComDetails.username,
        sort_name: this.curComDetails.sort_name,
        agency_contact_cell_number: this.curComDetails.agency_contact_cell_number,
        agency_contact_email_address: this.curComDetails.agency_contact_email_address,
      });
     
    }
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
        community_id:this.comunityId,
        access_to:this.addAccTo.value.trak_type ,
        start_date:new Date(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day),
        end_date:new Date(this.toDate.year, this.toDate.month - 1, this.toDate.day),
       }
       
       this.loading=  true;
       this.dataService.addCMAccessTo(input_data).subscribe((res: any) => {
        if (!res.error) {
          this.toastr.successToastr(res.msg);
          this.loading=  false;
    
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
  
    }
    
    open(content) {
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        },
      );
    }
  
    private getDismissReason(reason: any): string {
      if (reason === ModalDismissReasons.ESC) {
        return 'by pressing ESC';
      } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
        return 'by clicking on a backdrop';
      } else {
        return `with: ${reason}`;
      }
    }

    chckBx(e,index){
      
      if(e.target.checked){
        this.errTru =false
      }
    }
    
    changeDatetoNgStructr(date: any): NgbDateStruct {
      let da = new Date(date);
      da = !isNaN(da.getTime()) ? da : new Date();
      return {
        year: da.getFullYear(),
        month: da.getMonth() + 1,
        day: da.getDate(),
      }
    }
  
    changeNgStructrToDate(date: any) {
      let dt = new Date();
      return (date && date.year)
        ? `${date.year}-${date.month}-${date.day}`
        : `${dt.getFullYear()}-${dt.getMonth() + 1}-${dt.getDate()}`;
    }
  
  
   
    modalOpenOSE(modalOSE) {
      this.modalService.open(modalOSE,
        {
          backdrop: false,
          centered: true,
        }
      );
    }
  
    closed(modal: NgbModalRef) {
      modal.dismiss();
    }

    get comCn() {
           return this.updateCom.controls
         }
         
  
  
    fileChange(file) {
      this.file = file.target.files[0];
      if (this.file != undefined && this.file != null) {
        var strFileName = this.getFileExtension1(this.file.name);
        if (strFileName != 'jpeg' && strFileName != 'png' && strFileName != 'jpg') {
          this.toastr.errorToastr('Please select correct image format', '', {
            position: 'bottom-right'
          });
          return;
        }
      } else {
        this.toastr.errorToastr('Please select image', '', {
          position: 'bottom-right'
        });
        return;
      }
      var input_data = {
        "profile_pic": this.file == undefined ? "" : this.file
      }
  
      const formData = new FormData();
      formData.append('profilePic', input_data.profile_pic);
      formData.append('id', this.comunityId);
  
      //const httpOptions = { headers: new HttpHeaders({'token': this.token})};
      this.isLoading = true;
      this._userService.uploadProfilePic(formData).subscribe((res) => {
        if (!res['error']) {
          this.curComDetails.profile_pic = res['body'][0].profilePic;
          this.fileupload.nativeElement.value = "";
          this.isLoading = false;
          this.toastr.successToastr('Profile picture updated successfully');
        } else {
          this.isLoading = false;
          this.fileupload.nativeElement.value = "";
          this.toastr.errorToastr(res['msg']);
        }
      }, error => {
        this.isLoading = false;
        this.fileupload.nativeElement.value = "";
        this.toastr.errorToastr(error);
      })
  
    }
  
    getFileExtension1(filename) {
      return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename)[0] : undefined;
    }
    /**
     * Clear all subscriptions
    */
    ngOnDestroy() {
      this.subsAll.map(
        item => {
          item.unsubscribe();
          item = null;
        }
      )
    }
  
    closeEventHandler() {
      this.showFlag = false;
      this.imageObject = [];
      this.selectedImageIndex = -1;
      let b = document.body;
      b.style.overflow = 'unset';
    }
  
    get controls() {
      return this.formData.controls;
    }
  
    get pControls() {
      return this.confirmForm.controls
    }

  
    submitted() {
      for (let item of Object.keys(this.controls)) {
        this.controls[item].markAsDirty()
      }
      if (this.formData.invalid) {
        return;
      }
      else {
        if(this.formData.value?.community_id?.length){
          this.formData.value?.community_id.forEach(element => {
            this.submitId2.push(element.id)
          });
        }
        this.btnShow = true;
        let body1={
          agency_name: this.formData.value.agency_name,
          agency_phone: this.formData.value.agency_phone.replace(/\D/g, ''),
          agency_email: this.formData.value.agency_email,
          agency_website: this.formData.value.agency_website,
          address1: this.formData.value.address1,
          address2: this.formData.value.address2,
          city: this.formData.value.city,
          show_shift_user: this.formData.value.show_shift_user,
          community_id: this.submitId2,
          state: this.formData.value.state,
          zipcode: this.formData.value.zipcode,
          username: this.formData.value.username,
          sort_name: this.formData.value.sort_name,
          agency_contact_firstname: this.formData.value.agency_contact_firstname,
          agency_contact_lastname: this.formData.value.agency_contact_lastname,
          agency_contact_person_title: this.formData.value.agency_contact_person_title,
          agency_contact_cell_number: this.formData.value.agency_contact_cell_number.replace(/\D/g, ''),
          agency_contact_email_address: this.formData.value.agency_contact_email_address,
          id:  this.comunityId,
          // primary_contact_person: this.formData.value.primary_contact_person,
          // primary_contact_email: this.formData.value.primary_contact_email,
      }
        this.dataService.editAgencies(body1).subscribe((res: any) => {
          if (!res.error) {
            this.toastr.successToastr(res.msg);
            this.tempCmntyId = res.body[0].id
            this.rout.navigateByUrl('/agency')
          } else {
            this.toastr.errorToastr(res.msg);
          }
          this.btnShow = false;
        },
          (err) => {
            this.btnShow = false;
            this.dataService.genericErrorToaster();
  
          })
      }
    }
  
    confirmSubmit() {
      for (let item of Object.keys(this.pControls)) {
        this.pControls[item].markAsDirty()
      }
      if (this.confirmForm.invalid) {
        return;
      }
      else {
        let data: any = this.confirmForm.value;
        data.id = this.comunityId;
        this.btnShow = true;
        this.dataService.updateAgencyPassword(data).subscribe((res: any) => {
          if (!res.error) {
            this.toastr.successToastr(res.msg);         
            this.btnShow = false;
            this.confirmForm.reset();
          }else{
            this.toastr.errorToastr(res.msg);         
            this.btnShow = false;
          }
        }, (err: any) => {
          this.dataService.genericErrorToaster()
          this.btnShow = false;
        })
      }
    
    }  

    goBack(){
      this.loctn.back()
    }

    getCommunityId() {
      this.dataService.getCommunityId().subscribe((response: any) => {
        if (response['error'] == false) {
          this.allCommunity = response.body.sort(function(a, b){
            if(a.community_name.toUpperCase() < b.community_name.toUpperCase()) { return -1; }
            if(a.community_name.toUpperCase() > b.community_name.toUpperCase()) { return 1; }
            return 0;
        });
          //this.toastr.successToastr(response.msg);
        } else if (response['error'] == true) {
          this.toastr.errorToastr(response.msg);
        }
      }, (err) => {
        this.dataService.genericErrorToaster();
  
      })
    }

    updateComSubmit(){
      for (let item of Object.keys(this.comCn)) {
        this.comCn[item].markAsDirty()
      }
      if (this.updateCom.invalid) {
        return;
      }
      this.btnShow = true;
      let slctCom = []
       this.updateCom.value.com_id.filter(i => slctCom.push(i.id))
      let data = {
        community_id : slctCom,
        agency_id : this.comunityId
      }
      this.dataService.updateAgencyCommunity(data).subscribe((res: any) => {
        if (!res.error) {
          this.toastr.successToastr(res.msg);
          // this.tempCmntyId = res.body[0].id
          this.rout.navigateByUrl('/agency')
        } else {
          this.toastr.errorToastr(res.msg);
        }
        this.btnShow = false;
      },
        (err) => {
          this.btnShow = false;
          this.dataService.genericErrorToaster();

        })
    }


    getAgncyCom(){
      this.dataService.getAgencyCommunity(this.comunityId).subscribe((response: any) => {
        if (response['error'] == false) {
          let comId =[ ]
          response.body.forEach(i=> comId.push(i.community_id))
           
           if(this.allCommunity){
            this.AgncyCommunity =  this.allCommunity.filter(i=> comId.includes(i.id) )
            
            this.updateCom.patchValue({
              com_id :  this.AgncyCommunity 
            })
           }
          
        } else if (response['error'] == true) {
          this.toastr.errorToastr(response.msg);
        }
      }, (err) => {
        this.dataService.genericErrorToaster();
  
      })
    }
    
  
}
  
