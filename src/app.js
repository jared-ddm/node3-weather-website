const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine','hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', { 
        title: 'Weather',
        name: 'Jared Desvaux de Marigny'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Jared Desvaux de Marigny'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        message: 'If you need a hand, please read the documentation below.',
        name: 'Jared Desvaux de Marigny'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address!'
        })
    }

    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if (error) {
           return res.send({ error })
        }

        forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
            return res.send({ error })
        }

        res.send({
            forecast: forecastData,
            location,
            address: req.query.address
            })
        })
    })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
      return res.send({
            error: 'You must provide a search term'
        })
    }
    console.log(req.query.search)
    res.send({
        products: []
    })
})

// 404 catch for only the help page
app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Jared Desvaux de Marigny',
        errorMessage: 'Help article not found.'
    })
})

// 404 Page - This has to be the last handler called!
app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Jared Desvaux de Marigny',
        errorMessage: 'Page not found.'
    })
})

app.listen(3000, () => { // sets the server to constantly listen to a port (in this case port 3000) - in production you dont choose the port, you have the defaults used
    console.log('Server is up on port 3000')
})