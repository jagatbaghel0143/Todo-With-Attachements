const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path');
const port = 3000
const multer = require('multer');
//const upload = multer({dest:"./public/images"})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/images");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})

const upload = multer({ storage: storage, fileFilter: fileFilter })

function fileFilter(req, file, cb) {
    if (file.mimetype === "image/jpg")
        cb(null, true);
    else if (file.mimetype === "image/png")
        cb(null, true);
    else if (file.mimetype === "image/jpeg")
        cb(null, true);
    else
        cb("filetype not supported", false);
}

app.use(function (req, res, next) {
    console.log(req.url);
    next();
})

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/image", upload.single('avatar'), function (err, res) {
    res.send("Image Uploaded SuccessFully");
})

app.get('/getTask', (req, res) => {
    fs.readFile('task.txt', "utf8", (err, data) => {
        if (err) {
            res.send("Oops Page Not Found 404!!!");
            return;
        }
        res.send(data);
    })
})

app.post("/save", (req, res) => {
    fs.writeFile("./task.txt", JSON.stringify(req.body), (err) => {
        if (err) {
            console.error(err);
            res.send("Can't save right now");
            return;
        }
        res.send("Task saved successfully");
    })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
