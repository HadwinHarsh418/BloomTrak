import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Patterns } from 'app/auth/helpers/patterns';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { ApiService } from 'app/auth/service/api.service';
import { DataService } from 'app/auth/service/data.service';
import { EncryptionService } from 'app/utils/encryption/encryption.service';
import { Page } from 'app/utils/models';
import { ToastrManager } from 'ng6-toastr-notifications';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';


@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
  searchSub: any = null;
  public page = new Page();
  loadingList: boolean;
  searchStr: string = '';
  public rows = [];
  btnShow: boolean = false;
  formData!: FormGroup;
  editFormData!: FormGroup;
  allCommunity: any = [];
  currenUserId: any = ''
  public currentUser: User;
  minDate: any;


  @ViewChild('addUsers') addUsers: ElementRef<any>;
  @ViewChild('deleteUser') deleteUser: ElementRef<any>;
  @ViewChild('editUsers') editUsers: ElementRef<any>;
  @ViewChild('searchStrInput', { static: true }) searchStrInput: ElementRef;


  projectId: any;

  constructor(
    private fb: FormBuilder,
    private encryptionService: EncryptionService,
    private dataService: DataService,
    private _authenticationService: AuthenticationService,
    private modalService: NgbModal,
    private toastr: ToastrManager,
    private api: ApiService,

  ) {
    this.page.size = 10;
    this._authenticationService.currentUser.subscribe(x => (this.currentUser = x)
    
    );

  }





  ngOnInit(): void {
    this.getCommunityId()
    this.getDate()
    this.setPage({ offset: 0 });

    this.formData = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      budget: ['', [Validators.required, Validators.pattern(Patterns.number)]],
      start_date: ['', [Validators.required]],
      end_date: ['', Validators.required],

    })

    this.editFormData = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      budget: ['', [Validators.required, Validators.pattern(Patterns.number)]],
      start_date: ['', [Validators.required]],
      end_date: ['', Validators.required],

    })

    fromEvent(this.searchStrInput.nativeElement, 'keyup').pipe(
      map((event: any) => {
       
        return event.target.value;
      })
      , debounceTime(1000)
      , distinctUntilChanged()
    ).subscribe((text: string) => {
      
      this.setPage({ offset: 0 })
    }
    );
  }

  editSubmitted(modal) {
    for (let item of Object.keys(this.ef)) {
      this.ef[item].markAsDirty()
    }
    if (this.editFormData.invalid) {
      return;
    }

    if(new Date(this.editFormData.value.end_date).getTime() < new Date(this.editFormData.value.start_date).getTime() ){
      this.toastr.errorToastr('End date must be greater then start date')
      return;
    }
    this.btnShow = true;
   
    this.dataService.editProject({ ...this.editFormData.value, ...{id:this.projectId} }).subscribe((res: any) => {
    if (!res.error) {
      this.setPage({ offset: 0 });
      this.toastr.successToastr(res.msg)
      this.closeded(modal)
      this.btnShow = false;
    } else {
      this.btnShow = false;
      this.toastr.errorToastr(res.msg)
    }
  },
    (err) => {
      this.btnShow = false;
      this.api.genericErrorToaster()

    })
  }

EditUser(row: any) {
  this.modalOpenOSE(this.editUsers, 'lg');
  this.projectId = row.id
  this.dataService.getProjectById(this.projectId).subscribe((res: any) => {
    this.currenUserId = row

    if (!res.error) {
      let sd = res.body[0].start_date
      let ed = res.body[0].end_date
      let sd2 = sd.split('T')
      let ed2 = ed.split('T')

      this.editFormData.patchValue({
        title: res.body[0].title,
        description: res.body[0].description,
        budget: res.body[0].budget,
        start_date: sd2[0],
        end_date: ed2[0]

      });
    }
  },
    (err) => {
      this.dataService.genericErrorToaster()
    })
}


