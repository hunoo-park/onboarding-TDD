// import { MongoClient, Db } from "mongodb";
//
// const dbUrl = "mongodb://localhost:27017";
//
// const defaultDbName = "payment";
// const orderCollection = "order";
// const cardCollection = 'card';
// const productCollection = 'product';
//
// const client = new MongoClient(dbUrl, {useNewUrlParser: true ,useUnifiedTopology: true});

export const getProductNum = (productName) => {
    // db에 가서 해당 product 의 수량이 몇개 남았는지 알려주는 함수
    return 20;
}

export const setProductNum = (numChange, productName) => {
    //db 로 가서 해당 product 의 개수를 변경해주는 함수
    // findOneAndUpdate method 를 활용 해서 db collections 에 접근해야함
    // 변경에 성공했을 경우에 true 를 리턴.
    return true;
}