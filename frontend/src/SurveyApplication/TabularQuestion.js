import React, { useEffect, useState } from 'react';
import { Field, Input, Label, Button } from '@headlessui/react';
import { RiDeleteBinLine } from "react-icons/ri";
import { FaSave } from 'react-icons/fa';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function TabularQuestion({ blockId, index, questionId, deleteQuestion , sectionId , question , fetchSections}) {

    const [title, setTitle] = useState('');
    const [columns, setColumns] = useState([]);
    const [rows, setRows] = useState([]);
    const [columnInput, setColumnInput] = useState('');
    const [rowInput, setRowInput] = useState('');
    const [metaDataId, setMetaDataId] = useState('');
    
console.warn(question,"question")
    const addColumn = () => {
        if (columnInput.trim() !== '') {
            setColumns([...columns, columnInput.trim()]);
            setColumnInput('');
        }
    };

    const addRow = () => {
        if (rowInput.trim() !== '') {
            setRows([...rows, { title: rowInput.trim(), values: Array(columns.length).fill('') }]);
            setRowInput('');
        }
    };

    const handleCellChange = (rowIndex, colIndex, value) => {
        const newRows = [...rows];
        newRows[rowIndex].values[colIndex] = value;
        setRows(newRows);
    };

    const deleteRow = (rowIndex) => {
        setRows(rows.filter((_, index) => index !== rowIndex));
    };

    const deleteColumn = (colIndex) => {
        setColumns(columns.filter((_, index) => index !== colIndex));
        setRows(rows.map(row => ({
            ...row,
            values: row.values.filter((_, index) => index !== colIndex)
        })));
    };

    useEffect(()=>{
        if (question?.questionConf) {
            const data = JSON.parse(question.questionConf);
            setTitle(question.title);
            setColumns(data.columns.map(col => col.question.question));
            setRows(data.rows.map(row => ({ title: row.name, values: [] })));
            setMetaDataId(question.metaDataId)
          }
    },[])

    const submitTabularQuestion = async () => {
        const payload = {
            sectionId: sectionId,
            formatType: "tabular",
            title,
            metaDataId,
            questionConf: {
                columns: columns.map((col, idx) => ({
                    name: col,
                    sort: idx + 1,
                    question: {
                        sort: 1,
                        question: col,
                        queOptionType: "",
                        queValidation: "",
                        questionOptions: {
                            sort: 1,
                            placeholder: "",
                            optionLabel: "",
                            optionValues: "",
                            optionDefault: ""
                        }
                    }
                })),
                rows: rows.map((row, idx) => ({
                    name: row.title,
                    sort: idx + 1
                }))
            }
        };

        try {
            if(question.metaDataId){
                const response = await axios.put('http://localhost:8989/question-metadata/update-question', payload);
            fetchSections();
            toast.success("Data updated successfully");
            }else{
                const response = await axios.post('http://localhost:8989/question-metadata/question', payload);
                fetchSections();
                toast.success("Data saved successfully");
            }
        } catch (error) {
            console.error("Error saving data", error);
            toast.error("Failed to save data");
        }
    };

    const deleteTabularColumnQuestion = async() => {
        if (!metaDataId){
            deleteQuestion(blockId, questionId);
            return;
        }
        try {
            await axios.delete(`http://localhost:8989/question-metadata/${metaDataId}`)
            toast.success("Question deleted successfully!")
            fetchSections();
        } catch (error) {
            console.log("Failed to delete the question",error)
            toast.error("An error occurred while deleting.")
        }
    }

    return (
        <div>
            {/* <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} /> */}
            <div className='mx-3 bg-[#CBFED6] flex items-center justify-between'>
                <div className=''>
                    <Field className="flex items-center gap-5 px-4 py-1.5">
                        <Label className="text-xs">{index+1} Title</Label>
                        <Input
                            className='rounded-none border h-5 border-gray-400 bg-white py-1 px-1 text-xs text-gray-800 outline-none'
                            placeholder='Enter Title...'
                            value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        />
                    </Field>
                </div>
                <div>
                    <Button className='text-gray-700' onClick={submitTabularQuestion}><FaSave /></Button>
                    <Button className="py-1 px-1 mx-3 text-base text-gray-700 data-[hover]:text-gray-600" onClick={deleteTabularColumnQuestion}><RiDeleteBinLine /></Button>
                </div>
            </div>
            <div className='mx-3 bg-[#F1F1F1] p-3'>
                <div className=' bg-white'>
                    <div className='flex items-center'>
                        <Field className="flex items-center gap-5 px-4 py-1.5">
                            <Input
                                className='rounded-none border h-6 border-gray-400 bg-white py-1 px-1 text-sm text-gray-800 outline-none'
                                placeholder='Column Title...'
                                value={columnInput}
                                onChange={(e) => setColumnInput(e.target.value)}
                            />
                            <Button className='bg-[#434242] px-3 py-[1px] text-sm border border-[#A7A6A6] hover:bg-[#666464] rounded-md text-white' onClick={addColumn}>Add Column</Button>
                        </Field>
                        <Field className="flex items-center gap-5 px-4 py-1.5">
                            <Input
                                className='rounded-none border h-6 border-gray-400 bg-white py-1 px-1 text-sm text-gray-800 outline-none'
                                placeholder='Row Title...'
                                value={rowInput}
                                onChange={(e) => setRowInput(e.target.value)}
                            />
                            <Button className='bg-[#434242] px-3 py-[1px] text-sm border border-[#A7A6A6] hover:bg-[#666464] rounded-md text-white' onClick={addRow}>Add Row</Button>
                        </Field>
                    </div>
                    <div className='overflow-x-auto'>
                        <table className={`${columns.length > 0 ? "border-collapse border border-gray-300" : ""} mx-4 w-min-[450px]`}>
                            <thead>
                                <tr className='bg-gray-200'>
                                    <th className=''></th>
                                    {columns.map((col, index) => (
                                        <th key={index} className='border border-gray-300 font-semibold px-3 py-1'>{col}
                                        <button className='text-red-400 hover:text-red-500 text-xs float-end' onClick={() => deleteColumn(index)}>
                                            <RiDeleteBinLine />
                                        </button></th>
                                    ))}
                                    <th className='border border-gray-300 text-sm font-semibold px-3 py-1'>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, rowIndex) => (
                                    <tr key={rowIndex} className='text-center'>
                                        <td className='border w-36 border-gray-300 px-3 font-semibold py-1 break-all'>{row.title}</td>
                                        {columns.map((_, colIndex) => (
                                            <td key={colIndex} className='border border-gray-300 px-3 py-1'>
                                                <input
                                                    type='text'
                                                    className='border border-gray-300 outline-none h-6 px-2 py-1 bg-[#F3F9FF]'
                                                    value={row.values[colIndex]}
                                                    onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                                                />
                                            </td>
                                        ))}
                                        <td className='border border-gray-300 px-3 py-1'>
                                            <button className='text-red-500 hover:text-red-700' onClick={() => deleteRow(rowIndex)}>
                                                <RiDeleteBinLine />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TabularQuestion;