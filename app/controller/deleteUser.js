const CustomerSchema = require("../models/customer");
const Msg            = require("../public/js/msg");
const mongoose       = require('mongoose');
const express        = require('express');
const bunyan         = require("bunyan");

mongoose.Promise = global.Promise;

const   padrao = mongoose.model("Customers", CustomerSchema);
var     log    = bunyan.createLogger({ name: "crud" });

const msg    = new Msg();
const router = express.Router();

router
    .route("/data/:user_id")
    .delete((req, res) => {
        padrao.deleteOne(
            {
                _id: req.params.user_id,
            },
            (error) => {
                if (error)
                {
                    res.render("pages/error", {
                        title: msg.titleError,
                        error: error,
                    });
                    log.warn("DELETE -> /data/" + req.params.user_id + " ❌ - " + error);
                }
                
                router.route("/");
                res.render("pages/actionPage", { title: msg.deleted });
                log.info("DELETE -> /data/" + req.params.user_id + " ✅");
            }
        );
    });

module.exports = router;
