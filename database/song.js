// const mongoose = require('mongoose');
// const Song = require('../models/song');

// const musicDirectory = 'D:/music';
// const Song = require('./models/song');
// const songs = fs.readdirSync(musicDirectory);
// console.log(songs)
// songs.forEach(async (song) => {
//   // Skip directories
//     const file = fs.readFileSync(`${musicDirectory}/${song}`);

//     // Analyze the tempo using music-tempo package
//     // const tempo = await musicTempo.getTempo(file);
    
//     // Create a new song document
//     const songData = new Song({
//       title: song,
//       artist: 'The Artist',
//       album: 'The Album',
//       genre: 'The Genre',
//       tempo: tempo,
//       filePath: `${musicDirectory}/${song}`,
//     });

//     // Save the song data to MongoDB
//     try {
//       await songData.save();
//       console.log(`Saved ${song} to MongoDB`);
//     } catch (error) {
//       console.error(`Error saving ${song} to MongoDB:`, error);
//     }
  
// });