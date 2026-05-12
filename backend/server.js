import express from "express";
import cors from "cors";
import mysql from "mysql2";
import multer from "multer";
import path from "path";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import { v4 as uuidv4 } from "uuid";

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));


app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static("uploads"));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "hdz"
});

db.connect((err) => {
    if (err) {
        console.log("Database error:", err);
    } else {
        console.log("MySQL connected");
    }
});

//register

app.post("/register", async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password required"
        });
    }

    try {
        const passwordHash = await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO users (email, password_hash)
            VALUES (?, ?)
        `;

        db.query(sql, [email, passwordHash], (err, result) => {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    message: "Creating user failed"
                });
            }

            res.json({
                message: "User created!"
            });

        });

    } catch (err) {

        res.status(500).json({
            message: "Server error"
        });
    }
});

app.post("/login", (req, res) => {

    const { email, password } = req.body;

    const sql = `
        SELECT * FROM users
        WHERE email = ?
    `;

    db.query(sql, [email], async (err, results) => {

        if (err) {
            return res.status(500).json({
                message: "Server error"
            });
        }

        if (results.length === 0) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const user = results[0];

        //password verification
        const validPassword = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!validPassword) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        //Token
        const token = uuidv4();

        //Expire
        const expiresAt = new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
        );

        //Save Session
        const sessionSql = `
            INSERT INTO sessions (
                user_id,
                token,
                expires_at
            )
            VALUES (?, ?, ?)
        `;

        db.query(
            sessionSql,
            [user.id, token, expiresAt],
            (err) => {

                if (err) {
                    return res.status(500).json({
                        message: "Session error"
                    });
                }

                //Send Cookie
                res.cookie("session_token", token, {
                    httpOnly: true,
                    secure: false, // attention true in production
                    sameSite: "lax",
                    expires: expiresAt
                });

                res.json({
                    message: "Logged in"
                });

            }
        );

    });

});

const authMiddleware = (req, res, next) => {

    const token = req.cookies.session_token;

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    const sql = `
        SELECT sessions.*, users.email
        FROM sessions
        JOIN users
        ON users.id = sessions.user_id
        WHERE token = ?
        AND expires_at > NOW()
    `;

    db.query(sql, [token], (err, results) => {

        if (err) {
            return res.status(500).json({
                message: "Server error"
            });
        }

        if (results.length === 0) {
            return res.status(401).json({
                message: "Invalid session"
            });
        }

        req.user = {
            id: results[0].user_id,
            email: results[0].email
        };

        next();

    });

};

//route login
app.get("/profile", authMiddleware, (req, res) => {

    res.json({
        user: req.user
    });

});

//logout
app.post("/logout", (req, res) => {

    const token = req.cookies.session_token;

    if (!token) {
        return res.json({
            message: "Already logged out"
        });
    }

    const sql = `
        DELETE FROM sessions
        WHERE token = ?
    `;

    db.query(sql, [token], (err) => {

        if (err) {
            return res.status(500).json({
                message: "Logout error"
            });
        }

        res.clearCookie("session_token");

        res.json({
            message: "Logged out"
        });

    });

});

//rendering all machines

app.get("/machines", authMiddleware, (req, res) => {
    const q = "SELECT * FROM machines";

    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json(data);
    });
});

//rendering single machine

app.get("/machines/:id", authMiddleware, (req, res) => {
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

app.post("/machines/:id/vulnerabilities", authMiddleware, (req, res) => {
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


//delete vulnerabilities
app.delete("/machines/:machineId/vulnerabilities/:id", authMiddleware, (req, res) => {
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

//storage image
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


//upload image

app.post("/machines/:id/images", authMiddleware, upload.single("image"), (req, res) => {
    const machineId = req.params.id;
    const file = req.file;
    const category = req.body.category;
    const userId = req.user.id;

    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const imageUrl = `http://localhost:5001/uploads/${file.filename}`;

    const q = `
        INSERT INTO machine_images (machine_id, image_url, category, uploaded_by)
        VALUES (?, ?, ?, ?)
    `;

    db.query(q, [machineId, imageUrl, category, userId], (err, result) => {
        if (err) { return res.status(500).json(err); }

        return res.json({
            message: "Uploaded",
            image: {
                id: result.insertId,
                image_url: imageUrl,
                category,
                uploaded_by: userId
            }
        });
    });
}
);

//deleting machine_image

app.delete("/machines/:machineId/images/:imageId", authMiddleware, (req, res) => {
    const { machineId, imageId } = req.params;
    const userId = req.user.id;

    const findQuery = `
        SELECT * FROM machine_images
        WHERE id = ? AND machine_id = ?
    `;

    db.query(findQuery, [imageId, machineId], (err, results) => {
        if (err) return res.status(500).json(err);

        if (results.length === 0) {
            return res.status(404).json({ message: "Image not found" });
        }

        const image = results[0];


        if (Number(image.uploaded_by !== userId)) {
            return res.status(403).json({ message: "Not allowed to delete this image" });
        }

        const deleteQuery = `
            DELETE FROM machine_images
            WHERE id = ? AND machine_id = ?
        `;

        db.query(deleteQuery, [imageId, machineId], (err2) => {
            if (err2) return res.status(500).json(err2);

            return res.json({
                message: "Image deleted",
                id: imageId
            });
        });
    });
});


//get user's favorites
app.get("/favorites", authMiddleware, (req, res) => {
    const userId = req.user.id;

    const sql = `
    SELECT 
        m.id,
        m.name,
        m.main_image,
        m.class,
        m.size_weight,
        m.weakness
    FROM favorites f
    JOIN machines m ON f.machine_id = m.id
    WHERE f.user_id = ?
`;

    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

//add a favorites
app.post("/favorites/:machineId", authMiddleware, (req, res) => {
    const userId = req.user.id;
    const machineId = req.params.machineId;

    const sql = `
        INSERT INTO favorites (user_id, machine_id)
        VALUES (?, ?)
    `;

    db.query(sql, [userId, machineId], (err) => {
        if (err) return res.status(500).json(err);

        res.json({ message: "Added to favorites" });
    });
});

app.delete("/favorites/:machineId", authMiddleware, (req, res) => {
    const userId = req.user.id;
    const machineId = req.params.machineId;

    const sql = `
        DELETE FROM favorites
        WHERE user_id = ? AND machine_id = ?
    `;

    db.query(sql, [userId, machineId], (err) => {
        if (err) return res.status(500).json(err);

        res.json({ message: "Removed from favorites" });
    });
});

//searching

app.get("/machines/search/:name", authMiddleware, (req, res) => {
    const { name } = req.params;

    const q = `
        SELECT *
        FROM machines
        WHERE name LIKE ?
    `;

    db.query(q, [`%${name}%`], (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: "DB error"
            });
        }

        return res.json(data);
    });
});