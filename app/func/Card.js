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

export const validateCard = (cardObject) => {
    const {_cardComp, _cardNum, _userName, _limit} = cardObject;
    return mockCard[_cardComp][_cardNum]['validate'];
}

export const limitCard = (cardObject, orderObject) => {
    const {_cardComp, _cardNum, _userName, _limit} = cardObject;
    const {_orderNum, _price} = orderObject;
    let productPrice = _orderNum * _price;
    if (productPrice > _limit) {
        return false;
    } else {
        return true;
    }

}

const mockCard = {
    17: {
        101010: {
            validate: true,
            limit: '3000'
        },
        101020: {
            validate: false,
            limit: '3000'
        }
    },

    20: {
        202020: {
            validate: true,
            limit: '3000'
        },
        202030: {
            validate: false,
            limit: '3000'
        }
    }
}
