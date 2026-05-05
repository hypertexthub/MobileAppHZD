import mysql from "mysql2";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "hdz"
});

const filePath = path.join(__dirname, "data", "machines.json");
const raw = fs.readFileSync(filePath, "utf-8");
const data = JSON.parse(raw).machines;

db.connect(err => {
    if (err) throw err;
    console.log("Connected");

    data.forEach(machine => {
        db.query(
            `INSERT INTO machines (id, name, class, size_weight, weakness, strength, main_image)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                machine.id,
                machine.name,
                machine.class,
                machine.size_weight,
                machine.weakness,
                machine.strength,
                machine["main-image"]
            ]
        );

        machine.attacks?.forEach(a => {
            db.query(
                `INSERT INTO attacks (machine_id, type, description)
         VALUES (?, ?, ?)`,
                [machine.id, a.type, a.description]
            );
        });

        machine.vulnerabilities?.forEach(v => {
            db.query(
                `INSERT INTO vulnerabilities (machine_id, type, description)
         VALUES (?, ?, ?)`,
                [machine.id, v.type, v.description]
            );
        });

    });

    console.log("Seeding done");
});