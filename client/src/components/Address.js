import React from 'react';

const User = (props) => {
    return (
      <div>
        {props.identity.name && <h3> <span> Name: {props.identity.name} </span> </h3> }
        {props.identity.ens && <h3> <span>Ens: {props.identity.ens} </span> </h3>}
        {props.address && <h3>Address: {props.address}!</h3>}

      </div>
    )
  }
  export default User;