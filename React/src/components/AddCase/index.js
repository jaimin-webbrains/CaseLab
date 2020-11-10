import React from "react";
import { styles } from "../../styles";
import { withStyles } from "@material-ui/core/styles";
import { Redirect } from "react-router-dom";
import { Typography, Button, TextField, Grid } from "@material-ui/core";
import SnackBarComp from "../SnackBar";
import * as API from "../../apis/apiServices.js";

class AddCase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            titleError: "",
            isSubmitClicked: false,
            alertType: "",
            alertMessage: "",
            description: "",
            alertOpen: false,
            fileArray: [],
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleTitleInputChange = this.handleTitleInputChange.bind(this);
        this.handledescriptionInputChange = this.handledescriptionInputChange.bind(
            this,
        );
    }

    componentDidMount() {
        API.getCases().then(
            (result) => {
                this.setState({ fileArray: result.result });
            },
            (error) => {
                console.log(error);
            },
        );
    }

    handleTitleInputChange(event) {
        this.setState({
            title: event.target.value,
            titleError: event.target.value ? "" : "Field required",
        });
    }

    handledescriptionInputChange(event) {
        this.setState({ description: event.target.value });
    }

    handleSubmit() {
        if (!this.state.title) {
            this.setState({ titleError: true });
            return;
        }
        if (this.state.title && this.state.description) {
            API.addCase(this.state.title, this.state.description).then(
                (result) => {
                    API.getCases().then(
                        (result) => {
                            this.setState({
                                fileArray: result.result,
                                title: "",
                                description: "",
                                alertOpen: true,
                                alertType: "success",
                                alertMessage: "Case added successfully!",
                            });
                        },
                        (error) => {
                            console.log(error);
                        },
                    );
                },
                (error) => {
                    console.log(error);
                },
            );
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                {localStorage.getItem("userToken") !== "null" &&
                localStorage.getItem("userRole") === "ADMIN" ? (
                    <>
                        <Grid
                            container
                            direction="row"
                            justify="center"
                            alignItems="center"
                        >
                            <Grid container item spacing={3}>
                                <div>
                                    <SnackBarComp
                                        isOpen={this.state.alertOpen}
                                        message={this.state.alertMessage}
                                        type={this.state.alertType}
                                    ></SnackBarComp>
                                    <div>
                                        <Typography
                                            variant="h5"
                                            color="primary"
                                            gutterBottom
                                        >
                                            Immunohistochemical analysis
                                        </Typography>
                                        <Typography
                                            variant="subtitle1"
                                            color="primary"
                                            gutterBottom
                                        >
                                            Add Case
                                        </Typography>
                                    </div>
                                    <div className={classes.inputFieldSection}>
                                        <form>
                                            <div
                                                className={classes.inputFields}
                                            >
                                                <TextField
                                                    name="title"
                                                    value={this.state.title}
                                                    onChange={
                                                        this
                                                            .handleTitleInputChange
                                                    }
                                                    label="Title"
                                                    variant="outlined"
                                                    size="small"
                                                    error={
                                                        this.state.titleError
                                                            ? true
                                                            : false
                                                    }
                                                    helperText={
                                                        this.state.titleError
                                                    }
                                                />
                                            </div>
                                            <div
                                                className={classes.inputFields}
                                            >
                                                <TextField
                                                    id="outlined-multiline-static"
                                                    label="Multiline"
                                                    multiline
                                                    rows={4}
                                                    variant="outlined"
                                                    onChange={
                                                        this
                                                            .handledescriptionInputChange
                                                    }
                                                />
                                            </div>
                                            <div
                                                className={
                                                    classes.buttonWrapper
                                                }
                                            >
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={this.handleSubmit}
                                                >
                                                    Add
                                                </Button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </Grid>
                        </Grid>
                        <br></br>
                        <br></br>
                        <div className={classes.imageDisplaySection}>
                            {this.state.fileArray.map((caseData, index) => {
                                return (
                                    <div
                                        key={index}
                                        className={classes.caseContainer}
                                    >
                                        <Typography
                                            className={classes.imageTitle}
                                            variant="h6"
                                            color="primary"
                                            gutterBottom
                                        >
                                            {caseData.title}
                                        </Typography>
                                        <Typography variant="h6" gutterBottom>
                                            {caseData.description}
                                        </Typography>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                ) : localStorage.getItem("userToken") !== "null" ? (
                    <>
                        <Redirect to="/viewImage" />
                    </>
                ) : (
                    <Redirect to="/login" />
                )}
            </div>
        );
    }
}

export default withStyles(styles)(AddCase);
