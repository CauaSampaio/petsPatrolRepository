require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')

const app = express()

// Configurar JSON
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(express.json())

// Models 

const User = require('./models/User')

// Rota Publica 
app.get('/', (req, res) => {
    res.status(200).json({msg: 'Bem vindo a nossa API'})
})

// Rota privada 

app.get('/user/:id', checkToken, async(req, res) => {
    const id = req.params.id

    // Verificar se usuario existe
    const user = await User.findById(id, '-passwordCad')

    if (!user) {
        return res.status(404).json({msg: 'Usuário não encontrado'})
    }

    res.status(200).json({user})
})

function checkToken (req, res, next) {
    const authHeader = req.headers['authorization']

    const token = authHeader && authHeader.split(" ")[1]

    if(!token) {
        return res.status(401).json({msg: "Sem autorização"})
    }

    try{

        const secret = process.env.SECRET

        jwt.verify(token, secret)

        next()
    }catch(error) {
        res.status(400).json({msg: "Token Inválido"})
    }
}

// Registrar Usuários
app.post('/auth/register', async(req, res) => {

    const {nameCad, emailCad, passwordCad, passwordCadConfirm} = req.body

    // Validações

    if(!nameCad) {
        return res.status(422).json({msg: 'o nome é obrigatório'})
    }
    if(!emailCad) {
        return res.status(422).json({msg: 'o email é obrigatório'})
    }
    if(!passwordCad) {
        return res.status(422).json({msg: 'a senha é obrigatório'})
    }

    if (!(passwordCad == passwordCadConfirm)) {
        return res.status(422).json({msg: 'as senhas não conicidem'})
    }

    // Verificar existencia de usuário

    const userExist = await User.findOne({emailCad: emailCad})

    if(userExist) {
        return res.status(422).json({msg: 'Por favor, utilize outro email'})
    }

    const salt = await bcrypt.genSalt((12))
    const passwordHash = await bcrypt.hash(passwordCad, salt)


    const user = new User({
        nameCad, 
        emailCad,
        passwordCad: passwordHash,
    })

    try {

        await user.save()
        
        res.status(201).json({msg: "User Criado com sucesso"})
    } catch(error) {
        console.log(error)
        res.status(500).json({msg: "Aconteceu um erro no servidor , tente mais tarde"})
    }
})

// Login de usuário

app.post('/auth/login', async(req, res) => {

    const {emailCad, passwordCad} = req.body

        if(!emailCad) {
            return res.status(422).json({msg: 'o email é obrigatório'})
        }
        if(!passwordCad) {
            return res.status(422).json({msg: 'a senha é obrigatório'})
        }
        // Verificar a existencia de user

        const user = await User.findOne({emailCad: emailCad})
        if (!user) {
            return res.status(404).json({msg: "Usuário não encontrado"})
        }
        
        // Verificar senha

        const checkPassword = await bcrypt.compare(passwordCad, user.passwordCad)

        if (!checkPassword) {
            return res.status(422).json({msg: 'Senha Invalida !'})
        }



        try {

            const secret = process.env.SECRET

            const token = jwt.sign(
                {
                    id: user._id,
                },

                secret,
            )

            res.status(200).json({msg: 'Autenticação realizada com sucesso', token})

        } catch(err){
            console.log(err)
            res.status(500).json({msg: 'Aconteceu um erro no servidor, tente novamente mais tarde'})
        }

    })
    
// Credenciais

const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS

mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.wtzbpbs.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp`)
.then(() => {
    app.listen(3000)
    console.log('Conectou ao banco! ')
})
.catch((err) => {
    console.log(err)
})