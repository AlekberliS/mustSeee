import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import { useNavigate } from 'react-router-dom';
import "./Main.css"


const fetchMovies = async (searchTerm) => {
  try {
    const response = await fetch(`http://www.omdbapi.com/?apikey=f0fcff3&s=${searchTerm || "book"}`);
    const data = await response.json();

    if (data.Search) {
      const moviesWithIMDbID = data.Search.map(async (movie) => {
        const imdbResponse = await fetch(`http://www.omdbapi.com/?apikey=f0fcff3&i=${movie.imdbID}`);
        const imdbData = await imdbResponse.json();
        return {
          ...movie,
          imdbLink: `https://www.imdb.com/title/${imdbData.imdbID}`,
        };
      });

      const moviesWithData = await Promise.all(moviesWithIMDbID);
      return moviesWithData;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

function Main() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTrigger, setSearchTrigger] = useState(false);
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [listItems, setListItems] = useState([]);
  const [isListSaved, setIsListSaved] = useState(false);
  const [isListLocked, setIsListLocked] = useState(false);
  const [isDeleteAllDisabled, setIsDeleteAllDisabled] = useState(false);
  const [listName, setListName] = useState("");
  const navigate = useNavigate();
  const [searchButtonClicked, setSearchButtonClicked] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (searchTrigger || searchTerm === "") {
        const moviesData = await fetchMovies(searchTerm);
        setMovies(moviesData);
        setSearchTrigger(false);
      }
    };

    fetchData();
  }, [searchTerm, searchTrigger]);

  useEffect(() => {
    setSearchTrigger(true);
  }, []);
  useEffect(() => {
    if (searchButtonClicked) {
      setSearchTerm("");
      setSearchButtonClicked(false);
    }
  }, [searchButtonClicked]);
  
  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchButtonClicked(true);
  
    try {

      const moviesData = await fetchMovies(searchTerm);
      setMovies(moviesData);
    } catch (error) {
      console.error("Error performing search:", error);
    }
  

  };

const handleListSubmit = (e) => {
    e.preventDefault();
  
    if (listName.trim() !== "") {
      setIsListSaved(true);
      setIsListLocked(true);
      setIsDeleteAllDisabled(true);
      setListName(listName.trim()); 
      setSelectedMovie(null);
    } else {
      alert("Write a valid list name");
    }
  };
  const handleInputChange = (e) => {
    setListName(e.target.value);
  };

  const handleDeleteAll = () => {
    if (isListSaved) {
      alert("You cannot delete all items after saving the list.");
    } else {
      setListItems([]);
    }
  };

  const handleAddToList = (movie) => {
    if (isListSaved) {
      alert("You cannot add new films after saving the list.");
    } else if (!listItems.includes(movie.Title)) {
      const newList = [...listItems, movie.Title];
      setListItems(newList);
      alert(`Adding ${movie.Title} to the list`);
    } else {
      alert(`${movie.Title} is already in the list`);
    }
  };
  const handleDeleteListItem = (title) => {
    if (isListLocked) {
      alert("You cannot delete items after saving the list.");
    } else {
      const updatedList = listItems.filter((item) => item !== title);
      setListItems(updatedList);
    }
  };

  const handleDetails = (movie) => {
    setSelectedMovie(movie);
    window.open(movie.imdbLink, '_blank');
  };

  return (
      <div className="app">
        <header className="header">
          <h1 className="siteName">MUSTSEE</h1>
        </header>
        <main className="mainn">
          <div className="left">
            <section className="searchFilmSection">
              <form className="searchFilm">
                <label htmlFor="searchInput">Find films:</label>
                <div className="inputform">
                  <input
                    id="searchInput"
                    className="searchInput"
                    placeholder="Search..."
                    onChange={(e) => setSearchTerm(e.target.value)}
                    value={searchTerm}
                  />
                  <button className="searchBtn" onClick={handleSearch}>
                    Search
                  </button>
                </div>
              </form>
            </section>
            <section className="apiDatas">
              <ul>
                {movies.map((movie) => (
                  <li key={movie.imdbID} className="movieCard">
                    <div className="movieCardImg">
                      <img
                        src={movie.Poster}
                        alt={movie.Title}
                        className="movieImg"
                      />
                    </div>
                    <div className="movieInfo">
                      <h3>{movie.Title}</h3>
                      <div className="movieBtn">
                        <button
                          className="searchBtn"
                          onClick={() => handleAddToList(movie)}
                        >
                          Add to List
                        </button>
                        <button
                          className="searchBtn"
                          onClick={() => handleDetails(movie)}
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>
          <section className="addElementSection">
            <form className="listElement" onSubmit={handleListSubmit}>
              <input
                className="searchInput writeListName"
                placeholder="List name..."
                name="listName"
                value={listName}
                onChange={handleInputChange}
              />
              <div className="listElementItem">
                <ul>
                  {listItems.map((item, index) => (
                    <li key={index} className="ListElementItemLi">
                      {item}
                      <button
                        className="deleteBtn"
                        onClick={() => handleDeleteListItem(item)}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="btnLists">
                <button type="submit" className="saveBtn searchBtn" disabled={isListSaved}>
                  Save
                </button>
  <button className="searchBtn" onClick={() => { navigate(`/list/${listName}`, { state: { listItems, isListSaved } }); }}>
        Go to List
      </button>
                <button type="button" className="goList searchBtn" onClick={handleDeleteAll} disabled={isDeleteAllDisabled}>
                  Delete All
                </button>
              </div>
            </form>
          </section>
        </main>
      </div>
    );
        }
export default Main;
