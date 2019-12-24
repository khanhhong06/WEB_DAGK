const express = require('express');
const exphbs = require('express-handlebars');
const morgan = require('morgan');
const numeral = require('numeral');
const hbs_sections = require('express-handlebars-sections');
require('express-async-errors');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(express.static('public')); 

app.engine('hbs', exphbs({
    defaultLayout : 'main.hbs',
    layoutsDir : 'views/layouts',
    helpers: {
        format: val => numeral(val).format('0,0'),
        section: hbs_sections(),
    }
}));

app.set('view engine','hbs');

app.get('/about', (req , res) => {
    res.render('about');
})

require('./middlewares/locals.mdw')(app);
require('./middlewares/routes.mdw')(app);

app.use((req, res, next) => {
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