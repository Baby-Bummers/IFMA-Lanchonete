const UserSchema = require("../../models/customer");
const Msg        = require("../../public/js/msg");
const express    = require("express");
const mongoose   = require("mongoose");
const bunyan     = require("bunyan");

mongoose.Promise = global.Promise;

const router     = express.Router();
const log        = bunyan.createLogger({ name: "crud" });

const msg           = new Msg();
const defaultSchema = mongoose.model("Customers", UserSchema);

router.route("/:itemId/view_raw").get((req, res) => {
    defaultSchema.findById(req.params.itemId, (error, elemento) => {
        if (error)
        {
            res.render("pages/error", {
                title: msg.titleData,
                error: error,
            });
            log.warn("GET -> /data/" + req.params.itemId + 
                     "/view_raw ❌ - " + error);
        }

        res.send(elemento, (error) => {
            log.warn("Error : ", error);
        });
        log.info("GET -> /data/" + req.params.itemId + "/view_raw ✅");
    });
});

router.route("/:itemId/editMode").get((req, res) => {
    defaultSchema.findById(req.params.itemId, (error, elemento) => {
        if (error)
        {
            res.render("pages/error", {
                title: msg.titleData,
                error: error,
            });
            log.warn("GET -> /data/" + req.params.itemId + 
                        "/editMode ❌ - " + error);
        }

        res.render("pages/edit", {
            title: msg.titleData,
            data: elemento,
        });
        log.info("GET -> /data/" + req.params.itemId + "/editMode ✅");
        log.info("Você está modificando o usuário (" + elemento.nickname + ")");
    });
}).put((req, res) => {
    defaultSchema.find((error, elementos) => 
    {
        if (error)
        {
            res.render("pages/error", {
                title: msg.titleData,
                error: error,
            });
            log.warn("PUT -> /data/" + req.params.itemId + "/editMode ❌ - " + error);
        }
        elementos.save((_error) => {
            res.render("pages/actionPage", {
                title: msg.edited,
            });
        });
        log.info("PUT -> /data" + req.params.itemId + "/editMode ✅");
    })
});

module.exports = router;