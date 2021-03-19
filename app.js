const express = require('express'); // se importa
const bodyParser = require('body-parser'); // se importa
const path = require('path');
const usuarios = require('./dummy');
const { exec } = require('child_process');

//console.log(usuarios);

const app = express(); // se crea una instancia

//Middlewares (funciones que se ejecutan enmedio)
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
//CORS ()

//Rutas ()
app.get('/', (req,res)=>{
    res.status(200).send('<div> <h1> Mi sitio web </h1> <p>esp32 y aws<p> <div>');
});

//console.log(__dirname); // crea ruta absoluta hasta el directorio actual

app.get('/homepage', (req,res)=>{
    res.sendFile(path.join(__dirname+'/index.html'));
});
const data = {
    message: 'datos',
    payload: {
        temperatura: '20',
        presion: '1'
    }
}

app.get('/data', (req,res)=> {
    // Operación de ordenamiento
    usuarios.sort(function(a, b) {
        return a.id - b.id;
      });
    res.status(200).send(usuarios);
});

app.get('/users/:id', (req, res)=>{
    const id = req.params.id;
    var user = {};
    for(let u of usuarios){
        if (u.id == id){
            user = u;
        }
    }
    var nuevaClave = '';
    var contador = 1;
    var cRef = '';
    for(let c of user.clave){
        if(c==cRef)
        {
            contador++;
        }
        else if(contador==1)
        {
            cRef=c;
            nuevaClave=nuevaClave + cRef;
            
        }
            else
            {
            cRef=c;
            nuevaClave= nuevaClave + String(contador)+ cRef;
            contador=1;
            }
    
    }
    console.log(nuevaClave);
    res.status(200).send(nuevaClave);
});

app.get('/archivos', (req, res)=>{
    //Leer nombre de archivos
    exec('dir', (error, stdout, stderr)=>{
        if(error){
            res.status(200).send(error)
        }
        if(stderr){
            res.status(200).send(stderr)
        }
        res.status(200).send(stdout)
    });
});

app.get('/publish', (req, res)=>{
    //Leer nombre de archivos
    exec("aws --region us-east-2 iot-data publish --topic 'inTopic' --cli-binary-format raw-in-base64-out --payload 'Hello world'"
    , (error, stdout, stderr)=>{
        if(error){
            res.status(200).send(error)
        }
        if(stderr){
            res.status(200).send(stderr)
        }
        res.status(200).send("enviado correctamente")
    });
});

module.exports = app;