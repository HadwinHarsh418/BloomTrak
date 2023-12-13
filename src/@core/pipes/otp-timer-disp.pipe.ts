import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'otpTimerDisp'
})
export class OtpTimerDisp implements PipeTransform {
	constructor() { }
	transform(value: any) {
		let o = this.calculateTimeLeft(value);
		return `${o.mins}m ${o.seconds}s`
	}

	calculateTimeLeft(leftsec) {
		let timeLeft = { hours: 0, mins: 0, seconds: 0, overallsec: leftsec };
		timeLeft.hours = ~~(timeLeft.overallsec / 3600);
		timeLeft.mins = ~~((timeLeft.overallsec % 3600) / 60);
		timeLeft.seconds = ~~timeLeft.overallsec % 60;

		return timeLeft;
	}

}