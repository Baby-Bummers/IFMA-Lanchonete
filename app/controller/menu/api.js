const bodyParser     = require("body-parser").json();
const Msg            = require("../../public/js/msg");
const MenuSchema     = require("../../models/menu");
const mongoose       = require("mongoose");
const bunyan         = require("bunyan");
const express        = require("express");

mongoose.Promise = global.Promise;

//Get schema
const defaultSchema = mongoose.model("Menu", MenuSchema);

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

        elemento.warehouseId = user.warehouseId;
        elemento.name        = user.name;
        elemento.description = user.description;
        elemento.imageUrl    = user.imageUrl;
        elemento.amount      = user.amount;

        defaultSchema.find((error, elementos) => {
            if (error) {
                isElegible = false;
                res.send(msg.titleData + " | " + error);
                log.warn("POST -> /api/post ❌ - " + error);
            }

            if (elementos[0] != undefined) {
                elementos.forEach((element) => {
                    if (
                        element.warehouseId == elemento.warehouseId
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
                                elemento.warehouseId
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
                            elemento.warehouseId +
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

            elemento.warehouseId = user.warehouseId;
            elemento.name        = user.name;
            elemento.image       = user.image;
            elemento.description = user.description;
            elemento.amount      = user.amount;

            elemento.save((_error) => {
                res.send(msg.edited);
            });
            log.info("PUT -> /api/put" + req.body._id + " ✅");
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
router.route("/delete/:itemId").delete((req, res) => {
    defaultSchema.findById(req.params.itemId, (error, _elemento) => {
        if (error) {
            res.send(msg.titleError + " | " + error);
            log.warn("DELETE -> /api/delete/" + req.params.itemId + " ❌");
        }
        defaultSchema.deleteOne(
            {
                _id: req.params.itemId,
            },
            (error) => {
                if (error) {
                    res.send(msg.titleError + " | " + error);
                    log.warn(
                        "DELETE -> /api/delete/" + req.params.itemId + " ❌"
                    );
                }

                router.route("/");
                res.send(msg.deleted);
                log.info(
                    "DELETE -> /api/delete/" + req.params.itemId + " ✅"
                );
            }
        );
    });
});

module.exports = router;
