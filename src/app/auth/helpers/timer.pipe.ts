import { NgModule, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timer',
  pure: false,
})
export class TimerPipe implements PipeTransform {

  transform(value: any, fromTime: any): any {

    const startDateTime = value;

    if (!startDateTime) return
    var timeStart = startDateTime;
    var timeEnd = fromTime;
    var hourDiff = timeStart - timeEnd; //in ms

    var minDiff = Math.floor(hourDiff / 60000); //in minutes
    var hDiff = hourDiff / 3600 / 1000; //in hours
    var humanReadable = { hours: hDiff, minutes: minDiff };
    humanReadable.hours = Math.floor(hDiff);
    humanReadable.minutes = minDiff - 60 * humanReadable.hours;
    return value = humanReadable.hours + " h" + ' : ' + humanReadable.minutes + " m";

  }



}

@Pipe({
  name: 'numberToTime',
  pure: false,
})
export class NumberToTime implements PipeTransform {

  transform(value: any): any {
    if(value) {
      let hours = (value / 60).toString().split('.')[0];
      let mins = (value % 60);
      return `${hours} h : ${mins} m`;
    } else {
      return `0 h : 0 m`;
    }
  }



}

@NgModule({
  declarations: [
    TimerPipe,
    NumberToTime
  ],
  exports: [
    TimerPipe,
    NumberToTime
  ]
})
export class SharedModule { }