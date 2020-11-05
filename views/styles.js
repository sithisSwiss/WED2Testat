"use strict";
import { cookieHandler } from "../services/CookieHandler.js";
class Style {
    constructor() {
        /*#activeStyle;
        //get activeStyle(){ return this.#activeStyle}
        set activeStyle(value){
            if(typeof value === typeof this.#activeStyle)
            this.#activeStyle = value;
        }*/
        this._styleEnum = {
            default: 0,
            colorful: 1,
        };
    }
    nextStyle() {
        switch (cookieHandler.getFrontendStyle()) {
            case this._styleEnum.default:
                cookieHandler.setFrontendStyle(this._styleEnum.colorful);
                break;
            case this._styleEnum.colorful:
                cookieHandler.setFrontendStyle(this._styleEnum.default);
                break;
            default:
                cookieHandler.setFrontendStyle(this._styleEnum.default);
                break;
        }
    }
    getStyle() {
        const style = {
            title: "best app for Nodes",
            testing: true,
            frontendStyle: "defaultStyle",
        };
        switch (cookieHandler.getFrontendStyle()) {
            case this._styleEnum.default:
                break;
            case this._styleEnum.colorful:
                style.frontendStyle = "colorfulStyle";
                break;
        }
        return style;
    }
}
export const webStyle = new Style();
