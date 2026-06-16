import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { IoIosCloseCircleOutline } from "react-icons/io";

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

const ViewFeedback = () => {
    const { empCode, extensionNumber, threeId, sixId } = useParams();
    const navigate = useNavigate();

    const [threeMonthFeedback, setThreeMonthFeedback] = useState({});
    const [sixMonthFeedback, setSixMonthFeedback] = useState({});
    const [thirdMonthRemarks, setThirdMonthRemarks] = useState("");
    const [sixthMonthRemarks, setSixthMonthRemarks] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const [threeRes, sixRes] = await Promise.all([
                    axios.get(`http://localhost:8080/api/probation/probation-evaluation-three/${empCode}/${threeId}`),
                    axios.get(`http://localhost:8080/api/probation/probation-evaluation-six/${empCode}/${sixId}`)
                ]);

                const third = threeRes.data;
                const sixth = sixRes.data;

                setThreeMonthFeedback({
                    0: third.performanceStandardFeedback,
                    1: third.qualityOfWorkFeedback,
                    2: third.subjectKnowledgeCompetenceLevelFeedback,
                    3: third.initiativeWillingnessToTakeResponsibilitiesFeedback,
                    4: third.attendanceConsistencyInWorkFeedback,
                    5: third.teamWorkCooperationFeedback,
                    6: third.organizingTimeManagementFeedback,
                    7: third.attitudeTowardsWorkFeedback,
                    8: third.wellVersedWithCompanyPoliciesFeedback,
                    9: third.thoroughWithCompanyCodeOfConductFeedback
                });
                setThirdMonthRemarks(third.remarks || "");

                setSixMonthFeedback({
                    0: sixth.performanceStandardFeedback,
                    1: sixth.qualityOfWorkFeedback,
                    2: sixth.subjectKnowledgeCompetenceLevelFeedback,
                    3: sixth.initiativeWillingnessToTakeResponsibilitiesFeedback,
                    4: sixth.attendanceConsistencyInWorkFeedback,
                    5: sixth.teamWorkCooperationFeedback,
                    6: sixth.organizingTimeManagementFeedback,
                    7: sixth.attitudeTowardsWorkFeedback,
                    8: sixth.wellVersedWithCompanyPoliciesFeedback,
                    9: sixth.thoroughWithCompanyCodeOfConductFeedback
                });
                setSixthMonthRemarks(sixth.remarks || "");

            } catch (error) {
                setError('❌ Failed to fetch one or both feedbacks');
            } finally {
                setLoading(false);
            }
        };

        fetchFeedbacks();
    }, [empCode, threeId, sixId]);

    if (loading) return <div className="text-center py-10 text-lg">Loading feedback...</div>;
    if (error) return <div className="text-red-600 text-center py-4">{error}</div>;

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
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">Employee Probation Feedback</h1>

                    {/* Third Month Feedback */}
                    <h2 className="text-lg font-semibold text-gray-800 mb-3">Third Month Evaluation</h2>
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
                                    <tr key={`third-month-${index}`} className="border-b border-gray-200 last:border-b-0">
                                        <td className="py-2.5 px-4">{index + 1}</td>
                                        <td className="py-2.5 px-4">{criteria}</td>
                                        <td className="py-2.5 px-4">
                                            <span className="block w-full p-1.5 border border-gray-300 rounded-md bg-gray-100 text-sm">
                                                {threeMonthFeedback[index] || "N/A"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <h3 className="mb-2 font-semibold">Remarks</h3>
                    <textarea
                        readOnly
                        rows="3"
                        className="block w-full p-2 border border-gray-300 rounded-md mb-8 resize-none bg-gray-100"
                        value={thirdMonthRemarks}
                    />

                    {/* Sixth Month Feedback */}
                    <h2 className="text-lg font-semibold text-gray-800 mb-3">Sixth Month Evaluation</h2>
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
                                    <tr key={`sixth-month-${index}`} className="border-b border-gray-200 last:border-b-0">
                                        <td className="py-2.5 px-4">{index + 1}</td>
                                        <td className="py-2.5 px-4">{criteria}</td>
                                        <td className="py-2.5 px-4">
                                            <span className="block w-full p-1.5 border border-gray-300 rounded-md bg-gray-100 text-sm">
                                                {sixMonthFeedback[index] || "N/A"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <h3 className="mb-2 font-semibold">Remarks</h3>
                    <textarea
                        readOnly
                        rows="3"
                        className="block w-full p-2 border border-gray-300 rounded-md mb-8 resize-none bg-gray-100"
                        value={sixthMonthRemarks}
                    />
                </div>
            </div>
        </div>
    );
};

export default ViewFeedback;
