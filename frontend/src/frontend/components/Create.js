import React, { useState, useEffect } from "react";
import { Row, Col, Card, Button } from 'react-bootstrap';
import TextField from "@mui/material/TextField"
import Grid from '@material-ui/core/Grid';
import { ethers } from "ethers"

const Create = ({addresscon, DaiAbi}) => {
  const [AccountName, setAccount] = useState();
  const createAccount = async (e) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const erc20 = new ethers.Contract(addresscon, DaiAbi, signer);
    await erc20._CreateAccount(AccountName);

  }
  function handleChange(event) {
    console.log(event.target.value);
    const id = event.target.id
    const { value } = event.target;
    console.log("Value", value)
    setAccount(value);
  }
    return(
    <div className="flex justify-center">
        <div className="px-auto container">
          <Row xs={1} md={2} lg={1} className="mx-auto py-5 ">
              <Col className="overflow-hidden">
                <Card
                  initialValues={{remember: true}}
                >
                  <Card.Body color="secondary">
                    <Card.Title>Create Bank Account</Card.Title>
                    <Grid item xs={12}>
                        <p>Account Name:</p>
                        <TextField
                            fullWidth
                            label="กรอกชื่อบัญชี"
                            variant="outlined"
                            type="string"
                            size="medium"
                            onChange = {handleChange}
                        />
                    </Grid>
                  </Card.Body>
                  <Card.Footer>
                    <div className='d-grid'>
                      <Button
                      onClick = {createAccount}
                      type="submit"  
                      variant="primary" size="lg"
                       >
                        Create Bank Account
                      </Button>
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
          </Row>
        </div>
    </div> 
    )
};

export default Create;