//server
const express = require("express");
const app = express(); 
const PORT = 8080;

// router (import)
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");

// handlebars (import)
const exphbs = require("express-handlebars");

// socket.io (import)
const socket = require("socket.io");

// middlewares
//app.use(express.static("./src/public"));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//Handlebars config
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// routes
app.use("/api", productsRouter);
app.use("/api", cartsRouter);
app.use("/", viewsRouter);

// refe al sevidor de express
const httpServer = app.listen(PORT, () => {
    console.log(`Listening on PORT: ${PORT}`);
});

//instancia socket.io (server)
const io = socket(httpServer);

const ProductManager = require("./controllers/ProductManager.js");
const productManager = new ProductManager("./src/models/products.json");

// escuchamos el evento connection
io.on("connection", async (socket) => {
    console.log("New client connected");

    //el servidor envía los productos al cliente
    socket.emit("products", await productManager.getProducts());

    //el servidor escucha cuando el cliente elimina un producto
    socket.on("deleteProduct", async (id) => {
        await productManager.deleteProduct(id);
    });
    // el servidor envía los productos actualizados al cliente
    socket.emit("products", await productManager.getProducts());

    //el servidor escucha cuando el cliente agrega un producto
    socket.on("addProduct", async (product) => {
        await productManager.addProduct(product);
        // el servidor envía los productos actualizados al cliente
        socket.emit("products", await productManager.getProducts());
    })
})
