import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CoreConfigService } from '@core/services/config.service';
import { Role } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { ApiService } from 'app/auth/service/api.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Patterns } from 'app/auth/helpers/patterns';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss']
})
export class ManagementComponent implements OnInit {
  private _unsubscribeAll: Subject<any>;

  formData!: FormGroup;
  btnShow: boolean = false
  tempUserId: any;
  managementForm!: FormGroup;
  public coreConfig: any;
  error: boolean = false;
  loading: boolean = false;

  constructor(
    private _coreConfigService: CoreConfigService,
    private fb: FormBuilder,
    private rout: Router,
    private api: ApiService,
    private tost: ToastrManager,
    private authService: AuthenticationService
  ) {
    this._unsubscribeAll = new Subject()
    // Configure the layout
    this._coreConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        menu: {
          hidden: true
        },
        footer: {
          hidden: true
        },
        customizer: false,
        enableLocalStorage: false
      }
    };
  }

  ngOnInit(): void {
    // Subscribe to config changes
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });

    this.formData = this.fb.group({
      mg_name: ['', Validators.required],
      mg_title: ['', Validators.required],
      mg_phone: ['', [Validators.required,Validators.pattern(Patterns.number)]],
      mg_email: ['', [Validators.required,Validators.email]],
      contact_email: ['', [Validators.required,Validators.email]],
      contact_person: ['', Validators.required],
      contact_person_name: ['', Validators.required],
      password: ['', [Validators.required, Validators.pattern(Patterns.password)]],
    })

    this.managementForm = this.fb.group({
      mg_email: ['', [Validators.required,Validators.email]],
      password: ['', Validators.required,Validators.pattern(Patterns.password)]
    });
    
  }

  get controls() {
    return this.formData.controls
  }

  submitted() {
    for (let item of Object.keys(this.controls)) {
      this.controls[item].markAsDirty()
    }
    if (this.formData.invalid) {
      return;
    }
    else {
      this.btnShow = true;
      let body1={
        mg_name: this.formData.value.mg_name,
        mg_title: this.formData.value.mg_title,
        mg_phone: this.formData.value.mg_phone.replace(/\D/g, ''),
        mg_email: this.formData.value.mg_email,
        contact_email: this.formData.value.contact_email,
        contact_person: this.formData.value.contact_person,
        contact_person_name: this.formData.value.contact_person_name,
        password: this.formData.value.password,
    }
      this.api.addManagement(body1).subscribe((res: any) => {
        if (!res.error) {

          let cUser = res.body[0]
          if (cUser.user_role) {
            switch (parseInt(cUser.user_role)) {
              case 1:
                cUser.role = Role.Community;
                break;
              case 2:
                cUser.role = Role.Agency;
                break;
              case 3:
                cUser.role = Role.Admin;
                break;
              case 4:
                cUser.role = Role.User;
                break;
              default:
                cUser.role = Role.Community;
                break;
            }
          }
          this.authService.setLogin(cUser)
          this.tost.successToastr(res.msg)
          this.tempUserId = res.body[0].id
          this.rout.navigateByUrl('setup')
        } else {
          this.tost.errorToastr(res.msg);
        }
        this.btnShow = false;
      },
        (err) => {
          this.btnShow = false;
          this.api.genericErrorToaster();

        })
    }

  }

  get f() {
    return this.managementForm.controls;
  }


}
