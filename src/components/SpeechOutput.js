import React, {Component} from "react";
import { Row } from "reactstrap";
import SpeechDetector from "../api/SpeechDetector";

class SpeechOutput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            latestTranscript: ""
        }

        this.newSpeechDetected = this.newSpeechDetected.bind(this);
    }

    componentDidMount() {
        this.speechDetector = new SpeechDetector();
        this.speechDetector.startDetection(this.newSpeechDetected);
    }

    /**
     * The method called by the SpeechDetector whenever new speech is transcribed.
     * @param {string} transcript The speech most recently transcribed by the 
     * SpeechDetector
     */
    newSpeechDetected(transcript) {
        // YOUR CODE HERE
        this.setState({latestTranscript: transcript});
    }

    render() {
        return (
            <Row>
                <p><strong>Latest command:</strong>{this.state.latestTranscript}</p>
            </Row>
        )
    }
}

export default SpeechOutput;