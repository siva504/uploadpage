const express = require('express');
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

cloudinary.config({ 
  cloud_name: 'djusoo1nh', 
  api_key: '787543858154415', 
  api_secret: '2ItKz978-EsS06CLjPXnGQ_wrts' 
});

mongoose.connect('mongodb://localhost:27017', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});


const fileSchema = new mongoose.Schema({
  title: String,
  description: String,
  thumbnailUrl: String,
  videoUrl: String,
});

const File = mongoose.model('File', fileSchema);

app.use(bodyParser.json());
app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post('/api/upload', upload.fields([{ name: 'thumbnail' }, { name: 'video' }]), async (req, res) => {
  try {
    const { title, description } = req.body;
    const thumbnailFile = req.files['thumbnail'][0];
    const videoFile = req.files['video'][0];
    const thumbnailFilePath = path.join(__dirname, 'temp', 'thumbnail.jpg');
    const videoFilePath = path.join(__dirname, 'temp', 'video.mp4');

    if (!fs.existsSync(path.join(__dirname, 'temp'))) {
      fs.mkdirSync(path.join(__dirname, 'temp'));
    }
    fs.writeFileSync(thumbnailFilePath, thumbnailFile.buffer);
    fs.writeFileSync(videoFilePath, videoFile.buffer);
    const thumbnailUploadResult = await cloudinary.uploader.upload(thumbnailFilePath, {
      resource_type: 'image',
    });
    const videoUploadResult = await cloudinary.uploader.upload(videoFilePath, {
      resource_type: 'video',
      format: 'mp4', 
    });
    const newFile = new File({
      title,
      description,
      thumbnailUrl: thumbnailUploadResult.secure_url,
      videoUrl: videoUploadResult.secure_url,
    });

    await newFile.save();
    if (fs.existsSync(thumbnailFilePath)) {
      fs.unlinkSync(thumbnailFilePath);
    }
    if (fs.existsSync(videoFilePath)) {
      fs.unlinkSync(videoFilePath);
    }

    return res.status(200).json({ message: 'Upload successful' });
  } catch (error) {
    console.error('Error uploading:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


app.get('/api/files', async (req, res) => {
  try {
    const files = await File.find({}, 'title thumbnailUrl videoPublicId'); 
    return res.status(200).json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/video/:thumbnailId', async (req, res) => {
  try {
    const thumbnailId = req.params.thumbnailId;

    const videoUrl = `https://res.cloudinary.com/djusoo1nh/video/upload/${thumbnailId}.mp4`;

    if (!videoUrl) {
      return res.status(404).json({ message: 'Video not found' });
    }

    return res.status(200).json({ videoUrl });
  } catch (error) {
    console.error('Error fetching video:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
