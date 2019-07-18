


const PROCESSING_RESOLUTION_WIDTH = 240;

var fps = document.getElementById('fps');
var video = document.getElementById('videoElement');
var canvas = null;
let scale = 0;



function addCanvas(width, height) {
    const canvas = document.createElement('canvas');
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    canvas.style.display = 'none';
    document.body.appendChild(canvas);

    return canvas;
}

let init_flag = false;
async function init() {
    const stream = await navigator.mediaDevices
              .getUserMedia({ video: true, audio: false });

    const settings = stream.getVideoTracks()[0].getSettings();
    scale = PROCESSING_RESOLUTION_WIDTH / settings.width;

    canvas = addCanvas(settings.width * scale, settings.height * scale);

    video.setAttribute('width', settings.width);
    video.setAttribute('height', settings.height);

    video.srcObject = stream;
    await video.play();

    init_flag = true;
}

init();


async function createFileFromUrl(path, url) {
    // Small function to make a remote file visible from emscripten module.

    console.log(`Downloading additional file from ${url}.`);
    const res = await self.fetch(url);
    if (!res.ok) {
        throw new Error(`Response is not OK (${res.status} ${res.statusText} for ${url})`);
    }
    const buffer = await res.arrayBuffer();
    const data = new Uint8Array(buffer);
    cv.FS_createDataFile('/', path, data, true, true, false);
    console.log(`📦${url} downloaded. Mounted on /${path}`);
}

let cv_loaded = false;
cv['onRuntimeInitialized'] = async () => {
    console.log('cv loaded.');

    await createFileFromUrl('haarcascade_frontalface_default.xml',
                            './data/haarcascade_frontalface_default.xml');

    classifier = new cv.CascadeClassifier();
    classifier.load('haarcascade_frontalface_default.xml');

    cv_loaded = true;
};



function detectFaces(imageData) {
    if (imageData == undefined) return;
    const img = cv.matFromImageData(imageData);
    const imgGray = new cv.Mat();

    const rect = [];
    cv.cvtColor(img, imgGray, cv.COLOR_RGBA2GRAY, 0);
    const faces = new cv.RectVector();
    const msize = new cv.Size(0, 0);
    classifier.detectMultiScale(imgGray, faces, 1.1, 3, 0, msize, msize);

    for (let i = 0; i < faces.size(); i++) {
        rect.push(faces.get(i));
    }

    img.delete();
    faces.delete();
    imgGray.delete();

    return rect;
}

const FPS = 30;
function processVideo() {
    let begin = Date.now();

    if (cv_loaded && init_flag){
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        // imageData = imageData.data.buffer;

        const faces = detectFaces(imageData);

        if (faces.length > 0)
            console.log(faces);       
    }
    const dt = Date.now() - begin;
    let delay = 1000/FPS - dt;
    fps.innerHTML = dt + ' ms';
    
    setTimeout(processVideo, delay);
}
// schedule first one.
setTimeout(processVideo, 0);