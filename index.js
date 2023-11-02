// Dependencias do programa:
require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const path = require('path');
const multer = require('multer')
const cors = require('cors');
const upload = multer({ dest: 'uploads/' });

// Métodos atribuidos: 
const app = express();

// Modelos: 
const User = require('./models/User')
const Ong = require('./models/Ong')
const Upload = require('./models/Upload');
const Etiqueta = require('./models/Etiqueta');

// Configurações do servidor: 
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(cors());

// Rota Publica 
app.get('/', (req, res) => {

    res.render('index')
})

// Rota privada 
app.get('/user/:id', checkToken, async(req, res) => {
    const id = req.params.id

    // Verificação de existencia de usuário:
    const user = await User.findById(id, '-passwordCad')

    if (!user) {
        return res.status(404).json({msg: 'Usuário não encontrado'})
    }

    res.status(200).json({user})
})

// Checagem de token: 
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

const validateOngId = async (req, res, next) => {
    const ongId = req.params.id;
    if (!ongId) {
      return res.status(400).json({ msg: 'ID da ONG ausente na solicitação' });
    }
  
    // Verifique se a ONG com o ID fornecido existe (você pode adicionar a lógica para isso aqui)
  
    // Se a ONG existir, defina req.ongId para ser usado nas rotas subsequentes
    req.ongId = ongId;
    next();
  };

// Rota para pesquisar ONGs
app.get('/searchOngs', async (req, res) => {

    const searchTerm = req.query.q;
  
    if (!searchTerm) {
      return res.status(400).json({ msg: 'Informe um termo de pesquisa' });
    }
  
    try {
      // Consulta as ONGs no MongoDB com base no campo "nomeOng"
      const ongs = await Ong.find({ nomeOng: { $regex: searchTerm, $options: 'i' } });

  
      res.json(ongs); // Retorna os resultados em formato JSON
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Ocorreu um erro na pesquisa de ONGs' });
    }
});

// Registrar Usuários
app.post('/auth/register', async(req, res, e) => {


    const {userType, userName, userEmail, userPassword, passwordConfirm} = req.body


    // Validações

    if(!userName) {
        return res.status(422).json({msg: 'o nome é obrigatório'})
    }
    if(!userEmail) {
        return res.status(422).json({msg: 'o email é obrigatório'})
    }
    if(!userPassword) {      
        return res.status(422).json({msg: 'a senha é obrigatório'})
    }

    if (!(userPassword == passwordConfirm)) {
       return res.status(422).json({msg: 'as senhas não conicidem'})
    }

    // Verificar existencia de usuário

    let userExist = await User.findOne({userEmail: userEmail})

    if(userExist) {
        return res.status(422).json({msg: 'Por favor, utilize outro email'})
    }

    let salt = await bcrypt.genSalt((12))
    let passwordHash = await bcrypt.hash(userPassword, salt)


    // Instancia de novo usuario

    const user = new User({
        userType: "voluntario",
        userName, 
        userEmail,
        userPassword: passwordHash,
    })

    // Tramento de exceção

    try {

        await user.save()
        
        res.render('feed.ejs', {user})
    } catch(error) {
        console.log(error)
        res.status(500).json({msg: "Aconteceu um erro no servidor , tente mais tarde"})
    }
});

app.get('/buscar-ongs', async (req, res) => {
    const termoBusca = req.query.termo; 

  
    try {
        const novaEtiqueta = await Etiqueta.find();
        const novoUpload = await Upload.find();
        const upload = await Upload.find()
        const etiqueta = await Etiqueta.find();
        const ongs = await Ong.find();

        res.render('resultadoBusca', { ongs, etiqueta, novaEtiqueta, novoUpload, upload });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro na pesquisa' });
    }
});

app.get('/visualizar-ong/:id', validateOngId, async (req, res) => {
    try {
      // Consulte o banco de dados para obter informações da ONG com base no ID fornecido
      const ong = await Ong.findById(req.params.id);
      const upload = await Upload.find();
      const novaEtiqueta = await Etiqueta.find();
      const novoUpload = await Upload.find();
      const etiqueta = await Etiqueta.find();

      // Renderize a página de visualização da ONG com os detalhes da ONG
      res.render('visualizarOng', { ong, upload, novoUpload, novaEtiqueta, etiqueta });
    } catch (error) {
      // Lidar com erros, por exemplo, se a ONG não for encontrada
      console.error(error);
      res.status(404).send('Página não encontrada');
    }
});
  

  // Rota para o perfil da ONG
