import React from "react";
import { styles } from "../../styles";
import { withStyles } from "@material-ui/core/styles";
import {
   Typography,
   Button,
   TextField,
   Snackbar,
   FormControl,
   Select,
   InputLabel,
   MenuItem,
   Grid,
} from "@material-ui/core";
import * as API from "../../apis/apiServices.js";
import { HOST } from "../../App.config";
import MuiAlert from "@material-ui/lab/Alert";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import ZoomInIcon from "@material-ui/icons/ZoomIn";
import ZoomOutIcon from "@material-ui/icons/ZoomOut";
import ZoomOutMapIcon from "@material-ui/icons/ZoomOutMap";
import _ from "underscore";
import { Redirect } from "react-router-dom";

class AddImage extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         image: null,
         fileArray: [],
         title: "",
         titleError: "",
         isSubmitClicked: false,
         case: "",
         isAlertOpen: false,
         caseDescription: "",
         caseArray: [],
      };

      this.handleFileUpload = this.handleFileUpload.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleInputChange = this.handleInputChange.bind(this);

      this.handleAlertClose = this.handleAlertClose.bind(this);
      this.handleCaseChange = this.handleCaseChange.bind(this);
   }

   componentWillMount() {
      API.getCases().then(
         (result) => {
            this.setState({ caseArray: result.result });
            let caseArray = this.state.caseArray;
            if (caseArray.length > 0) {
               let caseId = caseArray[0].id;
               this.setState({
                  caseIndex: 0,
                  case: caseArray[0].id,
                  caseDescription: caseArray[0].description,
               });
               this.getImagesByCaseId(caseId);
            }
         },
         (error) => {
            console.log(error);
         },
      );
   }

   handleInputChange(event) {
      this.setState({
         title: event.target.value,
         titleError: event.target.value ? "" : "Field required",
      });
   }

   handleFileUpload(event) {
      this.setState({ image: event.target.files[0] });
   }

   getImagesByCaseId(caseId) {
      API.getImages(caseId).then(
         (result) => {
            this.setState({
               fileArray: result.result,
               title: "",
               image: null,
               isAlertOpen: true,
            });
         },
         (error) => {
            console.log(error);
         },
      );
   }

   handleSubmit() {
      if (
         this.state.image &&
         this.state.image.size > 0 &&
         this.state.title &&
         this.state.case
      ) {
         API.addImage(this.state.title, this.state.image, this.state.case).then(
            (result) => {
               let caseId = this.state.case;
               this.getImagesByCaseId(caseId);
            },
            (error) => {
               console.log(error);
            },
         );
      }
   }

   handleAlertClose(event, reason) {
      if (reason === "clickaway") {
         return;
      }
      this.setState({ isAlertOpen: false });
   }

   handleCaseChange(event) {
      this.setState({ case: event.target.value });
      let caseId = event.target.value;
      let selectedCaseDetail = _.findWhere(this.state.caseArray, {
         id: caseId,
      });
      this.setState({
         case: caseId,
         caseDescription: selectedCaseDetail.description,
      });
      this.getImagesByCaseId(caseId);
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
                     <Grid container item xs={4} spacing={3}></Grid>
                     <Grid container item xs={6} spacing={3}>
                        <Snackbar
                           open={this.state.isAlertOpen}
                           autoHideDuration={3000}
                           onClose={this.handleAlertClose}
                        >
                           <MuiAlert
                              onClose={this.handleAlertClose}
                              elevation={6}
                              variant="filled"
                              severity="success"
                           >
                              Image Added Successfully!
                           </MuiAlert>
                        </Snackbar>
                        <div>
                           <Typography
                              variant="h5"
                              color="primary"
                              gutterBottom
                           >
                              Immunohistochemical analysis
                           </Typography>
                           <Typography
                              variant="h6"
                              color="primary"
                              gutterBottom
                           >
                              Case
                           </Typography>
                           <FormControl
                              variant="outlined"
                              className={classes.formControl}
                           >
                              <InputLabel id="demo-simple-select-outlined-label">
                                 Case
                              </InputLabel>
                              <Select
                                 labelId="demo-simple-select-outlined-label"
                                 id="demo-simple-select-outlined"
                                 value={this.state.case}
                                 onChange={this.handleCaseChange}
                                 label="Case"
                              >
                                 {this.state.caseArray.map(
                                    (caseData, index) => {
                                       if (index === 0) {
                                          return (
                                             <MenuItem
                                                selected={true}
                                                key={index}
                                                value={caseData.id}
                                             >
                                                {caseData.title}
                                             </MenuItem>
                                          );
                                       } else {
                                          return (
                                             <MenuItem
                                                key={index}
                                                value={caseData.id}
                                             >
                                                {caseData.title}
                                             </MenuItem>
                                          );
                                       }
                                    },
                                 )}
                              </Select>
                           </FormControl>
                           <pre>
                              <Typography variant="body2" gutterBottom>
                                 {this.state.caseDescription}
                              </Typography>
                           </pre>
                           <Typography
                              variant="subtitle1"
                              color="primary"
                              gutterBottom
                           >
                              Add Image
                           </Typography>

                           <div className={classes.inputFields}>
                              <TextField
                                 name="title"
                                 value={this.state.title}
                                 onChange={this.handleInputChange}
                                 label="Title"
                                 variant="outlined"
                                 size="small"
                                 error={this.state.titleError ? true : false}
                                 helperText={this.state.titleError}
                              />
                           </div>
                           {this.state.image ? (
                              <input
                                 type="file"
                                 files={[this.state.image]}
                                 onChange={this.handleFileUpload}
                              />
                           ) : (
                              <input
                                 type="file"
                                 value=""
                                 onChange={this.handleFileUpload}
                              />
                           )}
                           <div className={classes.buttonWrapper}>
                              <Button
                                 variant="contained"
                                 color="primary"
                                 onClick={this.handleSubmit}
                              >
                                 Upload
                              </Button>
                           </div>
                        </div>
                     </Grid>
                     <div
                        align="center"
                        className={classes.imageDisplaySection}
                     >
                        {this.state.fileArray &&
                           this.state.fileArray.length > 0 &&
                           this.state.fileArray.map((imageData, index) => {
                              return (
                                 <div
                                    key={index}
                                    className={classes.imageSection}
                                 >
                                    <Typography
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
                                                   className={classes.imageBox}
                                                   src={
                                                      HOST + imageData.fileName
                                                   }
                                                   alt={imageData.fileName}
                                                   onClick={
                                                      this.handleImageZoom
                                                   }
                                                />
                                             </TransformComponent>
                                             <div className={classes.tools}>
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
                                                   onClick={resetTransform}
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
                  </Grid>
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

export default withStyles(styles)(AddImage);
