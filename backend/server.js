import express from "express";
import cors from "cors";
import mysql from "mysql2";
import multer from "multer";
import path from "path";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "hdz"
});

//manage storage

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 999 * 1024
    },
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype === "image/jpeg" ||
            file.mimetype === "image/png"
        ) {
            cb(null, true);
        } else {
            cb(new Error("Only JPG/PNG allowed"));
        }
    }
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
    const imagesQuery = "SELECT * FROM machine_images WHERE machine_id = ?";

    db.query(machineQuery, [id], (err, machineData) => {
        if (err) return res.status(500).json(err);

        db.query(attacksQuery, [id], (err, attacksData) => {
            if (err) return res.status(500).json(err);

            db.query(vulnQuery, [id], (err, vulnData) => {
                if (err) return res.status(500).json(err);

                db.query(imagesQuery, [id], (err, imagesData) => {
                    if (err) return res.status(500).json(err);

                    const machine = machineData[0];

                    machine.attacks = attacksData;
                    machine.vulnerabilities = vulnData;
                    machine.images = imagesData;

                    res.json(machine);
                });
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

//remove vulnerability

// app.delete("/vulnerabilities/:id", (req, res) => {
//     const id = req.params.id;
//     const machineId = req.body.machine_id;

//     const q = `
//         DELETE FROM vulnerabilities 
//         WHERE id = ? AND machine_id = ?
//     `;

//     db.query(q, [id, machineId], (err, data) => {
//         if (err) return res.status(500).json(err);
//         return res.json({ message: "Vulnerability deleted" });
//     });
// });

app.delete("/machines/:machineId/vulnerabilities/:id", (req, res) => {
    const { machineId, id } = req.params;

    const q = `
        DELETE FROM vulnerabilities 
        WHERE id = ? AND machine_id = ?
    `;

    db.query(q, [id, machineId], (err) => {
        if (err) return res.status(500).json(err);
        return res.json({ message: "Vulnerability deleted" });
    });
});


//uploading image


app.post("/machines/:id/images", upload.single("image"), (req, res) => {
    const machineId = req.params.id;
    const file = req.file;
    const category = req.body.category;

    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const imageUrl = `http://localhost:5001/uploads/${file.filename}`;

    const q = `
        INSERT INTO machine_images (machine_id, image_url, category)
        VALUES (?, ?, ?)
    `;

    db.query(q, [machineId, imageUrl, category], (err) => {
        if (err) return res.status(500).json(err);
        return res.json({ message: "Uploaded" });
    });
});

