import React from "react";
import { styles } from "../../styles";
import { withStyles } from "@material-ui/core/styles";
import { Typography, Button } from "@material-ui/core";
import * as API from "../../apis/apiServices.js";
import { HOST } from "../../App.config";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import ZoomInIcon from "@material-ui/icons/ZoomIn";
import ZoomOutIcon from "@material-ui/icons/ZoomOut";
import ZoomOutMapIcon from "@material-ui/icons/ZoomOutMap";
import { Redirect } from "react-router-dom";

class ViewImage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fileArray: [],
            isImageZoomed: false,
            zoomedImage: null,
            caseName: "",
            caseDescription: "",
            caseIndex: "",
            caseArray: [],
        };
        this.handleImageZoom = this.handleImageZoom.bind(this);
        this.handleZoomClose = this.handleZoomClose.bind(this);
        this.handleNextClick = this.handleNextClick.bind(this);
    }

    componentDidMount() {
        API.getCases().then(
            (result) => {
                this.setState({ caseArray: result.result });
                let caseArray = this.state.caseArray;
                if (caseArray.length > 0) {
                    let caseId = caseArray[0].id;
                    this.setState({
                        caseIndex: 0,
                        caseName: caseArray[0].title,
                        caseDescription: caseArray[0].description,
                    });
                    API.getImages(caseId).then(
                        (result) => {
                            this.setState({ fileArray: result.result });
                        },
                        (error) => {
                            console.log(error);
                        },
                    );
                }
            },
            (error) => {
                console.log(error);
            },
        );
    }

    handleImageZoom(event) {
        this.setState({ isImageZoomed: true, zoomedImage: event.target.src });
    }

    handleZoomClose() {
        this.setState({ isImageZoomed: false, zoomedImage: null });
    }

    handleNextClick() {
        let caseIndex = this.state.caseIndex;
        let caseArray = this.state.caseArray;
        if (caseArray.length - 1 === caseIndex) {
            this.setState({
                caseIndex: 0,
                caseName: caseArray[0].title,
                caseDescription: caseArray[0].description,
            });
        } else {
            caseIndex++;
            this.setState({
                caseIndex: caseIndex,
                caseName: caseArray[caseIndex].title,
                caseDescription: caseArray[caseIndex].description,
            });
        }
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
        });
        let caseId = caseArray[caseIndex].id;
        API.getImages(caseId).then(
            (result) => {
                console.log(result);
                this.setState({ fileArray: result.result });
            },
            (error) => {
                console.log(error);
            },
        );
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                {localStorage.getItem("userToken") !== "null" ? (
                    <>
                        <Typography variant="h5" color="primary" gutterBottom>
                            Immunohistochemical analysis
                        </Typography>
                        <Typography variant="h6" color="primary" gutterBottom>
                            {this.state.caseName}
                        </Typography>
                        <Typography
                            variant="body1"
                            gutterBottom
                            className={classes.caseDescription}
                        >
                            {this.state.caseDescription}
                        </Typography>
                        <div className={classes.imageDisplaySection}>
                            {this.state.fileArray.map((imageData, index) => {
                                return (
                                    <div
                                        key={index}
                                        className={classes.imageSection}
                                    >
                                        <Typography
                                            className={classes.imageTitle}
                                            variant="h6"
                                            color="primary"
                                            gutterBottom
                                        >
                                            {imageData.title}
                                        </Typography>
                                        <TransformWrapper maxScale={50}>
                                            {({
                                                zoomIn,
                                                zoomOut,
                                                resetTransform,
                                                ...rest
                                            }) => (
                                                <React.Fragment>
                                                    <TransformComponent>
                                                        <img
                                                            className={
                                                                classes.imageBox
                                                            }
                                                            src={
                                                                HOST +
                                                                imageData.fileName
                                                            }
                                                            alt={
                                                                imageData.fileName
                                                            }
                                                            onClick={
                                                                this
                                                                    .handleImageZoom
                                                            }
                                                        />
                                                    </TransformComponent>
                                                    <div
                                                        className={
                                                            classes.tools
                                                        }
                                                    >
                                                        <button
                                                            onClick={zoomIn}
                                                            className={
                                                                classes.marginLeftLeft5
                                                            }
                                                        >
                                                            <ZoomInIcon />
                                                        </button>
                                                        <button
                                                            onClick={zoomOut}
                                                            className={
                                                                classes.marginLeftLeft5
                                                            }
                                                        >
                                                            <ZoomOutIcon />
                                                        </button>
                                                        <button
                                                            onClick={
                                                                resetTransform
                                                            }
                                                            className={
                                                                classes.marginLeftLeft5
                                                            }
                                                        >
                                                            <ZoomOutMapIcon />
                                                        </button>
                                                    </div>
                                                </React.Fragment>
                                            )}
                                        </TransformWrapper>
                                    </div>
                                );
                            })}
                        </div>
                        <div className={classes.viewNextImage}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={this.handleNextClick}
                            >
                                Next
                            </Button>
                        </div>
                    </>
                ) : (
                    <Redirect to="/login" />
                )}
            </div>
        );
    }
}

export default withStyles(styles)(ViewImage);
