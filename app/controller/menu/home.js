const Notification = require("../../public/js/notification");
const MenuSchema = require("../../models/menu");
const CartSchema = require("../../models/cart");
const Msg = require("../../public/js/msg");
const mongoose = require("mongoose");
const express = require("express");
const bunyan = require("bunyan");

var router = express.Router();
var log = bunyan.createLogger({ name: "crud" });

mongoose.Promise = global.Promise;

const msg = new Msg();
const cartSchema = mongoose.model("Cart", CartSchema);
const defaultSchema = mongoose.model("Menu", MenuSchema);

router.route("/").get((_req, res) => {
    defaultSchema.find((error, elementos) => {
        if (error) {
            res.render("pages/error", {
                title: msg.titleData,
                subtitle: msg.titleData,
                error: error,
            });
            log.warn("GET -> /data ❌ " + error);
        }
        const notificacao = new Notification(false);
        res.render("pages/data", {
            title: msg.titleData,
            name: "",
            data: elementos,
            notificacao: notificacao,
        });
        log.info("GET -> /data ✅");
    });
});

router.route("/").post((req, res) => {
    var element = new cartSchema();

    element.warehouseId = req.body.warehouseId;
    element.name = req.body.name;
    element.description = req.body.description;
    element.imageUrl = req.body.imageUrl;
    element.amount = req.body.amount;

    element.save((error) => {
        if (error) {
            res.send("Erro ao tentar salvar o elemento....: " + error);
            log.warn("POST -> / ❌ - " + error);
        }
        log.info(
            "POST -> / ✅ - Adicionado ao carrinho (" + element.name + ")"
        );
    });
});

router.route("/search?:name").get((req, res) => {
    defaultSchema.find((error, elementos) => {
        if (error)
            res.render("pages/error", {
                title: msg.titleData,
                error: error,
            });
        res.render("pages/data", {
            title: msg.titleResults,
            name: req.query.name,
            data: elementos,
        });
        log.info("GET -> /data/search?name=" + req.query.name + " ✅");
    });
});

module.exports = router;