app.get('/ong/:id', async (req, res) => {
    const ongId = req.params.id;
    const ong = await Ong.findById(ongId);
    const novaEtiqueta = await Etiqueta.find();
    const novoUpload = await Upload.find();
    const upload = await Upload.find();
    const etiqueta = await Etiqueta.find();

    try {

      if (!ong) {
        // Se a ONG não for encontrada, você pode redirecionar o usuário ou exibir uma mensagem de erro
        res.status(404).send('ONG não encontrada.');
      } else {
        // Renderize a página de perfil da ONG (ong.ejs) com os detalhes da ONG
        res.render('ong', { ong, novaEtiqueta, novoUpload, upload, etiqueta });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao buscar perfil da ONG' });
    }
  });
  
  
// Rota para processar o registro da ONG
app.post('/auth/registerong', async (req, res) => {
  const { userNameOng, userEmailOng, userPasswordOng, passwordConfirmOng, nomeOng, chavePix, telefoneOng, animais, filhotes, doentes, banner, ongBio, ongEndereco, etiquetas } = req.body;

     // Validações
    if(!userNameOng) {
        return res.status(422).json({msg: 'o nome é obrigatório'})
    }
    if(!userEmailOng) {
        return res.status(422).json({msg: 'o email é obrigatório'})
    }
    if(!userPasswordOng) {
        return res.status(422).json({msg: 'a senha é obrigatória'})
    }
    if(!nomeOng) {
        return res.status(422).json({msg: 'o nome da ong é obrigatório'})
    }
    if(!chavePix) {
        return res.status(422).json({msg: 'o email é obrigatório'})
    }
    if(!telefoneOng) {
        return res.status(422).json({msg: 'O numeo de telefone é obrigatório'})
    }
    if(userPasswordOng !== passwordConfirmOng) {
        return res.status(422).json({msg: 'As senhas devem ser iguais'})
    }

  try {

    const ongId = req.params.id; 
    // Verifique se a ONG já existe
    let ongExists = await Ong.findOne({ userEmailOng: userEmailOng });

    if (ongExists) {
      return res.status(422).json({ msg: 'Por favor, utilize outro email' });
    }

    // Crie um hash da senha
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(userPasswordOng, salt);

    // Instancie um novo usuário
    const ong = new Ong({
      userType: "ong",
      userNameOng,
      userEmailOng,
      userPasswordOng: passwordHash,
      nomeOng,
      chavePix,
      telefoneOng,
      animais,
      filhotes,
      doentes,
      banner,
      ongEndereco,
      ongBio,
    });

    await ong.save();

    // Recupere os uploads e etiquetas necessários
    const upload = await Upload.find();
    const etiqueta = await Etiqueta.find()
    const novaEtiqueta = await Etiqueta.find();
    const novoUpload = await Upload.find();

    // Renderize a página da ONG com as informações carregadas
    res.render('ong', {upload, etiqueta, novaEtiqueta, ong, ongId, novoUpload})
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Aconteceu um erro no servidor, tente mais tarde" });
  }
});

// Rota para exibir a página da ONG com base no ID
app.get('/ong/:id', async (req, res) => {
  const ongId = req.params.id;
  // Use ongId para carregar as informações da ONG a serem exibidas na página
  const ong = await Ong.findOne({ _id: ongId });
  if (!ong) {
    return res.status(404).json({ msg: 'ONG não encontrada' });
  }

  // Renderize a página da ONG com as informações carregadas
  res.render('ong', { ong });
});

app.post('/ong/uploadimage', upload.single('filename'), async (req, res) => {

    const { filename, tituloEvento, descricao, dataEvento } = req.body;
    const ongId = await Ong.findOne({ongId: Ong.objectId});
    const ong = await Ong.findOne(ongId);

    try {
      

        const upload = new Upload({            
            filename,
            ong: ongId, // Associa o upload à ong usando o ID da sessão
            tituloEvento,
            descricao,
            dataEvento, 
        });

        await upload.save();
        const novoUpload = await Upload.find()
        const novaEtiqueta = await Etiqueta.find();
        res.render('ong', { ong, upload, novoUpload, novaEtiqueta});
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Aconteceu um erro no servidor, tente novamente mais tarde' });
    }
});

app.post('/ong/etiquetas', async (req, res) => {
    const { etiquetaUm, etiquetaDois, etiquetaTres } = req.body;
    const ongId = await Ong.findOne({ ongId: Ong.objectId });
    const ong = await Ong.findOne(ongId);

    if (etiquetaUm == '') {
        return res.status(422).json({ msg: "O campo 1 deve ser preenchidos" });
    }
    if (etiquetaTres == '') {
        return res.status(422).json({ msg: "O campo 3  deve ser preenchidos" });
    }
    if (etiquetaDois == '') {
        return res.status(422).json({msg: "O campo 2 deve ser preenchido "})
    }
    if (etiquetaUm === etiquetaDois ) {
        return res.status(422).json({ msg: "Os valores não devem ser iguais" });
    }

    if (etiquetaUm === etiquetaTres) {
        return res.status(422).json({ msg: "Os valores não devem ser iguais" });
    }

    if (etiquetaTres === etiquetaDois) {
         return res.status(422).json({ msg: "Os valores não devem ser iguais" });
    }
  

    try {
   
        const etiqueta = new Etiqueta({
            etiquetaUm,
            etiquetaDois,
            etiquetaTres,
            ong: ongId,
        });
        
        await etiqueta.save();
        const novaEtiqueta = await Etiqueta.find();
        const novoUpload = await Upload.find();

        res.render('ong', { ong, novoUpload, novaEtiqueta });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Aconteceu um erro no servidor, tente novamente mais tarde" });
    }
});


app.get('/ong/uploadimage/:id', validateOngId, async (req, res) => {
    const ongId = req.ongId;
    const ong = Ong.findOne({ _id: ongId })
    try {
        res.render('upload', { ong, ongId });
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: 'Aconteceu um erro no servidor, tente novamente mais tarde' });
    }

});

