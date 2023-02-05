import logo from "./logo.svg";
import axios, * as others from "axios";
import "./App.css";
import React, { Component, useState } from "react";
import title from "./images/Logo.PNG";

function App() {
  const [index, setIndex] = useState(0);
  // const [plantList, setPlantList] = useState([]);
  const [plant, setPlant] = useState("");
  const [name, setName] = useState("");
  const [minTemp, setMinTemp] = useState(0);
  const [maxTemp, setMaxTemp] = useState(0);
  const [toleratedLight, setToleratedLight] = useState("");
  const [water, setWater] = useState("");
  const plantList = [];

  const sendIdentification = (e) => {
    e.preventDefault();
    const files = [...document.querySelector("input[type=file]").files];
    const promises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const res = event.target.result;
          console.log(res);
          resolve(res);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then((base64files) => {
      console.log(base64files);

      const data = {
        api_key: "DhcmcJKc1JVWCtkoTOq7s3c3sg4Pvx8IdncoNDcnL4RKMMDE1L",
        images: base64files,
        // modifiers docs: https://github.com/flowerchecker/Plant-id-API/wiki/Modifiers
        modifiers: ["crops_fast", "similar_images"],
        plant_language: "en",
        // plant details docs: https://github.com/flowerchecker/Plant-id-API/wiki/Plant-details
        plant_details: [
          "common_names",
          "url",
          "name_authority",
          "wiki_description",
          "taxonomy",
          "synonyms",
        ],
      };

      fetch("https://api.plant.id/v2/identify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          console.log(data.suggestions[0].plant_details.common_names);
          data.suggestions[0].plant_details.common_names.map((plantName) => {
            plantList.push(plantName);
          });
          console.log(plantList);
          handleSubmit();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  };

  const handleChange = (e) => {
    setPlant(e.target.value);
  };

  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "cd4d4e9398msha1a160b6d47f7b2p12c974jsndf0cd5442f53",
      "X-RapidAPI-Host": "house-plants.p.rapidapi.com",
    },
  };

  const handleSubmit = () => {
    // console.log(plantList.length);
    // console.log(plantList);
    // setPlant(plantList[index]);
    // console.log(plantList[index]);
    // console.log(plant);
    // setPlant(plant.replace(/\s/g, ""));
    // console.log(plant);
    for (var i = 0; i < plantList.length; i++) {
      const url = `https://house-plants.p.rapidapi.com/common/${plantList[i]}`;
      console.log(url);
      fetch(url, options)
        .then((response) => response.json())
        .then(
          (response) => (
            console.log(response),
            setName(response[0].common[0]),
            setMaxTemp(response[0].tempmax.celsius),
            setMinTemp(response[0].tempmin.celsius),
            setToleratedLight(response[0].toleratedlight),
            setWater(response[0].watering)
          )
        )
        .catch((err) => console.error(err));
      if (name !== "") {
        break;
      }
    }
    setIndex(index + 1);
    console.log(index);
  };

  return (
    <div className="body">
      <div className="titleAlign">
        <img src={title} style={{ height: 230, width: 1000 }} />
        {/* <div className="plantcare">Plant Care</div> */}
      </div>
      <div className="plantWrapper">
        <div className="imageWrapper">
          <div>
            <div className="insertPrompt">Insert Photo Here:</div>
            <input onChange={handleChange} />
            <button onClick={handleSubmit}>Enter</button>
            <form>
              <input type="file" multiple />
              <button type="button" onClick={sendIdentification}>
                OK
              </button>
            </form>
          </div>
        </div>
        <div className = "promptText">
          <div>Plant Name: {name}</div>
          <div>Max Temperature: {maxTemp}</div>
          <div>Min Temperature: {minTemp}</div>
          <div>Tolerated Light: {toleratedLight}</div>
          <div>Watering: {water}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
