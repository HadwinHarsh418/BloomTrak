import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { EncryptionService } from 'app/utils/encryption/encryption.service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-identification-modal',
  templateUrl: './identification-modal.component.html',
  styleUrls: ['./identification-modal.component.scss']
})
export class IdentificationModalComponent implements OnInit {
  @ViewChild('termModal') termModal: ElementRef<any>;
  @ViewChild('identifyModal') identifyModal: ElementRef<any>;

  isLoading: boolean;
  identificationSuccess: string;
  identificationError: string;
  public identificaitonForm: FormGroup;
  termsRead = { terms: false, rules: false, knowledge: false }
  falseVal = [undefined, null, false, 'false'];
  termType: any;
  loading: boolean;

  user_id: any = 0;
  subAll: any[] = [];
  uploadingImg: boolean;

  termData: any;
  ruleProcedure: any;
  contract: any;
  knwoledgeTest: any;
  constructor(
    public _dataService: DataService,
    private encryptionService: EncryptionService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    public toastr: ToastrManager,
    private translateService: TranslateService
  ) {
    this.identificaitonForm = this.formBuilder.group({
      term_cond: ['', [Validators.required]],
      rule_procedure: ['', [Validators.required]],
      knwdlge_test: ['', [Validators.required]],
      is_company: ['', [Validators.required]],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      dni: ['', Validators.required],
      dni_doc_name: ['', Validators.required],
      dni_doc_fileSource: ['', Validators.required],
      selfie_pic_name: ['', Validators.required],
      selfie_pic_fileSource: ['', Validators.required],
      nie_passport: [''],
      nie_doc_name: [''],
      nie_doc_fileSource: [''],
      room: ['', Validators.required],
      telephone: ['', Validators.required],
      // email: ['', [Validators.required, Validators.email]],
      company_name: ['', Validators.required],
      contact_number: ['', Validators.required],
      company_url: [''],
      // company_url: ['', Validators.required],
      company_address: ['', Validators.required]
    })

    this.identificaitonForm.get('is_company').valueChanges.subscribe(val => {
      if (val == 'individual') {
        setTimeout(() => {
          this.identificaitonForm.get('name').enable();
          this.identificaitonForm.get('surname').enable();
          this.identificaitonForm.get('room').enable();
          this.identificaitonForm.get('telephone').enable();
          // --
          this.identificaitonForm.get('company_name').disable();
          this.identificaitonForm.get('company_url').disable();
          this.identificaitonForm.get('contact_number').disable();
          this.identificaitonForm.get('company_address').disable();
        }, 100)
      } else if (val == 'company') {
        setTimeout(() => {
          this.identificaitonForm.get('company_name').enable();
          this.identificaitonForm.get('company_url').enable();
          this.identificaitonForm.get('contact_number').enable();
          this.identificaitonForm.get('company_address').enable();

          // --

          this.identificaitonForm.get('name').disable();
          this.identificaitonForm.get('surname').disable();
          this.identificaitonForm.get('room').disable();
          this.identificaitonForm.get('telephone').disable();
        }, 100)
      }
    });

    this.identificaitonForm.get('term_cond').valueChanges.subscribe(val => {
      if (this.falseVal.includes(val)) {
        this.identificaitonForm.get('term_cond').setValue('');
      } else if (val == true || val == 'true') {
        if (!this.termsRead.terms) {
          this.openTermModal('term_cond');
        } else {
        }
      }
    });
    this.identificaitonForm.get('rule_procedure').valueChanges.subscribe(val => {
      if (this.falseVal.includes(val)) {
        this.identificaitonForm.get('rule_procedure').setValue('');
      } else if (val == true || val == 'true') {
        if (!this.termsRead.rules) {
          this.openTermModal('rule_procedure');
        } else {
        }
      }
    });
    this.identificaitonForm.get('knwdlge_test').valueChanges.subscribe(val => {
      if (this.falseVal.includes(val)) {
        this.identificaitonForm.get('knwdlge_test').setValue('');
      } else if (val == true || val == 'true') {
        if (!this.termsRead.knowledge) {
          this.openTermModal('knwdlge_test');
        } else {
        }
      }
    })
    this.subAll.push(
      this._dataService.opentIdentificaitonModal.subscribe(
        val => {
          if (val && val.user_id) {
            this.user_id = val.user_id;
            this.openModalMain();
          }
        }
      )
    )
  }

