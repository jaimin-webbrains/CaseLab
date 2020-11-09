import React from "react";
import { styles } from "../../styles";
import { withStyles } from "@material-ui/core/styles";
import { Drawer, List, ListItem, ListItemText } from "@material-ui/core";
import clsx from "clsx";
import MenuIcon from "@material-ui/icons/Menu";
import { history } from "../../index.js";
import AddIcon from "@material-ui/icons/Add";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import PermMediaIcon from "@material-ui/icons/PermMedia";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { Prompt } from "react-router-dom";

class Navigation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            isImageMenuOpen: false,
            userRoles: "",
        };
        this.handleDrawerClick = this.handleDrawerClick.bind(this);
        this.handleAddImageMenuClick = this.handleAddImageMenuClick.bind(this);
        this.handleViewImageMenuClick = this.handleViewImageMenuClick.bind(
            this,
        );
        this.handleRequestTable = this.handleRequestTable.bind(this);
    }

    componentDidMount() {
        let userRole = localStorage.getItem("userRole");
        console.log("userRole::", userRole);
        this.setState({ userRoles: userRole }); //userRoles
    }

    handleDrawerClick() {
        this.setState({ isOpen: !this.state.isOpen });
    }

    handleAddImageMenuClick() {
        history.push("/addImage");
    }

    handleAddCaseMenuClick() {
        history.push("/addCase");
    }

    handleViewImageMenuClick() {
        history.push("/viewImage");
    }

    handleRequestTable() {
        history.push("/Request");
    }

    handleLogOut() {
        localStorage.setItem("userToken", null);
        localStorage.setItem("userRole", null);
        history.replace("/login");
    }

    render() {
        let { classes } = this.props;
        return (
            <Drawer
                variant="permanent"
                className={clsx(classes.navigationBar, classes.drawer, {
                    [classes.drawerOpen]: this.state.isOpen,
                    [classes.drawerClose]: !this.state.isOpen,
                })}
                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: this.state.isOpen,
                        [classes.drawerClose]: !this.state.isOpen,
                    }),
                }}
            >
                <div
                    className={classes.logoSection}
                    onClick={this.handleDrawerClick}
                >
                    {this.state.isOpen ? (
                        <MenuIcon className={classes.largeLogo} />
                    ) : (
                        <MenuIcon className={classes.smallLogo} />
                    )}
                </div>

                <List className={classes.navigationIconBar}>
                    {this.state.userRoles === "ADMIN" ? (
                        <ListItem>
                            <AddIcon
                                className={classes.listIcon}
                                onClick={this.handleAddCaseMenuClick}
                            />
                            <ListItemText
                                className={classes.menuText}
                                primary="Add Case"
                                onClick={this.handleAddCaseMenuClick}
                            />
                        </ListItem>
                    ) : (
                        ""
                    )}
                    {this.state.userRoles === "ADMIN" ? (
                        <ListItem>
                            <AddIcon
                                className={classes.listIcon}
                                onClick={this.handleAddImageMenuClick}
                            />
                            <ListItemText
                                className={classes.menuText}
                                primary="Add Images"
                                onClick={this.handleAddImageMenuClick}
                            />
                        </ListItem>
                    ) : (
                        ""
                    )}
                    {this.state.userRoles === "ADMIN" ? (
                        <ListItem>
                            <AssignmentIndIcon
                                className={classes.listIcon}
                                onClick={this.handleRequestTable}
                            />
                            <ListItemText
                                className={classes.menuText}
                                primary="Requests"
                                onClick={this.handleRequestTable}
                            />
                        </ListItem>
                    ) : (
                        ""
                    )}
                    <ListItem>
                        <PermMediaIcon
                            className={classes.listIcon}
                            onClick={this.handleViewImageMenuClick}
                        />
                        <ListItemText
                            className={classes.menuText}
                            primary="View Images"
                            onClick={this.handleViewImageMenuClick}
                        />
                    </ListItem>
                    <ListItem>
                        <ExitToAppIcon
                            className={classes.listIcon}
                            onClick={this.handleLogOut}
                        />
                        <ListItemText
                            className={classes.menuText}
                            primary="Logout"
                            onClick={this.handleLogOut}
                        />
                    </ListItem>
                </List>
            </Drawer>
        );
    }
}

export default withStyles(styles)(Navigation);
