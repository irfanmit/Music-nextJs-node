'use client'
import Image from 'next/image';
import Head from 'next/head';
import { useState } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import LoginButton from './signin/LoginButton';
import SignUp from './signup/SignUp';
import { useRef } from 'react';
import Player from './Player/Player';
import Artist from './Player/Artist';
import Similar from './Player/Similar'

export default function Home() {

  const audioRef = useRef();

  const suggestions = ['Dune', 'First Flight', 'Pirates Of Carribean', 'Can you hear the music', 'Dream is collapsing'];

  const [showDiv, setShowDiv] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [filePath, setFilePath] =  useState('')
  const [prio, setPrio] = useState(1);
  const [artist, setArtist] = useState('');
  const [title, setTitle] = useState('')
  const [similarSongs, setSimilarSongs] = useState([]);

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    setInputValue(inputValue);

    // Filter suggestions based on input value
    const filtered = suggestions.filter(suggestion =>
      suggestion.replace(/\s+/g, '').toLowerCase().includes(inputValue.replace(/\s+/g, '').toLowerCase())
    );
    setFilteredSuggestions(filtered);
  };
///////////////////////
const handleSearch = () => {
  const type = localStorage.getItem('type')
  setInputValue('')
  setPrio(0);
  setShowDiv(true); // Show the conditional div
  const graphqlQuery = {
    query: `
      query {
        musicPlayer(
          songTitle: "${inputValue}"
          currentType: "${type}"
      
        ){
          filePath
          type
          artist
          title
          similarSongs
        }
      }
    `
  };

  fetch('http://localhost:8080/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(graphqlQuery)
  })
    .then(res => {
      return res.json();
    })
    .then(resData => {
      // alert("Fetching music data failed!");
      console.log(resData.errors)
      if (resData.errors && resData.errors[0].status === 424) {
        throw new Error("Fetching music data failed!");
      }
      if (resData.errors) {
        alert('failed')
        // console.log(resData.errors);
      }
      console.log("similar songs data "  +resData)
      setPrio(1);
      setFilePath(resData.data.musicPlayer.filePath)
      setArtist(resData.data.musicPlayer.artist)
      setTitle(resData.data.musicPlayer.title)
      console.log(resData.data.musicPlayer.similarSongs);
      setSimilarSongs(resData.data.musicPlayer.similarSongs)
      localStorage.setItem('type' , resData.data.musicPlayer.type)
    })
    .catch(error => {
      // console.error(error);
      // setError('User creation failed');
    });
};

const handlePlay = (event) =>{
  event.preventDefault();
  audioRef.current.play();
}

  const handlePause = (event) =>{
    event.preventDefault();
    audioRef.current.pause();
  }


  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setFilteredSuggestions([]);

  };
////////////////////////////
  return (
    <>
       <nav className="navbar navbar-expand-lg navbar-light navbar-dark bg-dark">
        <div className="container">
          <a className="navbar-brand" href="#">Spoti-Clone</a>
          <div className="ml-auto">
            <LoginButton />
            <SignUp />   
          </div>
        </div>
      </nav>
      {/* <audio src={'/music/dune.mp3'} controls ></audio> */}
     
      <div>
      <div>
        <div className="theForm">
          <form>
            <input
              placeholder='Search music, album, artist'
              value={inputValue}
              onChange={handleInputChange}
            />
            <div className="btn">
              <button onClick={handleSearch} type="button">Search</button>
            </div>
            {inputValue && (
              <div className="suggestions">
                {filteredSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="suggestion"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </form>
        </div>
      </div>
     
      {showDiv && (
        <div className="conditionalDiv">

      {/* <Similar setPrio={setPrio} setFilePath={setFilePath}  setArtist={setArtist} setTitle={setTitle} similarSongs={similarSongs} /> */}
       
        
          <Artist   artist={artist} title={title} />

        </div>
      )}
      </div>
      <button onClick={handlePlay} >play-audio</button>
      <hr/>
      {console.log("FILEPATH ======== "+filePath)}
      <button onClick={handlePause} >pause-audio</button>
      {!inputValue && filePath && (
        <div className="audioDiv">
          <Player title={title} artist={artist} setArtist={setArtist} setTitle={setTitle} setSimilarSongs={setSimilarSongs} similarSongs={similarSongs} filePath={filePath} setPrio={setPrio} prio={prio} />
        </div>
      )}
    </>
  );
}
