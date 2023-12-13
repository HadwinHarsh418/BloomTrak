import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Patterns } from 'app/auth/helpers/patterns';
import { UserService } from 'app/auth/service';
import { ApiService } from 'app/auth/service/api.service';
import { DataService } from 'app/auth/service/data.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import StatesJson from 'assets/states.json';

@Component({
  selector: 'app-edit-management',
  templateUrl: './edit-management.component.html',
  styleUrls: ['./edit-management.component.scss']
})
export class EditManagementComponent implements OnInit {
  States:any = StatesJson;
  editManagement!: FormGroup;
  btnShow: boolean = false;
  currenUserId: any;
  prmsUsrId: any;
  state:any;

  public contentHeader: object;
  brdLbl: any;

  constructor(
    private fb: FormBuilder,
    private tost: ToastrManager,
    private api: ApiService,
    private dataService: DataService,
    private userService: UserService,
    private loctn: Location,
    private aCtRoute: ActivatedRoute

  ) { 
    this.aCtRoute.params.subscribe(
      res => {
        if (res.id) {
          this.prmsUsrId = res;
          this.EditUser(this.prmsUsrId)
        }
      }
    )
  }

  ngOnInit(): void {
    this.state = this.States
    this.editManagement = this.fb.group({
      mg_name: ['', [Validators.required]],
      // mg_title: ['', [Validators.required]],
      mg_phone: ['', [Validators.required,Validators.pattern(Patterns.number)]],
      // mg_email: ['', [Validators.required,Validators.pattern(Patterns.email)]],
      contact_email: ['', [Validators.required,Validators.email]],
      contact_person: ['', [Validators.required,Validators.pattern(Patterns.number)]],
      // contact_person_name: ['', [Validators.required]],
      contact_person_firstname: ['', [Validators.required]],
      contact_person_lastname: ['', [Validators.required]],
      contact_person_title: ['', [Validators.required]],
      state: ['', [Validators.required]],
      mg_address1: ['', [Validators.required]],
      mg_address2: [''],
      zipcode: ['',[ Validators.required]],
      website: ['',[ Validators.required]],
      city: ['',[ Validators.required]],
      // password: ['', [Validators.required, Validators.pattern(Patterns.password)]],
      // approval: ['1'],
    })

      setTimeout(() => {
        this.contentHeader = {
          headerTitle: 'Edit Management Company ',
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
              },
              {
                name: this.brdLbl,
                isLink: false,
                link: '/management'
              }
            ]
          }
        };
      }, 500);
  
  }

  get ec() {
    return this.editManagement.controls;
  }

  editManagementSubmit() {
    for (let item of Object.keys(this.ec)) {
      this.ec[item].markAsDirty()
    }
    if (this.editManagement.invalid) {
      return;
    }
    this.btnShow = true;
    let body1={
      mg_name: this.editManagement.value.mg_name,
      mg_title: this.editManagement.value.mg_title,
      // contact_person_name: this.editManagement.value.contact_person_name,
      contact_person_firstname: this.editManagement.value.contact_person_firstname,
      contact_person_lastname: this.editManagement.value.contact_person_lastname,
      contact_person_title: this.editManagement.value.contact_person_title,
      contact_email: this.editManagement.value.contact_email,
      mg_address1: this.editManagement.value.mg_address1,
      mg_address2: this.editManagement.value.mg_address2,
      city: this.editManagement.value.city,
      mg_phone: this.editManagement.value.mg_phone.replace(/\D/g, ''),
      contact_person: this.editManagement.value.contact_person.replace(/\D/g, ''),
      state: this.editManagement.value.state,
      website: this.editManagement.value.website,
      zipcode: this.editManagement.value.zipcode,
      id:this.currenUserId.id
    }
    this.dataService.editManagementByID(body1).subscribe((res: any) => {
      if (!res.error) {
        this.tost.successToastr(res.msg)
        this.btnShow = false;
        this.loctn.back()
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
  
  EditUser(row: any) {
    this.userService.getManagementById(row.id).subscribe((res: any) => {
      this.currenUserId = row
      this.brdLbl = res.body[0].mg_name

      if (!res.error) {
        this.editManagement.patchValue({
          mg_name: res.body[0].mg_name,
          mg_title: res.body[0].mg_title,
          mg_phone: res.body[0].mg_phone,
          mg_address1: res.body[0].mg_address1,
          mg_address2: res.body[0].mg_address2,
          zipcode: res.body[0].zipcode,
          city: res.body[0].city,
          state: res.body[0].state,
          website: res.body[0].website,
          contact_person_firstname: res.body[0].contact_person_firstname,
          contact_person_lastname: res.body[0].contact_person_lastname,
          contact_person_title: res.body[0].contact_person_title,
          contact_person_name: res.body[0].contact_person_name,
          contact_email: res.body[0].contact_email,
          contact_person: res.body[0].contact_person,
        });
        setTimeout(() => {
          this.editManagement.get('mg_phone').setValue(this.editManagement.value.mg_phone)
        }, 100)
        setTimeout(() => {
          this.editManagement.get('contact_person').setValue(this.editManagement.value.contact_person)
        }, 100)
      }
    },
      (err) => {
        this.dataService.genericErrorToaster()
      })
  }

  goBack(){
    this.loctn.back()
  }

}
