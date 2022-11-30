const express = require('express')
const session = require('express-session')
const app = express()
const ejs = require('ejs')
const fs = require('fs')
const multer = require('multer')
let Id = 0
const upload = multer({ dest: 'uploads/' })
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('public'))
app.use(express.static('uploads'))
app.set('view engine', 'ejs')
app.set('views', __dirname + '/public')
app.route('/').get((req, res) => {
    fs.readFile("./data.txt","utf-8",(err,data)=>{
        if(!err)
        {
            let file;
            if(data.length===0)
            {
                file = []
            }
            else
            {
                file = JSON.parse(data)
            }
            res.render('index.ejs', { Error: "", data: file})
        }
    })
})

app.route('/postdata').post( upload.single('Profile'), (req, res) => {

    fs.readFile("./data.txt", "utf-8", (err, data) => {

        if (err) {
            res.send("Error Occured")
        }
        else {
            let file;
            if (data.length === 0) {
                file = []
            }
            else {
                file = JSON.parse(data)
            }
            if (req.body.Task === "" || req.file === undefined) {
                res.render('index.ejs', { Error: "Fields should not be empty", data: file})
            }
            else {
                let count = 0;
                file.forEach(function (obj) {
                    if (req.body.Task === obj.Task) {
                        count++;
                    }
                })
                if (count === 0) {
                    file.push({ Task: req.body.Task, url: req.file.filename, check: 0 })
                    Id++;
                    fs.writeFile("./data.txt", JSON.stringify(file), (err) => {

                    })
                    res.render('index.ejs', { Error: "", data: file})
                }
                else {
                    res.render('index.ejs', { Error: "Tasks should be Unique and Non-Empty", data: file})
                }
            }
        }
        })
    })

    app.post('/check',(req,res)=>{

        fs.readFile("./data.txt","utf-8",(err,data)=>{
            if(!err)
            {
                let file;
                if(data.length===0)
                {
                    file=[]
                }
                else
                {
                    file = JSON.parse(data)
                }
                file.forEach(function(obj)
                {
                    if(req.body.Id===obj.Task)
                    {
                        obj.check =!obj.check
                    }
                })
                fs.writeFile("./data.txt",JSON.stringify(file),(err)=>{
                    
                })
                res.end()
            }
        }) 
    })

    app.post('/delete',(req,res)=>{

        fs.readFile("./data.txt","utf-8",(err,data)=>{
            if(!err)
            {
                let file;
                if(data.length===0)
                {
                    file=[]
                }
                else
                {
                    file = JSON.parse(data)
                }
                let file2
                file2 = file.filter(function(obj)
                {
                        return (req.body.Id!=obj.Task)
                })
                fs.writeFile("./data.txt",JSON.stringify(file2),(err)=>{
                    
                })
                res.end()
            }
        })
    })
    app.listen(1201, () => {
        console.log(`Example app listening at http://localhost:1201`)
    })