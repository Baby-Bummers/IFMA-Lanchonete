const CustomerSchema = require("../models/customer");
const Msg            = require("../public/js/msg");
const mongoose       = require("mongoose");
const express        = require("express");
const bunyan         = require("bunyan");

var router           = express.Router();
var log              = bunyan.createLogger({ name: "crud" });

mongoose.Promise     = global.Promise;

const msg           = new Msg();
const defaultSchema = mongoose.model("Customers", CustomerSchema);

router.route("/").get((_req, res) => {
    defaultSchema.find((error, elementos) => {
        if (error)
        {
            res.render("pages/error", {
                title: msg.titleData,
                subtitle: msg.titleData,
                error: error,
            });
            log.warn("GET -> /data ❌ " + error)
        }
        res.render("pages/data", {
            title: msg.titleData,
            nicknameResult: "",
            data: elementos,
        });
        log.info("GET -> /data ✅");
    });
});

router.route("/search?:nickname").get((req, res) => {
    defaultSchema.find((error, elementos) => {
        if (error)
            res.render("pages/error", {
                title: msg.titleData,
                error: error,
            });

        res.render("pages/data", {
            title: msg.titleResults,
            nicknameResult: req.query.nickname,
            data: elementos,
        });
        log.info("GET -> /data/search?nickname=" + req.query.nickname + " ✅");
    });
});

    module.exports = router;