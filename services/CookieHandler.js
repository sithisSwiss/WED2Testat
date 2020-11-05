"use strict";
export class CookieHandler {
    constructor() {
        this._userSettings = {
            listSorted: 0,
            isASC: true,
            showFinished: true,
            frontendStyle: 0
        };
    }
    readCookies(req) {
        let cooklieTemp;
        if (req.cookies.listSorted) {
            cooklieTemp = req.cookies.listSorted;
            if ([0, 1, 2, 3].indexOf(cooklieTemp) >= 0)
                this._userSettings.listSorted = cooklieTemp;
        }
        if (req.cookies.isASC) {
            cooklieTemp = req.cookies.isASC;
            if (typeof cooklieTemp === "boolean")
                this._userSettings.isASC = cooklieTemp;
        }
        if (req.cookies.showFinished) {
            cooklieTemp = req.cookies.showFinished;
            if (typeof cooklieTemp === "boolean")
                this._userSettings.showFinished = cooklieTemp;
        }
        if (req.cookies.frontendStyle) {
            cooklieTemp = req.cookies.frontendStyle;
            if ([0, 1, 2, 3].indexOf(cooklieTemp) >= 0)
                this._userSettings.frontendStyle = cooklieTemp;
        }
    }
    updateCookies(res) {
        res.cookie("listSorted", this._userSettings.listSorted);
        res.cookie("isASC", this._userSettings.isASC);
        res.cookie("showFinished", this._userSettings.showFinished);
        res.cookie("frontendStyle", this._userSettings.frontendStyle);
    }
    setListSorted(isSortedOver) {
        this._userSettings.listSorted = isSortedOver;
    }
    setIsASC(isASC) {
        this._userSettings.isASC = isASC;
    }
    setSortingComplete(isSortedOver, isASC) {
        this.setListSorted(isSortedOver);
        this.setIsASC(isASC);
    }
    setShowFinished(isShowFinished) {
        this._userSettings.showFinished = isShowFinished;
    }
    setFrontendStyle(frontendStyle) {
        this._userSettings.frontendStyle = frontendStyle;
    }
    getListSorted() {
        return this._userSettings.listSorted;
    }
    getIsASC() {
        return this._userSettings.isASC;
    }
    getShowFinished() {
        return this._userSettings.showFinished;
    }
    getFrontendStyle() {
        return this._userSettings.frontendStyle;
    }
}
export const cookieHandler = new CookieHandler();
