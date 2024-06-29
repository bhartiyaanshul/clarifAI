import React, { useState } from 'react'
import './HomePage.css';


const HomePage = () => {
  const [fileUrl, setFile] = useState("");
  const [filedata, setFileData] = useState("");
  function getURL(event) {
    var tmppath = event.target.files[0];
    setFile(tmppath);
  }

  const arrayBufferToBase64 = (buffer) => {
    let binary = '';

    const bytes = new Uint8Array(buffer)

    const len = bytes.length

    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i])
    }

    return window.btoa(binary) 
  }

  async function fileSubmitted() {
    const blob = new Blob([fileUrl], { type: fileUrl.type });
    console.log(blob);
    console.log(fileUrl);
    const arrayBuffer = await blob.arrayBuffer()
    const base64 = arrayBufferToBase64(arrayBuffer)
    
    console.log("This is the base64 string")
    console.log(base64)

    const file = await fetch('http://localhost:3000/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        blob: base64, name: fileUrl.name, type: fileUrl.type
      }),
    })

    // setFileData(JSON.stringify(file));
    console.log(file.text());
    // const filedata = document.querySelector('.result-container').innerHTML = await file.text();
    
    console.log(JSON.stringify(file));
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
            {filedata}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage