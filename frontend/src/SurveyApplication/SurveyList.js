
import { Button, Dialog, Field, Input, Label, Listbox, ListboxButton, ListboxOption, ListboxOptions, Popover, PopoverButton, PopoverPanel, Transition, Combobox, ComboboxOptions, ComboboxOption, ComboboxInput } from '@headlessui/react';
import React, { useEffect, useState } from 'react';
import { FaLongArrowAltLeft } from 'react-icons/fa';
import { FaPencil, FaPlus } from 'react-icons/fa6';
import { IoSettingsOutline } from 'react-icons/io5';
import { PiDotsThreeOutlineVerticalLight } from 'react-icons/pi';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { RxCross2 } from 'react-icons/rx';
import { FiFilter } from "react-icons/fi";
import { IoIosArrowDown } from 'react-icons/io';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Header from '../components/Header';

const statusOptions = [
    { id: 1, name: 'Draft' },
    { id: 2, name: 'Publish' },
    { id: 3, name: 'Inactive' },
];

function SurveyList() {
    const navigate = useNavigate();
    const [category, setCategory] = useState([]);
    const [subCat, setSubCat] = useState([]);
    const [addPopup, setAddPopUp] = useState(false);
    const [surveyList, setSurveyList] = useState([]);
    const [people, setPeople] = useState([])
    const [selectedSurveyId, setSelectedSurveyId] = useState('')
    const [selectedSurveyGroup, setSelectedSurveyGroup] = useState(null);
    const [users, setUsers] = useState([]);
    const [surveyData, setSurveyData] = useState({
        cat: null,
        subCatId: null,
        surveyName: "",
        startDate: "",
        endDate: "",
        status: "Draft",
        createdAt:'',
        createdBy:'',
        updatedBy:''
    });
    const [isSurveyEditing, setIsSurveyEditing] = useState(false)
    const [selectedSurvey, setSelectedSurvey] = useState(null);
    const [selectedSurveyData, setSelectedSurveyData] = useState(null);
    const location = useLocation();
    const empCode = location?.state?.empCode || '';
    const fetchPeople = () => {
        axios.get('http://localhost:8989/users/api')
            .then((res) => {
                setPeople(res.data);
            }).catch((err) => {
                console.log("error during fetching", err);
            });
    };

    const handleChange = (key, value) => {
        setSurveyData((prev) => ({
            ...prev,
            [key]: value,
            ...(key === "cat" ? { subCatId: null } : {}), // Reset sub-category when category changes
        }));
        if (key === "cat") {
            const selectedCategory = category.find(cat => cat.name === value);
            if (selectedCategory) {
                fetchSubCategory(selectedCategory.id);
            } else {
                setSubCat([]); // Reset sub-category if no valid category is selected
            }
        }
    };

    function handleAddSurveyList() {
        setAddPopUp(true);
    }

    function close() {
        setAddPopUp(false);
        setIsSurveyEditing(false);
        setSelectedSurvey(null);
        setSelectedSurveyGroup(null);
        setSelectedSurveyId(null);
        setSurveyData(prev => ({ ...prev, cat: null, subCat: null, subCatId: null, surveyName: "", startDate: "", endDate: "", status: "Draft", createdAt:'', createdBy:'', updatedBy:'' }));
    }

    function handleEdit(list) {
        setIsSurveyEditing(true);
        setSelectedSurvey(list.id)
        setSurveyData({
            cat: catDetails[subCatDetails[list.subCatId]?.catId]?.cat || "",
            subCat: subCatDetails[list.subCatId]?.subCat || "",
            subCatId: list.subCatId,
            surveyName: list.surveyName,
            startDate: list.startDate ? new Date(list.startDate).toISOString().split("T")[0] : "",
            endDate: list.endDate ? new Date(list.endDate).toISOString().split("T")[0] : "",
            status: list.status || "Draft",
            createdAt: list.createdAt,
            createdBy: list.createdBy,
        });
        setAddPopUp(true);
    }
    const [subCatDetails, setSubCatDetails] = useState({});
    const [catDetails, setCatDetails] = useState({});

    const fetchSurveyList = async () => {
        try {
            const res = await axios.get("http://localhost:8989/survey-new");
            // const response = res.data.filter(res => new Date(res.endDate).getTime() > new Date().getTime());
            setSurveyList(res.data.data);
            const subCatMap = {};
            const catMap = {};

            await Promise.all(res.data.data.map(async (survey) => {
                try {
                    const subCatRes = await axios.get(`http://localhost:8989/survey-sub-category/${survey.subCatId}/sub-cat-id`);
                    subCatMap[survey.subCatId] = subCatRes.data.data;

                    if (!catMap[subCatRes.data.catId]) {
                        const catRes = await axios.get(`http://localhost:8989/survey-cat/${subCatRes.data.data.catId}`);
                        catMap[subCatRes.data.data.catId] = catRes.data.data;
                    }
                } catch (err) {
                    console.error(`Error fetching sub-category for survey ${survey.id}`, err);
                }
            }));

            setSubCatDetails(subCatMap);
            setCatDetails(catMap);
        } catch (err) {
            console.error("Error fetching surveys", err);
        }
    };

    const fetchCategory = () => {
        axios.get("http://localhost:8989/survey-cat/getCategoryList")
            .then((res) => {
                setCategory(res.data.data);
            }).catch((err) => {
                console.log("Error during fetching", err);
            });
    }

    const fetchSubCategory = (catId) => {
        axios.get(`http://localhost:8989/survey-sub-category/${catId}`)
            .then((res) => {
                setSubCat(res.data);
            }).catch((err) => {
                console.log("Error during fetching", err);
            })
    }

    useEffect(() => {
        fetchSurveyList();
        if (addPopup) {
            fetchCategory();
        }
        fetchSubCategory();
        fetchPeople();
    }, [addPopup])

    const handleSave = () => {
        // const formattedData = {
        //     ...surveyData,
        //     startDate: surveyData.startDate ? new Date(surveyData.startDate).toISOString() : null,
        //     endDate: surveyData.endDate ? new Date(surveyData.endDate).toISOString() : null,
        // };
        // if (Object.values(formattedData).some(value => value === null || value === "")) {
        //     alert("Fill the required fields");
        //     return;
        // }
        const formattedData = {
            ...surveyData,
            startDate: surveyData.startDate ? new Date(surveyData.startDate).toISOString() : null,
            endDate: surveyData.endDate ? new Date(surveyData.endDate).toISOString() : null,
            ...(isSurveyEditing ? {updatedBy: empCode} : 
                {createdBy: empCode }
            )};
        // List of required fields to validate
        const requiredFields = ['cat', 'subCatId', 'surveyName', 'startDate', 'endDate', 'status'];
    
        // Check if any required field is null or empty
        const hasEmptyRequiredField = requiredFields.some(
            key => !formattedData[key] || formattedData[key].toString().trim() === ""
        );
    
        if (hasEmptyRequiredField) {
            alert("Fill the required fields");
            return;
        }
        const url = isSurveyEditing ? `http://localhost:8989/survey-new/${selectedSurvey}` : 'http://localhost:8989/survey-new'
        const method = isSurveyEditing ? 'put' : 'post';
        axios[method](url, formattedData)
            .then(() => {
                fetchSurveyList();
                close();
            }).catch((err) => {
                console.log("Error during posting", err)
            })
    }

    const handleDeleteSurvey = (id) => {
        axios.delete(`http://localhost:8989/survey-new/${id}`)
            .then(() => {
                fetchSurveyList();
            }).catch((err) => {
                console.log("Error during delete", err);
            });
    };

    const [selectedPerson, setSelectedPerson] = useState(null)
    const [query, setQuery] = useState('')

    const filteredPeople =
        query === ''
            ? []
            : people.filter((person) => {
                return (
                    person.firstName.toLowerCase().includes(query.toLowerCase()) ||
                    person.userId.toString().includes(query) ||
                    person.lastName.toLowerCase().includes(query.toLowerCase())
                );
            });

    const getUsers = (list) => {
        setSelectedSurveyGroup(true);
        setSelectedSurveyId(list.id);
        setSelectedSurveyData(list)
        axios.get(`http://localhost:8989/survey-users-list/${list.id}/surveyId`)
            .then((res) => {
                const userGroupData = res.data.data; // This contains additional user-group-member fields
                // Fetch full user details for each userId
                return Promise.all(userGroupData.map(user =>
                    axios.get(`http://localhost:8989/users/api/${user.surveyUsersPKey.userId}`)
                        .then(response => ({
                            ...response.data,  // Full user details
                            ...user  // Include original user-group-member fields
                        }))
                ));
            })
            .then((userDetails) => {
                setUsers(userDetails);
            })
            .catch((err) => {
                console.log("Error during fetching users", err);
            });
    };

    const handleAddUser = (selectedPerson) => {
        if (!selectedPerson || !selectedSurveyId) {
            alert("Please select a user and a group.");
            return;
        }
        const userExists = users.some(user => user.userId === selectedPerson.userId);
        if (userExists) {
            alert("User already exists in this Survey List.");
            return;
        }
        axios.post('http://localhost:8989/survey-users-list', {
            surveyUsersPKey: {
                surveyId: selectedSurveyId,
                userId: selectedPerson.userId
            }
        })
            .then((res) => {
                setUsers(prevUsers => [...prevUsers, selectedPerson]);
                setSelectedPerson(null);
            }).catch((error) => {
                console.log("error during posting", error);
            });
    };

    const handleSurveyBuilder = () => {
        navigate('/survey-builder', { state: { data: selectedSurveyData } });
    };

    return (
          <><Header /><div className='mt-20 h-screen'>

            <Navbar />
            <div className='flex items-center gap-6 mx-4 mt-5 pb-5 '>
                <Button className="rounded-full bg-gray-700 py-1 px-1 text-sm/6 text-white data-[hover]:bg-gray-600" onClick={() => { navigate("/survey"); setSelectedSurveyGroup(null); setSelectedSurveyId(null); } }><FaLongArrowAltLeft /></Button>
                <h1 className='text-blue-400 font-bold text-base'>Survey Table</h1>
            </div>
            <div className='border-t border-gray-400 pb-6'></div>
            <div className='grid grid-cols-4 mx-12'>
                <div className='col-span-3'>
                    <div className='mx-4'>
                        <div className='justify-between flex mx-1 text-xl text-gray-800 pb-3'>
                            <FiFilter className='text-[#3AA1FF]' />
                            <div className='flex items-center gap-7'>
                                {selectedSurveyGroup && (
                                    <Button className="text-sm font-semibold text-white px-2 bg-[#3AA1FF]" onClick={handleSurveyBuilder}>Survey Form</Button>
                                )}
                                <FaPlus className='text-white bg-[#3AA1FF]' onClick={() => handleAddSurveyList()} />
                            </div>
                        </div>
                        <Transition appear show={addPopup}>
                            <Dialog as='div' className='relative z-10' onClose={close}>
                                <Transition.Child enter='ease-out duration-200' enterFrom='opacity-0 scale-95' enterTo='opacity-100 scale-100' leave='ease-in duration-100' leaveFrom='opacity-100 scale-100' leaveTo='opacity-0 scale-95'>
                                    <div className='fixed inset-0 bg-black bg-opacity-50' />
                                </Transition.Child>
                                <div className='fixed inset-0 flex items-center justify-center'>
                                    <Dialog.Panel className='w-full max-w-md rounded-lg shadow-xl'>
                                        <div className='bg-[#3AA1FF] flex items-center justify-between px-4 py-3'>
                                            <h1 className='text-white font-semibold'>{isSurveyEditing ? 'Edit the fields' : 'Enter the fields'}</h1>
                                            <Button className="text-xl font-semibold text-white" onClick={() => close()}>
                                                <RxCross2 />
                                            </Button>
                                        </div>
                                        <div className='grid grid-cols-2 py-2 pb-3 bg-[#F1F1F1] items-center'>
                                            <div className=' mx-5'>
                                                <Listbox value={surveyData.cat} onChange={(value) => handleChange("cat", value.name)}>
                                                    <Label className="text-sm font-medium text-black">Category</Label>
                                                    <ListboxButton
                                                        className={`flex items-center w-full  border-gray-500 border rounded-md py-1.5 justify-between px-1 text-sm ${surveyData.cat ? 'text-black bg-white' : 'text-gray-500 bg-gray-200'}`}>
                                                        {surveyData.cat || "Select Category"}
                                                        <IoIosArrowDown className="text-black" />
                                                    </ListboxButton>
                                                    <ListboxOptions
                                                        anchor="bottom"
                                                        transition
                                                        className='w-[var(--button-width)] rounded-md border border-grey-400 bg-white p-1 transition duration-100 ease-in '>
                                                        {category.map((cat) => (
                                                            <ListboxOption
                                                                key={cat.id}
                                                                value={cat}
                                                                className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-gray-300"
                                                                onClick={() => handleChange("cat", cat.name)}
                                                            >
                                                                <div className="text-sm text-black">{cat.name}</div>
                                                            </ListboxOption>
                                                        ))}
                                                    </ListboxOptions>
                                                </Listbox>
                                            </div>
                                            <div className=' mx-5'>
                                                <Listbox value={surveyData.subCat} onChange={(value) => handleChange("subCat", value.name)}>
                                                    <Label className="text-sm font-medium text-black">Sub Category</Label>
                                                    <ListboxButton
                                                        className={`flex items-center w-full bg-grey-200 border-gray-500 border rounded-md py-1.5 justify-between px-1 text-sm ${surveyData.subCatId ? 'text-black bg-white' : 'text-gray-500 bg-gray-200'}`}>
                                                        {surveyData.subCat || "Select Sub Category"}
                                                        <IoIosArrowDown className="text-black" />
                                                    </ListboxButton>
                                                    <ListboxOptions
                                                        anchor="bottom"
                                                        transition
                                                        className='w-[var(--button-width)] rounded-md border border-gray-400 bg-white p-1 transition duration-100 ease-in '>
                                                        {subCat.map((sub) => (
                                                            <ListboxOption
                                                                key={sub.id}
                                                                value={sub}
                                                                className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-gray-300"
                                                                onClick={() => handleChange("subCatId", sub.id)}
                                                            >
                                                                <div className="text-sm text-black">{sub.name}</div>
                                                            </ListboxOption>
                                                        ))}
                                                    </ListboxOptions>
                                                </Listbox>
                                            </div>
                                            <div className='mt-3 mx-5'>
                                                <Field>
                                                    <Label className="text-sm font-medium text-black">Survey Name</Label>
                                                    <Input
                                                        className={(
                                                            'mt-2 border border-gray-500 text-sm/6 w-full rounded-md bg-white py-1 px-1 text-gray-800 '
                                                        )}
                                                        placeholder='Survey Name... '
                                                        value={surveyData.surveyName}
                                                        onChange={(e) => handleChange("surveyName", e.target.value)} />
                                                </Field>
                                            </div>
                                            <div className='mt-3 mx-5'>
                                                <Field>
                                                    <Label className="text-sm font-medium text-black">Start Date</Label>
                                                    <Input type='date'
                                                        className={(
                                                            'mt-2 border border-gray-500 text-sm/6 w-full rounded-md bg-white py-1 px-1 text-gray-800 '
                                                        )}
                                                        min={new Date().toISOString().split("T")[0]}
                                                        placeholder='Survey Name... '
                                                        value={surveyData.startDate}
                                                        onChange={(e) => handleChange("startDate", e.target.value)} />
                                                </Field>
                                            </div>
                                            <div className='mt-3 mx-5'>
                                                <Field>
                                                    <Label className="text-sm font-medium text-black">End Date</Label>
                                                    <Input type='date'
                                                        className={(
                                                            'mt-2 border border-gray-500 text-sm/6 w-full rounded-md bg-white py-1 px-1 text-gray-800 '
                                                        )}
                                                        disabled={!surveyData.startDate}
                                                        value={surveyData.endDate}
                                                        min={new Date().toISOString().split("T")[0]}
                                                        onChange={(e) => {
                                                            const selectedEndDate = e.target.value;
                                                            if (surveyData.startDate && selectedEndDate < surveyData.startDate) {
                                                                alert("End Date cannot be before Start Date.");
                                                            } else {
                                                                handleChange("endDate", selectedEndDate);
                                                            }
                                                        } } />
                                                </Field>
                                            </div>
                                            <div className='mt-3 mx-5'>
                                                <Listbox value={surveyData.status} onChange={(value) => handleChange("status", value.name)}>
                                                    <Label className="text-sm font-medium text-black">Status</Label>
                                                    <ListboxButton
                                                        className={`flex items-center w-full  border-gray-500 border rounded-md py-1.5 justify-between px-1 text-sm ${surveyData.status ? 'text-black bg-white' : 'text-gray-500 bg-gray-200'}`}>
                                                        {surveyData.status}
                                                        <IoIosArrowDown className="text-black" />
                                                    </ListboxButton>
                                                    <ListboxOptions
                                                        anchor="bottom"
                                                        transition
                                                        className='w-[var(--button-width)] rounded-md border border-grey-400 bg-white p-1 transition duration-100 ease-in '>
                                                        {statusOptions.map((status) => (
                                                            <ListboxOption
                                                                key={status.id}
                                                                value={status}
                                                                className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-gray-300"
                                                                onClick={() => handleChange("status", status.name)}
                                                            >
                                                                <div className="text-sm text-black">{status.name}</div>
                                                            </ListboxOption>
                                                        ))}
                                                    </ListboxOptions>
                                                </Listbox>
                                            </div>
                                        </div>
                                        <div className='border-t bg-[#F1F1F1] border-gray-400 py-2 text-right'>
                                            <Button className="items-center rounded-md bg-[#3AA1FF] py-1 px-4 mx-8 text-sm/6 font-semibold text-white data-[hover]:bg-blue-500" onClick={handleSave}>
                                                Save
                                            </Button>
                                        </div>
                                    </Dialog.Panel>
                                </div>
                            </Dialog>
                        </Transition>
                        <div className='w-full overflow-x-auto'>
                            <table className='table-fixed w-full border-collapse border border-gray-400 min-w-[800px]'>
                                <thead className='bg-gray-300 text-[#434242] text-sm'>
                                    <tr>
                                        <th className='border border-gray-400 py-1 text-center w-16 font-medium'>#</th>
                                        <th className='border border-gray-400 py-1 text-center font-medium'>Survey Name</th>
                                        <th className='border border-gray-400 py-1 text-center font-medium'>Category</th>
                                        <th className='border border-gray-400 py-1 text-center font-medium'>Sub Category</th>
                                        <th className='border border-gray-400 py-1 text-center font-medium'>Start Date</th>
                                        <th className='border border-gray-400 py-1 text-center font-medium'>End Date</th>
                                        <th className='border border-gray-400 py-1 text-center font-medium'>Status</th>
                                        <div className='flex justify-center'>
                                            <th className='py-1 font-medium'><IoSettingsOutline /></th>
                                        </div>
                                    </tr>
                                </thead>
                                <tbody>
                                    {surveyList.map((list) => (
                                        <tr key={list.id} className={` text-center text-xs py-1 cursor-pointer ${selectedSurveyId === list.id ? 'bg-blue-100 ' : 'hover:bg-gray-100'}`} onClick={() => getUsers(list)}>
                                            <td className={`border border-gray-400 `}>{list.surveyNo}</td>
                                            <td className={`border border-gray-400  cursor-pointer ${selectedSurveyId === list.id ? 'font-bold underline' : ''}`}>{list.surveyName}</td>
                                            <td className={`border border-gray-400 `}>{catDetails[subCatDetails[list.subCatId]?.catId]?.cat || "Loading..."}</td>
                                            <td className={`border border-gray-400 `}>{subCatDetails[list.subCatId]?.subCat || "Loading..."}</td>
                                            <td className={`border border-gray-400 `}>{new Date(list.startDate).toLocaleDateString("en-GB")}</td>
                                            <td className={`border border-gray-400 `}>{new Date(list.endDate).toLocaleDateString("en-GB")}</td>
                                            <td className={`border border-gray-400 `}>{list.status}</td>
                                            <td className='border border-gray-400 px-4'>
                                                <div className='flex justify-center text-base'>
                                                    <Popover>
                                                        <PopoverButton className=''>
                                                            <PiDotsThreeOutlineVerticalLight />
                                                        </PopoverButton>
                                                        <PopoverPanel
                                                            transition
                                                            anchor="right"
                                                            className={('bg-white shadow-xl border border-gray-200 text-sm mt-[2px] transition duration-200 ease-in-out [--anchor-gap:var(--spacing-5)] data-[closed]:-translate-y-1 data-[closed]:opacity-0')}
                                                        >
                                                            <div className=" items-center flex gap-2">
                                                                <button className="py-1 flex px-3 transition" href="#" title='Edit' onClick={() => handleEdit(list)}><FaPencil /></button>
                                                                <button className="py-1 flex px-3 transition" href="#" title='Delete' onClick={() => handleDeleteSurvey(list.id)}><RiDeleteBin6Line /></button>
                                                            </div>
                                                        </PopoverPanel>
                                                    </Popover>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className='mt-8 col-span-1'>
                    {(selectedSurveyGroup && (
                        <div className='mx-8 flex gap-10'>
                            <Combobox value={selectedPerson} onChange={setSelectedPerson} onClose={() => setQuery('')}>

                                <ComboboxInput
                                    className={('rounded-lg border border-[#B6B5B5] bg-gray-100 py-1.5 px-3 text-sm text-gray-800 ')}
                                    placeholder='Add User...'
                                    displayValue={(person) => person ? `${person.firstName || ''} ${person.lastName || ''}`.trim() : ''}
                                    onChange={(event) => setQuery(event.target.value)} />
                                {filteredPeople.length > 0 && (
                                    <ComboboxOptions anchor="bottom" className={`w-[var(--input-width)] border border-gray-300 shadow-xl bg-gray-100 mt-1 overflow-y-auto ${filteredPeople.length > 4 ? 'h-36' : 'h-auto'}`}>
                                        {filteredPeople.map((person) => (
                                            <ComboboxOption key={person.id} value={person} className="group flex cursor-default items-center text-md gap-2 py-1.5 px-3 data-[focus]:bg-gray-300">
                                                {person.firstName} {person.lastName}
                                            </ComboboxOption>
                                        ))}
                                    </ComboboxOptions>
                                )}

                            </Combobox>
                            <Button className="rounded-md bg-[#3E3E3E] py-1.5 px-3 text-sm font-semibold text-white shadow-inner shadow-white/10 " onClick={() => handleAddUser(selectedPerson)}>Add</Button>
                        </div>
                    ))}
                    <div className='mx-6'>
                        <table className='w-full border mt-4 border-gray-400'>
                            {selectedSurveyGroup && (
                                <thead className='bg-gray-300 text-[#1E1E1E]'>
                                    <tr>
                                        <th className='border border-gray-400 text-sm py-1 w-1/2 text-centerfont-semibold'>Username(s)</th>
                                        <div className='flex justify-center text-text-sm'>
                                            <th className='py-1 text-black'><IoSettingsOutline /></th>
                                        </div>
                                    </tr>
                                </thead>
                            )}
                            {selectedSurveyGroup && users.length > 0 ?
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id} className='hover:bg-gray-100 text-center'>
                                            <td className='border border-gray-400 px-4 py-1 text-nowrap text-xs'>{user.firstName} {user.lastName}</td>
                                            <td className='border border-gray-400 px-4 py-1 text-center'>
                                                <div className='flex justify-center'>
                                                    <Button><RiDeleteBin6Line /></Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                : selectedSurveyGroup ? (
                                    <tr>
                                        <td colSpan="3" className="text-center py-1 text-sm border border-gray-400 text-gray-500">
                                            Add Users
                                        </td>
                                    </tr>) : ''}
                        </table>
                    </div>

                </div>
            </div>
        </div></>
    );
}

export default SurveyList;
