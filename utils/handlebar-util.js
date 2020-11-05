"use strict";
export function registerHelpers(hbs) {
    hbs.registerHelper('if_id', function (a) {
        return a !== 0;
    });
    hbs.registerHelper('if_equal', function (a, b) {
        return a === b;
    });
    hbs.registerHelper('getASCArrow', function (a) {
        return a ? "&ShortUpArrow" : "&ShortDownArrow";
    });
}
