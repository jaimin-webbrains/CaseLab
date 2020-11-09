var express = require("express");
var bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
var mysql = require("mysql");
var validator = require("validator");
const e = require("express");
var cors = require("cors");
require("dotenv").config();
var cookieParser = require("cookie-parser");
const PORT = 5000;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET; //use crypto package to generate complex tokens
var sqlConfig = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    // password: process.env.MYSQL_PWD,
    database: process.env.MYSQL_DATABSE,
};

var pool = mysql.createPool(
    {
        connectionLimit: 10,
        ...sqlConfig,
    },
    (res) => console.log(res),
);
var con = pool;

var app = express();

app.use(express.static(process.env.IMAGE_STORAGE_PATH));

const corsOpts = {
    origin: "*",

    methods: ["GET", "POST"],

    allowedHeaders: ["Content-Type", "authorization"],
};
app.use(cors(corsOpts));

app.use(bodyParser.json());
app.use(cookieParser());
/* var con = mysql.createConnection(sqlConfig); */

const path = require("path");
const fs = require("fs");
const multer = require("multer");

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const fileStorePath = process.env.IMAGE_STORAGE_PATH;
        console.log("fileStorePath:", fileStorePath);
        // Path separators could change depending on the platform
        fileStorePath
            .toString()
            .split(path.sep)
            .reduce((prevPath, folder) => {
                const currentPath = path.join(prevPath, folder, path.sep);
                if (!fs.existsSync(currentPath)) {
                    fs.mkdirSync(currentPath);
                }
                console.log("currentPath:", currentPath);
                return currentPath;
            }, "");

        cb(null, fileStorePath);
    },
    filename: (req, file, cb) => {
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname),
        );
    },
});

const upload = multer({
    storage: storage,
});

app.post("/register", function (req, res) {
    if (
        req.body &&
        req.body.name &&
        req.body.email &&
        validator.isEmail(req.body.email) &&
        req.body.password
    ) {
        var sql = `SELECT * FROM users WHERE email='${req.body.email}'`;
        con.query(sql, function (err, result) {
            if (err) throw err;
            if (result.length > 0) {
                res.status(409).send({ message: "User already exists" });
            } else {
                con.query(
                    `INSERT INTO users (name, email, password,status) VALUES ('${req.body.name}', '${req.body.email}', '${req.body.password}','pending')`,
                    function (err, result) {
                        if (err) throw err;
                        console.log("User added.");
                        con.query(
                            `INSERT INTO request (name, email,userId) VALUES ('${req.body.name}', '${req.body.email}','${result.insertId}')`,
                            (err, result) => {
                                if (err) throw err;
                                res.status(200).send({ message: "User added" });
                            },
                        );
                    },
                );
            }
        });
    } else {
        res.sendStatus(400);
    }
});

app.post("/login", function (req, res) {
    if (
        req.body.email &&
        validator.isEmail(req.body.email) &&
        req.body.password
    ) {
        res.cookie("token", "token");
        con.query(
            `SELECT * FROM users WHERE email='${req.body.email}'`,
            function (err, result) {
                if (err) throw err;
                if (result.length < 1) {
                    return res.status(200).send({
                        status: -1,
                        message: "Email doesn't Exist",
                    });
                } else if (result[0].status === "accepted") {
                    if (result[0].password == req.body.password) {
                        let token = jwt.sign(
                            {
                                email: req.body.email,
                                password: req.body.password,
                            },
                            ACCESS_TOKEN_SECRET,
                            // {
                            //    expiresIn: "18000s",
                            // },
                        );
                        if (
                            req.body.email === "jaimin.prajapati786@gmail.com"
                        ) {
                            return res.send({
                                status: 1,
                                token: token,
                                role: "ADMIN",
                            });
                        } else {
                            return res.send({
                                status: 1,
                                token: token,
                            });
                        }
                    } else {
                        return res.status(200).send({
                            status: -2,
                            message: "Invalid password",
                        });
                    }
                } else if (result[0].status === "pending") {
                    return res.status(200).send({
                        status: 0,
                        message: "Your registration request on pending...",
                    });
                } else if (result[0].status === "rejected") {
                    return res.status(200).send({
                        status: -1,
                        message: "Your registration request is rejected.",
                    });
                }
            },
        );
    } else {
        return res.status(400).send({ message: "Bad Request" });
    }
});

//APIs that require authentication must be written below this function
app.use("/", function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token || !validator.isJWT(token)) {
        return res.sendStatus(401); //unauthorised
    }

    jwt.verify(token, ACCESS_TOKEN_SECRET, (error, user) => {
        if (error) {
            console.log(error);
            return res.sendStatus(403); //forbidden
        }
        next(); //allow further access
    });
});

