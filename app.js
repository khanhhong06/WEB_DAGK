const express = require('express');
const exphbs = require('express-handlebars');
const morgan = require('morgan');
require('express-async-errors');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.engine('hbs', exphbs({
    defaultLayout : 'main.hbs',
    layoutsDir : 'views/layouts'
}));

app.set('view engine','hbs');

app.get('/', (req, res) => {
    res.render('./wwCategories/index');
})

app.get('/about', (req , res) => {
    res.render('about');
})

app.get('/register',(req,res)=>{
    res.render('register');
})
//app.use('/admin/categories',require('./routes/admin/category.route'));

app.use('/',require('./routes/admin/main.route'));

app.use((req, res, next) => {
    // res.render('vwError/404');
    res.send('You\'re lost');
})
  
app.use((err,req,res,next)=>{
    console.error(err.stack);
    res.status(500).send('View error on console');
})

const PORT = 8000;

app.listen(PORT, () =>{
    console.log(`Server is running at http://localhost:${PORT}`);
})