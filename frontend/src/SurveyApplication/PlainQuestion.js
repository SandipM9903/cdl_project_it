import React, { useEffect, useState } from 'react';
import { Field, Input, Label, Listbox, ListboxButton, ListboxOption, ListboxOptions, Checkbox, Button } from '@headlessui/react';
import { IoIosArrowDown } from 'react-icons/io';
import { CheckIcon } from '@heroicons/react/16/solid';
import { RiDeleteBinLine, RiAddBoxLine } from "react-icons/ri";
import { FaSave } from 'react-icons/fa';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const queType = [
    { id: 1, name: "Input Text" },
    { id: 2, name: "Check-Box" },
    { id: 3, name: "Check-Box Inline" },
    { id: 4, name: "Radio" },
    { id: 5, name: "Radio Inline" }
];

function PlainQuestion({ blockId, index, questionId, deleteQuestion, sectionId, question, fetchSections }) {
    const [originalData, setOriginalData] = useState({});
    const [selectedQueType, setSelectedQueType] = useState(queType[0]);
    const [options, setOptions] = useState([{ id: 1, text: "", checked: false }]);
    const [counter, setCounter] = useState(2); // Start from 2 since the first option is 1
    const MaxOption = 4;
    const [title, setTitle] = useState('');
    const [questionText, setQuestionText] = useState('');
    const [metaDataId, setMetaDataId] = useState('');
    const [queId, setQueId] = useState('');
    const [optionId, setOptionId] = useState('');


    const handleAddOption = () => {
        if (options.length < MaxOption) {
            setOptions([...options, { id: counter, text: '', checked: false }]);
            setCounter(counter + 1);
        } else {
            alert("You can add maximum 4 Options");
        }
    };

    useEffect(() => {
        if (question) {
            setMetaDataId(question.metaDataId);
            setQueId(question.questionId);
            setOptionId(question.optionId);
            setTitle(question.title || '');
            setQuestionText(question.questionText || '');

            const queTypeObj = queType.find(q => q.name === question.queOptionType);
            if (queTypeObj) setSelectedQueType(queTypeObj);

            const optionsFromProps = question.options?.map((opt, index) => ({
                id: index + 1,
                text: opt.optionValues || '',
                checked: false
            })) || [];

            if (["Check-Box", "Check-Box Inline"].includes(question.queOptionType)) {
                setOptions(optionsFromProps.length ? optionsFromProps : [{ id: 1, text: '', checked: false }]);
                setRadioOptions([{ id: 1, text: "" }]); // Clear radio options
            } else if (["Radio", "Radio Inline"].includes(question.queOptionType)) {
                setRadioOptions(optionsFromProps.length ? optionsFromProps.map(({ id, text }) => ({ id, text })) : [{ id: 1, text: '' }]);
                setOptions([{ id: 1, text: '', checked: false }]); // Clear checkbox options
            }

            setCounter((optionsFromProps.length || 1) + 1);
            setOriginalData({
                title: question.title || '',
                questionText: question.questionText || '',
                queOptionType: question.queOptionType,
                options: optionsFromProps.map(opt => opt.text.trim())
            });
        }
    }, [question]);

    useEffect(() => {
        if (!question) {
            setOptions([{ id: 1, text: "", checked: false }]);
            setRadioOptions([{ id: 1, text: "" }]);
            setCounter(2);
        }
    }, [selectedQueType]);

    const handleDeleteOption = (id) => {
        const updated = options.filter(option => option.id !== id);
        setOptions(updated);
    };

    const handleCheckboxChange = (id) => {
        setOptions(options.map(option =>
            option.id === id ? { ...option, checked: !option.checked } : option
        ));
    };

    const handleInputChange = (id, value) => {
        setOptions(options.map(option =>
            option.id === id ? { ...option, text: value } : option
        ));
    };

    const [radioOptions, setRadioOptions] = useState([{ id: 1, text: "" }]);
    const [selectedOption, setSelectedOption] = useState(null);
    const addOption = () => {
        if (radioOptions.length < MaxOption) {
            setRadioOptions([...radioOptions, { id: counter, text: "" }]);
            setCounter(counter + 1);
        }
    };


    const removeOption = (id) => {
        setRadioOptions(radioOptions.filter(option => option.id !== id));
    };

    const handleOptionChange = (id, text) => {
        setRadioOptions(radioOptions.map(option => option.id === id ? { ...option, text } : option));
    };

    const isDataEdited = () => {
        const currentOptions =
            selectedQueType.name.includes("Radio")
                ? radioOptions.map(opt => opt.text.trim())
                : options.map(opt => opt.text.trim());

        return (
            title !== originalData.title ||
            questionText !== originalData.questionText ||
            selectedQueType.name !== originalData.queOptionType ||
            JSON.stringify(currentOptions) !== JSON.stringify(originalData.options)
        );
    };

    const handleSave = async () => {
        const payload = {
            sectionId: sectionId,
            formatType: "plain question",
            title: title,
            metaDataId: metaDataId || null,
            questionConf: {
                question: {
                    sort: 1,
                    question: questionText,
                    queOptionType: selectedQueType.name,
                    queValidation: "required",
                    options: []
                }
            },
        };

        if (["Check-Box", "Check-Box Inline"].includes(selectedQueType.name)) {
            payload.questionConf.question.options = options
                .map(opt => ({ optionValues: opt.text.trim() }))
                .filter(opt => opt.optionValues !== "");
        } else if (["Radio", "Radio Inline"].includes(selectedQueType.name)) {
            payload.questionConf.question.options = radioOptions
                .map(opt => ({ optionValues: opt.text.trim() }))
                .filter(opt => opt.optionValues !== "");
        }


        try {
            if (question.metaDataId) {
                // Update existing question
                const response = await axios.put(
                    "http://localhost:8989/question-metadata/update-plainQuestion",
                    payload,
                    {
                        headers: { "Content-Type": "application/json" }
                    }
                );
                toast.success("Question updated successfully!", {
                    autoClose: 2000 // closes after 2000 milliseconds (2 seconds)
                });
                fetchSections();
            } else {
                // Save new question
                const response = await axios.post(
                    "http://localhost:8989/question-metadata/plainQuestion",
                    payload,
                    {
                        headers: { "Content-Type": "application/json" }
                    }
                );
                toast.success("Question saved successfully!")
                fetchSections();
            }
            const savedOptions =
                selectedQueType.name.includes("Radio")
                    ? radioOptions.map(opt => opt.text.trim())
                    : options.map(opt => opt.text.trim());

            setOriginalData({
                title,
                questionText,
                queOptionType: selectedQueType.name,
                options: savedOptions,
            });
        } catch (error) {
            console.error("Error saving/updating question:", error);
            alert("An error occurred while saving/updating.");
        }
    };

    const handleDeleteFromServer = async () => {
        if (!metaDataId) {
            deleteQuestion(blockId, questionId)
            return;
        }

        try {
            await axios.delete(`http://localhost:8989/question-metadata/${metaDataId}`);
            toast.success("Question deleted successfully!");
            fetchSections();
            // deleteQuestion(blockId, questionId); // This will remove the component from UI
        } catch (error) {
            console.error("Failed to delete question:", error);
        }
    }



    return (
        <div>
            {/* <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} /> */}
            <div className='mx-3 bg-[#FEDFC8] flex items-center justify-between'>
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
                    <Button className={isDataEdited() ? "text-[#2AC62A]" : "text-[#328EE4]"} onClick={handleSave}><FaSave /></Button>
                    <Button className="py-1 px-1 mx-3 text-sm text-gray-700 data-[hover]:text-gray-600" onClick={handleDeleteFromServer}><RiDeleteBinLine /></Button>
                </div>
            </div>
            <div className='mx-3 bg-[#EDEDED] grid grid-cols-4 items-start py-2'>
                <div className='col-span-3'>
                    <Field className="flex items-center gap-5 px-4">
                        <Input
                            className='w-full rounded-none border h-7 border-gray-400 bg-white py-1 px-1 text-xs text-gray-800 outline-none'
                            placeholder='Enter Question...'
                            value={questionText}
                            onChange={(e) => setQuestionText(e.target.value)}
                        />
                    </Field>
                </div>
                <div className='col-span-1 mx-10'>
                    <Listbox value={selectedQueType} onChange={setSelectedQueType}>
                        <div className="relative">
                            <ListboxButton className="w-full bg-white border-gray-500 h-7 font-normal border rounded-none py-1 px-1 text-sm flex items-center justify-between">
                                {selectedQueType.name}
                                <IoIosArrowDown className="text-black" />
                            </ListboxButton>
                            <ListboxOptions className="absolute z-50 w-3/4 mt-1 border border-gray-400 bg-white rounded-md shadow-md">
                                {queType.map((type) => (
                                    <ListboxOption
                                        key={type.id}
                                        value={type}
                                        className="cursor-pointer px-3 py-1.5 text-sm text-black hover:bg-gray-300"
                                    >
                                        {type.name}
                                    </ListboxOption>
                                ))}
                            </ListboxOptions>
                        </div>
                    </Listbox>
                </div>
            </div>
            <div className={`mx-3 bg-[#EDEDED] py-2 ${selectedQueType.name === "Check-Box" ? "flex items-end gap-3" : " "}`}>
                {selectedQueType.name === "Input Text" && (
                    <Field className="flex items-center gap-5 px-4">
                        <Input
                            className='w-4/5 rounded-none border h-7 border-gray-400 bg-white py-1 px-1 text-xs text-gray-800 outline-none' placeholder='Enter...' />
                    </Field>
                )}
                {selectedQueType.name === "Check-Box" && (
                    <>
                        <div>
                            {options.map((option, index) => (
                                <div key={option.id} className='flex items-center'>
                                    <Field className="flex items-center gap-2 px-4 mt-4">
                                        <Checkbox
                                            checked={option.checked}
                                            onChange={() => handleCheckboxChange(option.id)}
                                            className="group size-4 rounded-none bg-white"
                                        >
                                            <CheckIcon className="hidden size-4 fill-black group-data-[checked]:block" />
                                        </Checkbox>
                                        <Input
                                            className='w-72 rounded-none border h-6 border-gray-400 bg-white py-1 px-1 text-xs text-gray-800 outline-none'
                                            placeholder={`Option ${index + 1}...`}
                                            value={option.text}
                                            onChange={(e) => handleInputChange(option.id, e.target.value)}
                                        />
                                        <RiDeleteBinLine onClick={() => handleDeleteOption(option.id)} className="cursor-pointer text-red-500" />
                                    </Field>
                                </div>
                            ))}
                        </div>
                        <div className='flex justify-start px-4 py-1'>
                            <RiAddBoxLine className='text-blue-500 cursor-pointer' onClick={handleAddOption} />
                        </div>
                    </>
                )}
                {selectedQueType.name === "Check-Box Inline" && (
                    <>
                        <div className='flex items-center'>
                            {options.map((option, index) => (
                                <div key={option.id} className='flex items-center'>
                                    <Field className="flex items-center gap-2 px-4">
                                        <Checkbox
                                            checked={option.checked}
                                            onChange={() => handleCheckboxChange(option.id)}
                                            className="group size-4 rounded-none bg-white"
                                        >
                                            <CheckIcon className="hidden size-4 fill-black group-data-[checked]:block" />
                                        </Checkbox>
                                        <Input
                                            className='rounded-none border h-6 border-gray-400 bg-white py-1 px-1 text-xs text-gray-800 outline-none'
                                            placeholder={`Option ${index + 1}...`}
                                            value={option.text}
                                            onChange={(e) => handleInputChange(option.id, e.target.value)}
                                        />
                                        {options.length > 1 && (
                                            <RiDeleteBinLine onClick={() => handleDeleteOption(option.id)} className="cursor-pointer text-red-500" />
                                        )}
                                    </Field>
                                </div>
                            ))}
                        </div>
                        <div className='flex justify-start px-4 py-1'>
                            <RiAddBoxLine className='text-blue-500 cursor-pointer' onClick={handleAddOption} />
                        </div>
                    </>
                )}
                {selectedQueType.name === "Radio" && (
                    <div className="space-y-2 mx-6 flex items-end gap-4">
                        <div className=''>
                            {radioOptions.map((option, index) => (
                                <div key={option.id} className="flex items-center gap-2 mt-4">
                                    <input
                                        type="radio"
                                        name="radio-group"
                                        className="w-3 h-3 rounded-full appearance-none cursor-pointer checked:bg-gray-600 checked:border-gray-600 focus:ring-0 focus:outline-none"
                                        checked={selectedOption === option.id}
                                        onChange={() => setSelectedOption(option.id)}
                                    />
                                    <input
                                        type="text"
                                        className="w-72 rounded-none border h-6 border-gray-400 bg-white py-1 px-1 text-xs text-gray-800 outline-none"
                                        placeholder={`Option ${index + 1}...`}
                                        value={option.text}
                                        onChange={(e) => handleOptionChange(option.id, e.target.value)}
                                    />
                                    {radioOptions.length > 1 && (
                                        <button onClick={() => removeOption(option.id)} className="text-red-500">
                                            <RiDeleteBinLine className="cursor-pointer text-red-500" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div>
                            {radioOptions.length < MaxOption && (
                                <button onClick={addOption} className="text-blue-500 justify-start flex items-center ">
                                    <RiAddBoxLine className='text-blue-500 cursor-pointer' />
                                </button>
                            )}
                        </div>
                    </div>
                )}
                {selectedQueType.name === "Radio Inline" && (
                    <div className="space-y-2 mx-6">
                        <div className='flex items-center gap-6'>
                            {radioOptions.map((option, index) => (
                                <div key={option.id} className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="radio-group"
                                        className="w-3 h-3 rounded-full appearance-none cursor-pointer checked:bg-gray-600 checked:border-gray-600 focus:ring-0 focus:outline-none"
                                        checked={selectedOption === option.id}
                                        onChange={() => setSelectedOption(option.id)}
                                    />
                                    <input
                                        type="text"
                                        className="rounded-none border h-6 border-gray-400 bg-white py-1 px-1 text-xs text-gray-800 outline-none"
                                        placeholder={`Option ${index + 1}...`}
                                        value={option.text}
                                        onChange={(e) => handleOptionChange(option.id, e.target.value)}
                                    />
                                    {radioOptions.length > 1 && (
                                        <button onClick={() => removeOption(option.id)} className="text-red-500">
                                            <RiDeleteBinLine className="cursor-pointer text-red-500" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {radioOptions.length < MaxOption && (
                            <button onClick={addOption} className="text-blue-500 flex items-center mt-2">
                                <RiAddBoxLine className='text-blue-500 cursor-pointer' />
                            </button>
                        )}

                    </div>
                )}
            </div>
        </div>
    );
}

export default PlainQuestion;
