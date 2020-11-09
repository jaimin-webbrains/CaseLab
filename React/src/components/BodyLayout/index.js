import React from "react";
import { styles } from "../../styles";
import { withStyles } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";
import { Route, Switch } from "react-router";
import AddImage from "../AddImage";
import AddCase from "../AddCase";
import ViewImage from "../View Image";
import Registeration from "../Registeration";
import Login from "../Login";
import Tables from "../Tables/Tables";

class BodyLayout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.mainBodyContainer}>
                <Paper className={classes.bodySubSection} elevation={0}>
                    <Switch>
                        <Route exact path="/addImage">
                            <AddImage />
                        </Route>
                        <Route path="/viewImage">
                            <ViewImage />
                        </Route>
                        <Route path="/Request">
                            <Tables />
                        </Route>
                        <Route path="/addCase">
                            <AddCase />
                        </Route>
                        <Route path="/register">
                            <Registeration />
                        </Route>
                        <Route path="/" exact>
                            <Login />
                        </Route>
                        <Route path="/login" exact>
                            <Login />
                        </Route>
                    </Switch>
                </Paper>
            </div>
        );
    }
}

export default withStyles(styles)(BodyLayout);
