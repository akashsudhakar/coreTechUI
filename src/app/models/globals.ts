import { Injectable } from '@angular/core';
import { UserI } from './user-i';

Injectable();
export class Globals {
    userI: UserI;

    constructor() {
        this.userI = {} as UserI;
    }

}
