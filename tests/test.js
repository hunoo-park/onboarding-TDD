// 1. 주문 객체는 아래와 같은 상태를 가진다
//     1. [결제시작, 결제요청, 결제완료, 결제실패, 취소요청, 취소완료, 취소실패, 환불요청, 환불완료, 환불실패]
// 2. 각 기록은 직전 기록에 대해 의존성을 가진다.
//     1. 결제시작: 주문하는 상품이 장바구니에 담겨있고, 직전기록이 비어있어야 함
//     2. 결제요청: 직전기록이 결제시작 이어야 함
//     3. 결제완료: 직전기록이 결제요청이어야 함
//     4. 결제실패: 직전기록이 [결제요청, 결제시작] 중 하나
//     5. 취소요청: 직전기록이 [결제완료, 환불실패] 중 하나  (여기서 취소는 ‘결제 취소’를 의미)
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

import Order, {orderStatus, requestOrder, completeOrder, sendOrder, requestCancel,
    completeCancel, requestRefund, completeRefund} from '../app/func/Order'
import Card, {validateCard, limitCard} from '../app/func/Card'

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
        newOrder = createSampleOrder('MacBook', 10, 100, '000000000000');
    })
    test('1. 결제시작: 직전기록이 비어있어야 함.', () => {
        expect(newOrder._status).toEqual(orderStatus.PAY_STARTED);
    });

    test('2. 결제요청: 직전기록이 결제시작 이어야 함', () => {
        let beforeStatus = newOrder._status;
        expect(beforeStatus).toEqual(orderStatus.PAY_STARTED);
        // 결제요청하는 함수
        let changedOrder = requestOrder(newOrder);
        // 결제 이후엔 이전과 다른 상태여야 함
        expect(changedOrder._status).not.toEqual(beforeStatus);
    });

    test('3. 결제완료: 직전기록이 결제요청이어야 함', () => {
        let changedOrder = requestOrder(newOrder);
        let beforeStatus = newOrder._status;
        let completedOrder = completeOrder(changedOrder);
        expect(beforeStatus).toEqual(orderStatus.PAY_REQUEST);
    })

    test('추가 테스트, 결제완료 후 재고가 변경되었는가?', () => {
        let changedOrder = requestOrder(newOrder);
        let completedOrder = completeOrder(changedOrder); // 현재 completeOrder 안에 있는 setProductNum함수에서 재고 변경한다고 가정.

    })

    // 4. 결제실패: 직전기록이 [결제요청, 결제시작] 중 하나
    // 위의 시나리오의 경우 두가지 분기가 가능하다.
    // 결제시작 -> 결제실패 로 가는 경우
    // 결제요청 -> 결제실패 로 가는 경우 이다. 이 중 결제시작 -> 결제실패로 가는 경우는 후에 서술되어 있지만
    // 재고가 없을 경우를 의미한다.

    describe('4. 결제실패: 직전기록이 [결제요청, 결제시작] 중 하나', () => {
        let newOrder;
        beforeEach(() => {
            newOrder = createSampleOrder('MacBook', 11, 100, '000000000000');
        });
        test('직전기록이 [결제요청] 인 경우', () => {
            let changedOrder = requestOrder(newOrder)
            let beforeStatus = newOrder._status;
            let completedOrder = completeOrder(changedOrder);
            expect(beforeStatus).toEqual(orderStatus.PAY_REQUEST);
            expect(completedOrder._status).not.toEqual(beforeStatus);
        });

        test('직전기록이 [결제시작] 인 경우', () => {
            let overOrder = createSampleOrder('MacBook', 21, 100, '000000000000');
            let changedOrder = requestOrder(overOrder) // 결제를 시작은 하였음. -> 사용자가 버튼을 누른것
            // 만약 재고가 부족했다면 status는 여전히 started 일것
            let beforeStatus = overOrder._status;
            expect(beforeStatus).toEqual(orderStatus.PAY_STARTED);
            let completedOrder = completeOrder(changedOrder);
            expect(completedOrder._status).toEqual(orderStatus.PAY_FAILED);
            expect(completedOrder._status).not.toEqual(beforeStatus);
            // 전제를 가정해놓고 테스트하고자 하는 함수에 집중. spyOn.
        })
    })

    //5. 취소요청: 직전기록이 [결제완료, 환불실패] 중 하나
    describe('5. 취소요청: 직전기록이 [결제완료, 환불실패] 중 하나', () => {
        let newOrder, changedOrder, completedOrder;
        beforeEach(() => {
            newOrder = createSampleOrder('MacBook', 10, 100, '000000000000');
            changedOrder = requestOrder(newOrder);
            completedOrder = completeOrder(changedOrder);

        })

        test('직전기록이 결제완료 인 경우', () => {
            let beforeStatus = completedOrder._status;
            let canceledOrder = requestCancel(completedOrder);
            expect(beforeStatus).toEqual(orderStatus.PAY_COMPLETE);
            expect(canceledOrder._status).toEqual(orderStatus.CANCEL_REQUEST);
        });

        test('직전기록이 환불실패인 경우', () => {

        });
        // 6. 취소실패: 직전기록이 취소요청 이어야 함
    //     7. 취소완료: 직전기록이 취소요청 이어야 함

        test('6. 취소실패: 직전기록이 취소요청 이어야 함', () => {

        });

        test('7. 취소완료: 직전기록이 취소요청 이어야 함', () => {
            let canceledOrder = requestCancel(newOrder);
            let beforeStatus = canceledOrder._status;
            expect(beforeStatus).toEqual(orderStatus.CANCEL_REQUEST);
            let completedOrder = completeCancel(canceledOrder);
        });

        //     8. 환불요청: 직전기록이 [결제완료, 취소실패] 중 하나
        //     9. 환불완료: 직전기록이 환불요청 이어야 함
        //     10. 환불실패: 직전기록이 환불요청 이어야 함
        test('환불요청, 직전기록이 결제완료 인 경우', () => {
            let beforeStatus = completedOrder._status;
            let refundedOrder = requestRefund(completedOrder);
            expect(beforeStatus).toEqual(orderStatus.PAY_COMPLETE);
        });

        test('환불요청, 직전기록이 취소 실패 인 경우', () => {

        });
    });



    test('9. 환불완료: 직전기록이 환불요청 이어야 함', () => {
        let newOrder = createSampleOrder('watch', 3, 1000, '000000000000');
        let refundedOrder = requestRefund(newOrder);
        let beforeStatus = refundedOrder._status;
        expect(beforeStatus).toEqual(orderStatus.REFUND_REQUEST);
        let completedOrder = completeRefund(refundedOrder);
        expect(completedOrder._status).toEqual(orderStatus.REFUND_COMPLETE);
    });
    test('10. 환불실패: 직전기록이 환불요청 이어야 함', () => {
        let newOrder = createSampleOrder('watch', 3, 1000, '000000000000');
        let refundedOrder = requestRefund(newOrder);
        let beforeStatus = refundedOrder._status;
        expect(beforeStatus).toEqual(orderStatus.REFUND_REQUEST);
        // 이 다음 확인은 completeRefund 함수에서 실패할 경우이다.
    });



});

