const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const multerS3 = require('multer-s3');

const s3Config = {
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
};

const s3 = process.env.AWS_ACCESS_KEY_ID ? new S3Client(s3Config) : null;
const bucketName = process.env.AWS_S3_BUCKET;

const uploadDir = process.env.UPLOAD_DIR || './uploads';
const postsDir = path.join(uploadDir, 'posts');
const avatarsDir = path.join(uploadDir, 'avatars');
const thumbnailsDir = path.join(uploadDir, 'thumbnails');

if (!process.env.VERCEL) {
    [uploadDir, postsDir, avatarsDir, thumbnailsDir].forEach(dir => {
        try {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        } catch (e) {
            console.warn(`Could not create directory ${dir}:`, e.message);
        }
    });
}

let postStorage;
if (s3) {
    postStorage = multerS3({
        s3: s3,
        bucket: bucketName,
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const ext = path.extname(file.originalname);
            cb(null, `posts/post-${uniqueSuffix}${ext}`);
        }
    });
} else {
    postStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, postsDir);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const ext = path.extname(file.originalname);
            cb(null, `post-${uniqueSuffix}${ext}`);
        }
    });
}

let avatarStorage;
if (s3) {
    avatarStorage = multerS3({
        s3: s3,
        bucket: bucketName,
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const ext = path.extname(file.originalname);
            cb(null, `avatars/avatar-${uniqueSuffix}${ext}`);
        }
    });
} else {
    avatarStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, avatarsDir);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const ext = path.extname(file.originalname);
            cb(null, `avatar-${uniqueSuffix}${ext}`);
        }
    });
}

const imageFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
    }
};

const mediaFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|mov|avi|mkv|webm/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = /image|video/.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only image and video files are allowed'));
    }
};

const uploadPost = multer({
    storage: postStorage,
    fileFilter: mediaFilter,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 104857600
    }
}).single('media');

const uploadAvatar = multer({
    storage: avatarStorage,
    fileFilter: imageFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
}).single('avatar');

const deleteFile = async (filePath) => {
    if (!filePath) return false;

    if (filePath.startsWith('http') && s3 && filePath.includes(bucketName)) {
        try {
            const key = filePath.split(`${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/`)[1] ||
                filePath.split(`${bucketName}/`)[1];
            if (!key) return false;

            const command = new DeleteObjectCommand({
                Bucket: bucketName,
                Key: key
            });
            await s3.send(command);
            return true;
        } catch (error) {
            console.error('Error deleting from S3:', error);
            return false;
        }
    }

    try {
        const fullPath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error deleting local file:', error);
        return false;
    }
};

const uploadFileToS3 = async (localPath, s3Key, contentType) => {
    if (!s3) return null;
    try {
        const fileStream = fs.createReadStream(localPath);
        await s3.send(new PutObjectCommand({
            Bucket: bucketName,
            Key: s3Key,
            Body: fileStream,
            ContentType: contentType,
            ACL: 'public-read'
        }));
        return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
    } catch (error) {
        console.error('Manual S3 upload error:', error);
        return null;
    }
};

module.exports = {
    uploadPost,
    uploadAvatar,
    deleteFile,
    uploadFileToS3,
    isS3: !!s3,
    postsDir,
    avatarsDir,
    thumbnailsDir
};

