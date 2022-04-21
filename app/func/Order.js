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

    set userName(value) {
        this._userName = value;
    }

    set productName(value) {
        this._productName = value;
    }

    set status(value) {
        this._status = value;
    }

    set orderNum(value) {
        this._orderNum = value;
    }

    set date(value) {
        this._date = value;
    }

}

export const requestOrder = (orderObject) => {
    let {_userName, _productName, _status, _orderNum, _date} = orderObject;
    // 재고 확인을 해줘야함.
    let presentNum = getProductNum(_productName);
    if (_orderNum <= presentNum) {
        orderObject.status = orderStatus.PAY_REQUEST;
    }
    return orderObject;
}

export const completeOrder = (orderObject) => {
    let {_userName, _productName, _status, _orderNum, _date} = orderObject;


    if (setProductNum(_orderNum, _productName)) {
        orderObject.status = orderStatus.PAY_COMPLETE;
    } else {
        // 재고 변경을 하지 못했을 경우 -> 주문을 완료하지 못했을 것이므로
        // 주문 객체의 상태를 실패로 변경. ..여기 걸리는 경우는 왠만해선 없을것 같긴하다.
        orderObject.status = orderStatus.PAY_FAILED;
    }
    return orderObject;
}

export const sendOrder = (orderObject) => {
    // 실제로 주문하는 행동을 하는 액션이 여기에 들어가야함.
    // 이부분에서 성공할시 status 를 complete 으로 바꾸는 거고
    // 실패하면 failed 가 되는 것. 결제가 언제 실패하는지에 따라 다시 수정해보자.
    // 여기가 실패하는 경우는? 망취소의 경우
    let jsonOrder = JSON.stringify(orderObject);
    let responseResult = sendUsingNet(jsonOrder);
    return responseResult;
}

const sendUsingNet = (jsonString) => {
    return true;
}

export const requestCancel = (orderObject) => {
    orderObject.status = orderStatus.CANCEL_REQUEST;
    return orderObject;
}

export const completeCancel = (orderObject) => {
    // 취소 요건을 달성하는 것이라면
    orderObject.status = orderStatus.CANCEL_COMPLETE;
    // 아니라면 cancel_fail로 변경할예정.
    return orderObject;
}

export const requestRefund = (orderObject) => {
    orderObject.status = orderStatus.REFUND_REQUEST;
    return orderObject;
}

export const completeRefund = (orderObject) => {
    // 환불요건을 만족한다면 아래와 같이 상태를 바꾼다.
    orderObject.status = orderStatus.REFUND_COMPLETE;
    return orderObject;
}