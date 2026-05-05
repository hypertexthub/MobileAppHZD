import express from "express";
import cors from "cors";
import mysql from "mysql2";

const app = express();

app.use(cors());
app.use(express.json());


const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "hdz"
});

app.get("/machines", async (req, res) => {
    try {
        const [machines] = await db.promise().query("SELECT * FROM machines");
        const [attacks] = await db.promise().query("SELECT * FROM attacks");
        const [vulns] = await db.promise().query("SELECT * FROM vulnerabilities");


        const result = machines.map(m => ({
            ...m,
            id: Number(m.id),
            attacks: attacks.filter(a => Number(a.machine_id) === Number(m.id)),
            vulnerabilities: vulns.filter(v => Number(v.machine_id) === Number(m.id))
        }));

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

app.listen(5001, () => {
    console.log("Server running on port 5001");
});