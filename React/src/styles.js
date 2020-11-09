import { createMuiTheme } from "@material-ui/core/styles";

export const theme = createMuiTheme({
    palette: {
        primary: {
            main: "#6548bc",
        },
        secondary: {
            main: "#009900",
        },
    },
});

export const styles = (theme) => ({
    //Layout styles >>>>>>>>>>>>>>
    mainLayout: {
        backgroundColor: "#f9faff",
    },
    //Add and View Image styles >>>>>>>>>>>>
    formControl: {
        width: "230px",
    },
    buttonWrapper: {
        marginTop: 10,
        marginBottom: 10,
    },
    imageDisplaySection: {
        display: "flex",
        flexWrap: "wrap",
        alignItems: "flex-start",
        justifyContent: "space-around",
        marginTop: 20,
        marginBottom: 20,
    },
    imageSection: {
        width: 350,
        marginBottom: 10,
    },
    imageBox: {
        height: "500px",
        width: "300px",
        objectFit: "fit",
    },
    imageTitle: {
        backgroundColor: "lightgrey",
        marginRight: "50px",
        paddingLeft: "20px",
        paddingTop: "5px",
        paddingBottom: "5px",
    },
    tools: {
        marginTop: "10px",
    },
    marginLeftLeft5: {
        marginLeft: "5px",
    },
    zommedImageBox: {
        position: "fixed",
        left: "25%",
        right: "25%",
        alignSelf: "center",
    },
    noteTitle: {
        color: "orange",
        display: "inline",
    },
    infoIcon: {
        marginTop: "5px",
    },
    displayInline: {
        display: "inline",
    },
    caseDescription: {
        width: "40%",
    },
    viewNextImage: {
        display: "flex",
        justifyContent: "flex-end",
    },
    //Registartion and Login style >>>>>>
    registrationForm: {
        textAlign: "center !important",
    },
    inputFieldSection: {
        width: "80%",
        display: "inline-block",
    },
    inputFields: {
        marginTop: 10,
        marginBottom: 10,
    },
    //MainBody styles >>>>>>>>>>
    mainBodyContainer: {
        width: "70%",
        margin: "auto",
        paddingTop: 10,
        paddingBottom: 10,
        [theme.breakpoints.down(600)]: {
            width: "100%",
        },
    },
    bodySubSection: {
        margin: 20,
        padding: 15,
        border: "solid",
        borderColor: "#e8eff9",
        borderWidth: 1,
    },
    //Navigation styles >>>>>>>>>>>>>>>
    navigationBar: {},
    logoSection: {
        display: "flex",
        flexDirection: "row-reverse",
        margin: 10,
        color: "#FFFFFF",
    },
    smallLogo: {
        height: 25,
        width: 25,
        margin: 8,
    },
    largeLogo: {
        height: 25,
        width: 25,
        margin: 8,
    },
    drawer: {
        width: 240,
        flexShrink: 0,
        whiteSpace: "nowrap",
    },
    drawerOpen: {
        background: "#6548bc",
        border: "none",
        width: 240,
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        background: "#6548bc",
        border: "none",
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: "hidden",
        width: 60,
    },
    navigationIconBar: {
        color: "#FFFFFF",
    },
    listIcon: {
        marginLeft: 2,
        marginRight: 17,
    },

    //Case styles >>>>>>>>>>
    caseContainer: {
        width: 350,
        marginBottom: 10,
    },
});
