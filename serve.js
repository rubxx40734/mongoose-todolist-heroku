
const http = require('http');
const Room = require('./model/rooms.js')
const mongoose = require('mongoose');
const dotenv = require('dotenv')

dotenv.config({path:'./config.env'})
const DB = process.env.DATABASE.replace(
    '<password>',
    process.env.DATABASEPASSWORD
)
console.log(DB)
mongoose.connect(DB)
 .then(() => { console.log('資料庫連線成功')})
 .catch(err => {console.log(err)})


// const roomSchema = new mongoose.Schema(
//     {
//         name : String,
//         price : {
//             type : Number,
//             required : [true,'價格必填']
//         },
//         rating : Number,
//         createdAt : {
//             type: Date,
//             default : Date.now,
//             select : false
//         }
//     },
//     {
//         versionKey: false,
//     }
// )

// const Room = mongoose.model('Room', roomSchema)
// Room > rooms
// user > users
// 開頭字小寫 (mongodb特性)
// 強制加上s
// Room.create(
//     {
//         name : '副總統套房6-model',
//         price : 7800,
//         rating : 5
//     }
// ).then(res => {
//     console.log('新增資料成功')
// }).catch(error => {
//     console.log(error.errors)
// })

// const testRoom = new Room(
//     {
//     name : '副總統套房2',
//     price : 2500,
//     rating : 5
//     },
// )

// testRoom.save()
//   .then(res => {
//       console.log(res,'新增資料成功')
//   })
//   .catch(error => {
//       console.log(error)
//   })

const httpRequest = async (req,res) => {
    let body = ''
    req.on('data', chunk => {
        body += chunk
    })
    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
       'Content-Type': 'application/json'
      }
    if (req.url == '/rooms' && req.method == 'GET'){
        const rooms = await Room.find()
        res.writeHead(200,headers)
        res.write(JSON.stringify({
            "status" : "success",
             rooms
        }))
        res.end()
    }else if (req.url == '/rooms' && req.method == 'POST') {
        req.on('end', async() => {
            try{
                const data = JSON.parse(body)
                const newRoom = await Room.create(data)
                console.log('await', newRoom)
                res.writeHead(200,headers)
                res.write(JSON.stringify({
                    "status" : "success",
                    newRoom
                }))
                res.end()
            }
            catch(error){
                res.writeHead(400,headers)
                res.write(JSON.stringify({
                    "status" : "false",
                    "message" : "格式錯誤 or 找無此ID",
                    "error" : error
                }))
                res.end()
            }
        })
    }else if (req.url == '/rooms' && req.method == 'DELETE') {
        const room = await Room.deleteMany({})
        res.writeHead(200,headers)
        res.write(JSON.stringify({
            "status" : "success",
             room
        }))
        res.end()
    }else if (req.url.startsWith('/rooms/') && req.method == "DELETE") {
        const id = req.url.split('/').pop()
        try{
            const room = await Room.findByIdAndDelete(id)
            res.writeHead(200,headers)
            res.write(JSON.stringify({
                "status" : "success",
                 room
            }))
            res.end()
        }
        catch(error){
            res.writeHead(400,headers)
            res.write(JSON.stringify({
                "status" : "false",
                "message" : "格式錯誤 or 找無此ID",
                "error" : error
            }))
            res.end()
        }
    }else if (req.url.startsWith('/rooms/') && req.method == "PATCH") {
            req.on('end', async() => {
                try{
                    const id = req.url.split('/').pop()
                    const name = JSON.parse(body).name
                    const price = JSON.parse(body).price
                    const rating = JSON.parse(body).rating
                    console.log(name,price,rating)
                    const room = await Room.findByIdAndUpdate(id,{
                        name : name,
                        price : price,
                        rating : rating
                    })
                    res.writeHead(200,headers)
                    res.write(JSON.stringify({
                        "status" : "success",
                         room
                    }))
                    res.end()
                }
                catch(error){
                res.writeHead(400,headers)
                res.write(JSON.stringify({
                "status" : "false",
                "message" : "格式錯誤 or 找無此ID",
                "error" : error
                }))
                res.end()
            }
               

            })
    }
    else if (req.url == '/rooms' && req.method == 'OPTIONS') {
        res.writeHead(200,headers)
        res.end()
    }else{
        res.writeHead(400,headers)
        res.write(JSON.stringify({
            "status" : "false",
            "message": "找無此路由"
        }))
        res.end()
    }
    
}

const server = http.createServer(httpRequest)
server.listen(3005)
