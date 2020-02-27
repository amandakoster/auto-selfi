import React, {Component} from "react";
import PropTypes from "prop-types";
import ExpressionDetector from "../api/ExpressionDetector";
import { Row } from "reactstrap";
import { connect } from "react-redux";
import { updateExpressions, photoTaken } from "../redux/actions";

class FaceApiVideo extends Component {
    constructor(props) {
        super(props);

        // face-api uses these references to capture the webcam stream and 
        // draw predictions
        this.videoRef = React.createRef(); // The video element that displays the webcam stream. To use: this.videoRef.current
        this.canvasRef = React.createRef(); // The canvas used to draw detection output. To use: this.canvasRef.current
        this.hiddenCanvasRef = React.createRef(); // The canvas used to take a photo. Not visible in the UI.

        this.newExpressionsDetected = this.newExpressionsDetected.bind(this);
    }
    
    componentDidMount() {
        this.expressionDetector = new ExpressionDetector(
            this.videoRef.current, 
            this.canvasRef.current, 
            this.hiddenCanvasRef.current);
        this.expressionDetector.startDetection(this.newExpressionsDetected);
    }

    /**
     * The method called by the ExpressionDetector whenever new predictions are
     * available.
     * @param {array} expressions The detected expressions returned by the 
     * ExpressionDetector. The array contains the most probable expression for 
     * each face detected in the webcam.
     * 
     * For example:
     * ["neutral", "happy"]
     * 
     * In this example, there are two detected faces. Face 0 has a "neutral" 
     * expression and Face 1 has a "happy" expression.
     */
    newExpressionsDetected(expressions) {
        // Calls a redux action that updates the expressions in the store.
        this.props.updateExpressions(expressions);

        /**
         * YOUR CODE HERE
         */
    }

    /**
     * Call this function to take a photo from the webcam. You should not need 
     * to modify this function.
     */
    takePhoto() {
        const newPhoto = this.expressionDetector.takePhoto();
        // Calls a redux action that adds the new photo to the store.
        this.props.photoTaken(newPhoto);
    }

    render() {
        return (
            <Row>
                <video ref={this.videoRef} 
                    width={this.props.width + "%"}  
                    autoPlay muted
                    style={
                        {
                            top: this.props.top,
                            left: this.props.left
                        }
                    }
                ></video>
                <canvas ref={this.canvasRef} 
                    style={
                        {
                            top: this.props.top,
                            left: this.props.left
                        }
                    }
                ></canvas>
                <canvas ref={this.hiddenCanvasRef} className="hidden-canvas"></canvas>
            </Row>
        );
    }
}

export default connect(null, { updateExpressions, photoTaken }) (FaceApiVideo);

FaceApiVideo.propTypes = {
    top: PropTypes.number,
    left: PropTypes.number,
    width: PropTypes.number
}

FaceApiVideo.defaultProps = {
    top: 0,
    left: 0,
    width: 100
}