"use strict";
export function registerHelpers(hbs : any) {
    hbs.registerHelper('if_id', function (a : any){
        return a !== 0;
    });
    hbs.registerHelper('if_equal', function(a : any, b : any){
       return a===b;
    });
    hbs.registerHelper('getASCArrow', function(a : boolean){
        return a ? "&ShortUpArrow" : "&ShortDownArrow";
    });
}