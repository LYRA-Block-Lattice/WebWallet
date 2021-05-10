import React, { useEffect } from "react";
import { connect, useSelector } from "react-redux";
import { Button } from "@material-ui/core";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import { Link, useRouteMatch } from "react-router-dom";

const useStyles = makeStyles({
  table: {},
});

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "navy",
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

// function createData(coin, total, action) {
//   return { coin, total, action };
// }

// const rows = [createData("LYR", 100), createData("XRP", 237)];

const WalletsView = (props) => {
  const classes = useStyles();
  let match = useRouteMatch();

  useEffect(() => {});

  const coins = useSelector((state) => state.dex.coins);

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} stickyHeader aria-label="simple table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Coin</StyledTableCell>
            <StyledTableCell align="right">Total</StyledTableCell>
            <StyledTableCell align="right">Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {coins.map((row) => (
            <TableRow key={row.coin}>
              <TableCell component="th" scope="row">
                {row.coin}
              </TableCell>
              <TableCell align="right">{row.total}</TableCell>
              <TableCell align="right">
                <Link to={`${match.url}/deposit`} color="primary">
                  Deposit
                </Link>
                &nbsp;&nbsp;&nbsp;
                <Link to={`${match.url}/withdraw`} color="primary">
                  Withdraw
                </Link>
                &nbsp;&nbsp;&nbsp;
                <Link to={`${match.url}/swap`} color="primary">
                  Swap
                </Link>
                &nbsp;&nbsp;&nbsp;
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const mapStateToProps = (state) => {
  return {
    userId: state.dex.userId,
    loggedin: state.dex.loggedin,
    isSignup: state.dex.signedup,
    error: state.dex.error,
    coins: state.dex.coins,
  };
};

const Wallets = connect(mapStateToProps)(WalletsView);
export default Wallets;
