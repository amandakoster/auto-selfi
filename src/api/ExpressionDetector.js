/**
 * Face and expression detection information: https://github.com/justadudewhohacks/face-api.js
 */
import * as faceapi from "face-api.js";

const MODEL_URL = process.env.PUBLIC_URL + "/models";
const DETECTION_INTERVAL = 300; // How often to update predictions in milliseconds

class ExpressionDetector {
    /**
     * @param {video element} video To show the webcam stream. 
     * @param {canvas element} canvas To draw the prediction results.
     * @param {canvas element} hiddenCanvas To capture a photo.
     */
    constructor(video, canvas, hiddenCanvas) {
        this.video = video;
        this.canvas = canvas;
        this.hiddenCanvas = hiddenCanvas;

    }

    /**
     * Configures, starts, and manages face/expression detection.
     * @param {function} callbackOnDetection Component function called when the 
     * detection results are updated. 
     */
    startDetection(callbackOnDetection) {
        const prepareVideo = () => {
            this.video.addEventListener("play", () => {
                const displaySize = this.getDisplaySize();
                faceapi.matchDimensions(this.canvas, displaySize);
                faceapi.matchDimensions(this.hiddenCanvas, displaySize);
                detectFaces();
            }); 
        }

        const loadModels = () => {
            Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL), // detects faces
                faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL) // detects facial expression e.g. neutral, happy
            ]).then(() => {
                startWebcam();
            });
        }

        const startWebcam = () => {
            navigator.mediaDevices.getUserMedia({
                    video: {}
                })
            .then(stream => {
                this.video.srcObject = stream
            })
            .catch(err => console.error(err));
        }
        
        /**
         * Performs the face and expression detection at the given interval
         */
        const detectFaces = () => {
            const displaySize = this.getDisplaySize();
            setInterval(async () => {
                const detections = await faceapi.detectAllFaces(
                        this.video, new faceapi.TinyFaceDetectorOptions()
                    ).withFaceExpressions();
                drawPredictions(detections, displaySize);
                // Passes the detection results back to the component
                callbackOnDetection(getTopPredictions(detections))
            }, DETECTION_INTERVAL)
        }
        
        /**
         * Draws the detection results on top of the video
         * @param {object} detections The detection results
         * @param {object} displaySize Contains the dimensions of the video, for 
         * drawing alignment and scaling
         */
        const drawPredictions = (detections, displaySize) => {
            const resizedDetections = faceapi.resizeResults(detections, displaySize)
            // Clears the previous drawing
            this.canvas.getContext("2d").clearRect(
                    0, 0, this.canvas.width, this.canvas.height);
            // draw box around face    
            faceapi.draw.drawDetections(this.canvas, resizedDetections);
            // add expression label
            faceapi.draw.drawFaceExpressions(this.canvas, resizedDetections);
        }
        
        /**
         * Returns an array of the most probable expression for each face.
         * @param {object} detections The detection results
         */
        const getTopPredictions = (detections) => {
            let topPredictions = [];
            for (let face in detections) {
                // Sort expressions in order of probability
                const sortedPredictions = detections[face].expressions.asSortedArray();
                // Adds the top probability expression (e.g. "neutral", "happy") to 
                // the array. To get the probability of that expression, use 
                // sortedPredictions[X].probability
                topPredictions.push(sortedPredictions[0].expression);
            }
            return topPredictions;
        }

        prepareVideo();
        loadModels();
    }

    getDisplaySize = () =>{
        return { 
            width: this.video.clientWidth, 
            height: this.video.clientHeight 
        };
    }

    /**
     * Captures a still from the webcam feed and returns an image as a data url.
     * The data URL can be used as an image src e.g.:
     * const pic = takePhoto();
     * ...
     * <img src={pic} />
     */
    takePhoto = () => {
        const displaySize = this.getDisplaySize();
        this.hiddenCanvas.getContext("2d").drawImage(this.video, 0, 0, displaySize.width, displaySize.height);
        const imageData = this.hiddenCanvas.toDataURL("image/jpeg");
        return imageData;
    }
}

export default ExpressionDetector;