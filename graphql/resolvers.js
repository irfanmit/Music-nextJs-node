const bcrypt = require('bcryptjs');
const User = require('../models/user');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const Song = require('../models/song')
// const nodemailer = require('nodemailer')

const musicPathArray = require('../musicPath/path')

let lastFoundIndex = -1; 

module.exports = {
  /////////////////// pass word changer /////////////////////

  resetPassword: async function ({ email, newPassword }) {
    try {
      // Find the user by email
      const user = await User.findOne({ email });

      if (!user) {
        throw new Error('User not found');
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      // Update the user's password in the database
      user.password = hashedPassword;
      await user.save();

      return { message: 'Password updated successfully' };
    } catch (error) {
      throw new Error('Failed to reset password');
    }
  },


/////////////////////// isLikedSong ////////////////////////

isLikedSong : async function ({path}) {
  try {
    console.log("inside liked song");

    // Check if a liked song with the given path already exists
    const existingPath = await Song.findOne({ path: path });

    if (existingPath) {

      // Return a success message or status here if needed
      return {
        exist: true,
      };
    }

    else{
      return {
        exist : false,
      }
    }
}catch(err)
{

  throw err
}
},

/////////////////////// Add liked song ////////////////////////////

  AddlikedSong: async function ({ title }) {
    try {
      console.log(title);
      const formattedSongTitle = title.replace(/\s+/g, '').toLowerCase();
    const songInArray = musicPathArray.find(song =>
      song.title.replace(/\s+/g, '').toLowerCase() === formattedSongTitle
    );

      if (!songInArray) {
        return {message: "We are sorry we couldn't save the requested music since we dont have it."}
        error.code = 404;
        throw error;
      }

      const existingSong = await Song.findOne({ title });

      if (existingSong) {
        return { message: "The song was already saved in your liked song ." };
      }

      const song = new Song({
        title: songInArray.title,
        artist: songInArray.artist,
        path: songInArray.path,
        type: songInArray.type,
      });

      const createdSong = await song.save();
      return { message: "Song  liked and added to the database." };
    } catch (err) {
      console.log(err);
      console.log("error occurred while handling liked song");
      throw err;
    }
  },


//////////////////////// LIKED - SONG - FETCHER //////////////////////

likedSongFetcher: async function (_, req) {
  try {
    // Fetch all liked songs from the database
    const allLikedSongs = await Song.find();

    const likedSongPaths = allLikedSongs.map(likedSong => likedSong.path);

    return { likedSongArray: likedSongPaths };
  } catch (err) {
    console.log("error occurred while fetching liked songs");
    throw err;
  }
},


////////////////////////// LIKED - SONG - HANDLE /////////////////////

likedSong: async function({ pathToLikedSong, artist, title }, req) {
  try {
    console.log("inside liked song");

    // Check if a liked song with the given path already exists
    const existingPath = await Song.findOne({ path: pathToLikedSong });

    if (existingPath) {
      console.log("LIKED SONG ALREADY EXISTS");

      // Delete the existing liked song using its _id
      await Song.findByIdAndDelete(existingPath._id);

      // Return a success message or status here if needed
      return {
        message: "Song disliked",
      };
    }

    // If no existing liked song, then create a new one
    const song = new Song({
      title: title,
      artist: artist,
      path: pathToLikedSong,
    });

    const createdSong = await song.save();

    return {
      message: "Song liked"
    };
  } catch (err) {
    console.log("error occurred in liking song");
    throw err;
  }
},



/////////////USER-CREATION/////////////


createUser: async function ({ userInput }, req) {
  try {
    const errors = [];

    if (!validator.isEmail(userInput.email)) {
      errors.push({ message: 'E-Mail is invalid.' });
    }

    if (
      validator.isEmpty(userInput.password) ||
      !validator.isLength(userInput.password, { min: 5 })
    ) {
      errors.push({ message: 'Password too short!' });
    }

    if (errors.length > 0) {
      const error = new Error('Invalid input.');
      error.data = errors;
      error.code = 422;
      throw error;
    }

    const existingUser = await User.findOne({ email: userInput.email });
    if (existingUser) {
      const error = new Error('User exists already!');
      throw error;
    }

    const hashedPw = await bcrypt.hash(userInput.password, 12);
    const user = new User({
      email: userInput.email,
      name: userInput.name,
      password: hashedPw,
    });

    const createdUser = await user.save();
    return {
      ...createdUser._doc,
      _id: createdUser._id.toString(),
      name: userInput.name,
      email : userInput.email,
    };
  } catch (err) {
    // Handle any potential errors here
    throw err;
  }
},
//////////////////////// PREV MUSIC - PLAYER ////////////////////////

prevMusicPlayer: async function ({ currentType }, req) {
  try {
    // console.log('Previous Music Player');

    const formattedCurrentType = currentType;

    let foundIndex;
    let musicPlayer;

    // Calculate the previous index considering the circular array
    const startIndex = (lastFoundIndex - 1 + musicPathArray.length) % musicPathArray.length;

    for (let i = startIndex; i >= 0; i--) {
      if (musicPathArray[i].type === formattedCurrentType) {
        foundIndex = i;
        break;
      }
    }

    if (foundIndex === undefined) {
      // Logic when the specified type is not found
      throw new Error('Specified type not found.');
    } else {
      musicPlayer = musicPathArray[foundIndex];
      lastFoundIndex = foundIndex; // Update lastFoundIndex
    }

    console.log('Returning previous data');
    return {
      filePath: musicPlayer.path,
      type: musicPlayer.type,
      artist : musicPlayer.artist,
      title : musicPlayer.title
    };
  } catch (err) {
    console.log('Returning ERROR data');
    console.log(err);
    throw err;
  }
},


//////////////////////// N E X T -- M U S I C - P L A Y E R /////////////////
nextMusicPlayer: async function ({ currentType }, req) {
  try {
    console.log("CURRENT TYPE === "+currentType)

    let foundIndex;
    let musicPlayer;
    const startIndex = (lastFoundIndex + 1) % musicPathArray.length;

    // console.log("musicPathArray at index 0 " + musicPathArray[0].type)

    for (let i = startIndex; i < musicPathArray.length; i++) {
      if (musicPathArray[i].type === currentType) {
        foundIndex = i;
        musicPlayer = musicPathArray[i];
        console.log("MUSIC PLAYER VALUE IN NEXT = " + musicPlayer)
        break;
      }
    }
    
    if (foundIndex === -1) {
      // Logic when the specified type is not found
    } else {
      //  musicPlayer = musicPathArray[foundIndex];
       
      lastFoundIndex = foundIndex; // Update lastFoundIndex
    }
    

    // Update the lastFoundIndex with the new foundIndex
    // lastFoundIndex = (startIndex + foundIndex) % musicPathArray.length;
    
    console.log('returning next data ')
    return {
      filePath: musicPlayer.path,
      type: musicPlayer.type,
      artist : musicPlayer.artist,
      title : musicPlayer.title
    };
  } catch (err) {
    console.log('returning next ERROR data ')
    console.log(err)
    throw err;
  }
},

/////////////////////// M U S I C - P L A Y E R ////////////////////
musicPlayer: async function ({currentType, songTitle}, req) {
  try {
    let exist;
    console.log(' MUSIC PLAYER ')
    const formattedSongTitle = songTitle.replace(/\s+/g, '').toLowerCase();
    const musicPlayer = musicPathArray.find(song =>
      song.title.replace(/\s+/g, '').toLowerCase() === formattedSongTitle
    );

    if (!musicPlayer) {
      const error = new Error('Our server does not contain your requested song..we are sorry plz maf krdo');
      error.code = 424;
      throw error;
    }

    const similarSongsPaths = musicPathArray
    .filter((song) => song.type === currentType)
    .map((song) => song.path)
    .slice(0, 5); // Limit the array to 5 items

console.log("similarSongsPaths")
    return {
      filePath: musicPlayer.path,
      type: musicPlayer.type,
      artist: musicPlayer.artist,
      title: musicPlayer.title,
      similarSongs: similarSongsPaths,
      image : musicPlayer.image
    };
  } catch (err) {
    console.log('ERRRORR musicPLyaer')
    console.log(err)
    throw err;
  }
},


// ///////////////////////// AUTHENTICATION /////////////////////

    authentication: async function (_, req) {
      try {
        // req.isAuth=true;
        // console.log(req.isAuth)
        if(!req.isAuth) {
          const error = new Error('Not authenticated');
          error.code = 420;
          throw error;
          // return {Authenticated : false}
        }
        // return {Authenticated : true}
      } catch (err) {
        // Handle any potential errors here
        throw err;
      }
    },

  

  

  ///////////////////////LOGIN/////////////////////////
  login: async function ({ email, password }) {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error('Email not found');
      error.code = 401;
      throw error;
    }

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error('wrong password');
      error.code = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      'somesupersecretsecret',
      { expiresIn: '1h' }
    );

    return { token: token, userId: user._id.toString(), email: email };
  },
};
