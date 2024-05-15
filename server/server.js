const { v4 } = require('uuid');


const path = require('path');
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");



const publicPath = path.join(__dirname, '/../public');
const port  = process.env.PORT || 3100
let app = express(express.json());
app.use(express.json());
let server = http.createServer(app);

// DB 
const {Client} = require('pg');
const pg = require('pg');
const pool = new pg.Pool();
const client = new Client({
    host:'localhost',
    user:"postgres",
    port:5433,
    password:'Haslo123!',
    database:'master'
})
// DB
client.connect();




let io = socketIO(server);
const playersAuth = [
    {
        playerID:0,
        username:'Tester',
        password:'Test123!'
    }
]

const playerDetails = [
    {
        id:1,
        color:'red',
        name:'Adrian',
        positon:{
            x:100,
            y:100
        },
        auth:{
            username:'test',
            password:'test123!'
        }
    }
]

app.get('/test', (req,res) =>{
    res.status(200).send({
        message:"fuck you"
    })
    console.log('fuck you');
    // res.status(200);
    client.query('SELECT * FROM public.users;',(err, result)=>{
        if ( !err ){
            console.log(JSON.stringify(result.rows));
            // res.status(200).send({
            //     message: JSON.stringify(result.rows)
            // })

        }
    });
    client.end();
});

app.post('/auth', (request,response) =>{
    const requestBody = request.body;
    console.log('NAME:'+requestBody.name);
    let query = `SELECT password FROM public.users WHERE name='${requestBody.name}';`
    console.log(`QUERY: ${query}`);
    // console.log(`REQUEST BODY: ${JSON.stringify(request.body)}`);
    // console.log('NAME:'+request.body.name);
    // console.log('PASSWORD:'+request.body.password);
    // const validation = loginValidation(request.body);
    // console.log(validation);
    
    client.query(query,(err, result)=>{
        if ( !err ){
            log(`QUERY RESULT: ${JSON.stringify(result)}`);
            if ( result.rowCount == 0 ){
                response.status(401);
                response.send({
                    status:"unauthorized",
                    message:"Incorrect user name or password."
                });
            }else{
                if ( result.rows[0].password == request.body.password ){
                    response.status(201);
                    response.send({
                        status:"authorized",
                        message:"User successfully logged in.",
                        token: `${v4()}-${v4()}-${v4()}-${v4()}-${v4()}-${v4()}-${v4()}-${v4()}-${v4()}`
                    });
                }else{
                    response.status(401);
                    response.send({
                        status:"unauthorized",
                        message:"Incorrect user name or password."
                    });
                }

            }
        }
    });

});
app.use(express.static(publicPath));



// io.on("connection",(socket)=>{
//     console.log('A new player connected to the game');
//     socket.broadcast.emit('newMessage',generateMessage('Server','New User has joined the chat'));

//     socket.on("createMessage", (newMessage) =>{
//         console.log("create message:",newMessage);
//         console.log(`user: ${newMessage.from}`);
//         console.log(`user: ${newMessage.text}`);
//         socket.broadcast.emit('newMessage',generateMessage(newMessage.user,newMessage.message));
//     })
//     socket.on("movePlayer", (player_transform) =>{
//         console.log("move player",player_transform);
//         socket.broadcast.emit('newMessage',generateMessage(newMessage.user,newMessage.message));
//     })

//     socket.on("disconnect",()=>{
//         console.log('Player has left the game');
//     })
// })


server.listen(port, () =>{
    console.log(`Server is running on port : ${port}`);
})


function log(value){
    console.log(value);
}

let myuuid = v4();
console.log(myuuid);