const Koa = require('koa');
const app = new Koa();

const MOCK_DATA = require('./data/mock-data');

app.use(async (ctx, next) => {
    ctx.body = MOCK_DATA;
    console.log("Request: " + ctx.URL);
    console.log("Message: " + ctx.body);
    await next();
});

app.listen(9000);
console.log("Listening on port 9000...");