import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrManager } from 'ng6-toastr-notifications';
import * as uuid from 'uuid'
@Component({
  selector: 'app-add-spend-down',
  templateUrl: './add-spend-down.component.html',
  styleUrls: ['./add-spend-down.component.scss']
})
export class AddSpendDownComponent implements OnInit {
  public contentHeader: any;
  formRoleData: any;
  otherDepr: any;
  loading: boolean = false;
  prmsUsrId: any;
  allCommunity: any;
  currentUser: any;
  vendorData: any = []
  ledgerData: any = []
  paymentType: any = []
  comName: any;
  submitId2: any = []
  dprtmnt: any = []
  scldta: any = []
  minDate: string;
  todaysDate: string;
  ledgerData1: any = []
  ptchDprt: any;
  formData: FormGroup;
  @ViewChild('Addnew') Addnew: ElementRef<any>;
  @ViewChild('Addnew1') Addnew1: ElementRef<any>;
  @ViewChild('otdModal') otdModal: ElementRef<any>;
  roleData: any = []
  roleData1: any = []
  roleData2: any = []
  userName: any;

  items: FormArray;
  patchData: any;
  patchData1: any;
  venData: any = [];
  loadSpinner: boolean;
  comData: any = [];
  communityData: any;
  creteRecDsbl: any;
  myId: any[] = []
  duplicate: boolean;
  data: any;
  indx: any;
  conTrue: boolean;
  rcpt_id: any;
  dprtmnt1: any;
  iddd: any;
  new_cid: any;

