const express = require('express');
const mongoose = require("mongoose");
const Link = require('./models/Link.js');

const app = express();

app.use(express.json());

const postbacks = new Set();


app.get('/postback/moderation', (req, res) => {
    const {workerId, offerId} = req.query;

    if(!workerId || !offerId) {
        return res.status(400);
    }

    postbacks.add({workerId, offerId, type: 0});

    return res.end();
});

app.get('/postback/approve', (req, res) => {
    const {workerId, offerId} = req.query;

    if(!workerId || !offerId) {
        return res.status(400);
    }

    postbacks.add({workerId, offerId, type: 1});

    return res.end();
})

app.get('/postback/decline', (req, res) => {
    const {workerId, offerId} = req.query;

    if(!workerId || !offerId) {
        return res.status(400);
    }

    postbacks.add({workerId, offerId, type: -1});

    return res.end();
});

app.get('/postback/information', (req, res) => {
    res.json(Array.from(postbacks));
    postbacks.clear();
    return;
});

app.get('/:link', async (req, res) => {

    try {
        const findedLink = (await Link.find({'_id': req.params.link}))[0];

        if (findedLink) {
           const originalLink = findedLink.original;

           const originalLinkURL = new URL(originalLink);

           const query = req.query;
           const hasQueries = Object.keys(query).length > 0;

           if (hasQueries) {
               Object
                   .entries(query)
                   .forEach(([key, value]) => {
                       originalLinkURL.searchParams.set(key, value);
               })
           }
           res.redirect(originalLinkURL.href);
        } else {
            res.redirect('https://t.me/jews_wallet_bot');
        }

    } catch(error) {
        res.status(400);
        res.json({error: error.message});
    }

});

app.get('/', (req, res) => {

    res.redirect('https://t.me/jews_wallet_bot');

})

app.post('/links/createLink', async(req, res) => {

   const {original} = req.body;
   if(!original || !original.startsWith('https://')) {
       res.status(400);
       return res.json({error: 'Не задано поле original!'});
   }
   const createdLink = new Link({original});
   await createdLink.save();
   return res.json({shortCut: createdLink._id});

});

const start = async () => {
    await mongoose.connect('mongodb+srv://jew_wallet:jew2004@cluster0.uh05wgg.mongodb.net/?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

};

start();
app.listen(process.env.PORT || 5000, () => {
    console.log(`Сервер запущен на хосту http://127.0.0.1:5000`);
});



