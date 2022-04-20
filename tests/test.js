// 1. 주문 객체는 아래와 같은 상태를 가진다
//     1. [결제시작, 결제요청, 결제완료, 결제실패, 취소요청, 취소완료, 취소실패, 환불요청, 환불완료, 환불실패]
// 2. 각 기록은 직전 기록에 대해 의존성을 가진다.
//     1. 결제시작: 주문하는 상품이 장바구니에 담겨있고, 직전기록이 비어있어야 함
//     2. 결제요청: 직전기록이 결제시작 이어야 함
//     3. 결제완료: 직전기록이 결제요청이어야 함
//     4. 결제실패: 직전기록이 [결제요청, 결제시작] 중 하나
//     5. 취소요청: 직전기록이 [결제완료, 결제실패, 환불실패] 중 하나  (여기서 취소는 ‘결제 취소’를 의미)
//     6. 취소실패: 직전기록이 취소요청 이어야 함
//     7. 취소완료: 직전기록이 취소요청 이어야 함
//     8. 환불요청: 직전기록이 [결제완료, 결제실패, 취소실패] 중 하나
//     9. 환불완료: 직전기록이 환불요청 이어야 함
//     10. 환불실패: 직전기록이 환불요청 이어야 함
//
// 3. 아래와 같은 경우 결제가 실패한다
//     1. 사용자의 결제정보가 올바르지 않을 경우
//         1. 카드사와 카드정보가 일치하지 않는 경우
//         2. 카드가 한도초과 일 경우
//     2. 결제를 시작한 상품의 재고가 없을 경우
//         1. 결제 시작 이후 결제요청으로 가기전 (사용자가 결제 정보를 입력하기 전) 재고를 확인한다. 이때 재고가 없다면 주문의 상태는 결제 요청으로 바뀌지 않고 결제 실패로 바뀌게 된다.
//
//             ⇒ 현재 기록이 ‘결제실패' 인데 직전기록이 ‘결제시작'이라면 재고가 부족하다는 의미인 셈
//
// 4. 취소 및 환불은 아래와 같은 경우 불가능하다.
//     1. 구매일로부터 회사에서 정한 기간이 지났을 경우
//     2. 취소 및 환불규정을 만족하지 않을 경우
// 5. 주문의 상세내용은 결제시작 상태(결제요청 이전)에서만 변경 가능하다.
//     1. 여기서 주문의 상세내용이라 함은, 결제 수단 등 사용자의 결제 정보를 의미한다.

import Order, {orderStatus, requestOrder, completeOrder} from '../app/func/Order'

// test No.1
// 1. 주문 객체는 아래와 같은 상태를 가진다
//     1. [결제시작, 결제요청, 결제완료, 결제실패, 취소요청, 취소완료, 취소실패, 환불요청, 환불완료, 환불실패]
// 2. 각 기록은 직전 기록에 대해 의존성을 가진다.
//     1. 결제시작: 직전기록이 비어있어야 함
//     2. 결제요청: 직전기록이 결제시작 이어야 함
//     3. 결제완료: 직전기록이 결제요청이어야 함


describe('객체의 상태확인 테스트', () => {
    let newOrder;
    beforeEach(() => {
        newOrder = createSampleOrder('MacBook', 10);
    })
    test('처음 상태는 started 이어야 한다.', () => {
        expect(newOrder._status).toEqual(orderStatus.PAY_STARTED);
    });

    test('결제요청을 하기위해선 직전기록이 결제시작 이어야 한다.', () => {
        let beforeStatus = newOrder._status;
        expect(beforeStatus).toEqual(orderStatus.PAY_STARTED);
        // 결제요청하는 함수
        requestOrder(newOrder);
        // 결제 이후엔 이전과 다른 상태여야 함
        expect(newOrder._status).not.toEqual(beforeStatus);
    });

    test('결제완료는 직전기록이 결제요청 이어야 한다.', () => {
        requestOrder(newOrder);
        let beforeStatus = newOrder._status;
        completeOrder(newOrder);
        expect(beforeStatus).toEqual(orderStatus.PAY_REQUEST);
    })
});

// test No.2
// 4. 결제실패: 직전기록이 [결제요청, 결제시작] 중 하나
// 위의 시나리오의 경우 두가지 분기가 가능하다.
// 결제시작 -> 결제실패 로 가는 경우
// 결제요청 -> 결제실패 로 가는 경우 이다. 이 중 결제시작 -> 결제실패로 가는 경우는 후에 서술되어 있지만
// 재고가 없을 경우를 의미한다.

describe('4. 결제실패: 직전기록이 [결제요청, 결제시작] 중 하나', () => {
    let newOrder;
    beforeEach(() => {
        newOrder = createSampleOrder('MacBook', 11);
    });
    test('직전기록이 [결제요청] 인 경우', () => {
        requestOrder(newOrder)
        let beforeStatus = newOrder._status;
        completeOrder(newOrder);
        expect(beforeStatus).toEqual(orderStatus.PAY_REQUEST);
        expect(newOrder._status).not.toEqual(beforeStatus);
    });

    test('직전기록이 [결제시작] 인 경우', () => {
        let beforeStatus = newOrder._status;
        requestOrder(newOrder) // 결제를 시작은 하였음. -> 사용자가 버튼을 누른것

    })
})



const createSampleOrder = (productName, orderNum) => {
    const presentDate = Date.now();
    return new Order(
        "Hongil",
        productName,
        "payStarted",
        orderNum,
        presentDate
    )
};