getDate() {
  let todayDate: any = new Date();
  let toDate: any = todayDate.getDate();
  if (toDate < 10) {
    toDate = '0' + toDate
  }
  let month = todayDate.getMonth() + 1;
  if (month < 10) {
    month = '0' + month;
  }
  let year = todayDate.getFullYear();
  this.minDate = year + '-' + month + '-' + toDate
}


closeded(modal: NgbModalRef) {
  modal.dismiss();
}
closeAddCommunity(modal: NgbModalRef) {
  modal.dismiss();
}
  get controls() {
  return this.formData.controls;
}

  get ef() {
  return this.editFormData.controls;
}


setPage(pageInfo) {
  if (this.searchSub) {
    this.searchSub.unsubscribe();
    this.searchSub = null;
  }
  this.page.pageNumber = pageInfo.offset;
  let data = {
    pageNo: this.page.pageNumber,
    limitNum: this.page.size,
  };
  let itemenc = this.encryptionService.encode(JSON.stringify(data))
  this.loadingList = true;
  this.searchSub = this.dataService.getProject(this.searchStr, this.page.pageNumber, this.page.size).subscribe(res => {
    if (!res.error) {
      this.rows = res.body;

      if (!res.pagination) {
        this.page.size = res.body.length;
        this.page.totalElements = res.body.length;
        this.page.pageNumber = res.pagination.pageNumber;
        this.page.totalPages = res.pagination.totalPages;
      } else {
        this.page = res.pagination
        this.page.pageNumber = res.pagination.pageNumber
      }
    } else {
      this._authenticationService.errorToaster(data)
    }
    this.loadingList = false;
  }, error => {
    this.loadingList = false;
  }
  )
}

openAddUser() {
  this.formData.reset();
  this.modalOpenOSE(this.addUsers, 'lg');
}

modalOpenOSE(modalOSE, size = 'sm') {
  this.modalService.open(modalOSE,
    {
      backdrop: false,
      size: size,
      centered: true,
    }
  );
}

submitted(modal) {
  for (let item of Object.keys(this.controls)) {
    this.controls[item].markAsDirty()
  }
  if (this.formData.invalid) {
    return;
  }
  if(new Date(this.formData.value.end_date).getTime() < new Date(this.formData.value.start_date).getTime() ){
    this.toastr.errorToastr('End date must be greater then start date')
    return;
  }

  this.btnShow = true;
  this.dataService.addProject({ ...this.formData.value, ...{community_id:this.currentUser?.id} }).subscribe((res: any) => {
    if (!res.error) {
      this.setPage({ offset: 0 });
      this.toastr.successToastr(res.msg)
      this.closeded(modal)
      this.btnShow = false;
    } else {
      this.btnShow = false;
      this.toastr.errorToastr(res.msg)
    }
  },
    (err) => {
      this.btnShow = false;
      this.api.genericErrorToaster()

    })
}

getCommunityId() {
  this.dataService.getCommunityId().subscribe((response: any) => {
    if (response['error'] == false) {
      this.allCommunity = response.body;
    } else if (response['error'] == true) {
      this.toastr.errorToastr(response.msg);
    }
  })
}

deletesUser(modal: NgbModalRef) {
  this.btnShow = true;
  this.dataService.deleteProject(this.projectId).subscribe((res: any) => {
    if (!res.error) {
      this.setPage({ offset: 0 });
      this.toastr.successToastr(res.msg)
      this.closeded(modal)
      this.btnShow = false;
    } else {
      this.btnShow = false;
      this.toastr.errorToastr(res.msg)
    }
  },
    (err) => {
      this.btnShow = false;
      this.api.genericErrorToaster()

    })
}

openDeleteUser(row: any) {
  this.projectId = { id: row.id }
  this.modalOpenOSE(this.deleteUser, 'lg');
}
closed(modal: NgbModalRef) {
  modal.dismiss();
}

}
