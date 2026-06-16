import React, { useState } from 'react';
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useNavigate, useParams } from 'react-router-dom';

const ProbationEvaluation = () => {
    const navigate = useNavigate();
    const { empCode } = useParams(); 
    console.log(empCode);
    

    const evaluationCriteria = [
        "Performance Standard",
        "Quality of Work",
        "Subject Knowledge & Competence level",
        "Initiative & willingness to take responsibilities",
        "Attendance & Consistency in work",
        "Team work & Cooperation",
        "Organizing & time Management",
        "Attitude towards Work",
        "Well versed with Company Policies",
        "Thorough with Company's Code of Conduct"
    ];

    const feedbackOptions = ["Excellent", "Very good", "Good", "Average", "Poor"];

    const initialFeedbackState = evaluationCriteria.reduce((acc, _, index) => {
        acc[index] = "Excellent";
        return acc;
    }, {});

    const [thirdMonthFeedback, setThirdMonthFeedback] = useState(initialFeedbackState);
    const [sixthMonthFeedback, setSixthMonthFeedback] = useState(initialFeedbackState);
    const [thirdMonthRemarks, setThirdMonthRemarks] = useState("");
    const [sixthMonthRemarks, setSixthMonthRemarks] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleFeedbackChange = (type, index, value) => {
        if (type === "thirdMonth") {
            setThirdMonthFeedback(prev => ({ ...prev, [index]: value }));
        } else if (type === "sixthMonth") {
            setSixthMonthFeedback(prev => ({ ...prev, [index]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const baseUrl = "http://localhost:8080/api/probation/evaluate";
            const todayDate = new Date().toISOString().split('T')[0];

            const thirdMonthPayload = {
                empCode: empCode,
                evaluationType: "THIRD_MONTH",
                evaluationDate: todayDate,
                evaluatorName: "EMP002",
                performanceStandardFeedback: thirdMonthFeedback[0],
                qualityOfWorkFeedback: thirdMonthFeedback[1],
                subjectKnowledgeCompetenceLevelFeedback: thirdMonthFeedback[2],
                initiativeWillingnessToTakeResponsibilitiesFeedback: thirdMonthFeedback[3],
                attendanceConsistencyInWorkFeedback: thirdMonthFeedback[4],
                teamWorkCooperationFeedback: thirdMonthFeedback[5],
                organizingTimeManagementFeedback: thirdMonthFeedback[6],
                attitudeTowardsWorkFeedback: thirdMonthFeedback[7],
                wellVersedWithCompanyPoliciesFeedback: thirdMonthFeedback[8],
                thoroughWithCompanyCodeOfConductFeedback: thirdMonthFeedback[9],
                remarks: thirdMonthRemarks,
            };

            const sixthMonthPayload = {
                empCode: empCode,
                evaluationType: "SIXTH_MONTH",
                evaluationDate: todayDate,
                evaluatorName: "EMP002",
                performanceStandardFeedback: sixthMonthFeedback[0],
                qualityOfWorkFeedback: sixthMonthFeedback[1],
                subjectKnowledgeCompetenceLevelFeedback: sixthMonthFeedback[2],
                initiativeWillingnessToTakeResponsibilitiesFeedback: sixthMonthFeedback[3],
                attendanceConsistencyInWorkFeedback: sixthMonthFeedback[4],
                teamWorkCooperationFeedback: sixthMonthFeedback[5],
                organizingTimeManagementFeedback: sixthMonthFeedback[6],
                attitudeTowardsWorkFeedback: sixthMonthFeedback[7],
                wellVersedWithCompanyPoliciesFeedback: sixthMonthFeedback[8],
                thoroughWithCompanyCodeOfConductFeedback: sixthMonthFeedback[9],
                remarks: sixthMonthRemarks,
            };

            // Send 3rd month evaluation
            const res3 = await fetch(baseUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(thirdMonthPayload),
            });
            if (!res3.ok) {
                const errData = await res3.json();
                throw new Error(`3rd month submission failed: ${res3.status} ${JSON.stringify(errData)}`);
            }

            // Send 6th month evaluation
            const res6 = await fetch(`${baseUrl}/six`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sixthMonthPayload),
            });
            if (!res6.ok) {
                const errData = await res6.json();
                throw new Error(`6th month submission failed: ${res6.status} ${JSON.stringify(errData)}`);
            }

            setSuccessMessage("✅ Evaluations submitted successfully!");

            // After success, navigate back after 2 seconds delay (optional)
            setTimeout(() => {
                navigate(-1);
            }, 2000);

        } catch (err) {
            setError(err.message || "❌ Failed to submit evaluation. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-1 font-inter">
            <div className="bg-white shadow-xl max-w-5xl w-full max-h-[98vh] min-h-[90vh] overflow-y-auto relative rounded-lg">
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-red-500 hover:text-red-700 transition duration-200"
                    aria-label="Close"
                >
                    <IoIosCloseCircleOutline className="w-6 h-6" />
                </button>

                <div className="py-6 px-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Probation Evaluation & Confirmation Form</h1>
                    <p className="text-gray-700 leading-relaxed mb-6 text-sm">
                        To understand the progress of a new joinee, to support him/her during the initial probation period with necessary trainings & to evaluate his/her performance, probation evaluation is carried out on completion of Third month from the Date of Joining (DOJ) while final employment confirmation is carried out on completion of Sixth month from DOJ.
                    </p>

                    {error && (
                        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded border border-red-400 font-semibold">{error}</div>
                    )}
                    {successMessage && (
                        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded border border-green-400 font-semibold">{successMessage}</div>
                    )}

                    <form onSubmit={handleSubmit}>

                        {/* Third Month Evaluation */}
                        <h2 className="text-lg font-semibold text-gray-800 mb-3">Probation Evaluation: Third Month from DOJ</h2>
                        <p className="text-gray-600 mb-5 text-sm">(*Rate the employee's overall performance on the scale given below)</p>

                        <div className="overflow-x-auto mb-6 max-w-4xl mx-auto">
                            <table className="w-full bg-white border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold tracking-wider">
                                        <th className="py-3 px-4 text-left border-b border-gray-300 w-[10%]">S.NO</th>
                                        <th className="py-3 px-4 text-left border-b border-gray-300 w-[60%]">EVALUATION CRITERIA</th>
                                        <th className="py-3 px-4 text-left border-b border-gray-300 w-[30%]">FEEDBACK</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-700 text-sm">
                                    {evaluationCriteria.map((criteria, index) => (
                                        <tr key={`third-month-${index}`} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
                                            <td className="py-2.5 px-4">{index + 1}</td>
                                            <td className="py-2.5 px-4">{criteria}</td>
                                            <td className="py-2.5 px-4">
                                                <select
                                                    className="block w-full p-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                                    value={thirdMonthFeedback[index]}
                                                    onChange={(e) => handleFeedbackChange("thirdMonth", index, e.target.value)}
                                                    disabled={loading}
                                                >
                                                    {feedbackOptions.map(option => (
                                                        <option key={option} value={option}>{option}</option>
                                                    ))}
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <h3 className="mb-2 font-semibold">Additional Remark(s)</h3>
                        <textarea
                            rows="3"
                            className="block w-full p-2 border border-gray-300 rounded-md mb-8 resize-none"
                            value={thirdMonthRemarks}
                            onChange={(e) => setThirdMonthRemarks(e.target.value)}
                            disabled={loading}
                        />

                        {/* Sixth Month Evaluation */}
                        <h2 className="text-lg font-semibold text-gray-800 mb-3">Probation Confirmation: Sixth Month from DOJ</h2>
                        <p className="text-gray-600 mb-5 text-sm">(*Rate the employee's overall performance on the scale given below)</p>

                        <div className="overflow-x-auto mb-6 max-w-4xl mx-auto">
                            <table className="w-full bg-white border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold tracking-wider">
                                        <th className="py-3 px-4 text-left border-b border-gray-300 w-[10%]">S.NO</th>
                                        <th className="py-3 px-4 text-left border-b border-gray-300 w-[60%]">EVALUATION CRITERIA</th>
                                        <th className="py-3 px-4 text-left border-b border-gray-300 w-[30%]">FEEDBACK</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-700 text-sm">
                                    {evaluationCriteria.map((criteria, index) => (
                                        <tr key={`sixth-month-${index}`} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
                                            <td className="py-2.5 px-4">{index + 1}</td>
                                            <td className="py-2.5 px-4">{criteria}</td>
                                            <td className="py-2.5 px-4">
                                                <select
                                                    className="block w-full p-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                                    value={sixthMonthFeedback[index]}
                                                    onChange={(e) => handleFeedbackChange("sixthMonth", index, e.target.value)}
                                                    disabled={loading}
                                                >
                                                    {feedbackOptions.map(option => (
                                                        <option key={option} value={option}>{option}</option>
                                                    ))}
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <h3 className="mb-2 font-semibold">Additional Remark(s)</h3>
                        <textarea
                            rows="3"
                            className="block w-full p-2 border border-gray-300 rounded-md mb-8 resize-none"
                            value={sixthMonthRemarks}
                            onChange={(e) => setSixthMonthRemarks(e.target.value)}
                            disabled={loading}
                        />

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                type="button"
                                onClick={() => navigate(-1)} 
                                className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-400 text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProbationEvaluation;
