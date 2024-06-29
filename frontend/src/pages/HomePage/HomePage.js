import React, { useState } from 'react'
import './HomePage.css';


const HomePage = () => {
  const [fileUrl, setFile] = useState("");
  function getURL(event) {
    var tmppath = event.target.files[0];
    setFile(tmppath);
  }
  async function fileSubmitted() {
    const blob = new Blob([fileUrl], { type: fileUrl.type });
    console.log(blob);
    console.log(fileUrl);
    const file = await fetch('http://localhost:3000/upload-video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ blob: blob.arrayBuffer, name: fileUrl.name }),
    })
    
    console.log(await file.json());
  }
  return (
    <div className='homepage'>
      <div className='main-container'>
        <div className='chart-container'>
          Container 1
        </div>
        <div className='content-container'>
          <div className='upload-file'>
            <input type='file' id='i_file' value="" onChange={getURL} />
            <button type='button' onClick={fileSubmitted}>Submit </button>
            <div id='text'></div>
          </div>
          <div className='result-container'>
            respons
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage