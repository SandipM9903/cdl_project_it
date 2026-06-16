import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function FormComponent() {
  const [workflowName, setWorkflowName] = useState('');
  const navigate = useNavigate();
  const handleOptionChange = (event) => {
    setWorkflowName(event.target.value);
  };
  const handleProceed = () => {
    if (workflowName) {
      //navigate(`/${workflowName}`, { state: { workflowName } });
      sessionStorage.setItem('workflowName', workflowName);
      if(workflowName==="E-Separation"){
        navigate('/exitDashboard');
      }
      else if(workflowName==="MediClaim"){
        navigate('/mediClaimFormDashboard');
      }
      else if(workflowName==="TravelClaim"){
        navigate('/travelClaimFormDashboard');
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
            value="E-Separation"
            checked={workflowName === 'E-Separation'}
            onChange={handleOptionChange}
          />
          E-Separation
        </label>
      </div>
      <div>
        <label>
          <input
            type="radio"
            value="MediClaim"
            checked={workflowName === 'MediClaim'}
            onChange={handleOptionChange}
          />
          MediClaim
        </label>
      </div>
      <div>
        <label>
          <input
            type="radio"
            value="TravelClaim"
            checked={workflowName === 'TravelClaim'}
            onChange={handleOptionChange}
          />
          TravelClaim
        </label>
      </div>
    </form>
    </div>
      {workflowName && (
        <div>
          <button onClick={handleProceed}>Proceed</button>
        </div>
      )}
    </div>
  );
}
export default FormComponent;