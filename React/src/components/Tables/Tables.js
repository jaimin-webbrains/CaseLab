import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import * as API from "../../apis/apiServices.js";
import moment from "moment";
import { Button } from "@material-ui/core";

const useStyles = makeStyles({
   root: {
      width: "100%",
   },
   container: {
      maxHeight: 440,
   },
});

export default function Tables() {
   const [data, setData] = React.useState([]);
   const [temp, setTemp] = React.useState([]);

   const columns = [
      { id: "Request Id", align: "center", style: 170 },
      { id: "Name", align: "center", style: 170 },
      { id: "Email", align: "center", style: 170 },
      { id: "Status", align: "center", style: 170 },
      { id: "Requested Date", align: "center", style: 170 },
      { id: "Confirmation", align: "center", style: 170 },
   ];

   React.useEffect(() => {
      API.getAlRequest()
         .then((response) => {
            const result = response.result;
            const request = result.filter((ele) => {
               ele.requestDate = moment(ele.requestDate).format(
                  "DD-MM-YYYY hh:mm:ss a",
               );
               return ele;
            });
            setData(request);
            setTemp(request);
         })
         .catch((e) => {
            console.log(e);
         });
      console.log("called One?");
   }, []);

   const classes = useStyles();
   const [page, setPage] = React.useState(0);
   const [rowsPerPage, setRowsPerPage] = React.useState(10);

   const handleChangePage = (event, newPage) => {
      setPage(newPage);
   };

   const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
   };

   const update = (id, userId, clicked) => {
      let temp = data.filter((ele) => {
         if (ele.id === id && clicked === "accepted") {
            ele.status = "accepted";
         } else if (ele.id === id && clicked === "rejected") {
            ele.status = "rejected";
         }
         return ele;
      });
      API.updateRequest(userId, clicked).catch((e) => console.log("err" + e));
      setData(temp);
   };

   const getAccept = () => {
      let some = data.filter((ele) => {
         if (ele.status === "rejected") {
            return ele;
         }
         return null;
      });
      setTemp(some);
      return;
   };

   const getReject = () => {
      let some = data.filter((ele) => {
         if (ele.status === "accepted") {
            return ele;
         }
         return null;
      });
      setTemp(some);
      return;
   };

   const getAll = () => {
      setTemp(data);
   };
   return (
      <Paper className={classes.root}>
         <div style={{ textAlign: "center", fontSize: "24px" }}>
            Registration Request
         </div>
         <div
            style={{
               textAlign: "right",
               marginRight: "20px",
               fontSize: "24px",
            }}
         >
            <Button onClick={() => getAll()}>All</Button>
            <Button onClick={() => getAccept()}>Accepted</Button>
            <Button onClick={() => getReject()}>Rejected</Button>
         </div>
         <TableContainer className={classes.container}>
            <Table stickyHeader aria-label="sticky table">
               <TableHead>
                  <TableRow key="99">
                     {columns.map((column) => (
                        <TableCell
                           key={column.id}
                           align={column.align}
                           style={{ minWidth: column.minWidth }}
                        >
                           {column.id}
                        </TableCell>
                     ))}
                  </TableRow>
               </TableHead>
               <TableBody>
                  {temp
                     .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage,
                     )
                     .map((row, key) => {
                        return (
                           <TableRow
                              hover
                              role="checkbox"
                              tabIndex={-1}
                              key={key}
                           >
                              <TableCell align="center">{row.id}</TableCell>
                              <TableCell align="center">{row.name}</TableCell>
                              <TableCell align="center">{row.email}</TableCell>
                              <TableCell align="center">{row.status}</TableCell>
                              <TableCell align="center">
                                 {row.requestDate}
                              </TableCell>
                              <TableCell align="center">
                                 <Button
                                    onClick={() =>
                                       update(row.id, row.userId, "accepted")
                                    }
                                    style={{
                                       backgroundColor: "#1ebd19",
                                       fontSize: "12px",
                                       margin: "10px",
                                    }}
                                    disabled={
                                       row.status !== "accepted" ? false : true
                                    }
                                 >
                                    Accept
                                 </Button>
                                 <Button
                                    onClick={() =>
                                       update(row.id, row.userId, "rejected")
                                    }
                                    style={{
                                       backgroundColor: "#ff5745",
                                       fontSize: "12px",
                                    }}
                                    disabled={
                                       row.status !== "rejected" ? false : true
                                    }
                                 >
                                    Reject
                                 </Button>
                              </TableCell>
                           </TableRow>
                        );
                     })}
               </TableBody>
            </Table>
         </TableContainer>
         <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={temp.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
         />
      </Paper>
   );
}
