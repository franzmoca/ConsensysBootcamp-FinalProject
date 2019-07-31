import React from 'react';

const PetitionNumber = (props) => {
    return (
      <div>
        <h3>
        {props.count || 0 } petitions have been created thanks to dSignThis!. 
        </h3>
      </div>
    )
  }
  export default PetitionNumber;