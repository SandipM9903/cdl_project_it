import React, { useEffect, useState } from 'react';
import { Field, Input, Label, Button } from '@headlessui/react';
import { RiDeleteBinLine, RiAddBoxLine } from "react-icons/ri";
import axios from 'axios';
import { FaSave } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function GroupQuestion({ blockId, index, questionId, deleteQuestion , sectionId , question , fetchSections }) {
    const [title, setTitle] = useState('');
    const [metaQuestion, setMetaQuestion] = useState('');
    const [que, setQue] = useState('');
    const [questions, setQuestions] = useState([{ id: 1, value: '' }]);
    const [counter, setCounter] = useState(2)
    const [metaDataId, setMetaDataId] = useState('');
    const [queId,setQueId]= useState('');
    // useEffect(()=>{
    //     if(question){
    //         setTitle(question.title);
    //         setMetaDataId(question.metaDataId);
    //         setQueId(question.questionId);
    //         setMetaQuestion(question.metaQuestion);
    //         setQue(question.questionText)
    //         try {
    //             const parsed = JSON.parse(question.questionText);
    //             if (Array.isArray(parsed)) {
    //                 const mapped = parsed.map((text, index) => ({
    //                     id: index + 1,
    //                     value: text,
    //                 }));
    //                 setQuestions(mapped);
    //                 setCounter(parsed.length + 1);
    //             }
    //         } catch (err) {
    //             console.error("Failed to parse questionText:", err);
    //         }
    //     }
    // },[question])

    useEffect(() => {
        if (question) {
            setTitle(question.title);
            setMetaDataId(question.metaDataId);
            setQueId(question.questionId); // might be null for group, keep if needed
            setMetaQuestion(question.metaQuestion);
    
            // Directly map questionConf since it's always group-type
            if (Array.isArray(question.questionConf)) {
                const mapped = question.questionConf.map((q, index) => ({
                    id: index + 1,
                    value: q.question,
                    questionId: q.questionId,
                    queOptionType: q.queOptionType,
                }));
                setQuestions(mapped);
                setCounter(mapped.length + 1);
            } else {
                console.warn("questionConf is not an array");
            }
        }
    }, [question]);
    
    const handleAddQuestion = () => {
        setQuestions([...questions, { id: counter }]);
        setCounter(counter + 1);
    };

    const handleRemoveQuestion = (id) => {
        setQuestions(questions.filter(q => q.id !== id));
    };

    const handleChangeQuestion = (id, value) => {
        setQuestions(prev => prev.map(q => q.id === id ? { ...q, value } : q));
    };

    const handleSubmit = async () => {
        const payload = {
            sectionId: sectionId,
            formatType: "group",
            title,
            metaDataId:metaDataId,
            questionConf: {
                metaQuestion: metaQuestion,
                questions: questions
                  .filter(q => q.value?.trim()) // Ensure only valid questions
                  .map((q, index) => ({
                    formatId: metaDataId,
                    sort: index + 1,
                    question: q.value,
                    queOptionType: "Input Text",
                    queValidation: "required",
                    questionOptions: null
                  }))
              }
        };

        try {
            if(question.metaDataId){
                const response = await axios.put(
                    "http://localhost:8989/question-metadata/update-plainQuestion",
                    payload,
                    {
                        headers: { "Content-Type": "application/json" }
                    }
                );
                toast.success("Question updated successfully!");
                fetchSections();
            }else{
                const response = await axios.post(
                    "http://localhost:8989/question-metadata/plainQuestion",
                    payload,
                    {
                      headers: { "Content-Type": "application/json" }
                    }
                  );
                  toast.success("Question saved successfully!");
                  fetchSections();
            }
        } catch (error) {
            console.error("Error saving/updating question:", error);
          toast.alert("An error occurred while saving/updating.");
        }
    };

    const handleDeleteFromServer = async () => {
            if (!metaDataId){
                deleteQuestion(blockId, questionId);
                return;
            }  
        
            try {
                await axios.delete(`http://localhost:8989/question-metadata/${metaDataId}`);
                toast.success("Question deleted successfully!");
                fetchSections();
            } catch (error) {
                console.error("Failed to delete question:", error);
                toast.alert("An error occurred while deleting.");
            }
        }

    return (
        <div>
            {/* <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} /> */}
            <div className='mx-3 bg-[#FDF6B7] flex items-center justify-between'>
                <div className=''>
                    <Field className="flex items-center gap-5 px-4 py-1">
                        <Label className="text-xs">{index + 1} Title</Label>
                        <Input
                            className='rounded-none border h-5 border-gray-400 bg-white py-1 px-1 text-xs text-gray-800 outline-none'
                            placeholder='Enter Title...'
                            value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        />
                    </Field>
                </div>
                <div>
                    <Button className='text-gray-700' onClick={handleSubmit}><FaSave /></Button>
                    <Button className="py-1 px-1 mx-3 text-sm text-gray-700 data-[hover]:text-gray-600" onClick={handleDeleteFromServer}><RiDeleteBinLine /></Button>
                </div>
            </div>
            <div className='mx-3 py-2 bg-[#F1F1F1]'>
                <Field className="px-4 py-1">
                    <Input
                        className='w-3/4 rounded-none border h-8 border-gray-400 bg-[#F3F9FF] py-1 px-1 text-sm text-gray-800 outline-none'
                        placeholder='Enter Question...'
                        value={metaQuestion}
                        onChange={(e) => setMetaQuestion(e.target.value)}
                    />
                </Field>
            </div>
            <div className='mx-3 grid grid-cols-12 bg-[#F1F1F1] pb-2'>
                {questions.map((q) => (
                    <>
                        <div className='col-span-3 bg-white ml-3'>
                            <Field className="px-4 py-1">
                                <Input
                                value={q.value}
                                onChange={(e) => handleChangeQuestion(q.id, e.target.value)}
                                    className='w-full rounded-none border h-8 border-gray-400 bg-[#F3F9FF] py-1 px-1 text-sm text-gray-800 outline-none'
                                    placeholder='Enter Question...'
                                />
                            </Field>
                        </div>
                        <div className='col-span-7 bg-white'>
                            <Field className="px-4 py-1">
                                <Input
                                    className='w-full rounded-none border h-8 border-gray-400 bg-[#F1F1F1] py-1 px-1 text-sm text-gray-800 outline-none'
                                    placeholder='Enter Answer...'
                                />
                            </Field>
                        </div>
                        {questions.length > 1 && (
                            <div className='col-span-1 p-2 bg-white text-center'>
                                <Button className='text-red-500' onClick={() => handleRemoveQuestion(q.id)}><RiDeleteBinLine /></Button>
                            </div>
                        )}
                    </>
                ))}
                <div className='col-span-1 p-2 mr-3 text-center'>
                    <Button className='text-lg' onClick={handleAddQuestion}><RiAddBoxLine /></Button>
                </div>
            </div>
        </div>
    );
}

export default GroupQuestion;