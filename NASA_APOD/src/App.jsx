import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [apodData, setApodData] = useState(null);
  const [banList, setBanList] = useState(new Set());
  const [history, setHistory] = useState([]);
  const apiKey = "meIIcmyZjFCdeEPMXDR7DO6IFKZqFHb8Hq04yPfI"; 
  
    useEffect(() => {
      // Load history from session storage on mount
      const savedHistory = JSON.parse(sessionStorage.getItem("viewedItems")) || [];
      setHistory(savedHistory);
    }, []);
  
    useEffect(() => {
      // Save history to session storage whenever it changes
      sessionStorage.setItem("viewedItems", JSON.stringify(history));
    }, [history]);
  
    const fetchRandomAPOD = () => {
      fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=1`)
        .then(response => response.json())
        .then(data => {
          let apod = data[0];
          if (shouldDisplay(apod)) {
            setApodData(apod);
            setHistory((prevHistory) => [...prevHistory, apod]);
          } else {
            fetchRandomAPOD(); // Fetch again if the item is banned
          }
        })
        .catch(error => console.error('Error:', error));
    };
  
    const shouldDisplay = (apod) => {
      return !banList.has(apod.title) && !banList.has(apod.explanation);
    };
  
    const addToBanList = (attribute) => {
      setBanList((prevBanList) => new Set(prevBanList).add(attribute));
    };
  
    const removeFromBanList = (attribute) => {
      setBanList((prevBanList) => {
        const updatedBanList = new Set(prevBanList);
        updatedBanList.delete(attribute);
        return updatedBanList;
      });
    };
  
    return (
      <div className="app">
        <h1>NASA Astronomy Picture of the Day</h1>
        <div className="main-container">
          <div className="history-container">
            <h3>Viewed Items</h3>
            <ul>
              {history.map((item, index) => (
                <li key={index} className="history-item">
                <div className="history-image-container">
                  <img src={item.url} alt={item.title} className="history-image" />
                </div>                  <div className="history-details">
                    <p>{item.title}</p>
                    <p>{item.date}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="apod-container">
            <button onClick={fetchRandomAPOD} className="fetch-button">Get Random APOD</button>
            {apodData && (
              <div className="apod">
                <h2 onClick={() => addToBanList(apodData.title)}>Title: {apodData.title}</h2>
                <p onClick={() => addToBanList(apodData.date)}>Date: {apodData.date}</p>
                {apodData.media_type === "image" && (
                  <img

                    src={apodData.url}
                    alt={apodData.title} className="apod-image"
                    onClick={() => addToBanList(apodData.url)}
                  />
                )}
                <p onClick={() => addToBanList(apodData.explanation)}>
                  Explanation: {apodData.explanation}
                </p>
              </div>
            )}
          </div>
          <div className="ban-list-container">
            <h3>Banned Attributes</h3>
            <ul>
              {[...banList].map((attribute, index) => (
                <li key={index} onClick={() => removeFromBanList(attribute)} className="ban-item">
                  {attribute}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };
  
  
  export default App;