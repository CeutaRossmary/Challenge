const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "challenge",
    password: "1234",
    max: 12,
    min: 2,
    idleTimeoutMillis: 3000,
    connectionTimeoutMillis: 2000,
});

async function create_user(name, email, password) {
    const client = await pool.connect();
    const { rows } = await client.query(`select * from users `);
    if (rows.length > 0) {
        await client.query({
            text: "insert into users (name, email, password) values ($1, $2, $3)",
            values: [name, email, password],
        });
    } else {
        await client.query({
            text: "insert into users (name, email, password) values ($1, $2, $3)",
            values: [name, email, password],
        });
    }
    client.release();
}

async function get_user(email) {
    const client = await pool.connect();

    const { rows } = await client.query({
        text: "select * from users where email=$1",
        values: [email],
    });
    client.release();

    return rows[0];
}

async function create_operacion(user_id, concepto, monto, fecha, tipo) {
    const client = await pool.connect();
    const datos = await client.query({
        text: "insert into gestor (user_id, concepto, monto,fecha,tipo) values ($1, $2, $3,$4,$5)",
        values: [user_id, concepto, monto, fecha, tipo],
    });
    client.release();
    console.log(datos)
}
async function get_operacion(id) {
    const client = await pool.connect();
    const { rows } = await client.query({
        text: "select * from  gestor where user_id=$1 ",
        values: [id],
    })
    client.release();
    return rows
}

async function delete_registro(id, user_id) {
    const client = await pool.connect();
    const { rows } = await client.query({
        text: "delete from gestor where gestor.id=$1 and gestor.user_id=$2",
        values: [id, user_id],
    });

    client.release();
    return rows[0];
}

async function update_registro(id, user_id, concepto, monto, fecha) {
    const client = await pool.connect();
    const { rows } = await client.query({
        text: "update gestor set concepto=$3, monto=$4, fecha=$5  where gestor.id=$1 and gestor.user_id=$2",
        values: [id, user_id, concepto, monto, fecha],
    });

    client.release();
    return rows[0];
}

async function get_operacion_tipo(id, tipo) {
    const client = await pool.connect();
    const { rows } = await client.query({
        text: "select * from  gestor where user_id=$1 and tipo=$2",
        values: [id, tipo],
    });
    client.release();
    return rows;
}


module.exports = {
    get_user,
    create_user,
    create_operacion,
    get_operacion,
    delete_registro,
    update_registro,
    get_operacion_tipo,
};