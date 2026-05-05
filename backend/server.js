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

    const q = "SELECT * FROM machines WHERE id = ?";

    db.query(q, [id], (err, data) => {
        if (err) return res.status(500).json(err);

        return res.json(data[0]);
    });
});


app.listen(5001, () => {
    console.log("Server running on port 5001");
});