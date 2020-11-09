import React from "react";
import { styles } from "../../styles";
import { withStyles } from "@material-ui/core/styles";
import { TextField, Typography, Button, Snackbar } from "@material-ui/core";
import { EMAIL_PATTERN } from "../../App.config";
import { history } from "../../index.js";
import * as API from "../../apis/apiServices.js";
import MuiAlert from "@material-ui/lab/Alert";

class Registeration extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         inputFields: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
         },
         validationErrors: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
         },
         isSubmitClicked: false,
         isAllValid: false,
         isAlertOpen: false,
         isErrorAlertOpen: false,
      };
      this.handleSubmitClick = this.handleSubmitClick.bind(this);
      this.validateFields = this.validateFields.bind(this);
      this.handleInputChange = this.handleInputChange.bind(this);
      this.checkErrors = this.checkErrors.bind(this);
      this.gotoLogin = this.gotoLogin.bind(this);
   }

   gotoLogin() {
      history.push("/");
   }

   handleInputChange(event) {
      let name = event.target.name;
      let value = event.target.value;
      let inputObject = this.state.inputFields;
      inputObject[name] = value;
      this.setState({ inputFields: inputObject }, () => {
         this.state.isSubmitClicked && this.validateFields();
      });
   }

   checkErrors(callbackFunction) {
      let doErrorExist = false;
      Object.values(this.state.validationErrors).map((error) => {
         if (error) {
            doErrorExist = true;
         }
         return null;
      });
      this.setState({ isAllValid: !doErrorExist }, () => {
         callbackFunction && callbackFunction();
      });
   }

   handleSubmitClick(event) {
      event.preventDefault();
      let self = this;
      this.setState({ isSubmitClicked: true, isErrorAlertOpen: false });
      this.validateFields(() => {
         if (this.state.isAllValid) {
            //register user

            API.registerUser(
               this.state.inputFields.name,
               this.state.inputFields.email,
               this.state.inputFields.password,
            )
               .then((result) => {
                  setTimeout(() => {
                     history.push("/login");
                  }, 2000);
               })
               .catch((e) => {
                  self.setState({ isErrorAlertOpen: true });
               });
            // setTimeout(() => {
            //          history.push("/login");
            //       }, 2000);
            //    }
         }
      });
   }

   validateFields(callbackFunction) {
      let inputObject = this.state.inputFields;
      let inputErrorObject = this.state.validationErrors;
      Object.keys(inputObject).map((fieldName) => {
         if (!inputObject[fieldName]) {
            inputErrorObject[fieldName] = "Field cannot be empty";
            return null;
         }
         if (
            fieldName === "email" &&
            !EMAIL_PATTERN.test(inputObject[fieldName])
         ) {
            inputErrorObject[fieldName] = "Invalid email";
         } else if (
            fieldName === "confirmPassword" &&
            inputObject[fieldName] !== inputObject.password
         ) {
            inputErrorObject[fieldName] = "Password do not match";
         } else {
            inputErrorObject[fieldName] = "";
         }
         return null;
      });
      this.setState({ validationErrors: inputErrorObject }, () => {
         this.checkErrors(callbackFunction && callbackFunction);
      });
   }

   render() {
      const { classes } = this.props;
      return (
         <div className={classes.registrationForm}>
            <Snackbar open={this.state.isAlertOpen} autoHideDuration={2000}>
               <MuiAlert elevation={6} variant="filled" severity="success">
                  Registered Successfully!
               </MuiAlert>
            </Snackbar>
            <Snackbar
               open={this.state.isErrorAlertOpen}
               autoHideDuration={2000}
            >
               <MuiAlert elevation={6} variant="filled" severity="error">
                  Registration failed
               </MuiAlert>
            </Snackbar>
            <Typography variant="h4" color="primary" gutterBottom>
               Registration
            </Typography>
            <div className={classes.inputFieldSection}>
               <form>
                  <div className={classes.inputFields}>
                     <TextField
                        name="name"
                        onChange={this.handleInputChange}
                        fullWidth
                        label="Name"
                        variant="outlined"
                        size="small"
                        helperText={this.state.validationErrors.name}
                        error={this.state.validationErrors.name ? true : false}
                     />
                  </div>
                  <div className={classes.inputFields}>
                     <TextField
                        name="email"
                        onChange={this.handleInputChange}
                        fullWidth
                        label="Email"
                        variant="outlined"
                        size="small"
                        helperText={this.state.validationErrors.email}
                        error={this.state.validationErrors.email ? true : false}
                     />
                  </div>
                  <div className={classes.inputFields}>
                     <TextField
                        name="password"
                        onChange={this.handleInputChange}
                        fullWidth
                        label="Password"
                        type="password"
                        variant="outlined"
                        size="small"
                        helperText={this.state.validationErrors.password}
                        error={
                           this.state.validationErrors.password ? true : false
                        }
                     />
                  </div>
                  <div className={classes.inputFields}>
                     <TextField
                        name="confirmPassword"
                        onChange={this.handleInputChange}
                        fullWidth
                        label="Confirm Password"
                        type="password"
                        variant="outlined"
                        size="small"
                        helperText={this.state.validationErrors.confirmPassword}
                        error={
                           this.state.validationErrors.confirmPassword
                              ? true
                              : false
                        }
                     />
                  </div>
                  <div>
                     <Button
                        variant="contained"
                        color="primary"
                        onClick={this.handleSubmitClick}
                     >
                        Submit
                     </Button>
                  </div>
               </form>
            </div>
            <br></br>
            <br></br>
            <div>
               <Typography
                  variant="body1"
                  color="primary"
                  gutterBottom
                  onClick={this.gotoLogin}
               >
                  Already a user? Login
               </Typography>
            </div>
         </div>
      );
   }
}

export default withStyles(styles)(Registeration);
