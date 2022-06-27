const CartSchema = require("../../models/cart");
const Msg        = require("../../public/js/msg");
const mongoose   = require("mongoose");
const express    = require("express");
const bunyan     = require("bunyan");

var router       = express.Router();
var log          = bunyan.createLogger({ name: "crud" });

mongoose.Promise = global.Promise;

const msg           = new Msg();
const defaultSchema = mongoose.model("Cart", CartSchema);

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
        res.render("pages/cart", {
            title: msg.titleData,
            itemResult: "",
            totalAmount: 0,
            data: elementos,
        });
        log.info("GET -> /data ✅");
    });
});
router.route("/search?:itemResult").get((req, res) => {
    defaultSchema.find((error, elementos) => {
        if (error)
            res.render("pages/error", {
                title: msg.titleData,
                error: error,
            });

        res.render("pages/cart", {
            title: msg.titleResults,
            itemResult: req.query.itemResult,
            data: elementos,
        });
        log.info(
            "GET -> /cart/search?itemResult=" + req.query.itemResult + " ✅"
        );
    });
});
router.route("/:_id").delete((req, res) => {
    defaultSchema.deleteOne(
        {
            _id: req.params._id,
        },
        (error) => {
            if (error) {
                res.render("pages/error", {
                    title: msg.titleError,
                    error: error,
                });
                log.warn(
                    "DELETE -> /data/" + req.params._id + " ❌ - " + error
                );
            }

            router.route("/");
            res.render("pages/actionPage", { title: msg.deleted });
            log.info("DELETE -> /data/" + req.params._id + " ✅");
        }
    );
});

router.route("/payment").get((req, res) => {
    defaultSchema.deleteMany({},
        (error) => {
            if (error) {
                res.render("pages/error", {
                    title: msg.titleError,
                    error: error,
                });
                log.warn(
                    "DELETE -> /data/" + req.params._id + " ❌ - " + error
                );
            }

            router.route("/");
            res.render("pages/paymentMode", { title: msg.paid });
            log.info("DELETE -> /data/" + req.params._id + " ✅");
        }
    );
});

module.exports = router;