// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UploadPage from './Upload_page';
import VideoPage from './Display_Video';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<UploadPage />} /> 
          <Route path="/video/upload/:thumbnailId" element={<VideoPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
