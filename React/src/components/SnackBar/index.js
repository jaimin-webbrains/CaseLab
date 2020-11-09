import React from "react";
import { styles } from "../../styles";
import { withStyles } from "@material-ui/core/styles";
import MuiAlert from "@material-ui/lab/Alert";
import { Snackbar } from "@material-ui/core";

class SnackBarComp extends React.Component {
   constructor(props) {
      super(props);
   }
   render() {
      const { isOpen, handleClose, message, type } = this.props;
      console.log(
         "isOpen, handleClose, message, type::",
         isOpen,
         handleClose,
         message,
         type,
      );
      return (
         <Snackbar open={isOpen} autoHideDuration={3000} onClose={handleClose}>
            <MuiAlert
               onClose={handleClose}
               elevation={6}
               variant="filled"
               severity={type}
            >
               {message}
            </MuiAlert>
         </Snackbar>
      );
   }
}

export default withStyles(styles)(SnackBarComp);
