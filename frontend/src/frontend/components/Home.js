import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import React from "react";
import { Row, Col, Card, Button } from 'react-bootstrap'
import { Paper } from "@material-ui/core";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import LoadingButton from '@mui/lab/LoadingButton';


const Home = ({ WalletAddress, balance, DaiAbi, accountss }) => {
  const [loadingCreate, setLoadingCreate] = React.useState(false);
  const [loadingDeposit, setLoadingDeposit] = React.useState(false);
  const [loadingWithdraw, setLoadingWithdraw] = React.useState(false);
  const [loadingTransfer, setLoadingTransfer] = React.useState(false);


  useEffect(() => {
    if (WalletAddress !== "-") {
      // err
    }
  }, [WalletAddress]);

  const AccountCreate = () => {
    window.location.href = "/create";
    setLoadingCreate(true);
  };

  const DepositCreate = () => {
    window.location.href = "/deposit";
    setLoadingDeposit(true);
  };

  const WithdrawCreate = () => {
    window.location.href = "/withdraw";
    setLoadingWithdraw(true);
  };

  const TransferCreate = () => {
    window.location.href = "/transfer";
    setLoadingTransfer(true);
  };

  useEffect(() => {
  }, [])
  //   if (loading) return (
  //     <main style={{ padding: "1rem 0" }}>
  //       <h2>Loading...</h2>
  //     </main>
  //   )
  return (
    <div className="flex justify-center">
      <div className="px-auto container">
        <Row xs={1} md={2} lg={1} className="mx-auto py-5">
          <Col className="overflow-hidden">
            <Card>
              <Card.Body color="secondary">
                <Card.Title>My Account</Card.Title>
                <Card.Text>
                  Account: {WalletAddress}
                </Card.Text>
                <Card.Text>
                  Balance: {balance / 1000000000000000000}
                </Card.Text>
              </Card.Body>
              <Card.Footer>
                <div className='d-grid'>
                  <LoadingButton
                    variant="text"
                    onClick={AccountCreate}
                    loading={loadingCreate} >
                    Create Bank Account
                  </LoadingButton>
                </div>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center" width="30%">
                  <div className='d-grid'>
                    <Button
                      onClick={DepositCreate}
                      loading={loadingDeposit}
                      type="submit"
                      variant="primary" size="lg"
                    >
                      Deposit
                    </Button>
                  </div>
                </TableCell>
                <TableCell align="center" width="30%">
                  <div className='d-grid'>
                    <Button
                      onClick={WithdrawCreate}
                      loading={loadingWithdraw}
                      type="submit"
                      variant="primary" size="lg"
                    >
                      Withdraw
                    </Button>
                  </div>
                </TableCell>
                <TableCell align="center" width="30%">
                  <div className='d-grid'>
                    <Button
                      onClick={TransferCreate}
                      loading={loadingTransfer}
                      type="submit"
                      variant="primary" size="lg"
                    >
                      Transfer
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
              </TableRow>
            </TableHead>
            <TableBody>

            </TableBody>
          </Table>
        </TableContainer>

      </div>
    </div>
  );
}
export default Home