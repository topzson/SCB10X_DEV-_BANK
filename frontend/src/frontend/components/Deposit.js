
import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Col, Card, Button } from 'react-bootstrap'

import TextField from "@mui/material/TextField"

import Grid from '@material-ui/core/Grid';

const Deposit = ({addresscon , DaiAbi}) => {
    const [amounts, setAmount] = useState([]);
    const [_to, setAdd] = useState([]);
    const getDeposit = async (e) => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const erc20 = new ethers.Contract(addresscon, DaiAbi, signer);
        await erc20.deposit(_to , amounts);
        };

        function handleChangeAmount(event) {
            console.log(event.target.value);
            const id = event.target.id
            const { value } = event.target;
            console.log("Value", value)
            setAmount(value);
        }
        function handleChangeAdd(event) {
            console.log(event.target.value);
            const id = event.target.id
            const { value } = event.target;
            console.log("Value", value)
            setAdd(value);
        }

        return (
            <div className="flex justify-center">
                <div className="px-auto container">
                    <Row xs={1} md={2} lg={1} className="mx-auto py-5 ">
                        <Col className="overflow-hidden">
                            <Card
                                initialValues={{ remember: true }}
                            >
                                <Card.Body color="secondary">
                                    <Card.Title>Deposit</Card.Title>
                                    <Grid item xs={12}>
                                        <p>To Address:</p>
                                        <TextField
                                            fullWidth
                                            id="_to"
                                            label="กรอกชื่อบัญชี"
                                            variant="outlined"
                                            type="string"
                                            size="medium"
                                            onChange={handleChangeAdd}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <p>Amount:</p>
                                        <TextField
                                            fullWidth
                                            id="Amount"
                                            label="กรอกจำนวน"
                                            variant="outlined"
                                            type="string"
                                            size="medium"
                                            onChange={handleChangeAmount}
                                        />
                                    </Grid>
                                </Card.Body>
                                <Card.Footer>
                                    <div className='d-grid'>
                                        <Button
                                            onClick={getDeposit}
                                            type="submit"
                                            variant="primary" size="lg"
                                        >
                                            Deposit
                                        </Button>
                                    </div>
                                </Card.Footer>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>

        );
    }

    export default Deposit;