  constructor(
    private formBuilder: FormBuilder,
    private location: Location,
    private dataSrv: DataService,
    private toaster: ToastrManager,
    private aCtRoute: ActivatedRoute,
    private _router: Router,
    private _authenticationService: AuthenticationService,
    private modalService: NgbModal,

  ) {
    this.getRole()
    this.aCtRoute.params.subscribe(
      res => {
        this.prmsUsrId = res;
      }
    )
    this.scldta = this.dataSrv.getData()
    this._authenticationService.currentUser.subscribe((x: any) => {
      this.currentUser = x
    })
    if (this.prmsUsrId?.id) {
      this.loadSpinner = true;
    }
    let today = new Date();
    this.todaysDate = this.getDate(today)

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
      headerTitle: this.prmsUsrId?.id ? 'Edit Spend Down' : 'Add Spend Down',
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
            name: 'Spend Down',
            isLink: true,
            link: '/spend_down'
          }
        ]
      }
    };



    this.formRoleData = new FormGroup({
      // community_name: [''],
      // purchage_date: [this.minDate],
      // vendor: [''],
      // description: [''],
      // gl_account : [''],
      // amount: [''],
      // pmt_type: [''],
      // department: [''],
      // final: [''],
      // entered_by: [this.currentUser?.id],
      // start_date:[''],
      // invoice_date:[''],
      // invoice_number:['']

      items: new FormArray([]),
    })

    this.otherDepr = this.formBuilder.group({
      community_name: this.currentUser?.prmsnId == '6' ? ['', Validators.required] : [''],
      department: ['', Validators.required],
      vendor: ['', Validators.required],
      description: ['', Validators.required],
      gl_account: ['', Validators.required],
      amount: ['', Validators.required],
      pmt_type: ['', Validators.required],
      final: ['', Validators.required],
      receipt_id: ['', Validators.required],
      purchage_date: [this.minDate, Validators.required],
      entered_by: [''],
      invoice_number: [''],
      entered_date: [this.minDate],
    })

    this.addItem();
    this.getType()

    this.formData = this.formBuilder.group({
      newVendor: ['', Validators.required],
      description: ['', Validators.required],
    })

    if (this.currentUser?.prmsnId == 6 || this.currentUser?.user_role == 3 || this.currentUser?.user_role == 8) {
      this.getCommunityId()
    }
    this.currentUser?.user_role == 1 ? this.getCommunityDetails() : ''

    // if(this.scldta && !(this.prmsUsrId?.id)){
    //   this.patchVal()
    // }

    if (this.prmsUsrId?.id) {
      if (this.currentUser?.user_role != 8) {
        this.getCommunityDetails()
      }
      this.getSpendDownList()
    }

    // if(this.roleData1.includes(this.currentUser?.prmsnId))
    // {
    //  this.formRoleData.controls['com_name'].clearValidators();
    //  this.formRoleData.updateValueAndValidity();
    // }
    // if(['6'].includes(this.currentUser?.prmsnId))
    // {
    //  this.formRoleData.controls['com_name'].setValidators(Validators.required);
    //  this.formRoleData.updateValueAndValidity();
    // }

  }

  goBack() {
    this.location.back()
  }

  get FormData_Control() {
    return this.formRoleData.controls;
  }

  get ogt() {
    return this.otherDepr.controls;
  }

  submitted(no) {
    Object.keys(this.formRoleData.controls.items.controls).forEach(
      (fg: any) => {
        Object.keys(this.formRoleData.controls.items.controls[fg].controls).forEach(
          fc => {
            if (fc != 'department') {
              this.formRoleData.controls.items.controls[fg].controls[fc].markAsDirty()
            }
          }
        )
      }
    )

    if (this.formRoleData.invalid) {
      this.toaster.errorToastr('Fill the required fields')
      return;
    }

    if (this.prmsUsrId?.id) {
      this.loading = true;
      // let data ={
      //   id:this.prmsUsrId.id,
      //   community_name:this.roleData1.includes(this.currentUser?.prmsnId) ? this.comName.community_name:this.submitId2[0].community_name,
      //   purchage_date:body.purchage_date,
      //   vendor: body.vendor,
      //   description:body.description,
      //   gl_account:body.gl_account,
      //   amount:body.amount,
      //   department:body.department,
      //   pmt_type: body.pmt_type,
      //   final: body.final,
      //   entered_by:this.currentUser?.id,
      //   start_date:this.minDate,
      //   // invoice_date:this.formRoleData.value.invoice_date,
      //   invoice_number:this.formRoleData.value.invoice_number

      // }

      this.items.value.forEach(i => {
        i.community_name = this.currentUser?.user_role == 8 ? this.submitId2[0]?.community_name : this.roleData1.includes(this.currentUser?.prmsnId) || this.currentUser?.user_role == 1 ? this.comName?.community_name : this.submitId2[0]?.community_name
        i.id = parseInt(this.prmsUsrId.id)
      }
      )
      this.items.value.filter(element => {
        element.vendor = element.vendor[0].vendor_name
      });
      
      this.dataSrv.editSpendDown(this.items.value[0]).subscribe((res: any) => {

        if (!res.error) {
          this.loading = false;
          this.toaster.successToastr(res.msg)
          this._router.navigate(['/spend_down'])
        } else {
          this.loading = false;
          this.toaster.errorToastr(res.msg)
        }
      }, err => {
        this.loading = false;
        this.dataSrv.genericErrorToaster()
      })
    }
    else {
      this.loading = true;
      this.items.value.forEach((i: any) => {
        i.community_name = this.currentUser?.user_role == 8 ? this.submitId2[0]?.community_name : this.roleData1.includes(this.currentUser?.prmsnId) ? this.comName?.community_name : this.submitId2[0]?.community_name
        i.entered_by = this.currentUser?.id
      })
      // let data  = {spend_array : this.items.value}

      // let data ={
      //   community_name: this.roleData1.includes(this.currentUser?.prmsnId) ? this.comName.community_name:this.submitId2[0].community_name,
      //   purchage_date:body.pur_date,
      //   vendor: body.vendor,
      //   description:body.desc,
      //   gl_account:body.gl_acc,
      //   amount:body.amount,
      //   department:body.department,
      //   pmt_type: body.pay_type,
      //   final: body.final,
      //   entered_by:this.currentUser?.id,
      //   start_date:this.minDate,
      //   // invoice_date:this.formRoleData.value.invoice_date,
      //   invoice_number:this.formRoleData.value.invoice_number

      // }
      this.venData = this.vendorData.filter(i => i.vendor_name.includes(this.items.value.vendor))
      this.items.value.filter(element => {
        element.vendor = element.vendor[0].vendor_name
      });
      this.items.value.map(i=>{i.amount = JSON.stringify(i.amount); return i})
      
      // return;
      // this.slctCom(this.items.value.community_name,this.items.value.department,this.items.value.gl_account)
      this.dataSrv.addSpendDown(this.items.value).subscribe((res: any) => {

        if (!res.error) {
          this.loading = false;
          this.toaster.successToastr(res.msg)
          this.createItem()
          if (no == 1) {
            this.otrDept(this.items.value)
            this.items.reset()
          }
          else {
            this._router.navigate(['/spend_down'])
          }
        } else {
          this.loading = false;
          this.toaster.errorToastr(res.msg)
        }
      }, err => {
        this.loading = false;
        this.dataSrv.genericErrorToaster()
      })
    }
    this.getCommunityDetails()
  }



  getCommunityId() {
    if (this.currentUser?.user_role != 3 && this.currentUser?.user_role != 8) {
      this.dataSrv.getCommunityId().subscribe((response: any) => {
        if (response['error'] == false) {
          this.communityData = response.body;
          this.allCommunity = response.body.sort(function (a, b) {
            if (a.community_name.toUpperCase() < b.community_name.toUpperCase()) { return -1; }
            if (a.community_name.toUpperCase() > b.community_name.toUpperCase()) { return 1; }
            return 0;
          });
          //this.toastr.successToastr(response.msg);
        } else if (response['error'] == true) {
          this.toaster.errorToastr(response.msg);
        }
      }, (err) => {
        this.dataSrv.genericErrorToaster();

      })
    }
    else {
      if (this.currentUser?.id && this.currentUser?.com_id) {
        let data = {
          userId : this.currentUser?.id,
          mangId : this.currentUser?.management
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
            // this.com_name =  this.allCommunity[0]?.community_id
          } else {
            this.toaster.errorToastr(res.msg);
          }
        },
          (err) => {
            this.dataSrv.genericErrorToaster();
          })
      }
      else {
        this.dataSrv.getMNMGcommunity(this.currentUser?.id).subscribe((response: any) => {
          if (response['error'] == false) {
            this.allCommunity = response.body.sort(function (a, b) {
              if (a.community_name.toUpperCase() < b.community_name.toUpperCase()) { return -1; }
              if (a.community_name.toUpperCase() > b.community_name.toUpperCase()) { return 1; }
              return 0;
            });
            // this.com_name =  this.allCommunity[0]?.cp_id
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

  getSpendDownList() {
    let data = {
      id: this.prmsUsrId.id,
      community_id: 'id'
    }
    this.dataSrv.getSpendDownById(data).subscribe((res: any) => {
      if (!res.err) {
        this.patchData = res.body;
        // this.ptchDprt = res.body[0].department
        // this.slctCom(res.body[0].community_id,3)
        // console.log(res.body,'ekjnrfjekrnfekj');

        if (['6'].includes(this.currentUser?.prmsnId) || this.currentUser?.user_role == 8 || this.currentUser?.user_role == 3) {
          this.comData = this.allCommunity?.filter(i => i.community_name.includes(res.body[0].community_name))
        }
        setTimeout(() => {
          this.venData = this.vendorData.filter(i => i.vendor_name.includes(res.body[0].vendor))
          Object.keys(this.formRoleData.controls.items.controls).forEach(
            (fg: any) => {
              Object.keys(this.formRoleData.controls.items.controls[fg].controls).forEach(
                (fc: any) => {
                  if (fc == 'amount') {
                    this.formRoleData.controls.items.controls[fg].controls[fc].setValue(res.body[0][fc].toFixed(2))
                  }
                  else if (fc == 'vendor') {
                    this.formRoleData.controls.items.controls[fg].controls[fc].setValue(this.venData)
                  }
                  else if ([6, 3, 8].includes(this.currentUser?.user_role) && fc == 'community_name') {
                    setTimeout(() => {
                      this.formRoleData.controls.items.controls[fg].controls[fc].setValue(this.comData[0].community_id || this.comData[0].cp_id || this.comData[0].id)
                    }, 500);
                  }
                  else {
                    this.formRoleData.controls.items.controls[fg].controls[fc].setValue(res.body[0][fc])
                    if (fc == 'department') {
                      this.ptchDprt = res.body[0][fc].trim()
                      // if(this.ptchDprt){
                      //   this.chngD(this.ptchDprt)
                      //  }
                    }

                  }
                  //  console.log(fc,'FCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC');       
                }
              )
            }
          )
          if (res.body[0]['pmt_type'].trim() == 'Contract') { this.conTrue = true }
        }, 1500);
        if (['6'].includes(this.currentUser?.prmsnId)) {
          this.slctCom(this.comData[0].id, 3, this.ptchDprt)
        }
        if (!['6'].includes(this.currentUser?.prmsnId)) {
          this.slctCom(res.body[0].community_id, 3, this.ptchDprt)
        }
        // console.log(this.formRoleData.controls.items.controls)


      }
      else {
        this.toaster.errorToastr('Something went wrong please try again leter')
      }
      this.loadSpinner= false;
    }, err => {
      this.dataSrv.genericErrorToaster()
    })
  }

  slctCom(e, no, dpt?) {
    this.submitId2 = []
    this.dprtmnt = []
    
    let comId = this.new_cid= (e?.target?.value ? e?.target?.value : e)
    if (this.currentUser?.user_role != 3) {
      this.allCommunity?.forEach(element => {
        if ((element.id || element.community_id) == comId) this.submitId2.push(element)
      });
    } else {
      this.allCommunity?.forEach(element => {
        if (element.cp_id == comId) this.submitId2.push(element)
      });
    }

    this.ledgerData = []
    this.getvendors(comId)
    if (!this.roleData2.includes(this.currentUser?.prmsnId) && this.currentUser?.user_role != 4) {
      this.getDepartment(no == 2 ? e : no == 3 ? e : e.target.value)
    } else if (this.roleData2.includes(this.currentUser?.prmsnId) || this.currentUser?.user_role == 4) {
      this.getPrmsnData()
    }
    if (this.currentUser?.user_role == 8) {
      this.getDepartment(no == 2 ? e : no == 3 ? e : e.target.value)
    }
    let data = {
      id: no == 2 ? e : no == 3 ? e : e.target.value,
      community_id: 'community_id'
    }
    this.dataSrv.getLedgerById(data).subscribe((res: any) => {
      if (!res.err) {
        this.ledgerData = res.body.sort(function(a,b){
          if (a.gl_acc.toUpperCase() < b.gl_acc.toUpperCase()) { return -1; }
          if (a.gl_acc.toUpperCase() > b.gl_acc.toUpperCase()) { return 1; }
        }
        )
        // this.loadSpinner = false
        if (this.ptchDprt) {
          this.chngD(dpt)
        }
        //   .sort(function(a, b){
        //     if(a.toUpperCase() < b.toUpperCase()) { return -1; }
        //     if(a.toUpperCase() > b.toUpperCase()) { return 1; }
        //     return 0;
        // })  ;
        // .filter(i=>{
        //       if ( i.gl_and_description) {this.ledgerData.push(i.gl_and_description)}
        //       });



      }
      else {
        this.loadSpinner = false
        this.toaster.errorToastr('Something went wrong please try again leter')
      }
    }, err => {
      this.loadSpinner = false
      this.dataSrv.genericErrorToaster()
    })
  }

  chngD(e) {
    let d = e?.target?.value || e 
    this.ledgerData1 = this.ledgerData.filter(i => i.department == d)
    if (!e?.target?.value && this.ptchDprt) {
      this.ledgerData1 = this.ledgerData.filter(i => i.department == this.ptchDprt).sort(function (a, b) {
        if (a.gl_acc.toUpperCase() < b.gl_acc.toUpperCase()) { return -1; }
        if (a.gl_acc.toUpperCase() > b.gl_acc.toUpperCase()) { return 1; }
      });
    }
    this.loadSpinner = false
  }

  getvendors(comId2) {
    this.vendorData = []
    if (comId2) {
      this.data = { usrRole: !comId2 ? '6' : 'xyz', comId: !comId2 ? '' : comId2 }
    } else {
      this.data = { usrRole: this.currentUser?.prmsnId == '6' ? '6' : '', comId: this.currentUser?.prmsnId == '6' ? '' : this.currentUser?.prmsnId == '1' ? this.currentUser?.id : this.currentUser?.com_id }
    }
    this.dataSrv.getVendor(this.data).subscribe((res: any) => {
      
      if (!res.err) {
        this.vendorData = res.body.sort(function (a, b) {
          if (a.vendor_name.toUpperCase() < b.vendor_name.toUpperCase()) { return -1; }
          if (a.vendor_name.toUpperCase() > b.vendor_name.toUpperCase()) { return 1; }
          return 0;
        });
        //  .filter(i=>{
        //   if ( i.vendor_name) {this.vendorData.push(i.vendor_name)}
        //   });



      }
      else {
        this.toaster.errorToastr('Something went wrong please try again leter')
      }
    }, err => {
      this.dataSrv.genericErrorToaster()
    })
  }

  getControlsOfArray(i) {
    return this.formRoleData.controls.items.controls[i].controls
  }


  getType() {
    this.paymentType = []
    this.dataSrv.getPaymentType().subscribe((res: any) => {
      if (!res.err) {
        res.body.filter(i => {
          if (i.name != 'Reconciliation') { this.paymentType.push(i.name) }
        });

        this.paymentType.sort(function (a, b) {
          if (a.toUpperCase() < b.toUpperCase()) { return -1; }
          if (a.toUpperCase() > b.toUpperCase()) { return 1; }
          return 0;
        });
        // console.log(this.paymentType);

      }
      else {
        this.toaster.errorToastr('Something went wrong please try again leter')
      }
    }, err => {
      this.dataSrv.genericErrorToaster()
    })
  }

  getCommunityDetails() {
    let id = this.currentUser?.prmsnId == '1' ? this.currentUser?.id : this.currentUser?.com_id
    this.dataSrv.getcommunityById(id).subscribe(response => {
      if (!response.error) {
        this.comName = response.body[0]
        if (this.roleData2.includes(this.currentUser?.prmsnId)) {
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

  getUserDtl() {
    let is_for = 'user'
    let searchStr = ''
    this.dataSrv.getUserById(searchStr = '', this.currentUser?.id, is_for).subscribe(response => {
      if (!response.error) {
        this.userName = response.body[0]
      } else {
        this._authenticationService.errorToaster(response);
      }
    }, error => {
      this.dataSrv.genericErrorToaster()
    }
    );
  }

  getDepartment(e) {
    this.dprtmnt = []
    let isfor = 6
    let for_other = null
    this.dataSrv.getDepartmentListing(e, isfor, for_other).subscribe((res: any) => {
      this.dprtmnt = res.body.sort(function (a, b) {
        if (a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
        if (a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
        return 0;
      });;
      this.ptchDprt = this.dprtmnt[0]?.name
        this.chngD(e)
      if (!['6'].includes(this.currentUser?.prmsnId) && !this.prmsUsrId.id) {
        Object.keys(this.formRoleData.controls.items.controls).forEach( //binding value of department in department dropdown by default.
          (fg: any) => {
            Object.keys(this.formRoleData.controls.items.controls[fg].controls).forEach(
              (fc: any) => {
                if (fc == 'department') {
                  this.formRoleData.controls.items.controls[fg].controls[fc].setValue(this.ptchDprt)
                  // console.log('dfvev',this.formRoleData.controls.items.controls[fg].controls[fc]);
                }
              }
            )
          }
        )
      }
    }, err => {
      this.toaster.errorToastr('Something went wrong please try again leter')
    })
  }

  getDepartment1(e) {
    this.dprtmnt1 = []
    let isfor = 6
    let for_other = null
    if (this.currentUser?.user_role == 4) {
      this.getDepartment(this.currentUser?.com_id)
    }else{
    this.getDepartmentForRolle(e,isfor,for_other)
  }
  }


  getDepartmentForRolle(e,isfor,for_other){
    this.dataSrv.getPermissionByAdminRole().subscribe(
      (res: any) => {
        if (!res.error) {
          res.body.map(i => {
            if (this.roleData.includes(i.role_id)) {
              if (i.permission_name == 'Department') {
                if(i.view_permission == '1'){
                  this.dataSrv.getDepartmentListing(e, isfor, for_other).subscribe((res: any) => {
                    this.dprtmnt1 = res.body.sort(function (a, b) {
                      if (a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
                      if (a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
                      return 0;
                    });;
                  }, err => {
                    this.toaster.errorToastr('Something went wrong please try again leter')
                  })
                }
                if(i.trak_type == '0'){
                this.dprtmnt1 = JSON.parse(i.row_data);
                }
                this.dprtmnt = this.dprtmnt.sort(function (a, b) {
                  if (a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
                  if (a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
                  return 0;
                });
              }
            }
          })
        }
      })
  }

  createItem(item?: any, data?: any): FormGroup {
    this.rcpt_id = uuid.v4()

    return this.formBuilder.group({
      community_name: this.currentUser?.prmsnId == '6' ? [data?.id || '', Validators.required] : [''],
      purchage_date: [this.minDate, Validators.required],
      vendor: [item?.vendor || '', Validators.required],

      description: ['', Validators.required],
      gl_account: ['', Validators.required],
      amount: ['', Validators.required],
      pmt_type: [item?.pmt_type || '', Validators.required],
      department: [item?.department || '', Validators.required],
      final: [item?.final || '', Validators.required],
      receipt_id: [this.duplicate == true ? item?.receipt_id : this.rcpt_id || ''],
      entered_by: [this.currentUser?.id],
      start_date: [this.minDate],
      // invoice_date:[''],
      invoice_number: [item?.invoice_number || '']
    });
    // if(this.roleData1.includes(this.currentUser?.prmsnId))
    //   {
    //    this.formRoleData.controls['com_name'].clearValidators();
    //    this.formRoleData.updateValueAndValidity();
    //   }
    //   if(['6'].includes(this.currentUser?.prmsnId))
    //   {
    //    this.formRoleData.controls['com_name'].setValidators(Validators.required);
    //    this.formRoleData.updateValueAndValidity();
    //   }
  }

  addItem(): void {
    this.duplicate = false;
    Object.keys(this.formRoleData.controls.items.controls).forEach(
      (fg: any) => {
        Object.keys(this.formRoleData.controls.items.controls[fg].controls).forEach(
          fc => {
            if (fc != 'department') {
              this.formRoleData.controls.items.controls[fg].controls[fc].markAsDirty()
            }
          }
        )
      }
    )

    if (this.formRoleData.invalid) {
      this.toaster.errorToastr('Fill the required fields')
      return;
    }
    this.creteRecDsbl = 'false'
    this.items = this.formRoleData.get('items') as FormArray;
    this.items.push(this.createItem());
    let d = this.items.controls[this.items.length > 1 ?  this.items.length-1 : 0]['controls'].department.value
    this.items.controls[this.items.length-1]['controls'].department.value = d ? d : this.ptchDprt

    // console.log(this.items.value);
  }
  removeCard(i) {
    this.items.removeAt(i)
    // console.log(this.items.value)
  }

  // patchVal(){
  // let dt = ''
  // this.slctCom(this.currentUser?.id,3,this.ptchDprt)
  //   dt = this.scldta.yr + '-' + this.scldta.mn + '-' + "01"
  // this.formRoleData.patchValue({
  //   com_name:this.scldta.com,
  //   pur_date:dt.toString(),
  //   department:this.scldta.drp 
  //        })
  // }

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

  modalOpenOSE(modalOSE, size = 'md') {
    this.modalService.open(modalOSE,
      {
        backdrop: false,
        size: size,
        centered: true,
      }
    );
  }

  openAddNew(i) {
    this.indx = i
    
    this.formData.reset()
    if(i == 1){
      this.modalOpenOSE(this.Addnew, 'lg');
    }else{
    this.modalOpenOSE(this.Addnew1, 'lg');
  }
}

  closeded(modal: NgbModalRef) {
    modal.dismiss();
    this.getPrmsnData()
  }

  closeded1(modal: NgbModalRef) {
    modal.dismiss();
    this.getDepartment(this.currentUser?.user_role == 4 ? this.currentUser?.com_id : this.currentUser?.id)
  }

  get controls() {
    return this.formData.controls;
  }

  addNwVndr(modal) {
    for (let item of Object.keys(this.controls)) {
      this.controls[item].markAsDirty()
    }
    if (this.formData.invalid) {
      return;
    }
    this.closeded(modal)
    Object.keys(this.formRoleData.controls.items.controls).forEach(
      (fg: any) => {
        Object.keys(this.formRoleData.controls.items.controls[fg].controls).forEach(
          fc => {
            if (fc == 'vendor') {
              this.formRoleData.controls.items.controls[fg].controls[fc].setValue(this.formData.value.newVendor)
            }
          }
        )
      }
    )
    // this.formRoleData.get('vendor').setValue(this.formData.value.newVendor)
    let data = {
      vendor_name: this.formData.value.newVendor,
      community_id: this.currentUser?.prmsnId == '6' ? this.formRoleData.controls.items.controls[this.indx].value['community_name'] : this.currentUser?.prmsnId == '1' ? this.currentUser?.id : this.currentUser?.com_id,
      description: this.formData.value.description,
    }
    this.dataSrv.addVendor(data).subscribe((res: any) => {
      // console.log(res)
      if (!res.error) {
        this.loading = false;
        this.toaster.successToastr(res.msg)
        Object.keys(this.formRoleData.controls.items.controls).forEach(
          (fg: any) => {
            Object.keys(this.formRoleData.controls.items.controls[fg].controls).forEach(
              fc => {
                if (fc == 'vendor') {
                  this.formRoleData.controls.items.controls[fg].controls[fc].setValue('')
                }
              }
            )
          }
        )
        // this.formRoleData.get('vendor').setValue('')
        this.getvendors(this.formRoleData.value.community_name)
      } else {
        this.loading = false;
        this.toaster.errorToastr(res.msg)
      }
    }, err => {
      this.loading = false;
      this.dataSrv.genericErrorToaster()
    })
  }

  getPrmsnData() {
    let post = [];
    this.dataSrv.getPermissionByAdminRole().subscribe(
      (res: any) => {
        if (!res.error) {
          res.body.map(i => {
            //comunity
            if (this.roleData.includes(i.role_id)) {
              if (i.permission_name == 'Department') {
                // if(i.trak_type == '0'){
                this.dprtmnt = JSON.parse(i.row_data);
                this.dprtmnt = this.dprtmnt.sort(function (a, b) {
                  if (a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
                  if (a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
                  return 0;
                });
                // }
                // this.frstDp = this.dprtmnt[0]?.name
                this.ptchDprt = this.dprtmnt[0]?.name.trim()
                if (this.currentUser?.prmsnId == '28' || this.currentUser?.prmsnId == '26' && !this.prmsUsrId.id) {
                  Object.keys(this.formRoleData.controls.items.controls).forEach( //binding value of department in department dropdown by default.
                    (fg: any) => {
                      Object.keys(this.formRoleData.controls.items.controls[fg].controls).forEach(
                        (fc: any) => {
                          if (fc == 'department') {
                            this.formRoleData.controls.items.controls[fg].controls[fc].setValue(this.dprtmnt[0]?.name)
                            // console.log('dfvev',this.formRoleData.controls.items.controls[fg].controls[fc]);
                          }
                        }
                      )
                    }
                  )
                }
                else if (this.currentUser?.prmsnId != '6' && !this.prmsUsrId.id) {
                  Object.keys(this.formRoleData.controls.items.controls).forEach( //binding value of department in department dropdown by default.
                    (fg: any) => {
                      Object.keys(this.formRoleData.controls.items.controls[fg].controls).forEach(
                        (fc: any) => {
                          if (fc == 'department') {
                            this.formRoleData.controls.items.controls[fg].controls[fc].setValue(this.dprtmnt[0]?.name)
                            // console.log('dfvev',this.formRoleData.controls.items.controls[fg].controls[fc]);
                          }
                        }
                      )
                    }
                  )
                }
              }
            }
          })
        }
      }, (error: any) => {
        this.dataSrv.genericErrorToaster()
      }
    )
  }

  getRole() {
    this.dataSrv.getAllRole().subscribe((res: any) => {
      if (!res.err) {

        res.body.filter(i => { this.roleData.push(i.id.toString()) })
        this.roleData.map(i => {
          if (i != 2 && i != 3 && i != 4 && i != 5 && i != 6) {
            this.roleData1.push(i)
          }
          if (i != 1 && i != 2 && i != 3 && i != 4 && i != 5 && i != 6) {
            this.roleData2.push(i)
          }
        })
        if (this.prmsUsrId.id == null) {
          if (this.roleData2.includes(this.currentUser?.prmsnId)) {
            this.slctCom(this.roleData2.includes(this.currentUser?.prmsnId) ? this.currentUser?.com_id : this.currentUser?.id, 2, this.ptchDprt)
          } else {
            this.slctCom(this.currentUser?.id, 3, this.ptchDprt)
          }
          if (this.roleData1.includes(this.currentUser?.prmsnId)) {
            if (this.currentUser?.user_role != 8) {
              this.getCommunityDetails()
            } else {
              this.getUserDtl()
            }
          }
        }
      }
    }, err => {
      this.dataSrv.genericErrorToaster()
    })
  }

  addReceipt() {
    this.duplicate = true;
    if (this.formRoleData.invalid) {
      this.toaster.errorToastr('Fill the required fields')
      return;
    }
    this.creteRecDsbl = 'true'
    this.venData = this.vendorData.filter(i => i.vendor_name.includes(this.items.value[0].vendor[0].vendor_name))
    if (['6'].includes(this.currentUser?.prmsnId)) {
      this.comData = this.allCommunity.filter(i => i.id.includes(this.items.value[0].community_name))
    }
    Object.keys(this.formRoleData.controls.items.controls).forEach(
      (fg: any) => {
        Object.keys(this.formRoleData.controls.items.controls[fg].controls).forEach(
          (fc: any) => {
            if (fc == 'amount') {
              this.formRoleData.controls.items.controls[fg].controls[fc].setValue(this.items.value[0][fc])
            }
            else if (fc == 'vendor') {
              this.formRoleData.controls.items.controls[fg].controls[fc].setValue(this.venData)
            }
            else if (['6'].includes(this.currentUser?.prmsnId) && fc == 'community_name') {
              this.formRoleData.controls.items.controls[fg].controls[fc].setValue(this.comData[0]?.id)
            }
            else {
              this.formRoleData.controls.items.controls[fg].controls[fc].setValue(this.items.value[0][fc])
              if (fc == 'department') {
                this.ptchDprt = this.items.value[0][fc]
                // if(this.ptchDprt){
                //   this.chngD(this.ptchDprt)
                //  }
              }
            }
            //  console.log(fc,'FCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC');       
          }
        )
      }
    )
    // if(['6'].includes(this.currentUser?.prmsnId)){
    //   this.slctCom(this.comData[0].id,3,this.ptchDprt)
    // }
    // if(!['6'].includes(this.currentUser?.prmsnId)){
    //   this.slctCom(this.items.value[0].community_id,3,this.ptchDprt)
    // }
    // this.items = this.formRoleData.get('items') as FormArray;
    let ln = this.formRoleData.get('items')['controls'].length;

    this.items.push(this.createItem(this.items.value[ln - 1], this.comData[0]));

  }

  crtRec() {
    this.myId.push(uuid.v4())
    let ln = this.formRoleData.get('items')['controls'].length;
    Object.keys(this.formRoleData.controls.items.controls).forEach(
      (fg: any) => {
        Object.keys(this.formRoleData.controls.items.controls[fg].controls).forEach(
          (fc: any) => {
            if (fc == 'receipt_id') {
              this.formRoleData.controls.items.controls[fg].controls[fc].setValue(this.myId)
            }

            //  console.log(fc,'FCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC');       
          }
        )
      }
    )
  }

  otrDept(data) {
    this.modalOpenOSE(this.otdModal, 'lg');
    this.getDepartment1(this.currentUser?.com_id ?? this.currentUser?.id)
    this.chngD(this.currentUser?.id)
    this.venData = this.vendorData.filter(i => i.vendor_name.includes(data[0].vendor))
    this.otherDepr.get('receipt_id').setValue(this.rcpt_id);
    this.otherDepr.get('department').setValue(data[0].department)
    this.otherDepr.get('purchage_date').setValue(data[0].purchage_date);
    this.otherDepr.get('vendor').setValue(this.venData);
    this.otherDepr.get('pmt_type').setValue(data[0].pmt_type);
    this.otherDepr.get('final').setValue(data[0].final);
    // this.otherDepr.get('description').setValue(data[0].description)
    this.otherDepr.get('gl_account').setValue(data[0].gl_account)
    // this.otherDepr.get('amount').setValue(data[0].amount)
  }

  otherDeprSubmitted() {
    for (let item of Object.keys(this.ogt)) {
      this.ogt[item].markAsDirty()
    }

    if (this.otherDepr.invalid) {
      return;
    };

    this.loading = true;
    let data = [{
      community_name: this.currentUser?.prmsnId == '1' || this.roleData2.includes(this.currentUser?.prmsnId) ? this.comName.community_name : this.submitId2[0].community_name,
      vendor: this.otherDepr.value.vendor[0].vendor_name,
      department: this.otherDepr.value.department,
      invoice_number: this.otherDepr.value.invoice_number,
      final: this.otherDepr.value.final,
      purchage_date: this.otherDepr.value.purchage_date,
      amount: this.otherDepr.value.amount,
      receipt_id: this.otherDepr.value.receipt_id,
      description: this.otherDepr.value.description,
      gl_account: this.otherDepr.value.gl_account,
      pmt_type: this.otherDepr.value.pmt_type,
      entered_by: this.currentUser?.id,
      entered_date: this.minDate,
    }]
    this.dataSrv.addSpendDownOthersTable(data).subscribe((res: any) => {
      if (!res.error) {
        this.loading = false;
        this.toaster.successToastr(res.msg)
        this.createItem()
        let dp = this.otherDepr.value.department
        this.items.reset()
        this.modalService.dismissAll()
        this.getPrmsnData()
        let data = {
          is_for: this.currentUser?.user_role == 4 ? this.currentUser?.com_id : this.currentUser?.id,
          department: dp
        }
        this.dataSrv.getDepartmentUser(data).subscribe((res: any) => {
          if (!res.error) {

          } else {
            this.loading = false;
            this.toaster.errorToastr(res.msg)
          }
        })
      } else {
        this.loading = false;
        this.toaster.errorToastr(res.msg)
      }
    }, err => {
      this.loading = false;
      this.dataSrv.genericErrorToaster()
    })

  }

}
