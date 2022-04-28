const express = require("express");
const router = express.Router();
router.use(express.static("static"));


const {
    create_operacion,
    get_operacion,
    delete_registro,
} = require("../db.js");


// router.use(express.static(htmlPath));

function protected_route(req, res, next) {
    if (!req.session.user) {
        // si quiere trabajar sin rutas prptegidas, comente la siguiente línea
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
    //console.log(operacion);
    send.json({ operacion });
});

router.get("/operaciones", protected_route, async(req, res) => {
    const id = req.session.user.id;
    const operacion = await get_operacion(id);
    //console.log(operacion);
    res.send(operacion);
    // res.send(id_login);

});

router.post("/operacion", async(req, res) => {
    let user_id = req.session.user.id;
    //console.log(user_id);
    let concepto = req.body.concepto;
    let monto = req.body.monto;
    let fecha = req.body.fecha;
    let tipo = req.body.tipo;

    await create_operacion(user_id, concepto, monto, fecha, tipo);
    const operacion = await get_operacion()
        //console.log(operacion);
    res.json({ operacion });
});

router.post("/delete", async(req, res) => {
    let user_id = req.session.user.id;
    console.log("este es el ", req.body.id);
    let id = req.body.id;

    await delete_registro(id, user_id);
    //const operacion = await get_operacion();


    return res.render("index.html");
});



module.exports = router;