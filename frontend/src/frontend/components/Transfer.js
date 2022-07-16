import { useState } from 'react'
import { ethers } from "ethers"
import { Row, Col, Card, Button } from 'react-bootstrap'
import TextField from "@mui/material/TextField"
import Grid from '@material-ui/core/Grid';

const Transfer = ({ addresscon, DaiAbi }) => {
    const [amounts, setAmount] = useState([]);
    const [_from, setAdd] = useState([]);
    const [_to, setAdd2] = useState([]);
    const getWithdraw = async (e) => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const erc20 = new ethers.Contract(addresscon, DaiAbi, signer);
        await erc20.withdraw(_from, _to, amounts);
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
    function handleChangeAdd2(event) {
        console.log(event.target.value);
        const id = event.target.id
        const { value } = event.target;
        console.log("Value", value)
        setAdd2(value);
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
                                <Card.Title>Transfer</Card.Title>
                                <Grid item xs={12}>
                                    <p>From Address:</p>
                                    <TextField
                                        fullWidth
                                        id="_from"
                                        label="กรอกชื่อบัญชี"
                                        variant="outlined"
                                        type="string"
                                        size="medium"
                                        onChange={handleChangeAdd}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <p>To Address:</p>
                                    <TextField
                                        fullWidth
                                        id="_to"
                                        label="กรอกชื่อบัญชี"
                                        variant="outlined"
                                        type="string"
                                        size="medium"
                                        onChange={handleChangeAdd2}
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
                                        onClick={getWithdraw}
                                        type="submit"
                                        variant="primary" size="lg"
                                    >
                                        Withdraw
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

export default Transfer;