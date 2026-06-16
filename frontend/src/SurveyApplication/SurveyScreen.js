import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Field, Input } from '@headlessui/react';
import { FaLongArrowAltLeft, FaSave } from "react-icons/fa";
import { RiDeleteBinLine } from 'react-icons/ri';
import PlainQuestion from './PlainQuestion';
import GroupQuestion from './GroupQuestion';
import TabularQuestion from './TabularQuestion';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../components/Header';

function SurveyScreen() {


    const location = useLocation();
    const selectedSurveyData = location?.state?.data || "";
    const navigate = useNavigate();

    const [blocks, setBlocks] = useState([{ id: 1, text: "", questions: [] }]);

    const [counter, setCounter] = useState(2);
    const [isChecked, setIsChecked] = useState(true);
    // const [blocksData, setBlocksData] = useState([])

    // useEffect(()=>{
    //     axios.get(`http://localhost:8989/survey/${selectedSurveyData.id}`)
    //     .then((res)=>{
    //         setBlocksData(res.data)
    //     }).catch((error)=>{
    //         console.log("Failed to fetch", error);
    //     })
    // },[selectedSurveyData.id])

    const addBlock = () => {
        setBlocks([...blocks, { id: counter, text: "", questions: [] }]);
        setCounter(counter + 1);
    }
    const deleteBlock = (block) => {
        axios.delete(`http://localhost:8989/section/${block.sectionId}`)
            .then(() => {
                toast.info("Section deleted.");
                fetchSections();
            })
    };
    const handleTextChange = (id, value) => {
        setBlocks(blocks.map(block => block.id === id ? { ...block, text: value } : block));
    };

    const addPlainQuestion = (id) => {
        setBlocks(blocks.map(block =>
            block.id === id ? { ...block, questions: [...block.questions, { id: Date.now(), type: "plain question" }] } : block
        ));
    };

    const addGroupQuestion = (id) => {
        setBlocks(blocks.map(block =>
            block.id === id ? { ...block, questions: [...block.questions, { id: Date.now(), type: "group" }]} : block
        ));
    };

    const deleteQuestion = (blockId, questionId) => {
        setBlocks(blocks.map(block =>
            block.id === blockId
                ? { ...block, questions: block.questions.filter(q => q.id !== questionId) }
                : block
        ));
    };


    const addTabularQuestion = (id) => {
        setBlocks(blocks.map(block =>
            block.id === id ? {
                ...block,
                questions: [...block.questions, { id: Date.now(), type: "tabular" }]
            } : block
        ));
    };

    const saveSection = async (block) => {
        try {
            const payload = {
                surveyId: selectedSurveyData.id,
                sectionName: block.text,
                isPreSurvey: isChecked
            };

            if (block.sectionId) {
                // Update existing section
                const response = await axios.put(`http://localhost:8989/section/updateSection/${block.sectionId}`, payload);
                toast.success("Section updated successfully!");
            } else {
                // Create new section
                const response = await axios.post("http://localhost:8989/section", payload);
                toast.success("Section saved successfully!");
                setBlocks(prev =>
                    prev.map(b => b.id === block.id ? { ...b, sectionId: response.data.id } : b)
                );
            }
        } catch (error) {
            console.error("Error saving or updating section:", error);
        }
    };


    //    const fetchSections = async () => {
    //         if (!selectedSurveyData?.id) return;

    //         try {
    //             const res = await axios.get(`http://localhost:8989/section/survey/${selectedSurveyData.id}`);

    //             const mappedBlocks = res.data.map((section, index) => ({
    //                 id: index + 1,
    //                 sectionId: section.id,
    //                 text: section.sectionName || "",
    //                 questions: []
    //             }));
    //             setBlocks(mappedBlocks.length > 0 ? mappedBlocks : [{ id: 1, text: "", questions: [] }]);
    //             setCounter(mappedBlocks.length + 1);
    //         } catch (error) {
    //             console.error("Failed to fetch survey sections:", error);
    //         }
    //     };
    const fetchSections = async () => {
        if (!selectedSurveyData?.id) return;
    
        try {
            const sectionRes = await axios.get(`http://localhost:8989/section/survey/${selectedSurveyData.id}`);
            const sectionData = sectionRes.data;
    
            const blocksWithQuestions = await Promise.all(
                sectionData.map(async (section, index) => {
                    let questions = [];
    
                    try {
                        const questionRes = await axios.get(`http://localhost:8989/question-metadata/get-questions/${section.id}`);
                        console.log(questionRes.data,"{{{{{{{{{{{")
                        questions = questionRes.data.map((q, i) => {
                            let parsedConf = {};
                            try {
                                parsedConf = JSON.parse(q.questionConf || '{}');
                            } catch (err) {
                                console.error("Invalid JSON in questionConf:", err);
                            }
                        
                            if (q.formatType === "plain question") {
                                const question = parsedConf.question || {};
                                return {
                                    metaDataId: q.id,
                                    type: q.formatType,
                                    questionConf: question,
                                    questionId: question.questionId,
                                    questionText: question.question,
                                    title: q.title,
                                    queOptionType: question.queOptionType,
                                    options: question.options || question.questionOptions || []
                                };
                            }
                        
                            if (q.formatType === "group") {
                                return {
                                    metaDataId: q.id,
                                    type: q.formatType,
                                    questionConf: parsedConf.questions || [],
                                    metaQuestion: parsedConf.metaQuestion || "",
                                    title: q.title,
                                    options: []
                                };
                            }
                        
                            if (q.formatType === "tabular") {
                                return {
                                    metaDataId: q.id,
                                    type: q.formatType,
                                    questionConf: q.questionConf,
                                    title: q.title,
                                    options: [],
                                };
                            }
                        
                            return null;
                        }).filter(Boolean);
                        
                        console.log(questions, "<<<<<<<<<questions");
                    } catch (e) {
                        console.error(`Error fetching questions for sectionId ${section.id}`, e);
                    }
    
                    return {
                        id: index + 1,
                        sectionId: section.id,
                        text: section.sectionName || "",
                        questions
                    };
                })
            );
    
            // setBlocks(blocksWithQuestions.length > 0 ? blocksWithQuestions : [{ id: 1, text: "", questions: [] }]);
            if (blocksWithQuestions.length > 0) {
                setBlocks(blocksWithQuestions);
                setCounter(blocksWithQuestions.length + 1);
            } else {
                setBlocks([{ id: 1, text: "", questions: [] }]);
                setCounter(2);
            }
            // setCounter(blocksWithQuestions.length + 1);
        } catch (error) {
            console.error("Failed to fetch survey sections:", error);
        }
    };
    
    useEffect(() => {
        fetchSections();
    }, [selectedSurveyData?.id]);



    return (
        <div>
            <Header/>
            <div className='mt-20 h-screen'>
                <Navbar />
          
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
            <div className='grid grid-cols-7 mx-10'>
                <div className='col-span-5 flex items-center gap-3'>
                    <Button className="rounded-full bg-gray-700 py-1 px-1 text-sm/6 text-white data-[hover]:bg-gray-600" onClick={() => navigate('/survey-list')}><FaLongArrowAltLeft /></Button>
                    <div>
                        <h1 className='text-lg text-[#3AA1FF] font-semibold'>{selectedSurveyData.surveyName}</h1>
                        <p className='text-xs text-gray-800'>This is sample survey of farming practices, crop production etc. This information helps in assessing and supporting farmer's needs</p>
                    </div>
                </div>
                <div className='col-span-2 grid grid-cols-4 items-end font-medium text-sm'>
                    <h1 className='ml-3 text-[#3AA1FF]'>Start Date -</h1>
                    <h1 className='text-gray-800'>{new Date(selectedSurveyData.startDate).toLocaleDateString("en-GB")}</h1>
                    <h1 className='ml-5 text-[#3AA1FF]'>End Date -</h1>
                    <h1 className='text-gray-800'>{new Date(selectedSurveyData.endDate).toLocaleDateString("en-GB")}</h1>
                </div>
            </div>
            <div className='border-[1px] border-gray-300 mt-3'></div>
            {blocks.map((block, index) => (
                <div key={index} className='mx-auto w-4/5 mt-3 border border-dotted border-gray-400'>
                    <div className=' flex items-center justify-between border-b border-gray-200'>
                        <Field className="flex items-center gap-5 p-4">
                            <Input
                                className='w-96 rounded-none border h-7 border-gray-400 bg-white py-1 px-1 text-xs text-gray-800 outline-none'
                                placeholder={`Block ${block.id}...`}
                                value={block.text}
                                onChange={(e) => handleTextChange(block.id, e.target.value)}
                            />
                        </Field>
                        <div className='flex items-center gap-3 mx-6'>
                            <input type="checkbox" checked={isChecked} onChange={() => setIsChecked(!isChecked)}
                            />
                            <Button className='text-[#416fee]' onClick={() => saveSection(block)}><FaSave /></Button>
                            <Button className='bg-[#B8FDB6] px-2 py-0.5 text-xs border border-gray-300'>{index + 1}</Button>
                            <Button className="bg-[#D9EDFF] px-2 py-0.5 text-xs text-gray-700 border border-gray-300">sort</Button>
                            {blocks.length > 1 && (
                                <Button className="bg-[#B8FDB6] px-2 py-[4px] text-xs text-gray-700 border border-gray-300" onClick={() => deleteBlock(block)}><RiDeleteBinLine /></Button>
                            )}
                        </div>
                    </div>
                    <div className='mt-3'>
                        {block.questions.length > 0 ? (
                            block.questions.map((question, qIndex) => (
                                <div key={question.id} className="my-4">
                                    {question.type === "group" ? (
                                        <GroupQuestion
                                            fetchSections={fetchSections}
                                            question={question}
                                            blockId={block.id}
                                            sectionId={block.sectionId}
                                            index={qIndex}
                                            questionId={question.id}
                                            deleteQuestion={deleteQuestion}
                                        />
                                    ) : question.type === "tabular" ? (
                                        <TabularQuestion
                                            fetchSections={fetchSections}
                                            question={question}
                                            blockId={block.id}
                                            sectionId={block.sectionId}
                                            index={qIndex}
                                            questionId={question.id}
                                            deleteQuestion={deleteQuestion}
                                        />
                                    ) : question.type === "plain question" ? (
                                        <PlainQuestion
                                        fetchSections={fetchSections}
                                            question={question}
                                            blockId={block.id}
                                            sectionId={block.sectionId}
                                            index={qIndex}
                                            questionId={question.id}
                                            deleteQuestion={deleteQuestion}
                                        />
                                    ) : null}
                                </div>
                            ))
                        ) : (
                            <h1 className="px-4 text-gray-400 font-semibold">Select Question Type</h1>
                        )}
                    </div>
                    <div className='py-6'>
                        <Button className='bg-[#53ABFC] px-2 py-1 mx-2 text-sm text-white rounded-md hover:bg-[#328EE4]' onClick={() => addPlainQuestion(block.id)}>Add Plain Question</Button>
                        <Button className='bg-[#2CB02C] px-2 py-1 mx-2 text-sm text-white rounded-md hover:bg-[#2AC62A]' onClick={() => addGroupQuestion(block.id)}>Add Group Question</Button>
                        <Button className='bg-[#9A9999] px-2 py-1 mx-2 text-sm text-white rounded-md hover:bg-[#AEA6A6]' onClick={() => addTabularQuestion(block.id)}>Add Tabular Question</Button>
                    </div>
                </div>
            ))}
            <div className='mx-auto w-4/5 mt-3'>
                <Button className='bg-[#2CB02C] px-2 py-1 mx-2 text-sm text-white rounded-md border border-gray-300 hover:bg-[#2AC62A]'>Save Survey</Button>
                <Button className='bg-gray-700 px-2 py-1 mx-2 text-sm float-right text-white rounded-md border border-gray-300 hover:bg-gray-500' onClick={addBlock}>Add Block</Button>
            </div>
        </div>
          </div>
    );
}

export default SurveyScreen;
