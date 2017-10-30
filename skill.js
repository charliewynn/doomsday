/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

'use strict';
const Alexa = require('alexa-sdk');

//=========================================================================================================================================
//TODO: The items below this comment need your attention.
//=========================================================================================================================================

//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
//Make sure to enclose your value in quotes, like this: const APP_ID = 'amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1';
const APP_ID = undefined;

const SKILL_NAME = 'Doomsday';
const STOP_MESSAGE = 'Goodbye!';

//=========================================================================================================================================
//TODO: Replace this data with your own.  You can find translations of this data at http://github.com/alexa/skill-sample-node-js-fact/lambda/data
//=========================================================================================================================================

exports.handler = function(event, context, callback) {
	var alexa = Alexa.handler(event, context);
	alexa.appId = APP_ID;
	alexa.registerHandlers(handlers);
	alexa.execute();
};

function randomDate(start, end) {
	var date = new Date(+start + Math.random() * (end - start));
	return date;
}

function randomDateThisYear(){
	var start = new Date().setMonth(0);
	start = (new Date(start)).setDate(1);
	var end = new Date().setMonth(11);
	end = (new Date(end)).setDate(31);
	return randomDate(start, end);
}
const dows = 
	[
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday'
	];

const months =
	[
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];

function getDoomsday(){
	var year = (new Date()).getFullYear() % 100;
	if(year % 2 == 1) year += 11;
	year /= 2;
	if(year % 2 == 1) year += 11;
	year -= 2;
	year %= 7;
	year = 7-year;
	return dows[year];
}
function numToOrdinal(num){
	if(num % 10 == 1) return num + 'st';
	if(num % 10 == 2) return num + 'nd';
	if(num % 10 == 3) return num + 'rd';
	return num + 'th';
}

function walkthrough(day, testing){
	var anchor = new Date(day);
	var leapYear = false;
	if(day.getFullYear() % 4 == 0)
		if(day.getFullYear() % 400 == 0)
			if(day.getFullYear() % 100 != 0)
				leapYear = true;

	var month = day.getMonth();
	var monthName = months[month];
	var date = day.getDate();

	var output = "Let's figure out " + months[day.getMonth()] + " " + numToOrdinal(day.getDate()) + ". ";
	var anchorDateNum = -1;
	switch(month+1)
	{
		case 1:
			if(leapYear){
				output += "It's a leap year so January 4th is our anchor day. ";
				anchor.setDate(anchorDateNum = 4);
			} else {
				output += "It's not a leap year so January 3rd is our anchor day. ";
				anchor.setDate(anchorDateNum = 3);
			}
			break;
		case 2:
			if(leapYear){
				output += "It's a leap year so we start with February 29th and work backwards. ";
				anchor.setDate(anchorDateNum = 29);
			}
			else{
				output += "It's not a leap year so we start with February 28th and work backwards. ";
				anchor.setDate(anchorDateNum = 28);
			}
			break;
		case 3:
			output += "For March we start with the last day of February, called March Zeroth. ";
			anchor.setDate(anchorDateNum = 0);
			break;
		case 4:
			output += "April is an even numbered month, so take it's month number, four, i.e. April 4th as our anchor date. ";
			anchor.setDate(anchorDateNum = 4);
			break;
		case 5:
			output += "For May remember nine to five at seven eleven. So start with May ninth. ";
			anchor.setDate(anchorDateNum = 9);
			break;
		case 6:
			output += "June is an even numbered month, so take it's month number, six, i.e. June 6th as our anchor date. ";
			anchor.setDate(anchorDateNum = 6);
			break;
		case 7:
			output += "For July we remember nine to five at seven eleven, so start with July 11th.  July 4th is always a doomsday too by the way. ";
			anchor.setDate(anchorDateNum = 11);
			break;
		case 8:
			output += "August is an even numbered month, so take it's month number, eight, i.e. August 8th as our anchor date. ";
			anchor.setDate(anchorDateNum = 8);
			break;
		case 9:
			output += "September falls under our nine to five at seven eleven rule. So September fifth is our achor. ";
			anchor.setDate(anchorDateNum = 5);
			break;
		case 10:
			output += "October is an even numbered month, so take it's month number, ten, i.e. October 10th as our anchor date. ";
			anchor.setDate(anchorDateNum = 10);
			break;
		case 11:
			output += "November is another nine to five at seven eleven month, so November 7th is our anchor. ";
			anchor.setDate(anchorDateNum = 7);
			break;			
		case 12:
			output += "December is an even numbered month, so take it's month number, twelve, i.e. December 12th as our anchor date. ";
			anchor.setDate(anchorDateNum = 12);
			break;

	}
	var outputResp = [];
	var daysAway = Math.round((day-anchor)/(1000*60*60*24));
	var weeksAway = Math.round(daysAway / 7);
	/*if(daysAway < 0){
		weeksAway++;// = Math.ceil(daysAway/7);
		daysAway += 7;
	}*/
	if(!testing) console.log('days away', daysAway);
	if(!testing) console.log('weeks away', weeksAway);
	if(daysAway == 0){
		outputResp = [0,0];
		output += "And we're done! Our day was a doomsday so the answer is " + getDoomsday();
	}
	else if(daysAway % 7 == 0){
		output += "If we count ";
		output += (daysAway < 0) ? "backwards" : "forwards";
		output += " " + weeksAway;
		outputResp = [weeksAway, 0];
		if(weeksAway == 1) {
			output += " week ";
		}
		else {
			output += " weeks ";
		}
		output += " we see our day is a doomsday and our answer is " + getDoomsday();
	}
	else if(weeksAway == 0){
		output += "If we count ";
		output += (daysAway < 0) ? "backwards" : "forwards";
		output += " " + Math.abs(daysAway);
		output += Math.abs(daysAway) == 1 ? " day " : " days ";
		output += "we can tell our answer is a " + dows[day.getDay()];
		outputResp = [0, daysAway];
	}
	else {
		var daysOff = daysAway % 7;
		var weeksGoNegative = anchor.getDate();

		output += "If we count ";
		output += (daysAway < 0) ? "backwards" : "forwards";
		output += " " + Math.abs(weeksAway);
		if(Math.abs(weeksAway) == 1) {
			output += " week ";
		}
		else {
			output += " weeks ";
		}
		output += "we can tell the " + numToOrdinal(anchorDateNum + (weeksAway * 7)) + " is a " + getDoomsday();
		var daysLeft = daysAway - (weeksAway * 7);
		outputResp = [weeksAway, daysLeft];
		output += ". Now we count ";
		output += daysLeft < 0 ? "backwards " : "forward ";
		output += Math.abs(daysLeft);
		output += Math.abs(daysLeft) == 1 ? " day " : " days ";
		output += "to our start date and see that the " + numToOrdinal(day.getDate());
		output += (day > new Date()) ? " will be " : " was ";
		output += "a " + dows[day.getDay()];

		//calculate number of days away and do the rest of the math
	}
	return testing ? outputResp : output;

}
function test(){
	var tests = [
		[new Date(2017, 4, 22), 2, -1],
		[new Date(2017, 4, 9), 0, 0],
		[new Date(2017, 4, 10), 0, 1],
		[new Date(2017, 0, 1), 0, -2],
		[new Date(2017, 0, 18), 2, 1],
		[new Date(2017, 2, 18), 3, -3],
	];
	var passed = true;
	for(test in tests){
		var t = tests[test];
		var res = walkthrough(t[0], 1);
		if(res[0] != t[1] || res[1] != t[2]){
			console.log("Problem with " + t[0] + " || expected " + t[1] + " weeks " + t[2] + " days but got " + res[0] + " weeks " + res[1] + " days");
			console.log("\r\n -- \r\n " + walkthrough(t[0]));
			passed = false;
		}
	}
	if(passed) console.log("all tests passed");
}

