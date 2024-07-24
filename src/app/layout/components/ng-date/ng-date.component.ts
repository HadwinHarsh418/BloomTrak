import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap'
import { log } from 'console';
@Component({
  selector: 'app-ng-date',
  templateUrl: './ng-date.component.html',
  styleUrls: ['./ng-date.component.scss']
})
export class NgDateComponent implements OnInit {
  model:NgbDateStruct;
  minModel:NgbDateStruct;
  maxModel:NgbDateStruct;
  disableInput: any;
  @Input() set min(value) {
    let dt = this.formatFromDate(value);
    if(dt?.year) {
      this.minModel = dt;
    }
  }
  
  @Input() set max(value) {
    let dt = this.formatFromDate(value);
    if(dt?.year) {
      this.maxModel = dt;
    }
  }

  @Input() set currentVal(value) {
    let dt = this.formatFromDate(value);
    if(dt?.year) {
      this.model = dt;
    }
  }

  @Input() set disabled(value){
    let disa = value
    this.disableInput = disa
  }

  @Output() updateDate:EventEmitter<any> = new EventEmitter()
  constructor() { }

  ngOnInit(): void {
  }

  formatFromDate(date: any) {
    let dt = date ?  new Date(date) : null;
    if(dt && dt.getFullYear() > 0) {
      let ngdt:any = { };
      ngdt.day = dt.getDate();
      ngdt.month = dt.getMonth()+1;
      ngdt.year = dt.getFullYear();
      return ngdt
    }
    return null;
  }

  formatToDate(date: NgbDateStruct) {
    if(date.year) {
      return `${this.getNumber(date.year)}-${this.getNumber(date.month)}-${this.getNumber(date.day)}`
    }
    return null;
  }

  getNumber(num:number) {
    if(isNaN(num)) {
      return num;
    } else {
      return (num < 10) ? `0${num}` : num;
    }
  }

  dataChanged() {
    if(this.model.year){
      this.updateDate.emit(this.formatToDate(this.model));
    }
  }

}
