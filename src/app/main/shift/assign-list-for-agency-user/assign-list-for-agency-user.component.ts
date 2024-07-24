import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmedValidator } from 'app/auth/helpers/mustMacth';
import { Patterns } from 'app/auth/helpers/patterns';
import { AuthenticationService } from 'app/auth/service';
import { ApiService } from 'app/auth/service/api.service';
import { DataService } from 'app/auth/service/data.service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-assign-list-for-agency-user',
  templateUrl: './assign-list-for-agency-user.component.html',
  styleUrls: ['./assign-list-for-agency-user.component.scss']
})
export class AssignListForAgencyUserComponent implements OnInit {
  public contentHeader: object;

  agncyUsr: any = []
  prmsUsrId: any;
  formData!: FormGroup;
  currentUser: any;
  data: any;
  submitId: any = [];
  submitId2: any = [];
  btnShow: boolean = false;
  crrntUsrId: any[] = []
  data4: any;
  asgnAgncyUsr: any;
  asgnBtn: boolean = false;
  dsble: boolean = false;

  constructor(
    private dataService: DataService,
    private _authenticationService: AuthenticationService,
    private fb: FormBuilder,
    private tost: ToastrManager,
    private api: ApiService,
    private loctn: Location,
    private aCtRoute: ActivatedRoute
  ) {
    this._authenticationService.currentUser.subscribe
      (x => {
        this.currentUser = x
        this.crrntUsrId.push(this.currentUser?.role == 'Admin' ? x?._id : x?.id)
      }
      );

    this.aCtRoute.params.subscribe(
      res => {
        this.prmsUsrId = res
      }
    )
  }

  ngOnInit(): void {
    this.getAgncyUsrLst();
    this.formData = this.fb.group({
      DOB: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required, Validators.pattern(Patterns.number)]],
      // PIN_code: ['', Validators.required],
      community_id: ['', Validators.required],
      agency_id: [''],
      management_Co: [''],
      management_co_user: ['', Validators.required],
      password: ['', Validators.compose([Validators.required, Validators.pattern(Patterns.password)])],
      cnfrmpassword: ['', [Validators.required]]
    }, {
      validator: ConfirmedValidator('password', 'cnfrmpassword')
    },

    )
    this.contentHeader = {
      headerTitle: 'Users List',
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
            name: 'Shifts',
            isLink: true,
            link: '/shift'
          }
        ]
      }
    };
  }



  assignShift(snglUsr) {
    let data = {
      shift_id: this.prmsUsrId.shift_id,
      user_id: snglUsr.id,
      agency_id: this.currentUser?.id,
      first_name:snglUsr.first_name,
      phone_number:snglUsr.phone_number,
      hourly_rate : snglUsr.hourly_rate
    }
    this.dataService.assignAGShift(data).subscribe((res: any) => {
      if (!res.error) {
        setTimeout(() => {
          this.getAgncyUsrLst()
        }, 200);

        this.ngOnInit()

      }
    },
      (err) => {
        this.dataService.genericErrorToaster()
      })

  }

  get controls() {
    return this.formData.controls;
  }

  submitted() {
    for (let item of Object.keys(this.controls)) {
      this.controls[item].markAsDirty()
    }
    if (this.controls.cnfrmpassword.status == "INVALID") {
      return;
    }

    this.data4 = {
      phone_number: this.formData.value.phone_number?.replace(/\D/g, ''),
      email: this.formData.value.email,
      first_name: this.formData.value.first_name,
      last_name: this.formData.value.last_name,
      DOB: this.formData.value.DOB,
      // PIN_code: this.formData.value.PIN_code,
      password: this.formData.value.password,
      agency_id: this.crrntUsrId,
      isAdmin: '5'
    }
    this.btnShow = true;
    this.dataService.addUser(this.data4).subscribe((res: any) => {
      if (!res.error) {
        this.tost.successToastr(res.msg)
        this.btnShow = false;

        setTimeout(() => {
          let data = {
            shift_id: this.prmsUsrId.shift_id,
            user_id: res.body.id,
            agency_id: this.currentUser?.id
          }
          this.dataService.assignAGShift(data).subscribe((res: any) => {
            if (!res.error) {
              this.tost.successToastr(res.msg)
              this.loctn.back()
            }
          })
        }, 200);
      } else {
        this.btnShow = false;
        this.tost.errorToastr(res.msg)
      }
    },
      (err) => {
        this.btnShow = false;
        this.api.genericErrorToaster()
      })
  }
  goBack() {
    this.loctn.back()
  }


  getAgncyUsrLst() {
    let is_for = 'agency'
    let searchStr = ''
    this.dataService.getUserById(searchStr = '',this.currentUser?.id, is_for).subscribe((res: any) => {
      if (!res.error) {
        this.agncyUsr = res.body
        this.agncyUsr.map(i => {
          if (this.prmsUsrId.shift_id == i.shift_id && this.prmsUsrId.agency_user == i.agency_user) {
            if (i.approved == 1) {
              if(i.shift_status == 1) {
                this.dsble = true;
              }else{
                this.dsble = false;
              }  
              i.asgnBtn = true;
            } else {               
              i.asgnBtn = false;
            }
          } else {
            if(this.dsble == true) {
              this.dsble = true;
            }else{
              this.dsble = false;
            }
            i.asgnBtn = false;
          }
         
        })

      }
    },
      (err) => {
        this.dataService.genericErrorToaster()
      })
  }

}
