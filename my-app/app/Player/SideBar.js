'use client'
import React from "react";
import styles from './SideBar.module.css'

const SideBar = ({setIsLiked , setSimilarSongs}) => {

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
}


return(
    <div className={styles.sideBar}>
    <div className={styles.likedSongs} >
      <button onClick={handleLike} >Liked Songs</button>
    </div>
    <button className={styles.addBtn}>Add + </button>
    </div>
)}

export default SideBar


