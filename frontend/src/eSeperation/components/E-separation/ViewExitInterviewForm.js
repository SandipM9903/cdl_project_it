import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaRegCircleXmark } from "react-icons/fa6";
import { BASE_URL } from '../../../config/Config';


const fieldMap = {
    'Why did you decide to leave the company?': 'reasonForLeaving',
    'Was there a specific event that triggered your decision to resign?': 'resignTriggerEvent',
    'Was this decision influenced by another job offer or opportunity?': 'influencedByOffer',
    'Were your job responsibilities and expectations clear to you?': 'roleClarity',
    'Did you have the tools and resources needed to do your job well?': 'resourceAvailability',
    'Were you given opportunities for growth and development?': 'growthOpportunities',
    'How was your relationship with your manager/supervisor?': 'managerRelationship',
    'Did you receive regular and constructive feedback from your manager?': 'managerFeedback',
    'Do you feel management supported your professional development?': 'developmentSupport',
    'How would you describe the work culture here?': 'workCulture',
    'Did you feel valued and respected as an employee?': 'employeeValued',
    'Were there any issues related to harassment or discrimination?': 'harassmentIssues',
    'How well did you collaborate with your team members?': 'teamCollaboration',
    'Were there any team dynamics that made your work difficult?': 'teamDynamicsIssues',
    'Did you receive adequate support from other departments?': 'deptSupport',
    'How satisfied were you with your salary and benefits?': 'salarySatisfaction',
    'Were there any specific benefits you felt were lacking?': 'benefitsLacking',
    'Was compensation fairly aligned with your responsibilities and performance?': 'fairCompensation',
    'Were company policies clear and consistently followed?': 'policyClarity',
    'Did HR support you well during your tenure?': 'hrSupport',
    'Were there any policies that you found confusing or unfair?': 'policyIssues',
    'What did you like most about working here?': 'likedMost',
    'What could the company improve?': 'companyImprovements',
    'Would you recommend this company to a friend? Why or why not?': 'recommendCompany',
    'Is there anything else you’d like to share?': 'additionalComments'
};

function ViewExitInterviewForm({ closeViewInterview, resignationDetails }) {
    const [questions, setQuestions] = useState([]);
    const [responses, setResponses] = useState({});

    useEffect(() => {
        axios.get(`${BASE_URL}:9029/api/eSeparation/getAllStayInterviewQue`)
            .then(res => setQuestions(res.data))
            .catch(err => console.error("Error fetching questions", err));

        axios.get(`${BASE_URL}:9029/api/eSeparation/getStayInterviewResponse/${resignationDetails.empCode}`)
            .then(res => setResponses(res.data))
            .catch(err => console.error("Error fetching responses", err));
    }, [resignationDetails.id]);

    return (
        <div>
            <div className='flex item-center justify-between p-5'>
                <h1 className='text-lg'>Exit Interview Feedback (View)</h1>
<button
  className='p-2 rounded-full hover:bg-gray-200 text-lg text-black hover:text-red-500'
  onClick={closeViewInterview}
>
  <FaRegCircleXmark size={20} />
</button>            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-10 py-5">
                {questions.map((question, index) => {
                    const field = fieldMap[question.question];
                    return (
                        <div key={index} className="px-4 py-2">
                            <p className="text-sm text-gray-700 mb-2 px-2">{question.question}</p>
                            <textarea
                                rows={2}
                                className='border outline-none rounded-md w-full px-3 py-2 bg-gray-100'
                                value={responses[field] || ''}
                                disabled
                            />
                        </div>
                    );
                })}
            </div>
            <div className="text-center py-6 mx-4 sm:mx-10 space-x-6">
                <button className="px-6 py-1.5 border border-[#DC3545] bg-[#FAFAFA] text-[#DC3545] rounded-full" onClick={closeViewInterview}>
                    Close
                </button>
            </div>
        </div>
    );
}

export default ViewExitInterviewForm;
