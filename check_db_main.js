const mysql = require("mysql2/promise");

async function checkDb() {
    const pool = mysql.createPool({
        host: "localhost",
        user: "root",
        password: "root",
        database: "crud-api-case2",
    });

    try {
        const [rows] = await pool.query("SELECT id, fileName, filePath FROM topicrequests ORDER BY id DESC LIMIT 10");
        console.log("Last 10 Topic Requests:");
        console.table(rows);

        const [id20] = await pool.query("SELECT id, fileName, filePath FROM topicrequests WHERE id = 20");
        console.log("ID 20 details:", JSON.stringify(id20));
    } catch (err) {
        console.error("Error:", err);
    } finally {
        await pool.end();
    }
}

checkDb();
