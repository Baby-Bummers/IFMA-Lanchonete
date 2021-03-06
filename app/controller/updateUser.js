const UserSchema = require("../models/customer");
const Msg        = require("../public/js/msg");
const express    = require("express");
const mongoose   = require("mongoose");
const bunyan     = require("bunyan");

mongoose.Promise = global.Promise;

const router     = express.Router();
const log        = bunyan.createLogger({ name: "crud" });

const msg        = new Msg();
const padrao     = mongoose.model("Customers", UserSchema);

router.route("/data/:user_id").get((req, res) => {
    padrao.findById(req.params.user_id, function (error, elemento) {
        if (error) 
        {
            res.render("pages/error", {
                title: msg.titleData,
                error: error
            });
            log.warn(
                "GET -> /data/" + req.params.user_id + " ❌ - " + error
            );
        }

        res.render("pages/dataUnique", {
            title: msg.titleData,
            data: elemento,
        });
        log.info("GET -> /data/" + req.params.user_id + " ✅");
    });
});

router.route("/data/:user_id/view_raw").get((req, res) => {
    padrao.findById(req.params.user_id, function (error, elemento) {
        if (error)
        {
            res.render("pages/error", {
                title: msg.titleData,
                error: error,
            });
            log.warn("GET -> /data/" + req.params.user_id + 
                     "/view_raw ❌ - " + error);
        }

        res.send(elemento, function (error) {
            log.warn("Error : ", error);
        });
        log.info("GET -> /data/" + req.params.user_id + "/view_raw ✅");
    });
});

router.route("/data/:user_id/mode_edit").get((req, res) => {
    padrao.findById(req.params.user_id, function (error, elemento) {
        if (error)
        {
            res.render("pages/error", {
                title: msg.titleData,
                error: error,
            });
            log.warn("GET -> /data/" + req.params.user_id + 
                        "/mode_edit ❌ - " + error);
        }

        res.render("pages/edit", {
            title: msg.titleData,
            data: elemento,
        });
        log.info("GET -> /data/" + req.params.user_id + "/mode_edit ✅");
        log.info("Você está modificando o usuário (" + elemento.nickname + ")");
    });
}).put((req, res) => {
    padrao.find((error, elementos) => 
    {
        if (error)
        {
            res.render("pages/error", {
                title: msg.titleData,
                error: error,
            });
            log.warn("PUT -> /data/" + req.params.user_id + "/mode_edit ❌ - " + error);
        }
        padrao.findById(req.params.user_id, (error, elemento) => {
            if (error)
            {
                res.render("pages/error", {
                    title: msg.titleData,
                    error: error,
                });
                log.warn("PUT -> /data/" + req.params.user_id + "/mode_edit ❌ - " + error);
            }
            //Guardamos o valor já presente no BD
            const static_nickname = elemento.nickname;
            var errorEqualsNick = false;
            //Poderiamos usar este valor `new Date().toDateString() + " | " + new Date().toTimeString()`
            // que é mais legivel para o usuario, mas eu optei por não mudar o padrão do schema
            var currentdate = new Date();

            elemento.firstname  = req.body.firstname;
            elemento.lastname   = req.body.lastname;
            elemento.nickname   = req.body.nickname;
            elemento.address    = req.body.address;
            elemento.bio        = req.body.bio;
            elemento.dataUltima = currentdate;

            elementos.forEach((iterator) => {
                if (
                    static_nickname             != elemento.nickname    &&
                    iterator.nickname           == elemento.nickname    ||
                    elemento.bio.length         > 100                   ||
                    elemento.nickname.length    > 30
                    )
                        errorEqualsNick = true;
            });
            if (errorEqualsNick)
            {
                res.render("pages/error", {
                    title: msg.titleData,
                    error: msg.elementError,
                });
                log.warn("PUT -> /data" + req.params.user_id + "/mode_edit ❌ - " + msg.elementError);
            }
            else
            {
                elemento.save((_error) => {
                    res.render("pages/actionPage", {
                        title: msg.edited,
                    });
                });
                log.info("PUT -> /data" + req.params.user_id + "/mode_edit ✅");
            }
        });
    })
});

module.exports = router;