const CartSchema = require("../../models/cart");
const Msg        = require("../../public/js/msg");
const mongoose   = require('mongoose');
const express    = require('express');
const bunyan     = require("bunyan");

mongoose.Promise = global.Promise;

const   defaultSchema = mongoose.model("Cart", CartSchema);
var     log    = bunyan.createLogger({ name: "crud" });

const msg    = new Msg();
const router = express.Router();

router.route("/:itemId").delete((req, res) => {
    defaultSchema.deleteOne(
        {
            _id: req.params.itemId,
        },
        (error) => {
            if (error) {
                res.render("pages/error", {
                    title: msg.titleError,
                    error: error,
                });
                log.warn(
                    "DELETE -> /data/" + req.params.itemId + " ❌ - " + error
                );
            }

            router.route("/");
            res.render("pages/actionPage", { title: msg.deleted });
            log.info("DELETE -> /data/" + req.params.itemId + " ✅");
        }
    );
});

module.exports = router;
