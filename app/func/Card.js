export default class Card {
    constructor(cardComp, cardNum, userName, limit) {
        this._cardComp = cardComp;
        this._cardNum = cardNum;
        this._userName = userName;
        this._limit = limit;
    }

    get CardComp() {
        return this._cardComp;
    }

    get CardNum() {
        return this._cardNum;
    }

    get UserName() {
        return this._userName;
    }

    get Limit() {
        return this._limit;
    }
}