import React from "react";
import { styles } from "../../styles";
import { withStyles } from "@material-ui/core/styles";
import { TextField, Typography, Button, Snackbar } from "@material-ui/core";
import { EMAIL_PATTERN } from "../../App.config";
import * as API from "../../apis/apiServices.js";
import { history } from "../../index.js";
import MuiAlert from "@material-ui/lab/Alert";

class Login extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         inputFields: {
            email: "",
            password: "",
         },
         validationErrors: {
            email: "",
            password: "",
         },
         isSubmitClicked: false,
         isAllValid: false,
         isAlertOpen: false,
         isErrorAlertOpen: false,
         msg: "",
         status: 0,
      };
      this.handleSubmitClick = this.handleSubmitClick.bind(this);
      this.validateFields = this.validateFields.bind(this);
      this.handleInputChange = this.handleInputChange.bind(this);
      this.checkErrors = this.checkErrors.bind(this);
      this.goToRegister = this.goToRegister.bind(this);
   }

   goToRegister() {
      history.push("/register");
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

   checkErrors(callback) {
      let doErrorExist = false;
      Object.values(this.state.validationErrors).map((error) => {
         if (error) {
            doErrorExist = true;
         }
         return null;
      });
      this.setState({ isAllValid: !doErrorExist });
      if (!doErrorExist) {
         if (callback) {
            callback(this);
         }
      }
   }

   handleSubmitClick(event) {
      event.preventDefault();
      this.setState({ isSubmitClicked: true, isErrorAlertOpen: false });

      var login = function(currentRef) {
         localStorage.setItem("userEmail", currentRef.state.inputFields.email);
         API.login(
            currentRef.state.inputFields.email,
            currentRef.state.inputFields.password,
         )
            .then(
               (response) => {
                  if (
                     response.status === -1 ||
                     response.status === 0 ||
                     response.status === -2
                  ) {
                     currentRef.setState({
                        msg: response.message,
                        status: response.status,
                     });
                     currentRef.setState({ isErrorAlertOpen: true });
                  } else {
                     currentRef.setState({ isAlertOpen: true });
                     setTimeout(() => {
                        history.push("/viewImage");
                     }, 2000);
                  }
               },
               (error) => {
                  currentRef.setState({ isErrorAlertOpen: true });
               },
            )
            .catch((e) => {
               console.log(e);
            });
      };

      this.validateFields(login);
   }

   validateFields(callback) {
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
         } else {
            inputErrorObject[fieldName] = "";
         }
         return null;
      });
      this.setState({ validationErrors: inputErrorObject }, () => {
         this.checkErrors(callback);
      });
   }

   render() {
      const { classes } = this.props;
      return (
         <div className={classes.registrationForm}>
            <Snackbar open={this.state.isAlertOpen} autoHideDuration={2000}>
               <MuiAlert elevation={6} variant="filled" severity="success">
                  Login Success!
               </MuiAlert>
            </Snackbar>
            <Snackbar
               open={this.state.isErrorAlertOpen}
               autoHideDuration={2000}
            >
               <MuiAlert
                  elevation={6}
                  variant="filled"
                  severity={this.state.status === 0 ? "info" : "error"}
               >
                  {this.state.msg}
               </MuiAlert>
            </Snackbar>
            <Typography variant="h4" color="primary" gutterBottom>
               Login
            </Typography>
            <div className={classes.inputFieldSection}>
               <form>
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
                  onClick={this.goToRegister}
               >
                  Register
               </Typography>
            </div>
         </div>
      );
   }
}

export default withStyles(styles)(Login);
