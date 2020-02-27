/**
 * Uses Mozilla's experimental SpeechRecognition API: https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition
 * Only available in Chrome!
 */
class SpeechDetector {
    constructor() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        try {
            this.recognition = new SpeechRecognition();
            this.isSupported = true;
        }
        catch (err) {
            console.error("SpeechRecognition is not supported by your browser! Try using Chrome");
            this.isSupported = false;
        }
    }

    /**
     * Configures, starts, and manages speech recognition.
     * @param {function} callbackOnDetection Component function called when the 
     * detection results are updated. 
     */
    startDetection = (callbackOnDetection) => {
        if (this.isSupported) {
            this.recognition.continous = true;
            this.recognition.lang = "en-US";
            this.recognition.start();

            /**
             * The recognizer stops whenever there is a pause in speech. This 
             * event handler restarts the recognizer.
             */
            this.recognition.onend = () => this.recognition.start();

            /**
             * When the recognizer detects speech, send it to a component via 
             * the callback function provided above.
             */
            this.recognition.onresult = event => {
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        callbackOnDetection(transcript);
                    }
                }
            }
        }
    }
}

export default SpeechDetector;