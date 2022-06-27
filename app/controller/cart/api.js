const bodyParser     = require("body-parser").json();
const Msg            = require("../../public/js/msg");
const CartSchema     = require("../../models/cart");
const mongoose       = require("mongoose");
const bunyan         = require("bunyan");
const express        = require("express");

mongoose.Promise = global.Promise;

//Get schema
const defaultSchema = mongoose.model("Cart", CartSchema);

const router     = express.Router();
const log        = bunyan.createLogger({ name: "crud" });

const msg        = new Msg();

router.route("/").get((_req, res) => {
    defaultSchema.find((error, elements) => {
        if (error) {
            res.send(msg.titleError + " | " + error);
            log.warn("GET -> /api/get ❌ - " + error);
        }
        res.send(elements);
    });
}).post(bodyParser, (req, res) => {
    var isElegible  = true;

    req.body._itens.forEach((user) => {
        log.info(user);

        var elemento    = new defaultSchema();
        var currentdate = new Date();

        elemento.firstname       = user.firstname;
        elemento.lastname        = user.lastname;
        elemento.nickname        = user.nickname;
        elemento.address         = user.address;
        elemento.bio             = user.bio;
        elemento.createdDateTime = currentdate;
        elemento.updatedDateTime = currentdate;

        defaultSchema.find((error, elementos) => {
            if (error) {
                isElegible = false;
                res.send(msg.titleData + " | " + error);
                log.warn("POST -> /api/post ❌ - " + error);
            }

            if (elementos[0] != undefined) {
                elementos.forEach((element) => {
                    if (
                        element.nickname == elemento.nickname ||
                        elemento.bio.length > 100 ||
                        elemento.nickname.length > 30
                    )
                        isElegible = false;
                });
                if (isElegible) {
                    elemento.save((error) => {
                        if (error) {
                            isElegible = false;
                            log.warn("POST -> /api/post ❌ - " + error);
                        }
                        log.info(
                            "POST -> /api/post ✅ - Bem-Vindo " +
                                elemento.nickname
                        );
                    });
                } else log.warn("POST -> /api/post ❌ - " + msg.elementError);
            } else {
                elemento.save((error) => {
                    if (error) {
                        isElegible = false;
                        log.warn("POST -> /api/post ❌ - " + error);
                    }
                    log.info(
                        "POST -> /api/post ✅ - Bem-Vindo (" +
                            elemento.nickname +
                            ")"
                    );
                });
            }
        });
    });
    if (isElegible) {
        res.send("Tudo ocorreu bem! ✅");
    } else {
        res.send("Ocorreu um erro ao criar os elemetos." + msg.elementError);
    }
}).put(bodyParser, (req, res) => {
    defaultSchema.find((error, elementos) => {
        if (error) {
            res.send(msg.titleData + " | " + error);
            log.warn(
                "PUT -> /api/put/" +
                    req.body._id +
                    " ❌ - " +
                    error
            );
        }
        defaultSchema.findById(req.body._id, (error, elemento) => {
            if (error) {
                res.send(msg.titleData + " | " + error);
                log.warn(
                    "PUT -> /api/put/" +
                        req.body._id +
                        "❌ - " +
                        error
                );
            }

            const static_nickname   = elemento.nickname;
            var isElegible          = false;
            var currentdate         = new Date();

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
                res.send(msg.titleData + " | " + error);
                log.warn(
                    "PUT -> /api/put" +
                        req.body._id +
                        " ❌ - " +
                        msg.elementError
                );
            } else {
                elemento.save((_error) => {
                    res.send(msg.edited);
                });
                log.info("PUT -> /api/put" + req.body._id + " ✅");
            }
        });
    });
}).delete((_req, res) => {
    defaultSchema.deleteMany(
        (error) => {
            if (error) {
                res.send(msg.titleError + " | " + error);
                log.warn(
                    "DELETE -> /api/data/ ❌"
                );
            }

            router.route("/");
            res.send("Todos os itens foram deletados 🗑");
            log.info("DELETE -> /api/data/ ✅");
        }
    );
});

//Delete element
router.route("/delete/:user_id").delete((req, res) => {
    defaultSchema.findById(req.params.user_id, (error, _elemento) => {
        if (error) {
            res.send(msg.titleError + " | " + error);
            log.warn("DELETE -> /api/delete/" + req.params.user_id + " ❌");
        }
        defaultSchema.deleteOne(
            {
                _id: req.params.user_id,
            },
            (error) => {
                if (error) {
                    res.send(msg.titleError + " | " + error);
                    log.warn(
                        "DELETE -> /api/delete/" + req.params.user_id + " ❌"
                    );
                }

                router.route("/");
                res.send(msg.deleted);
                log.info(
                    "DELETE -> /api/delete/" + req.params.user_id + " ✅"
                );
            }
        );
    });
});

module.exports = router;
