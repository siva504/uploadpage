import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Grid,Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper  } from '@mui/material';

import { useNavigate} from 'react-router-dom';

const UploadPage = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleThumbnailClick = (thumbnailId) => {
    navigate(`/video/upload/${thumbnailId}`);
  };

  const fetchUploadedFiles = () => {
    axios.get('http://localhost:3001/api/files') 
      .then((response) => {
        setUploadedFiles(response.data);
      })
      .catch((error) => {
        console.error('Error fetching uploaded files:', error);
      });
  };

  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  const handleTitleChange = (e) => {
    if (e.target.value.length <= 50) {
      setTitle(e.target.value);
    } else {
      alert('Title Field maximum 50 characters only');
    }
  };

  const handleDescriptionChange = (e) => {
    if (e.target.value.length <= 200) {
      setDescription(e.target.value);
    } else {
      alert('Description area maximum 200 characters only');
    }
  };

  const handleThumbnailChange = (e) => {
    setThumbnailFile(e.target.files[0]);
  };

  const handleVideoChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);

      if (thumbnailFile) {
        formData.append('thumbnail', thumbnailFile);
      }

      if (videoFile) {
        formData.append('video', videoFile);
      }
      await axios.post('http://localhost:3001/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload successful');
      setTitle('');
      setDescription('');
      setThumbnailFile(null);
      setVideoFile(null);
      fetchUploadedFiles();
    } catch (error) {
      console.error('Error uploading:', error);
    }
  };

  return (
    <Container maxWidth="md" style={{ marginTop: '40px' }}>
      <Typography variant="h4" gutterBottom>
        Upload Page
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField fullWidth label="Title" value={title} onChange={handleTitleChange} />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Description"
            minRows={4}
            value={description}
            onChange={handleDescriptionChange}
            style={{ width: '100%' }}
          />
        </Grid>
        <Grid item xs={12}>
          Upload Image
          <input
            type="file"
            accept="image/jpeg, image/png"
            onChange={handleThumbnailChange}
          />
        </Grid>
        <Grid item xs={12}>
          Upload Video
          <input
            type="file"
            accept="video/mpeg, video/avi, video/mp4"
            onChange={handleVideoChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: '20px' }}
            onClick={handleUpload}
          >
            Upload
          </Button>
        </Grid>
      </Grid>

      {uploadedFiles.length > 0 && (
        <div style={{ marginTop: '40px' }}>
          <Typography variant="h4" gutterBottom>
            Uploaded Files
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Thumbnail</TableCell>
                  <TableCell>Title</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {uploadedFiles.map((file) => (
                  <TableRow key={file._id}>
                    <TableCell>
                      <img
                        src={file.thumbnailUrl}
                        alt={file.title}
                        width="50"
                        height="50"
                        onClick={() => handleThumbnailClick(file._id)}
                        style={{ cursor: 'pointer' }} 
                      />
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body1"
                        onClick={() => handleThumbnailClick(file._id)} 
                        style={{ cursor: 'pointer', color: 'blue' }} 
                      >
                        {file.title}
                      </Typography>
                    </TableCell>
                    <TableCell>{file.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
    </Container>
  );
};

export default UploadPage;
