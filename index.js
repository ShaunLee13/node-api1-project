const express = require('express')
const shortid = require('shortid')

const server = express()
server.use(express.json())

let users = [
    {
        id: shortid.generate(),
        name: 'Jack B. Nimble',
        bio: 'Loves jumping'
    }
]
//Requests to /api/users (get and post)

server.get('/api/users', (req, res) => { 
    try{
        res.status(200).json(users)
    }
    catch(err){
        res.status(500).json({ errorMessage: "The users information could not be retrieved." });
    }
})

server.post('/api/users', (req, res) => {
    try{const user = req.body
    user.id = shortid.generate()
    
    if(!user.name || !user.bio){
        return res.status(400)
        .json({ errorMessage: "Please provide name and bio for the user."})
    } else {
        users.push(user)
        return res.status(201)
        .json(user)
    }}
    catch(err){
        res.status(500).json({ errorMessage: "There was an error while saving the user to the database"});
    }
})

//requests to /api/users/:name (get, put, delete)

server.get('/api/users/:id', (req, res) => {
    try{const name = req.params.id.toLocaleLowerCase()

    const user = users.find(u => u.name.toLocaleLowerCase() === name)
    if(user === undefined){
        res.status(404).json({ message: "The user with the specified ID does not exist." })
    } else{
        res.status(200).json(user)
    }}
    catch(err){
        res.status(500).json({ errorMessage: "The user information could not be retrieved." });
    }
})

server.put('/api/users/:id', (req, res) => {
    try{
        const name = req.params.id.toLocaleLowerCase()
    const update = req.body
    const user = users.find(u => u.name.toLocaleLowerCase() === name)
    if(user === undefined){
        res.status(404)
            .json({ message: "The user with the specified ID does not exist." })
    } else if(!update.name || !update.bio){
        return res.status(400)
            .json({ errorMessage: "Please provide name and bio for the user."})
    } else {
        user.name = update.name
        user.bio = update.bio

        return res.status(200)
            .json(user)
    }}
    catch(err){
        res.status(500).json({ errorMessage: "The user information could not be modified." });
    }
})

server.delete('/api/users/:id', (req, res) => {
    try{    
        const name = req.params.id.toLocaleLowerCase()

        const user = users.find(u => u.name.toLocaleLowerCase() === name)
        if(user === undefined){
            res.status(404).json({ message: "The user with the specified ID does not exist." })
        } else{
            users = users.filter(u => u.name.toLocaleLowerCase() !== name)

            res.status(204).end()
        }}
    catch(err){
        res.status(500).json({ errorMessage: "The user could not be removed" });
    }
})


const port = 8000
server.listen(port, () => console.log('server running...'))