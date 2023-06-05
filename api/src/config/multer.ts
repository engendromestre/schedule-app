import multer from "multer";

const upload = multer({
    storage: multer.memoryStorage(), //buffer storage
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB updload
})

export { upload }

