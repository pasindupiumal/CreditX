const express = require('express');
const fileUpload = require('express-fileupload');
const mongoose = require("mongoose");
const md5File = require('md5-file');
const path = require('path');
const cors = require('cors');

const Trans = require('./trans.model');

const app = express();

app.use(cors());

app.use(express.json());

const dbOpts = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
};

const db = "mongodb://127.0.0.1:27017/CreditX";

mongoose
    .connect(db, dbOpts)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log(err));

app.use(fileUpload());

/*app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});*/

app.get('/', (req, res) => {
    Trans.findOne({uid: req.query.id})
        .then(trans => {
            if (trans.hash) {
                res.json(trans)
            } else {
                res.json({status: 'failed', message: 'could not find the file with id'})
            }
        })
        .catch(err => {
            console.log(err);
            res.json({status: 'failed', message: 'could not find the file with id'})
        })
});

app.get('/shash', (req, res) => {
   Trans.findOne({uid: req.query.id})
       .then(trans => {
           if (trans.hash) {
               res.json({shash: trans.hash})
           } else {
               res.json({status: 'failed', message: 'could not find the file with id'})
           }
       })
       .catch(err => {
           console.log(err);
           res.json({status: 'failed', message: 'could not find the file with id'})
       })
});

app.get('/file', (req, res) => {
    res.sendfile(req.query.file);
});

app.get('/hash', (req, res) => {
    Trans.findOne({uid: req.query.id})
        .then(trans => {
            if (trans.filePath) {
                md5File(trans.filePath)
                    .then(hash => res.json({hash}))
                    .catch(err => {
                        console.log(err);
                        res.json({status: 'failed', message: 'hashing failed'})
                    })
            } else {
                res.json({status: 'failed', message: 'could not find the file with id'})
            }
        })
        .catch(err => {
           console.log(err);
           res.json({status: 'failed', message: 'could not find the file with id'})
        });
});

app.post('/update', (req, res) => {
    console.log(req.body)
    if (req.body.newId) {
        Trans.findOneAndUpdate({uid: req.query.id}, {uid: req.body.newId})
            .then(trans => {
                res.json({message: 'updated'})
            })
            .catch(err => {
                console.log(err);
                res.json({status: 'failed', message: 'could not find the file with id'})
            });
    } else {
        res.json({status: 'failed', message: 'New id not received'})
    }
});

app.post('/upload', async (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {

            let file = req.files.file;

            await file.mv('./uploads/' + file.name);

            let {id} = req.body;

            let trans = new Trans({uid: id, filePath: `${__dirname}/uploads/${file.name}`, hash: file.md5});

            Trans.findOne({uid: id})
                .then(t => {
                    if (t) {
                        Trans.updateOne({uid: id}, {uid: id, filePath: `/uploads/${file.name}`, hash: file.md5})
                            .then(() => {
                                res.send({
                                    status: true,
                                    message: 'File is uploaded',
                                    data: {
                                        name: file.name,
                                        mimetype: file.mimetype,
                                        size: file.size,
                                        hash: file.md5
                                    }
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.send({
                                    status: false,
                                    message: 'upload failed'
                                });
                            });
                    } else {

                        trans.save()
                            .then(() => {
                                res.send({
                                    status: true,
                                    message: 'File is uploaded',
                                    data: {
                                        name: file.name,
                                        mimetype: file.mimetype,
                                        size: file.size,
                                        hash: file.md5
                                    }
                                });

                            })
                            .catch(err => {
                                console.log(err);
                                res.send({
                                    status: false,
                                    message: 'upload failed'
                                });
                            });
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.send({
                        status: false,
                        message: 'upload failed'
                    });
                })

        }
    } catch (err) {
        res.status(500).send(err);
    }
});

// Port and Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));