app.get('/ong/etiquetas/:id', validateOngId, async (req, res) => {
    const ongId = req.ongId;
    const ong = Ong.findOne({ongId: Ong._id})

    try {
        res.render('estoque', { ongId })
    }catch(error) {
        console.log(error);
        res.status(500).json({msg: "Aconteceu um erro no servidor, tente novamente mais tarde"})
    }
});

app.get('/userSelect', async(req, res) => {
    try{
        res.render('userChange')
    }catch(err){
        console.log(err)
    }
});

app.get('/feed', async(req, res) => {


    try {

        return res.render('feed')
    } catch (err) {
        console.log(err);
       
        res.status(500).json({ msg: 'Aconteceu um erro no servidor, tente novamente mais tarde' });
    }
});

app.get('/ongRegister', async(req, res) => {
    try{
        res.render('ongRegister')
    }catch(err) {
        console.log(err)
    }
})

app.get('/register', async(req, res) => {
    try {

        return res.render('register')
    } catch (err) {
        console.log(err);
       
        res.status(500).json({ msg: 'Aconteceu um erro no servidor, tente novamente mais tarde' });
    }
});

//Login de Ong
app.post('/auth/loginong', async (req, res) => {
    const { userEmailOng, userPasswordOng } = req.body;

    if (!userEmailOng) {
        return res.status(422).json({ msg: 'O email é obrigatório' });
    }
    if (!userPasswordOng) {
        return res.status(422).json({ msg: 'A senha é obrigatória' });
    }

    // Verificar a existência do usuário

    const ong = await Ong.findOne({ userEmailOng: userEmailOng });

    if (!ong) {
        return res.status(404).json({ msg: 'Usuário não encontrado' });
    }

    const upload = await Upload.find();
    const novaEtiqueta  = await Etiqueta.find();
    const novoUpload = await Upload.find();

    // Verificar a senha
    const checkPassword = await bcrypt.compare(userPasswordOng, ong.userPasswordOng);
    if (!checkPassword) {
        return res.status(422).json({ msg: 'Senha inválida!' });
    }

    try {
        // Assinar um token JWT para autenticação
        const secret = process.env.SECRET;
        const token = jwt.sign({ id: ong._id }, secret);

        return res.render('ong', {ong, upload, novaEtiqueta, novoUpload})
       
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: 'Aconteceu um erro no servidor, tente novamente mais tarde' });
    }
});

// Login de usuário
app.post('/auth/login', async (req, res) => {
    const { userEmail, userPassword } = req.body;
   

    if (!userEmail) {
        return res.status(422).json({ msg: 'O email é obrigatório' });
    }
    if (!userPassword) {
        return res.status(422).json({ msg: 'A senha é obrigatória' });
    }

    // Verificar a existência do usuário

    const user = await User.findOne({ userEmail: userEmail });

    if (!user) {
        return res.status(404).json({ msg: 'Usuário não encontrado' });
    }


    // Verificar a senha
    const checkPassword = await bcrypt.compare(userPassword, user.userPassword);
    if (!checkPassword) {
        return res.status(422).json({ msg: 'Senha inválida!' });
    }

    try {
        // Assinar um token JWT para autenticação
        const secret = process.env.SECRET;
        const token = jwt.sign({ id: user._id }, secret);
        const ongs = await Ong.findOne();

        return res.render('feed', {user: user, ongs})
       
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: 'Aconteceu um erro no servidor, tente novamente mais tarde' });
    }
});

// Credenciais
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS

mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.dwnd9wu.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp`)

.then(() => {
    app.listen(3000)
    console.log('Conectou ao banco! ')
})
.catch((err) => {
    console.log(err)
})