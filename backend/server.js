const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const { exec } = require('child_process');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb+srv://sari:sari@demo.cbgcelo.mongodb.net/?retryWrites=true&w=majority&appName=demo')
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Schema for storing video metadata
const videoSchema = new mongoose.Schema({
  originalVideoUrl: String,
  resultVideoUrl: String,
});

const Video = mongoose.model('Video', videoSchema);

// Endpoint for video upload
app.post('/api/upload', upload.single('video'), (req, res) => {
  const originalVideoPath = path.resolve(__dirname, req.file.path);
  console.log('Original Video Path:', originalVideoPath);

  // Call the ML program with the uploaded video
  const mlScript = `python process_video.py "${originalVideoPath}"`;

  exec(mlScript, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing ML script: ${error}`);
      console.error(stderr);
      return res.status(500).send('Error processing video');
    }

    const resultVideoPath = stdout.trim();
    console.log('Result Video Path:', resultVideoPath);

    // Convert the processed video to H.264 using ffmpeg
    const outputFilePath = path.join(path.dirname(resultVideoPath), `converted_${path.basename(resultVideoPath)}`);
    const ffmpegCommand = `ffmpeg -i "${resultVideoPath}" -c:v libx264 -crf 23 "${outputFilePath}"`;

    exec(ffmpegCommand, (ffmpegError, stdout, stderr) => {
      if (ffmpegError) {
        console.error(`Error converting video with ffmpeg: ${ffmpegError}`);
        console.error(stderr);
        return res.status(500).send('Error converting video');
      }

      console.log('Converted Video Path:', outputFilePath);

      // Check if the output file exists
      if (!fs.existsSync(outputFilePath)) {
        console.error('Converted video file does not exist:', outputFilePath);
        return res.status(500).send('Converted video file does not exist');
      }

      const newVideo = new Video({
        originalVideoUrl: originalVideoPath,
        resultVideoUrl: outputFilePath,
      });

      newVideo.save().then(() => {
        res.json({ resultVideoUrl: `/uploads/${path.basename(outputFilePath)}` });
      });
    });
  });
});

// Serve processed videos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
