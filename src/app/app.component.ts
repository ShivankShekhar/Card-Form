import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface CardData {
  imageId: string;
  state: 'default' | 'flipped' | 'matched';
}

interface DateFormat {
  number: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('cardFlip', [
      state('default', style({
        transform: 'none'
      })),
      state('flipped', style({
        transform: 'rotateY(-180deg)'
      })),
      transition('default => flipped', [
        animate('400ms')
      ]),
      transition('flipped => default', [
        animate('400ms')
      ])
    ])
  ]
})
export class AppComponent {
  state = "default"
  selectedMonth: string = "MM";
  selectedYear: string = "YY";
  isCardHolder: boolean = false;
  isExpire: boolean = false;
  isNumber: boolean = false;
  name: string = "";
  cvv: string = "";
  cardNumber: string = "";
  cardInput: string = "";
  cardType: string = "";

  months: DateFormat[] = [
    { number: "01" }, { number: "02" }, { number: "03" }, { number: "04" },
    { number: "05" }, { number: "06" }, { number: "07" }, { number: "08" },
    { number: "09" }, { number: "10" }, { number: "11" }, { number: "12" },
  ];
  years: DateFormat[] = [
    { number: "21" }, { number: "22" }, { number: "23" },
    { number: "24" }, { number: "25" }, { number: "26" }
  ];

  constructor(private _snackBar: MatSnackBar) { }

  padRight = function (input) {
    return input + new Array(16 - input.length + 1).join('#');
  }

  validateInput(event: any, length: number, lenLimit: number) {
    if ([46, 8, 9, 18, 17, 27, 13, 110].indexOf(event.keyCode) !== -1 ||
      // Allow: Ctrl+A
      (event.keyCode === 65 && (event.ctrlKey || event.metaKey)) ||
      // Allow: Ctrl+C
      (event.keyCode === 67 && (event.ctrlKey || event.metaKey)) ||
      // Allow: Ctrl+V
      (event.keyCode === 86 && (event.ctrlKey || event.metaKey)) ||
      // Allow: Ctrl+X
      (event.keyCode === 88 && (event.ctrlKey || event.metaKey)) ||
      // Allow: home, end, left, right
      (event.keyCode >= 35 && event.keyCode <= 39)) {
      // let it happen, don't do anything
      return
    }
    // Ensure that it is a number and stop the keypress
    if ((event.shiftKey || (event.keyCode < 48 || event.keyCode > 57)) && (event.keyCode < 96 || event.keyCode > 105) || length > lenLimit) {
      event.preventDefault();
      if (length > lenLimit)
        this.openSnackBar("Only " + (lenLimit + 1) + " digits allowed");
      else
        this.openSnackBar("Only Numbers allowed");
    }
  }

  validateStringInput(event: any) {
    if ([46, 8, 9, 16, 17, 20, 18, 27, 13, 110].indexOf(event.keyCode) !== -1 ||
      // Allow: Ctrl+A
      (event.keyCode === 65 && (event.ctrlKey || event.metaKey)) ||
      // Allow: Ctrl+C
      (event.keyCode === 67 && (event.ctrlKey || event.metaKey)) ||
      // Allow: Ctrl+V
      (event.keyCode === 86 && (event.ctrlKey || event.metaKey)) ||
      // Allow: Ctrl+X
      (event.keyCode === 88 && (event.ctrlKey || event.metaKey)) ||
      // Allow: home, end, left, right
      (event.keyCode >= 35 && event.keyCode <= 39)) {
      // let it happen, don't do anything
      return
    }
    // Ensure that it is a number and stop the keypress
    if ((event.keyCode < 65 || event.keyCode > 90) && event.keyCode !== 32) {
      event.preventDefault();
      this.openSnackBar("Only Strings allowed");
    }
  }

  genCardNum() {
    this.cardNumber = this.padRight(this.cardInput).match(/.{1,4}/g).join(" ");
    this.cardType = this.getCardType(this.cardInput);
  }

  getCardType(cardNum) {
    var payCardType = "";
    var regexMap = [
      { regEx: /^4[0-9]{5}/ig, cardType: "VISA" },
      { regEx: /^5[1-5][0-9]{4}/ig, cardType: "MASTERCARD" },
      { regEx: /^3[47][0-9]{3}/ig, cardType: "AMEX" },
      { regEx: /^(5[06-8]\d{4}|6\d{5})/ig, cardType: "MAESTRO" }
    ];
    for (var j = 0; j < regexMap.length; j++) {
      if (cardNum.match(regexMap[j].regEx)) {
        payCardType = regexMap[j].cardType;
        break;
      }
    }
    if (cardNum.indexOf("50") === 0 || cardNum.indexOf("60") === 0 || cardNum.indexOf("65") === 0) {
      var g = "508500-508999|606985-607984|608001-608500|652150-653149";
      var i = g.split("|");
      for (var d = 0; d < i.length; d++) {
        var c = parseInt(i[d].split("-")[0], 10);
        var f = parseInt(i[d].split("-")[1], 10);
        if ((cardNum.substr(0, 6) >= c && cardNum.substr(0, 6) <= f) && cardNum.length >= 6) {
          payCardType = "RUPAY";
          break;
        }
      }
    }
    return payCardType;
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "", { duration: 1000 });
  }
}
