const express = require('express');
const multer = require('multer')
require('./config');
const Product = require('./product');

const app = express();

app.use(express.json())

app.post('/create', async (req, resp) => {
    let data = new Product(req.body);
    let result = await data.save()
    resp.send(result)
});

app.get('/getdata', async (req, resp) => {
    let data = await Product.find();
    resp.send(data)
})

app.delete('/delete/:_id', async (req, resp) => {
    let data = await Product.deleteOne(req.params);
    resp.send(data)
})

app.put('/update/:_id', async (req, resp) => {
    let data = await Product.updateOne(
        req.params,
        {$set: req.body});
    resp.send(data)
})

//Search key

app.get('/search/:key', async (req, resp) => {
    console.log(req.params.key)
    let data = await Product.find({
            "$or":[
                {"name": {$regex:req.params.key}}
            ]
        }
    )
    resp.send(data)
})

// file upload

const upload = multer({
    storage:multer.diskStorage({
        destination: function(req, file, cb){
            cb(null, "upload")
        },
        filename: function(req, file, cb){
            cb(null, file.fieldname+"-"+ Date.now()+'.jpg')
        }
    })
}).single('user_file')

app.post('/upload', upload, (req, resp) => {
    resp.send('upload api work')
})

app.listen(4000);