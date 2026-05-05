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

//rendering all machines

app.get("/machines", (req, res) => {
    const q = "SELECT * FROM machines";

    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json(data);
    });
});

//rendering single machine

app.get("/machines/:id", (req, res) => {
    const id = req.params.id;

    const machineQuery = "SELECT * FROM machines WHERE id = ?";
    const attacksQuery = "SELECT * FROM attacks WHERE machine_id = ?";
    const vulnQuery = "SELECT * FROM vulnerabilities WHERE machine_id = ?";

    db.query(machineQuery, [id], (err, machineData) => {
        if (err) return res.status(500).json(err);

        db.query(attacksQuery, [id], (err, attacksData) => {
            if (err) return res.status(500).json(err);

            db.query(vulnQuery, [id], (err, vulnData) => {
                if (err) return res.status(500).json(err);

                const machine = machineData[0];

                machine.attacks = attacksData;
                machine.vulnerabilities = vulnData;

                res.json(machine);
            });
        });
    });
});


app.listen(5001, () => {
    console.log("Server running on port 5001");
});

//add vulnerability

app.post("/machines/:id/vulnerabilities", (req, res) => {
    const machineId = req.params.id;
    const { type, description } = req.body;

    const q = `
        INSERT INTO vulnerabilities (machine_id, type, description)
        VALUES (?, ?, ?)
    `;

    db.query(q, [machineId, type, description], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json({ message: "Vulnerability added" });
    });
});