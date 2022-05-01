const express = require("express");
const router = express.Router();

const {
    create_operacion,
    get_operacion,
    delete_registro,
    update_registro,
    get_operacion_tipo,
} = require("../db.js");


function protected_route(req, res, next) {
    if (!req.session.user) {
        // si quiere trabajar sin rutas protegidas, comente la siguiente línea
        return res.redirect("/login");
    }
    next();
}

// RUTAS
router.get("/", protected_route, async(req, res) => {
    res.render("index.html", {});
});

router.get("/listado_operaciones", protected_route, async(req, res) => {
    const operacion = await get_operacion();
    res.send({ operacion });
});

router.get("/operaciones", protected_route, async(req, res) => {
    const id = req.session.user.id;
    const operacion = await get_operacion(id);
    res.send(operacion);
});

router.post("/operacion", async(req, res) => {
    let user_id = req.session.user.id;
    let concepto = req.body.concepto;
    let monto = req.body.monto;
    let fecha = req.body.fecha;
    let tipo = req.body.tipo;

    await create_operacion(user_id, concepto, monto, fecha, tipo);
    res.redirect('/');
});

router.get("/delete/:id", async(req, res) => {
    let user_id = req.session.user.id;
    let id = req.params.id;
    try {
        await delete_registro(id, user_id);
        res.redirect('/operaciones.html');
    } catch (err) {
        res.json({ err })
    }
});

router.post("/update", async(req, res) => {;
    let user_id = req.session.user.id;
    let id = req.body.identificador;
    let concepto = req.body.concepto;
    let monto = req.body.monto;
    let fecha = req.body.fecha;

    await update_registro(id, user_id, concepto, monto, fecha);
    res.redirect('/operaciones.html');
});

router.post("/listado_tipo", protected_route, async(req, res) => {
    const id = req.session.user.id;
    let tipo = req.body.tipo;
    const operacion = await get_operacion_tipo(id, tipo);
    res.send(operacion);
});



module.exports = router;