  reset() {
    this.identificaitonForm.reset();
    setTimeout(() => {
      this.identificaitonForm.patchValue({ is_company: 'individual' })
    }, 500)
    this.falseVal = [undefined, null, false, 'false'];
    this.termsRead = { terms: false, rules: false, knowledge: false }

  }

  ngOnInit(): void {
    this.getTermsData();
  }

  get identiForm() {
    return this.identificaitonForm.controls;
  }

  identificaitonSubmission(model) {
    this.identificationSuccess = '';
    this.identificationError = '';
    let checks = ['term_cond', 'rule_procedure', 'knwdlge_test']
    for (const key in this.identificaitonForm.controls) {
      if (Object.prototype.hasOwnProperty.call(this.identificaitonForm.controls, key)) {
        this.identificaitonForm.controls[key].markAsDirty();
        if (checks.includes(key) && this.falseVal.includes(this.identificaitonForm.controls[key].value)) {
          this.identificaitonForm.controls[key].setValue('');
        }
      }
    }

    // console.log(this.identificaitonForm);

    if (this.identificaitonForm.invalid) {
      return;
    }

    let data: any = {
      dni: this.identificaitonForm.value.dni,
      user_id: this.user_id,
      dni_doc: this.identificaitonForm.get('dni_doc_fileSource').value,
      selfie_pic: this.identificaitonForm.get('selfie_pic_fileSource').value,
      is_company: this.identificaitonForm.value.is_company == 'company' ? 1 : 0,
    }
    if (this.identificaitonForm.get('is_company').value == 'company') {
      data.company_name = this.identificaitonForm.value.company_name;
      data.contact_number = this.identificaitonForm.value.contact_number;
      data.company_url = this.identificaitonForm.value.company_url;
      data.company_address = this.identificaitonForm.value.company_address;
    } else {
      data.name = this.identificaitonForm.value.name;
      data.surname = this.identificaitonForm.value.surname;
      data.room = this.identificaitonForm.value.room;
      data.telephone = this.identificaitonForm.value.telephone;
    }

    // console.log(data); return
    let enc_dat = this.encryptionService.encode(JSON.stringify(data));
    this.isLoading = true;
    this._dataService.identification_file({ enc: enc_dat }).subscribe(
      response => {
        if (!response.error) {
          this.toastr.successToastr(response.msg);
          this.closedMain(model);
        } else {
          this.toastr.errorToastr(response.msg);
        }
        this.isLoading = false;
      },
      error => {
        this.isLoading = false;
        this.translateService.get('COMMONERRORS.somethingError').subscribe(
          res => {
            this.toastr.errorToastr(res);
          }
        )
      }
    )
  }