const handlers = {
	'LaunchRequest': function () {
		var res = "This year's doomsday is " + getDoomsday() +
			". Ask me to quiz you or say help for an explanation of " +
			"what the doomsday rule is";
		this.emit(":ask", res);
	},
	'test': function(){
		this.emit(":tell", 'okay');
	},
	'quiz': function ()	{

		var intent = this.event.request.intent;
		var attrs = this.event.session.attributes;

		//if we supplied a date it means they should be guessing now
		if(intent.slots.date.value) {
			//if(attrs.date){
			var guess = intent.slots.date.value;
			var date = new Date(attrs.date);
			//this.emit(':tell', guess + ' ' + date);
			if(guess == 'help'){

				this.emit(':tell', "Sure, here's how I'd do it. " + walkthrough(date));
			}
			var ans = dows[date.getDay()];
			if(ans == guess){
				this.emit(':tell', 'nice, you got it right');
			}
			else{
				if(attrs.badGuesses < 2){
					attrs.badGuesses++;
					resp = "Whoops, wrong answer.  Try again or say 'I give up' and I'll walk you through it";
					this.emit(':elicitSlot',
						'date',
						resp,
						'I\'ll give you some more time',
						intent);
				}
				else
				{
					this.emit(':tell', "hmm, still no luck.. Here's how I'd do it. " + walkthrough(date));
				}
			}


		}
		var randomDate = randomDateThisYear();
		attrs.date = randomDate;
		attrs.badGuesses = 0;
		var resp = "What day of the week is " + months[randomDate.getMonth()] + " " + numToOrdinal(randomDate.getDate()) + "?";

		//this.emit(':tell', resp);
		this.emit(':elicitSlot',
			'date',
			resp,
			'I\'ll give you some more time',
			intent);
	},
	'AMAZON.HelpIntent': function () {
		const speechOutput = 
			"The 'doomsday rule' is a way for you to figure out which day" + 
			" of the week a date will fall on." + 
			" Once you know the year's doomsday there's a day of each month you can use to help you figure out any day. " +
			" Doomsday is the last day of February. This year that's a " + getDoomsday() + ". Even months starting with April have a doomsday on the date matching the month number. In other words April 4th, June 6th, August 8th, October 10th and December 12th will all be on a " + getDoomsday() + " this year. For odd numbered months you can remember the phrase 'I work nine to five at seven eleven'.  The fifth of the ninth month, September 5th, and the ninth of the fifth month, May 9th, are both " + getDoomsday() + " same with the 7th of the eleventh month, and the eleventh of the 7th month. So November 7th and July 11th.  For January you can remember three quarters of the time, when it is not a leap year January 3rd will be doomsday. The other time, on leap years, the 4th will be doomsday.  For February you count backwards from the last day which is doomsday.  And finally March you count forward from what we call March zeroth";

		this.response.speak(speechOutput);
		this.emit(':responseReady');
	},
	'AMAZON.CancelIntent': function () {
		this.response.speak(STOP_MESSAGE);
		this.emit(':responseReady');
	},
	'AMAZON.StopIntent': function () {
		this.response.speak(STOP_MESSAGE);
		this.emit(':responseReady');
	},
};
