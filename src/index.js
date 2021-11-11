const Koa = require('koa');
const app = new Koa();

app.use(async (ctx, next) => {
    ctx.body = "Test response";
    console.log("Request: " + ctx.URL);
    console.log("Message: " + ctx.body);
    await next();
});

app.listen(9000);
console.log("Listening on port 9000...");