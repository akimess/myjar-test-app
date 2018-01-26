import React, { Component } from 'react';
import '../styles/NewClient.css';
import Input from 'material-ui/Input';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import { DialogTitle, DialogContent, DialogActions } from 'material-ui/Dialog';
import { FormHelperText } from 'material-ui/Form';

class NewClient extends Component {

    constructor(props) {
        super(props);

        let template = [
            {
                fieldId: 'email-field',
                fieldName: 'email',
                fieldValue: ''
            },
            {
                fieldId: 'phone-field',
                fieldName: 'phone',
                fieldValue: ''
            }
        ];

        let generatedObj = this.generateTemplate(8);
        let clientFields = template.concat(generatedObj);

        this.state = {
            newClient: clientFields,
            errMessage: '',
            errors: []
        }
    }

    generateTemplate(fieldCount) {
        let result = [];

        for (let i = 1; i <= fieldCount; i++) {
            result.push({
                fieldId: `field${i}`,
                fieldName: `field${i}`,
                fieldValue: ''
            })
        }

        return result;
    }

    handleChange(event, name) {
        let client = this.state.newClient;
        let fieldId = event.target.name;
        let value = event.target.value;
        let index = client.findIndex(x => x.fieldId === fieldId);

        name === "field" ?
            client[index].fieldName = value : client[index].fieldValue = value;

        this.setState({
            newClient: client
        })
    }

    saveClientInfo() {
        let data = {};

        this.state.newClient.forEach((clientField) => {
            data[clientField.fieldName] = clientField.fieldValue;
        });

        fetch('/clients', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-type': 'application/json'
            })
        }).then(res => res.json()).then((resp) => {

            if (resp.success) {
                this.props.close(true);
            } else {
                this.setState({
                    errMessage: resp.message,
                    errors: resp.errors ? resp.errors : []
                })
            }

        }).catch((err) => {
            this.setState({
                errMessage: err.message
            })
        })
    }

    render() {
        let { newClient, errors, errMessage } = this.state;
        return (
            <div>
                <div className="top">
                    <DialogTitle>New Client</DialogTitle>
                    <DialogActions>
                        <Button onClick={() => { this.saveClientInfo() }} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </div>
                <DialogContent>
                    <Typography className="err-message">{errMessage}</Typography>
                    <div className="container">
                        <div className="left">
                            <Typography>Field</Typography>
                            <br />
                            {
                                newClient.map((client, i) => (
                                    <div key={i}>
                                        <Input
                                            name={client.fieldId}
                                            onChange={(event) => { this.handleChange(event, "field") }}
                                            value={client.fieldName}
                                            disabled={client.fieldName === 'email' || client.fieldName === 'phone'}
                                            required
                                        />
                                        <FormHelperText></FormHelperText>
                                    </div>
                                ))
                            }
                        </div>
                        <div className="right">
                            <Typography>Value</Typography>
                            <br />
                            {
                                newClient.map((client, i) => (
                                    <div key={i}>
                                        <Input
                                            name={client.fieldId}
                                            value={client.fieldValue}
                                            onChange={(event) => { this.handleChange(event, "value") }}
                                            error={errors[client.fieldName] && errors[client.fieldName].length > 0}
                                            required
                                        />
                                        <FormHelperText>{errors[client.fieldName]}</FormHelperText>
                                    </div>


                                ))
                            }
                        </div>
                    </div>
                </DialogContent>
            </div>

        );
    }
}

export default NewClient;