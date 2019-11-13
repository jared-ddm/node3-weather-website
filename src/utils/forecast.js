const request = require('request')

const forecast = (latitude, longitude, callback) => {
    const url = 'https://api.darksky.net/forecast/2af6ca100bbd9997943c93d959766631/' + latitude + ',' + longitude + '?units=si'

    request({ url, json: true }, (error, {body}) => {
        if (error) {
            callback('Unable to connect to weather service!')
        } else if (body.error) {
            callback('Unable to find location!')
        } else {
            const summary = body.daily.data[0].summary + ` It is currently ${body.currently.temperature} degrees out. There is a ${(body.currently.precipProbability * 100)}% chance of rain. High: ${Math.round(body.daily.data[0].temperatureHigh)}, Low: ${Math.round(body.daily.data[0].temperatureLow)},  UV-Index: ${body.daily.data[0].uvIndex}`
            callback(undefined, summary)
        }
    })
}

module.exports = forecast