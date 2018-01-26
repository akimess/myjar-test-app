import React, { Component } from 'react';
import '../styles/ClientInfo.css';
import TextField from 'material-ui/TextField';

class ClientInfo extends Component {

    capitalizeFirstLetter = (strValue) => {
        return strValue.charAt(0).toUpperCase() + strValue.slice(1);
    }
    
    render() {
        let { client } = this.props;
        return (
            <div className="info">
                {client && Object.keys(client).map((clientKey, i) => (
                    <TextField 
                        key={i}
                        className="info-field"
                        labelClassName="info-label"
                        label={this.capitalizeFirstLetter(clientKey)}
                        value={client[clientKey]}
                        disabled
                    />
                ))}
            </div>
        );
    }
}

export default ClientInfo;