import React from "react";
import { styles, theme } from "../../styles";
import { withStyles, ThemeProvider } from "@material-ui/core/styles";
import Navigation from "../Navigation";
import BodyLayout from "../BodyLayout";
import { Route, Switch } from "react-router";

class MainLayout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { classes } = this.props;
        return (
            <ThemeProvider theme={theme}>
                <div className={classes.mainLayout}>
                    <Switch>
                        <Route path={["/addImage", "/addCase", "/Request"]}>
                            <Route path="/viewImage" />
                            <Navigation />
                        </Route>
                        <Route path="/viewImage">
                            <Navigation />
                        </Route>
                    </Switch>
                    <div
                        style={{
                            marginLeft: "50px",
                        }}
                    >
                        <BodyLayout />
                    </div>
                </div>
            </ThemeProvider>
        );
    }
}

export default withStyles(styles)(MainLayout);
