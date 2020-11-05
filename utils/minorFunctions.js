"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { listController } from "../controllers/ListController.js";
const characters = 'ABCDEFG HIJKLMNOPQ RSTUVW XYZa bcdef ghijk lmno pqrst uvwxyz012 3456789';
function createDummyNode() {
    return __awaiter(this, void 0, void 0, function* () {
        yield listController.addNewEntry("Title: " + generateRandomText(10), generateRandomText(characters.length * Math.floor((Math.random() * (15 - 1)) + 1)), Math.floor((Math.random() * (5 - 1)) + 1));
    });
}
function generateRandomText(length) {
    let textResult = "";
    for (let i = 0; i < length; i++) {
        textResult += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return textResult;
}
function giveStars(amount) {
    let retStr = "";
    for (let i = 0; i < 5; i++) {
        if (i < amount)
            retStr += '&starf; ';
        else
            retStr += '&star; ';
    }
    return retStr;
}
function getArrow(isASC) {
    return isASC ? "&ShortUpArrow;" : "&ShortDownArrow;";
}
export { createDummyNode, giveStars, getArrow };
