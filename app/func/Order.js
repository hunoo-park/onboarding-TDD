export const orderStatus = {
    PAY_STARTED: 'payStarted',
    PAY_REQUEST: 'payRequest',
    PAY_COMPLETE: 'payComplete',
    PAY_FAILED: 'payFailed',
    CANCEL_REQUEST: 'cancelRequest',
    CANCEL_COMPLETE: 'cancelComplete',
    CANCEL_FAILED: 'cancelFailed',
    REFUND_REQUEST: 'refundRequest',
    REFUND_COMPLETE: 'refundComplete',
    REFUND_FAILED: 'refundFailed'
}


export default class Order {
    constructor(userName, productName, status, orderNum, date) {
        this._userName = userName;
        this._productName = productName;
        this._status = status;
        this._orderNum = orderNum;
        this._date = date;
    }

    get UserName() {
        return this._userName;
    }

    get ProductName() {
        return this._productName;
    }

    get Status() {
        return this._status;
    }

    get OrderNum() {
        return this._orderNum;
    }

    get Date() {
        return this._date;
    }
}

export const requestOrder = (orderObject) => {
    let {_userName, _productName, _status, _orderNum, _date} = orderObject;
    // 재고 확인을 해줘야함.

    orderObject._status = orderStatus.PAY_REQUEST;

}

export const completeOrder = (orderObject) => {
    let {_userName, _productName, _status, _orderNum, _date} = orderObject;
    orderObject._status = orderStatus.PAY_COMPLETE;
}