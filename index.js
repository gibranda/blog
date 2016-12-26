const fs = require('fs');
const path = require('path');
const express = require('express');
const marked = require('marked');
const pug = require('pug');

const app = express();

app.use(express.static(__dirname + '/public'));

app.set('views', path.join(__dirname, 'public/views'));
app.set('view engine', 'pug');

marked.setOptions({
  highlight: function (code) {
    return require('highlight.js').highlightAuto(code).value;
  }
});

app.get('/', (req, res, next) => {
  fs.readdir('public/posts', (err, files) => {
    res.render('home', {
      files: files
    });
    next();
  });
});

app.get('/:post', (req, res, next) => {
  const file = req.params.post + '.md';
  fs.readdir('public/posts', (err, files) => {
    if (files.indexOf(file) === -1) return res.render('404');
    
    const markdown = fs.readFileSync('public/posts/'+file, 'utf8');
    res.send( marked(markdown) );
  });
});

app.listen('5000', () => {
  console.log('Your website is up and running on port 5000');
});