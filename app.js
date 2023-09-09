const express = require('express');
const fs = require('fs');
const multer = require('multer');
const { graphqlHTTP } = require('express-graphql');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');
const User = require('./models/user')

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, authorization');
  if(req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});
app.use(express.static('public'))


// Set up Multer for image uploads
const isAuth = require('./middleware/isAuth');
const path = require('path');

app.use(isAuth);

// console.log('hello')
const upload = multer({
  
  storage : multer.diskStorage({
    destination : (req, file, cb) => {
      cb(null, 'public/images')
    },
    filename : (req, file, cb) => {
      cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
  })
   
});

// GET endpoint for "Hello, World!"
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// const path = require('./static/music/dune.mp3')
console.log('here')

// Handle image retrieval based on user's email
app.get('/Profile/:email', (req, res) => {
  const userEmail = req.params.email;

  // Retrieve the user's data from the database based on the email
  User.findOne({ email: userEmail })
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
      if (!user.imageName) {
        // Send the default image name if no image exists for the user
        const defaultImageName = 'default.jpg';
        return res.status(200).json({ imageName: defaultImageName });
      }
      
      // Here, you can assume that the user has an 'imageName' field associated with their data
      const imageName = user.imageName;

      res.status(200).json({ imageName });
    })
    .catch(error => {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: 'Server error.' });
    });
});
console.log('here2')
// Handle image upload
app.post('/Profile', upload.single('image'), async (req, res) => {
  const imageName = req.file.filename;
  const description = req.body.description;
  const email = req.body.email; // Retrieve email from the request

  // Find the user by email and update the imageName field
  try {
      const user = await User.findOneAndUpdate(
          { email: email },
          { $set: { imageName: imageName } },
          { new: true }
      );

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      console.log('User image updated:', user);
      res.send({ description, imageName });
  } catch (error) {
      console.error('Error updating user image:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});




app.use('/music', express.static('music'));



app.use('/graphql', graphqlHTTP({
  schema: graphqlSchema,
  rootValue: graphqlResolver,
  graphiql: true,
  customFormatErrorFn(err){
    if(!err.originalError)
    return err;
    const data = err.originalError.data;
    const message = err.message || 'An errror occured';
    const code = err.originalError.code || 500;
    return {message : message, statusCode: code, data: data};
  }
}));

mongoose.connect('mongodb+srv://faisalirfan:AirpBqL5mMAal7ON@cluster0.j111j4d.mongodb.net/user').then(result => {
  app.listen(8080, () => {
    console.log('Server is running on port 8080.');
  });
}).catch(error => {
  console.error('Error connecting to MongoDB:', error.message);
});


