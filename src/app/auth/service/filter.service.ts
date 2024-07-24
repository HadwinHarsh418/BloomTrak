import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private filter: any;

  constructor() {}

  setFilter(filter: any) {
    this.filter = filter;
  }

  getFilter() {
    return this.filter;
  }
}
