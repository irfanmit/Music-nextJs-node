import React, { useState } from "react";
import styles from './SideBar.module.css';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const SideBar = ({ artist,title,filePath,setIsLiked, setSimilarSongs, suggestions, handleSuggestionClick }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  const handleLike = () => {
    const graphqlQuery = {
      query: `
        query {
          likedSongFetcher{
            likedSongArray 
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
    }).then(res => {
      return res.json();
    }).then(resData => {
      if (resData.errors && resData.errors[0].status === 422) {
        throw new Error("liked song fetching  failed!");
        alert("liked song failed");
      }
      if (resData.errors) {
        console.log(resData);
        if (resData.errors[0].data[0].message) {
          alert("error occurred while fetching liked song");
        }
        if (resData.errors[0].data[1].message) {
          alert("again liked song error");
        }
        throw new Error('liked song didnt work');
      }
      console.log("liked song fetched "+resData);
      console.log(resData);
      console.log(resData.data.likedSongFetcher.likedSongArray);
      setSimilarSongs(resData.data.likedSongFetcher.likedSongArray)
      alert('Successfully fetched liked the song');
    }).catch(error => {
      console.error(error);
    });
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    setInputValue(inputValue);

    // Filter suggestions based on input value
    const filtered = suggestions.filter(suggestion =>
      suggestion.replace(/\s+/g, '').toLowerCase().includes(inputValue.replace(/\s+/g, '').toLowerCase())
    );
    setFilteredSuggestions(filtered);
  };

  const handleAdd = (e) => {
    e.preventDefault();


    
    const graphqlQuery = {
      query: `
        mutation {
          likedSong(
            pathToLikedSong: "${likedSongPath}", artist: "${artist}", title: "${title}"
          ){
            message
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
    }).then(res => {
      return res.json();
    }).then(resData => {
      if (resData.errors && resData.errors[0].status === 422) {
        throw new Error("liked song creation failed!");
        alert("liked song failed");
      }
      if (resData.errors) {
        console.log(resData);
        if (resData.errors[0].data[0].message) {
          alert("error occurred while creating liked song");
        }
        if (resData.errors[0].data[1].message) {
          alert("again liked song error");
        }
        throw new Error('liked song didnt work');
      }
      console.log(resData);
      alert('Successfully liked the song');
    }).catch(error => {
      console.error(error);
    });

  }

  return (
    <div className={styles.sideBar}>
      <div className={styles.likedSongs}>
        <button onClick={handleLike}>Liked Songs</button>
      </div>
      <button onClick={openModal}>Add btn</button>
      <Modal isOpen={isModalOpen} toggle={closeModal}>
        <ModalHeader toggle={closeModal}>Add your favourate songs..</ModalHeader>
        <ModalBody>
          <input
            type="text"
            placeholder="Type here to search and add..."
            value={inputValue}
            onChange={handleInputChange}
          />
          <ul>
            {filteredSuggestions.map((suggestion, index) => (
              <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                {suggestion}
              </li>
            ))}
          </ul>
          <button onClick={handleAdd} >Add</button>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={closeModal}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default SideBar;
