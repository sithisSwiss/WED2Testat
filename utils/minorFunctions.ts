"use strict";
import {listController} from "../controllers/ListController.js";
const characters = 'ABCDEFG HIJKLMNOPQ RSTUVW XYZa bcdef ghijk lmno pqrst uvwxyz012 3456789';

async function createDummyNode(){
        await listController.addNewEntry(
            "Title: " + generateRandomText(10),
            generateRandomText(characters.length * Math.floor((Math.random() * (15 - 1)) + 1)),
            Math.floor((Math.random() * (5 - 1)) + 1),
            );
}

function generateRandomText(length: number) : string{
    let textResult : string = "";
    for (let i = 0; i < length; i++) {
        textResult += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return textResult;
}

function giveStars(amount: number): string {
    let retStr : string = "";
    for (let i = 0; i < 5; i++) {
        if (i < amount) retStr += '&starf; ';
        else retStr += '&star; ';
    }
    return retStr;
}

function getArrow(isASC : boolean) : string{
    return isASC ? "&ShortUpArrow;" : "&ShortDownArrow;"
}

export {createDummyNode, giveStars, getArrow}