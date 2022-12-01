const client_controller = require('./client.js');
const path = require('path');
const express = require('express');
const app = express();
const helmet = require('helmet');

app.use(helmet());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/client', (req, res, next) => {
    res.render('index');
})

app.post('/process_login', (req, res, next) => {
    var domain_nameC = req.body.name;
    const gen_keywords = async (cmd) => {
        try {
            var keywords_to_send = await client_controller(cmd)
            for (var i = 0; i < keywords_to_send.length; i++){
                keywords_to_send[i]=keywords_to_send[i]+"@"+cmd;
            }
            res.json({ 'keywords': keywords_to_send });
        } catch (err) {
            console.log(err);
        }
    }
    gen_keywords(domain_nameC);
})

app.listen(3000);