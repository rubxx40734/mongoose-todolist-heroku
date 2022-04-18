// 這邊用模組化 把schema跟model寫在一起
const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema(
    {
        name : String,
        rating : Number,
        price : {
            type : Number,
            required : [true,'價格為必填']
        },
        createdAt : {
            type : Date,
            default : Date.now()
        }
    },
    {
        versionKey : false
    }
)

const Room = mongoose.model('Room', roomSchema)

module.exports = Room