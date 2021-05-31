//Why is this typescript?
//I don't know, why is this in Express?
//Because i want it!

//Jokes aside, it's in case i want to add some features in the future + I'm trying to learn typescript

import express from 'express'
import fetch, {Headers} from 'node-fetch'
import bodyParser from 'body-parser'
const loginURL = "https://authentication-service-prod.superleague.com/v1/user/login/ghost/"

const app = express()

app.use('/login', express.static('./public/login'))
app.use('/script', express.static('./public/scripts'))
app.use('/selectserver', express.static('./public/serverselect'))
app.use('/serviceSelection', express.static('./public/serviceSelection'))
app.use('/fileManager', express.static('./public/fileManager'))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.redirect('/login')
})

let root: string = "" //Absoloute path of ../ (Initilized down below)

//res.sendFile() doesn't allow us to use ../ in path so.. we use a more creative way of saying the same thing.
__dirname.split("/").forEach((dir, index, array) => {
    if ((index < (array.length - 1)) && dir) {
        root += '/' + dir
    }
})

app.get('/selectserver', (req, res) => {
    res.sendFile('./public/serverselect/serverSelect.html', {root: root})
})

app.get('/serviceSelection', (req, res) => {
    res.sendFile('./public/serviceSelection/selection.html', {root: root})
})

app.get('/fileManager', (req, res) => {
    res.sendFile('./public/fileManager/fileManager.html', {root: root})
})

app.post('/login', (req, res) => {
    let xSlgUser = req.header('x-slg-user')
    let xSlgsession = req.header('x-slg-session')
    let minehutSessionId = req.body.minehutSessionId
    let slgSessionId = req.body.slgSessionId
    if (xSlgUser && xSlgsession && minehutSessionId && slgSessionId) {
        let headers = new Headers()
        headers.set('Content-Type', 'application/json')
        headers.set('x-slg-user', xSlgUser)
        headers.set('x-slg-session', xSlgsession)
        fetch(loginURL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(req.body)
        }).then(loginInfo => loginInfo.json().then(loginInfo => {
            if (loginInfo.message) {
                res.status(401)
                res.send(loginInfo.message)
            }
            else {
                res.send(loginInfo)
            }
        }))
    }
    else {
        res.sendStatus(400)
    }
})

app.listen(80,() => {
    console.log("Listening!")
})