// 3. 아래와 같은 경우 결제가 실패한다
//     1. 사용자의 결제정보가 올바르지 않을 경우
//         1. 카드사와 카드정보가 일치하지 않는 경우
//         2. 카드가 한도초과 일 경우
//     2. 결제를 시작한 상품의 재고가 없을 경우
//         1. 결제 시작 이후 결제요청으로 가기전 (사용자가 결제 정보를 입력하기 전) 재고를 확인한다.
//         이때 재고가 없다면 주문의 상태는 결제 요청으로 바뀌지 않고 결제 실패로 바뀌게 된다.

describe('결제가 실패하는 경우 테스트', () => {
    let failOrder;
    beforeEach(() => {
        failOrder = createSampleOrder('iPhone', 21, 200, '000000000000');
    });
    describe('1. 사용자의 결제정보가 올바르지 않을 경우', () => {
        test('카드사와 카드정보가 일치하지 않는 경우', () => {
            let userCard = createSampleCard(17, 101020 );
            let authorizationResult = validateCard(userCard);
            expect(authorizationResult).toBe(false);
        });

        test('카드가 한도초과 일 경우', () => {
            let userCard = createSampleCard(17, 101010);
            expect(limitCard(userCard, failOrder)).toBe(false);
        });
    });

    describe( '2. 결제를 시작한 뒤 발생하는 액션의 문제', () => {
        test('결제를 시작한 상품의 재고가 없을 경우', () => {
            let beforeStatus = failOrder._status;
            let changedOrder = requestOrder(failOrder);
            expect(changedOrder._status).toEqual(orderStatus.PAY_STARTED);

        });

        test('정상적인 응답이 오지 않았을 경우', () => {
            let newOrder = createSampleOrder('iPad', 15, 200, '000000000000');
            let beforeStatus = newOrder._status;
            let changedOrder = requestOrder(newOrder);
            sendOrder(changedOrder);
            const sendResult = jest.fn();
            sendResult.mockReturnValue(false);

            expect(sendResult(changedOrder)).toBe(false);
        })
    })
})


// 4. 취소 및 환불은 아래와 같은 경우 불가능하다.
//     1. 구매일로부터 회사에서 정한 기간이 지났을 경우
//     2. 취소 및 환불규정을 만족하지 않을 경우
// 5. 주문의 상세내용은 결제시작 상태(결제요청 이전)에서만 변경 가능하다.
//     1. 여기서 주문의 상세내용이라 함은, 결제 수단 등 사용자의 결제 정보를 의미한다.

describe('구매일로부터 회사에서 정한 기간이 지났을 경우', () => {
    let newOrder;
    beforeEach(() => {
        newOrder = createSampleOrder('airpod', 3, 10, '000000000000')

    })
    test('취소가 불가능한 경우', () => {
        let completedOrder = completeCancel(newOrder);
        expect(completedOrder._status).toEqual(orderStatus.CANCEL_FAILED);
    });

    test('환불이 불가능한 경우', () => {
        let completedOrder = completeRefund(newOrder);
        expect(completedOrder._status).toEqual(orderStatus.REFUND_FAILED);
    });
})



const createSampleOrder = (productName, orderNum, price, purchasedDate) => {
    const presentDate = Date.now();
    return new Order(
        "Hongil",
        productName,
        "payStarted",
        orderNum,
        presentDate,
        price,
        purchasedDate
    )
};

const createSampleCard = (cardComp, cardNum) => {
    return new Card(
        cardComp,
        cardNum,
        "Hongil",
        "3000"
    )
};