import React, { useState, useEffect } from 'react';
import './HomePage.css';
import { Radar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const HomePage = () => {
  const [fileUrl, setFile] = useState("");
  const [filedata, setFileData] = useState(null);

  const getURL = (event) => {
    const tmppath = event.target.files[0];
    setFile(tmppath);
  };

  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.length;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const fileSubmitted = async () => {
    const blob = new Blob([fileUrl], { type: fileUrl.type });
    const arrayBuffer = await blob.arrayBuffer();
    const base64 = arrayBufferToBase64(arrayBuffer);

    const response = await fetch('http://localhost:3000/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        blob: base64,
        name: fileUrl.name,
        type: fileUrl.type,
      }),
    });

    const jsonResponse = await response.json();
    setFileData(jsonResponse);
  };

  const getChartData = (data) => {
    if (!data) return null;
    const response = data.response;
    const candidates = response.candidates[0].content.parts[0].text;
    const parsedCandidates = JSON.parse(candidates);
    
    const labels = Object.keys(parsedCandidates);
    const values = Object.values(parsedCandidates).map(candidate => candidate.rating);

    return {
      labels: labels,
      datasets: [{
        label: 'Ratings',
        data: values,
        backgroundColor: 'rgba(34,202,236,0.2)',
        borderColor: 'rgba(34,202,236,1)',
        borderWidth: 1
      }]
    };
  };

  const renderResponse = (data) => {
    if (!data) return null;

    const response = data.response;
    const candidates = response.candidates[0].content.parts[0].text;
    const parsedCandidates = JSON.parse(candidates);

    return (
      <div>
        {Object.entries(parsedCandidates).map(([key, value]) => (
          <div key={key}>
            <h3>{key}</h3>
            <p>Rating: {value.rating}</p>
            <p>Description: {value.description}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className='homepage'>
      <div className='main-container'>
        <div className='chart-container'>
          {filedata && (
            <Radar
              data={getChartData(filedata)}
              options={{
                scale: {
                  ticks: { beginAtZero: true }
                }
              }}
            />
          )}
        </div>
        <div className='content-container'>
          <div className='upload-file'>
            <input type='file' id='i_file' onChange={getURL} />
            <button type='button' onClick={fileSubmitted}>Submit</button>
          </div>
          <div className='result-container'>
            {renderResponse(filedata)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
