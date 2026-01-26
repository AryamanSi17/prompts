const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

// Compress video to 720p MP4
const compressVideo = (inputPath, outputPath, onProgress) => {
    return new Promise((resolve, reject) => {
        const quality = process.env.VIDEO_COMPRESSION_QUALITY || '720';

        ffmpeg(inputPath)
            .output(outputPath)
            .videoCodec('libx264')
            .size(`?x${quality}`) // Maintain aspect ratio, height = 720
            .videoBitrate('1500k')
            .audioCodec('aac')
            .audioBitrate('128k')
            .format('mp4')
            .on('start', (commandLine) => {
                console.log('FFmpeg started:', commandLine);
            })
            .on('progress', (progress) => {
                if (onProgress) {
                    onProgress(progress);
                }
                console.log(`Processing: ${progress.percent}% done`);
            })
            .on('end', () => {
                console.log('Video compression completed');

                // Get file sizes
                const originalSize = fs.statSync(inputPath).size;
                const compressedSize = fs.statSync(outputPath).size;

                resolve({
                    success: true,
                    originalSize,
                    compressedSize,
                    compressionRatio: ((1 - compressedSize / originalSize) * 100).toFixed(2)
                });
            })
            .on('error', (err) => {
                console.error('Error compressing video:', err);
                reject(err);
            })
            .run();
    });
};

// Generate video thumbnail
const generateThumbnail = (videoPath, thumbnailPath, timeInSeconds = 1) => {
    return new Promise((resolve, reject) => {
        ffmpeg(videoPath)
            .screenshots({
                timestamps: [timeInSeconds],
                filename: path.basename(thumbnailPath),
                folder: path.dirname(thumbnailPath),
                size: '640x?'
            })
            .on('end', () => {
                console.log('Thumbnail generated:', thumbnailPath);
                resolve(thumbnailPath);
            })
            .on('error', (err) => {
                console.error('Error generating thumbnail:', err);
                reject(err);
            });
    });
};

// Get video duration
const getVideoDuration = (videoPath) => {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(videoPath, (err, metadata) => {
            if (err) {
                reject(err);
            } else {
                const duration = metadata.format.duration;
                resolve(duration);
            }
        });
    });
};

module.exports = {
    compressVideo,
    generateThumbnail,
    getVideoDuration
};
