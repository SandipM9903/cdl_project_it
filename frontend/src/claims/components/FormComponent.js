import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function FormComponent() {
  const [claimType, setClaimType] = useState('');
  const navigate = useNavigate();
  const handleOptionChange = (event) => {
    setClaimType(event.target.value);
  };
  const handleProceed = () => {
    if (claimType) {
      //navigate(`/${workflowName}`, { state: { workflowName } });
      sessionStorage.setItem('claimType', claimType);
      if(claimType==="ConveyanceClaim"){
        navigate('/conveyanceForm');
      }
      else if(claimType==="FoodClaim"){
        navigate('/mediclaimtDashboard');
      }
      else if(claimType==="TravelClaim"){
        navigate('/exitDashboard');
      }
      else if(claimType==="MobileClaim"){
        navigate('/exitDashboard');
      }
      else if(claimType==="MiscellaneousClaim"){
        navigate('/exitDashboard');
      }
    }
  };
  return (
    <div>
       <div>
    <h1>Select an Option:</h1>
    <form>
      <div>
        <label>
          <input
            type="radio"
            value="ConveyanceClaim"
            checked={claimType === 'ConveyanceClaim'}
            onChange={handleOptionChange}
          />
          ConveyanceClaim
        </label>
      </div>
      <div>
      <label>
          <input
            type="radio"
            value="FoodClaim"
            checked={claimType === 'FoodClaim'}
            onChange={handleOptionChange}
          />
          FoodClaim
        </label>
      </div>
      <div>
        <label>
          <input
            type="radio"
            value="TravelClaim"
            checked={claimType === 'TravelClaim'}
            onChange={handleOptionChange}
          />
          TravelClaim
        </label>
      </div>
      <div>
        <label>
          <input
            type="radio"
            value="MobileClaim"
            checked={claimType === 'MobileClaim'}
            onChange={handleOptionChange}
          />
          MobileClaim
        </label>
      </div>
      <div>
        <label>
          <input
            type="radio"
            value="MiscellaneousClaim"
            checked={claimType === 'MiscellaneousClaim'}
            onChange={handleOptionChange}
          />
          MiscellaneousClaim
        </label>
      </div>
    </form>
    </div>
      {claimType && (
        <div>
          <button onClick={handleProceed}>Proceed</button>
        </div>
      )}
    </div>
  );
}
export default FormComponent;