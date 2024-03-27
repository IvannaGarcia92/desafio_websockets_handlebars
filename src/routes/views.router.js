const express = require("express");
const router = express.Router(); 

const ProductManager = require("../controllers/ProductManager.js");
const productManager = new ProductManager("./src/models/products.json");

router.get("/",  async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render("home", {productos:products});
    } catch (error) {
        res.status(500).json({error: "Error interno del servidor"})
    }
})

router.get("/realTimeProducts", async (req, res) => {
    res.render("realTimeProducts");
})

module.exports = router; 