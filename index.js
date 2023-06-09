const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
let bodyParser = require('body-parser')
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
})
let User = mongoose.model('User', userSchema)

const ExerciseSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: Date, required: true },
})
let Exercise = mongoose.model('Exercise', ExerciseSchema)

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// app.get('/api/:users', (req,res) => {
//   res.send('Tu écoutes la rêquete de id:' + " " + req.params.users);
// })

// app.get('/api/users', (req, res) => {
//   res.send({ username: req.query.username })
// })

app.post('/api/users', (req, res) => {
  const newUser = new User({
    username: req.body.username
  })
  newUser.save()
    .then((response) => {
      res.json({ username: response.username, _id: response._id })
      console.log(response)
    })
    .catch((err) => {
      console.log(err)
    })
})
app.post('/api/users/:_id/exercises', (req, res) => {
  const newExercise = new Exercise({
    userId: req.params._id,
    description: req.body.description,
    duration: req.body.duration,
    date: req.body.date
  })
  newExercise.save()
    .then((response) => {
      res.json({
        username: response.username,
        _id: response._id,
        description: response.description,
        duration: response.duration,
        date: new Date(response.date).toDateString()
      })
      console.log(response)
    })
    .catch((err) => {
      console.log(err)
      res.send('There was a problem adding the information to the database.')
    })
  
})
app.get('/api/users', (req,res)=> {
  User.find().select('username').exec()
  .then((response) => {
    res.json(response)
  })
  .catch((err) => {
    console.error(err)
  })
})
app.get('/api/users/:_id/logs', (req,res)=> {
  Exercise.find({userId: req.params._id}).select('description duration date -_id').exec()
  .then((response) => {
    res.json(response)
  })
  .catch((err) => {
    console.error(err)
  })
})

// const createAndSavePerson = () => {
//   const newUser = new User({
//     name: 'John',
//     age: 37,
//     favoriteFoods: ['pizza', 'pasta', 'salad']
//   })
//   try {
//     newUser.save()
//     return console.log(newUser)
//   }
//   catch (err) {
//     console.log(err)
//   }
// };
// createAndSavePerson()

const findPeopleByName = (personName) => {
  User.find({ username: personName })
    .then((personFound) => {
      return console.log(personFound)
    })
    .catch((err) => {
      console.log(err)
    })
}
findPeopleByName('Ben')


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
