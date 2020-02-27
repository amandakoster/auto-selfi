import React, {Component} from "react";
import {Container} from "reactstrap";
import FaceApiVideo from "../components/FaceApiVideo";
import SpeechOutput from "../components/SpeechOutput";

class App extends Component {
    render() {
        // Container needs "pos-relative" to position the canvas for drawing 
        // face detection results
        return (
            <Container className="pos-relative">
                <FaceApiVideo />
                <SpeechOutput />
            </Container>
        )
    }
}

export default App;