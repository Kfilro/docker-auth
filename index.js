const express = require('express');
const session = require('express-session');
const app = express();
const { Client } = require('pg');


var { Liquid } = require('liquidjs');
var engine = new Liquid();

app.engine('liquid', engine.express());
app.set('views', './views');
app.set('view engine', 'liquid');

app.use(express.urlencoded({ extended: true }));
const port = 3000;
const {User, getTask, addTask, completeTask, deleteTask } = require('./bd');


app.set('trust proxy', 1) // trust first proxy



  app.use(session({
    secret: '12', 
    resave: false,
    saveUninitialized: true
  }));
  
const client = new Client({
    user: 'postgres',
    password: '1',
    database: 'sql'
});
client.connect();  

  



function redirectLogin(req, res, next) {
    if (!req.session.userId) {
      res.redirect('/login');
    } else {
      next();
    }
  }

app.get('/', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username, password } });
    if (user) {
        req.session.userId = user.id;
        res.redirect('/tasks');

        console.log('14')
    } else {
        res.redirect('/');
    }
});



app.post('/logout', (req, res) => {

    req.session.destroy(); // Удаляем сессию пользователя
    res.redirect('/');
});

  



   
app.get('/tasks', redirectLogin, async (req, res) => {
    const userId = req.session.userId;
    const tasks = await getTask(userId);

    const completedTasks = tasks.filter(task => task.completed);
    const plannedTasks = tasks.filter(task => !task.completed);


    res.render('tasks', { tasks, completedTasks, plannedTasks });
});

app.post('/addTask', redirectLogin, async (req, res) => {
    const { name } = req.body;
    const userId = req.session.userId;
    await addTask(name, userId);
    res.redirect('/tasks');
});

app.post('/completeTask/:taskId', redirectLogin, async (req, res) => {
    const { taskId } = req.params;
    await completeTask(taskId);
    res.redirect('/tasks');
});

app.post('/deleteTask/:taskId', redirectLogin, async (req, res) => {
    const { taskId } = req.params;
    await deleteTask(taskId);
    res.redirect('/tasks');
});
  
  


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
