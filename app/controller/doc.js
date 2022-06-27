const Notification = require("../public/js/notification");
const Msg          = require("../public/js/msg");
const mongoose     = require("mongoose");
const express      = require("express");
const bunyan       = require("bunyan");

var log = bunyan.createLogger({ name: "crud" });

mongoose.Promise = global.Promise;

const msg         = new Msg();
const notificacao = new Notification(true);

const router = express.Router();

router.route("/").get((_req, res) => {
    res.render("pages/doc", {
        title: msg.titleDoc,
        subtitle: msg.sutitleDoc,
        notificacao: notificacao,
    });
    log.info("GET -> /doc ✅");
});

module.exports = router;
