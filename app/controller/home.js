const Notification  = require("../public/js/notification");
const UserSchema    = require("../models/customer");
const bodyParser    = require("body-parser").json();
const Msg           = require("../public/js/msg");
const mongoose      = require("mongoose");
const express       = require("express");
const bunyan        = require("bunyan");
const router        = express.Router();

mongoose.Promise    = global.Promise;

const log       = bunyan.createLogger({ name: "crud" });

const msg       = new Msg();
const padrao    = mongoose.model("Customers", UserSchema);

router.get("/", (_req, res) => {
    res.render("pages/index", {
        title: msg.titleForms,
        subtitle: msg.subtitleForms,
        notificacao: "",
    });
    log.info("GET -> / ✅");
});

router.route("/").post((req, res) => {
    var elemento    = new padrao();
    var errorBool   = false;
    var currentdate = new Date();

    elemento.firstname       = req.body.firstname;
    elemento.lastname        = req.body.lastname;
    elemento.nickname        = req.body.username;
    elemento.address         = req.body.address;
    elemento.bio             = req.body.bio;
    elemento.createdDateTime = currentdate;
    elemento.updatedDateTime = currentdate;
    padrao.find((error, elementos) => {
        if (error)
        {
            res.render("pages/error", {
                title: msg.titleError,
                error: error,
            });
            log.warn("POST -> / ❌ - " + error);
        }

        if (elementos[0] != undefined) {
            elementos.forEach((element) => {
                if (element.nickname         == elemento.nickname ||
                    elemento.bio.length      > 100                ||
                    elemento.nickname.length > 30
                    )
                        errorBool = true;
            });
            if (!errorBool)
            {
                elemento.save((error) => {
                    if (error)
                    {
                        res.send(msg.saveError + error);
                        log.warn("POST -> / ❌ - " + error);
                    } 
                    log.info("POST -> / ✅ - Bem-Vindo " + elemento.nickname);
                });
            }
            else
                log.warn("POST -> / ❌ - " + msg.elementError);
        } else
        {
            elemento.save((error) => {
                if (error)
                {
                    res.send("Erro ao tentar salvar o elemento....: " + error);
                    log.warn("POST -> / ❌ - " + error);
                }
                log.info("POST -> / ✅ - Bem-Vindo (" + elemento.nickname + ")");
            });
        }        
        const notificacao = new Notification(!errorBool);
        res.render("pages/index", {
            title: msg.titleForms,
            subtitle: msg.subtitleForms,
            notificacao: notificacao,
        });
    });
});

router.route("/post").post(bodyParser, (req, res) => {
    var elemento    = new padrao();
    var isElegible  = true;
    var currentdate = new Date();

    elemento.firstname       = req.body.firstname;
    elemento.lastname        = req.body.lastname;
    elemento.nickname        = req.body.nickname;
    elemento.address         = req.body.address;
    elemento.bio             = req.body.bio;
    elemento.createdDateTime = currentdate;
    elemento.updatedDateTime = currentdate;
    padrao.find((error, elementos) => {
        if (error) {
            res.render("pages/error", {
                title: msg.titleError,
                error: error,
            });
            log.warn("POST -> / ❌ - " + error);
        }

        if (elementos[0] != undefined) {
            elementos.forEach((element) => {
                if (
                    element.nickname         == elemento.nickname ||
                    elemento.bio.length      > 100                ||
                    elemento.nickname.length > 30
                )
                    isElegible = false;
            });
            if (isElegible) {
                elemento.save((error) => {
                    if (error) {
                        res.send(msg.saveError + error);
                        log.warn("POST -> /post ❌ - " + error);
                    }
                    log.info("POST -> /post ✅ - Bem-Vindo " + elemento.nickname);
                });
            } else log.warn("POST -> /post ❌ - " + msg.elementError);
        } else {
            elemento.save((error) => {
                if (error) {
                    res.send("Erro ao tentar salvar o elemento....: " + error);
                    log.warn("POST -> /post ❌ - " + error);
                }
                log.info(
                    "POST -> /post ✅ - Bem-Vindo (" + elemento.nickname + ")"
                );
            });
        }
        if (isElegible)
        {
            res.send("Bem - Vindo(" + elemento.nickname + ")");
        }
        else
        {
            res.send("Erro ao tentar criar o elemento." + msg.elementError);
        }
    });
});

router.route("/update").put(bodyParser, (req, res) => {
    var isElegible = false;
    padrao.find((error, elementos) => 
    {
        if (error)
        {
            res.render("pages/error", {
                title: msg.titleData,
                error: error,
            });
            log.warn("PUT -> /update (id:" + req.body._id + ") ❌ - " + error);
        }
            padrao.findById(req.body._id, (error, elemento) => {
                if (error) {
                    res.send("pages/error", {
                        title: msg.titleData,
                        error: error,
                    });
                    log.warn(
                        "PUT -> /update (id:" +
                            req.body._id +
                            ") ❌ - " +
                            error
                    );
                }
                const static_nickname = elemento.nickname;
                var currentdate = new Date();

                elemento.firstname       = req.body.firstname;
                elemento.lastname        = req.body.lastname;
                elemento.nickname        = req.body.nickname;
                elemento.address         = req.body.address;
                elemento.bio             = req.body.bio;
                elemento.updatedDateTime = currentdate;

                elementos.forEach((iterator) => {
                    if (
                        (static_nickname != elemento.nickname &&
                            iterator.nickname == elemento.nickname) ||
                        elemento.bio.length > 100 ||
                        elemento.nickname.length > 30
                    )
                        isElegible = true;
                });
                if (isElegible) {
                    res.send("pages/error", {
                        title: msg.titleData,
                        error: msg.elementError,
                    });
                    log.warn(
                        "PUT -> /update (id:" +
                            req.body._id +
                            ") ❌ - " +
                            error
                    );
                } else {
                    elemento.save((_error) => {
                        res.send(msg.edited);
                    });
                    log.warn("PUT -> /update (id:" + req.body._id + ") ✅");
                }
            });
    })
});

router.route("/data/view_raw").get((_req, res) => {
    padrao.find((error, elementos) => {
        if (error) {
            res.render("pages/error", {
                title: msg.titleError,
                error: error,
            });
            log.warn("GET -> /data_raw ❌ - " + error);
        }
        res.send(elementos)
    });
});

module.exports = router;