app.post("/resetPassword", function (req, res) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const decodedValue = JSON.parse(
        Buffer.from(token.split(".")[1], "base64").toString(),
    );
    if (decodedValue.email === req.body.email) {
        if (
            req.body &&
            req.body.password &&
            req.body.confirmPassword &&
            req.body.email
        ) {
            if (req.body.password === req.body.confirmPassword) {
                con.query(
                    `UPDATE users SET password='${req.body.password}' WHERE email='${req.body.email}'`,
                    function (err, result) {
                        if (err) throw err;
                        if (result.affectedRows > 0) {
                            res.status(200).send({
                                message: "Pasword changed",
                            });
                        } else {
                            res.status(404).send({
                                message: "No such account found",
                            });
                        }
                    },
                );
            } else {
                res.status(400).send({
                    message: "Password fields do not match",
                });
            }
        } else {
            res.status(400).send({ message: "Bad Request" });
        }
    } else {
        res.status(400).send({ message: "Bad Request" });
    }
});

//Images APIs
app.post("/image", upload.single("document"), function (req, res) {
    try {
        console.log(req.body);
        const bodyParams = req.body;
        let title = bodyParams.title;
        let caseValue = bodyParams.case;
        let imagePath = req.file.path;
        let imageFileName = req.file.filename;
        con.query(
            `INSERT INTO images (title, filePath, fileName, caseId) VALUES ('${title}', '${imagePath}', '${imageFileName}', '${caseValue}')`,
            function (err, result) {
                if (err) throw err;
                console.log("Image added.");
                res.send({
                    message: "Image added",
                });
            },
        );
    } catch (e) {
        console.log("e::", e);
        return res.status(500).send(e.message);
    }
});

app.get("/images", function (req, res) {
    try {
        con.query(`SELECT * FROM images`, function (err, result) {
            if (err) throw err;
            if (result.length > 0) {
                res.send({
                    result,
                });
            }
        });
    } catch (e) {
        console.log("e::", e);
        return res.status(500).send(e.message);
    }
});

app.get("/images/:caseId", function (req, res) {
    try {
        const caseId = req.params.caseId;
        if (!caseId) {
            return res
                .status(500)
                .send({ message: "caseId parameter is require" });
        }
        con.query(
            `SELECT * FROM images where caseId='${caseId}' order by id`,
            function (err, result) {
                if (err) throw err;
                if (result.length > 0) {
                    res.send({
                        result,
                    });
                } else {
                    res.send({
                        result: [],
                    });
                }
            },
        );
    } catch (e) {
        return res.status(500).send(e.message);
    }
});

app.delete("/images/:imageId", function (req, res) {
    try {
        const imageId = req.params.imageId;
        if (!imageId) {
            return res
                .status(500)
                .send({ message: "imageId parameter is require" });
        }
        con.query(`Delete FROM images WHERE id='${imageId}'`, function (
            err,
            result,
        ) {
            if (err) throw err;
            console.log("Image Deleted.");
            res.send({
                message: "Image Deleted",
            });
        });
    } catch (e) {
        console.log("e::", e);
        return res.status(500).send(e.message);
    }
});

//Cases apis
app.post("/addCase", function (req, res) {
    try {
        const bodyParams = req.body;
        let title = bodyParams.title;
        let description = bodyParams.description;
        console.log("request coming::", bodyParams);
        con.query(
            `INSERT INTO cases (title, description) VALUES ('${title}', '${description}')`,
            function (err, result) {
                if (err) throw err;
                console.log("Case added.");
                res.send({
                    message: "Case added",
                });
            },
        );
    } catch (e) {
        console.log("e::", e);
        return res.status(500).send(e.message);
    }
});

app.get("/cases", function (req, res) {
    try {
        con.query(`SELECT * FROM cases order by id`, function (err, result) {
            if (err) throw err;
            if (result.length > 0) {
                res.send({
                    result,
                });
            } else {
                res.send({
                    result: [],
                });
            }
        });
    } catch (e) {
        console.log("e::", e);
        return res.status(500).send(e.message);
    }
});

app.post("/request", (req, res) => {
    try {
        let id = parseInt(req.body.userId);
        let status = req.body.status.toString();
        if (!req.body.userId) return res.status(400).send("No Body");
        con.query(
            `UPDATE request SET status="${status}" WHERE userId=${id}`,
            (err, result) => {
                if (err) return res.status(400).send(err);
                con.query(
                    `UPDATE users SET status="${status}" WHERE id=${id}`,
                    (err, result) => {
                        if (err) return res.status(400).send(err);
                        res.status(200).send(`User has been ${status}`);
                    },
                );
            },
        );
    } catch (e) {
        res.status(500).send(e.message);
    }
});

app.get("/getAllRequest", (req, res) => {
    try {
        con.query(
            `select * from request order by requestDate desc`,
            (err, result) => {
                if (err) return res.status(400).send(e);
                if (result.length === 0) return res.status(200).send("null");
                res.status(200).send({ result });
            },
        );
    } catch (e) {
        res.status(500).send(e);
    }
});

//starting server
var server = app.listen(PORT, function () {
    console.log(`The server is up on port: ${PORT}`);
});
