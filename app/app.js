import express from 'express';
// import {connect} from "./api/mongo.js";


export const app = express();
// connect();


export const server = app.listen(80, () => {
    console.log("server opened! port: 80");
});

app.get('/', (req, res) => {
    res.send("<div> HELLO WORLD!!!! </div>")
});

// app.get('/product', async (req, res) => {
//     const products = await getProduct("pencil");
//     res.send(products);
// })
//
// app.get('/card', async (req, res) => {
//     const cards = await getAllCard();
//     res.send(cards);
// })
//
// app.get(`/order`, async (req, res) => {
//     const orders = await getAllOrder();
//     res.send(orders);
// })
