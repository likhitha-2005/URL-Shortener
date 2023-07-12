//the required modules express, mongoose, and the ShortUrl model/schema are imported.
// An instance of the Express application is created.
const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shorturls')
const app = express()

mongoose.connect('mongodb+srv://likhithaeada:4kyoju0JMkvyHoHE@cluster0.88awtse.mongodb.net/mydatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true
})

app.use(express.static('public'));

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))


app.get('/', async (req, res) => {
    const searchText = req.query.fullUrl;
    const shortUrls = searchText
        ? await ShortUrl.find({
            $or: [
                { full: { $regex: searchText, $options: 'i' } },
                { short: { $regex: searchText, $options: 'i' } },
            ],
        }).exec()
        : await ShortUrl.find().exec();
    const errorMessage = '';
    res.render('index', { shortUrls, errorMessage });
});

app.post('/shortUrls', async (req, res) => {
    const fullUrl = req.body.fullUrl;
    const existingShortUrl = await ShortUrl.findOne({ full: fullUrl });
    console.log(existingShortUrl);

    if (existingShortUrl) {
        const shortUrls = await ShortUrl.find().exec();
        res.render('index', { shortUrls });
    }
    else {
        await ShortUrl.create({ full: fullUrl });
        res.redirect('/');
    }

});

app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
    if (!shortUrl) return res.sendStatus(404);

    await ShortUrl.findOneAndUpdate(
        { short: req.params.shortUrl },
    );

    res.redirect(301, shortUrl.full);
});

app.post('/shortUrl/:id/delete', async (req, res) => {
    try {
        const shortUrl = await ShortUrl.findById(req.params.id);
        if (!shortUrl) {
            return res.sendStatus(404);
        }

        await ShortUrl.deleteOne({ _id: req.params.id });
        console.log('Short URL deleted:', shortUrl);
        res.redirect('/');
    } catch (error) {
        console.log(error);
        res.status(500).redirect('/error-page');
    }
});
app.listen(process.env.PORT || 5000);