  onFileChange(event, type) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file && file != undefined) {
        var strFileName = this.getFileExtension1(file.name);
        if (strFileName != 'jpeg' && strFileName != 'pdf' && strFileName != 'jpg') {
          this.translateService.get('commonSlags.valExtn').subscribe(
            res => {
              this.toastr.errorToastr(res + " | .jpg | .jpeg | .pdf");
            }
          );
          if (type == 'dni_doc') {
            this.identificaitonForm.patchValue({ dni_doc_name: '' });
          }
          if (type == 'nie_doc') {
            this.identificaitonForm.patchValue({ nie_doc_name: '' });
          }
          if (type == 'selfie_pic') {
            this.identificaitonForm.patchValue({ selfie_pic_name: '' });
          }
          event.target.value = '';
          return;
        }
      }
      if (type == 'dni_doc') {
        this.uploadDocFile('dni_doc', file, event.target);
      } else if (type == 'nie_doc') {
        this.uploadDocFile('nie_doc', file, event.target);
      } else if (type == 'selfie_pic') {
        this.uploadDocFile('selfie_pic', file, event.target);
      }
    } else {
      if (type == 'dni_doc') {
        this.identificaitonForm.patchValue({ dni_doc_fileSource: '' });
      } else if (type == 'nie_doc') {
        this.identificaitonForm.patchValue({ nie_doc_fileSource: '' });
      } else if (type == 'selfie_pic') {
        this.identificaitonForm.patchValue({ selfie_pic_fileSource: '' });
      }
    }
  }

  getFileExtension1(filename) {
    return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename)[0] : undefined;
  }

  uploadDocFile(type, file, input) {
    if (file) {
      this.uploadingImg = true;
      const formData = new FormData();
      formData.append('doc', file);
      formData.append('user_id', this.user_id);
      formData.append('doc_type', type);

      this._dataService.uploadDocument(formData).subscribe(
        res => {
          if (!res.error) {
            // { doc_type: params.doc_type, url: params.doc_url }
            if (res.body[0].doc_type == 'dni_doc') {
              this.identificaitonForm.patchValue({ dni_doc_fileSource: res.body[0].url });
            } else if (res.body[0].doc_type == 'nie_doc') {
              this.identificaitonForm.patchValue({ nie_doc_fileSource: res.body[0].url });
            } else if (res.body[0].doc_type == 'selfie_pic') {
              this.identificaitonForm.patchValue({ selfie_pic_fileSource: res.body[0].url });
            }
          } else {
            if (type == 'dni_doc') {
              this.identificaitonForm.patchValue({ dni_doc_fileSource: null, dni_doc_name: '' });
              input.value = '';
            } else if (type == 'nie_doc') {
              this.identificaitonForm.patchValue({ nie_doc_fileSource: null, nie_doc_name: '' });
              input.value = '';
            } else if (type == 'selfie_pic') {
              this.identificaitonForm.patchValue({ selfie_pic_fileSource: null, selfie_pic_name: '' });
              input.value = '';
            }
            this.toastr.errorToastr(res.msg);
          }
          this.uploadingImg = false;
        }, error => {
          this.uploadingImg = false;
          if (type == 'dni_doc') {
            this.identificaitonForm.patchValue({ dni_doc_fileSource: null, dni_doc_name: '' });
            input.value = '';
          } else if (type == 'nie_doc') {
            this.identificaitonForm.patchValue({ nie_doc_fileSource: null, nie_doc_name: '' });
            input.value = '';
          } else if (type == 'selfie_pic') {
            this.identificaitonForm.patchValue({ selfie_pic_fileSource: null, selfie_pic_name: '' });
            input.value = '';
          }
          this.translateService.get('COMMONERRORS.somethingError').subscribe(
            res => {
              this.toastr.errorToastr(res);
            }
          );
        }
      )
    }

  }

  openModalMain() {
    this.reset();
    this.modalService.open(this.identifyModal,
      {
        backdrop: false,
        centered: true,
        size: 'lg',
      }
    );
  }

  closedMain(modal: NgbModalRef) {
    modal.dismiss();
  }

  openTermModal(type) {
    this.termType = type;
    this.modalService.open(this.termModal,
      {
        backdrop: false,
        centered: true,
        size: 'lg',
        beforeDismiss: () => {
          switch (this.termType) {
            case 'term_cond':
              if (!this.termsRead.terms) this.identificaitonForm.get('term_cond').setValue('');
              break;
            case 'rule_procedure':
              if (!this.termsRead.rules) this.identificaitonForm.get('rule_procedure').setValue('');
              break;
            case 'knwdlge_test':
              if (!this.termsRead.knowledge) this.identificaitonForm.get('knwdlge_test').setValue('');
              break;
          }
          return true;
        },
      }
    );

  }

  acceptTerms(modal1: NgbModalRef) {
    switch (this.termType) {
      case 'term_cond':
        this.termsRead.terms = true;
        this.closed(modal1)
        break;
      case 'rule_procedure':
        this.termsRead.rules = true;
        this.closed(modal1)
        break;
      case 'knwdlge_test':
        this.termsRead.knowledge = true;
        this.closed(modal1)
        break;
    }
  }


  getTermsData() {
    this.loading = true;
    this._dataService.getAllTermsData().subscribe((res) => {
      if (!res.error) {
        let dt = JSON.parse(this.encryptionService.decode(res['body']));
        this.loading = false;
        this.termData = dt[0]
        this.ruleProcedure = dt[1]
        this.knwoledgeTest = dt[2]
        this.contract = dt[3]
      }
    })
  }

  closed(modal: NgbModalRef) {
    modal.dismiss();
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.subAll.map(
      item => {
        if (item) {
          item.unsubscribe();
          item = null;
        }
      }
    );
  }

}
