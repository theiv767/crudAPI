require('dotenv').config()
const {MongoClient, objectId, ObjectId} = require('mongodb')  
async function connect(){
    if(global.db) return global.db;
    const conn = await MongoClient.connect(process.env.DB_URL);
    if(!conn) return new Error('ERRO de conexão!')
    global.db = await conn.db("unifor");
    return global.db;
}

const express   = require('express');
const app       = express();
const port      = process.env.PORT;

app.use(express.urlencoded({extended : true}))
app.use(express.json())

const router    = express.Router();
router.get('/', (req, res) => res.json( {message : 'Funcionando!'}));


//      API ALUNO 

// GET 
router.get('/aluno/:id?', async function(req, res, next){
    try {
        const db = await connect();
        if (req.params.id) {
            res.json(await db.collection("alunos").findOne({_id: new ObjectId(req.params.id)}));
        } else {
            res.json(await db.collection("alunos").find().toArray());
        }

    } catch (ex) {
        console.log(ex)
        res.status(400).json({erro: `${ex}`})
    }

}) 


// POST
router.post('/aluno', async function(req, res, next){
    try {
        const alunos = req.body;
        const db    = await connect();
        res.json(await db.collection("alunos").insertOne(alunos))
    } catch (ex) {
        console.log(ex)
        res.status(400).json({erro: `${ex}`})
    }

})


//  PUT
router.put('/aluno/:id', async function(req, res, next){
    try {
        const aluno = req.body;
        const db    = await connect();
        res.json(await db.collection("alunos").updateOne({_id: new ObjectId(req.params.id)}, {$set: aluno}))

    } catch (ex) {
        console.log(ex)
        res.status(400).json({erro: `${ex}`})

    }
})


//  DELETE
router.delete('/aluno/:id', async function(req, res, next){
    try {
        const db    = await connect();
        res.json(await db.collection("alunos").deleteOne({_id: new ObjectId(req.params.id)}));

    } catch (ex) {
        console.log(ex)
        res.status(400).json({erro: `${ex}`})
    }


})

//---------------------------------------------------------------------------
app.use('/', router)
app.listen(port)
console.log('API Funcionando!')
