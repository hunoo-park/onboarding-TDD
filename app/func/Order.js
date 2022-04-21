import {getProductNum, setProductNum} from "../api/mongo";

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
    constructor(userName, productName, status, orderNum, date, price) {
        this._userName = userName;
        this._productName = productName;
        this._status = status;
        this._orderNum = orderNum;
        this._date = date;
        this._price = price;
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
    let presentNum = getProductNum(_productName);
    if (_orderNum <= presentNum) {
        orderObject._status = orderStatus.PAY_REQUEST;
    }
}

export const completeOrder = (orderObject) => {
    let {_userName, _productName, _status, _orderNum, _date} = orderObject;
    // 실제로 주문하는 행동을 하는 액션이 여기에 들어가야함.
    // 이부분에서 성공할시 status 를 complete 으로 바꾸는 거고
    // 실패하면 failed 가 되는 것. 결제가 언제 실패하는지에 따라 다시 수정해보자.

    if (setProductNum(_orderNum, _productName)) {
        orderObject._status = orderStatus.PAY_COMPLETE;
    } else {
        // 재고 변경을 하지 못했을 경우 -> 주문을 완료하지 못했을 것이므로
        // 주문 객체의 상태를 실패로 변경.
        orderObject._status = orderStatus.PAY_FAILED;
    }

}


// export const requestCancel = (orderObject) => {
//
// }