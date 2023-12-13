import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { EncryptionService } from 'app/utils/encryption/encryption.service';
import { Page } from 'app/utils/models';
import { debounceTime, map, distinctUntilChanged, filter } from "rxjs/operators";
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.scss']
})
export class DriversComponent implements OnInit {
  @ViewChild('tablesss') tablesss: ElementRef<any>;
  @ViewChild('searchStrInput', { static: true }) searchStrInput: ElementRef;

  public page = new Page();
  public rows = [];
  loadingList: boolean;
  searchStr:string = '';
  searchSub:any = null;
  
  constructor(
    private _authenticationService: AuthenticationService,
    private encryptionService: EncryptionService,
    private dataService: DataService, ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit(): void {
    this.setPage(this.page);
    fromEvent(this.searchStrInput.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      })
      , debounceTime(1000)
      , distinctUntilChanged()
    ).subscribe((text: string) => {
      this.setPage(this.page)
    });
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    let data = {
      pageNo: this.page.pageNumber,
      limitNum: this.page.size,
    };
    let itemenc = this.encryptionService.encode(JSON.stringify(data))
    this.loadingList = true;
    this.searchSub = this.dataService.getAllDriver(this.searchStr).subscribe(
      res => {
        let data = this.encryptionService.getDecode(res);
        if (!data.error) {
          this.rows = data.body;
          if(!data.pagination) {
            this.page.size = data.body.length;
            this.page.totalElements = data.body.length;
            this.page.pageNumber = 0;
            this.page.totalPages = 1;
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

  ngOnDestroy() {
    if(this.searchSub) {
      this.searchSub.unsubscribe();
      this.searchSub = null;
    }
  }

}
