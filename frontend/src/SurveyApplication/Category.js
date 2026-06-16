

import React, { useEffect, useState } from 'react';
import { Button, Field, Input, Popover, PopoverButton, PopoverPanel, Dialog, Transition, RadioGroup, Listbox, ListboxButton, ListboxOptions, ListboxOption, Label } from '@headlessui/react';
import { FaLongArrowAltLeft } from "react-icons/fa";
import { IoSettingsOutline, IoAddCircleOutline } from "react-icons/io5";
import axios from 'axios';
import { PiDotsThreeOutlineVerticalLight } from "react-icons/pi";
import { RxDotFilled, RxCross2 } from "react-icons/rx";
import { FaPencil } from "react-icons/fa6";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoIosArrowDown } from "react-icons/io";
import Navbar from './Navbar';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';


// const people = [
//     { id: 1, name: 'Tom Cook' },
//     { id: 2, name: 'Wade Cooper' },
//     { id: 3, name: 'Tanya Fox' },
//     { id: 4, name: 'Arlene Mccoy' },
//     { id: 5, name: 'Devon Webb' },
// ]

function Categorys() {
    // const [selected, setSelected] = useState(null)
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('null')
    const [createdAt, setCreatedAt] = useState('');
    const [employeeId,setEmployeeId] = useState('');
    const [selectedSubStatus, setSelectedSubStatus] = useState('null')
    const [addCatPopup, setAddCatPopup] = useState(false)
    const [isCatEditing, setIsCatEditing] = useState(false);
    const [isSubCatEditing, setIsSubCatEditing] = useState(false);
    const [newCategory, setNewCategory] = useState('');
    const [selectedId, setSelectedId] = useState(null);
    const [selectedSubCatId, setSelectedSubCatId] = useState(null);
    const [addSubCatPopup, setAddSubCatPopup] = useState(false)
    const [newSubCategory, setNewSubCategory] = useState('');
    const [subCatCreatedBy,setSubCatCreatedBy] = useState('');
    const [subCatCreatedAt,setSubCatCreatedAt] = useState('');
    const location = useLocation();
    const empCode = location?.state?.empCode || "";

    useEffect(() => {
        fetchCategory();
        const fetchSubCategory = () => {
            axios.get(`http://localhost:8989/survey-sub-category/${selectedCategory.id}/catId`)
                .then((res) => {
                    setSubCategories(res.data.data);
                }).catch((err) => {
                    console.log("Error during fetching", err)
                })

        }
        if (selectedCategory) {
            fetchSubCategory();
        }
    }, [selectedCategory]);

    const fetchCategory = () => {
        axios.get('http://localhost:8989/survey-cat')
            .then((res) => {
                setCategories(res.data.data);
            }).catch((err) => {
                console.log("Error during fetching", err);
            });
    }

    const handleEdit = (category) => {
        setSelectedId(category.id);
        setNewCategory(category.cat);
        setSelectedStatus(category.status);
        setCreatedAt(category.createdAt);
        setEmployeeId(category.createdBy);
        setIsCatEditing(true);
        setAddCatPopup(true);
    };


    const handleSubCatEdit = (subCategory) => {
        setIsSubCatEditing(true);
        setAddSubCatPopup(true);
        setNewSubCategory(subCategory.subCat);
        setSelectedSubStatus(subCategory.status);
        setSelectedSubCatId(subCategory.id);
        setSubCatCreatedAt(subCategory.createdAt);
        setSubCatCreatedBy(subCategory.createdBy)
    }

    const handleSave = () => {
        if (!newCategory?.trim() || !selectedStatus) {
            alert("Fill the required field.");
            return;
        }
        const url = isCatEditing ? `http://localhost:8989/survey-cat/${selectedId}` : 'http://localhost:8989/survey-cat';
        const method = isCatEditing ? 'put' : 'post';

        const payload = {
            cat: newCategory,
            status: selectedStatus,
            ...(isCatEditing
                ? { updatedBy: empCode, createdAt: createdAt , createdBy: employeeId}
                : {createdBy: empCode,}
            )
        };

        axios[method](url, payload)
            .then((res) => {
                close();
                fetchCategory();
            })
            .catch((err) => console.log(`Error during ${isCatEditing ? "updating" : "adding"}`, err));
    };

    function handleAddCat() {
        setAddCatPopup(true);
        setIsCatEditing(false)
        setNewCategory('');
        setSelectedStatus('')
    }

    function close() {
        setAddCatPopup(false);
        setNewCategory('');
        setSelectedStatus('')
        setCreatedAt('');
        setEmployeeId('');
        setSubCatCreatedAt('');
        setSubCatCreatedBy('');
    }

    const handleCatDelete = (id) => {
        axios.delete(`http://localhost:8989/survey-cat/${id}`)
            .then(() => {
                setCategories((prevCategories) => prevCategories.filter(cat => cat.id !== id));
                if (selectedCategory?.id === id) {
                    setSelectedCategory(null);
                    setSubCategories([]);
                }
            }).catch((err) => {
                console.error("Error during delete", err);
                alert("You cannot delete this Category because it has SubCategories.");
            });
    }

    function handleAddSubCat() {
        setAddSubCatPopup(true);
        setIsSubCatEditing(false);
        setNewSubCategory('');
        setSelectedSubStatus('')
    }

    function closeSubCat() {
        setAddSubCatPopup(false);
        setIsSubCatEditing(false);
        setNewSubCategory('');
        setSelectedSubStatus('')
    }

    const handleSubCatSave = () => {
        if (!newSubCategory?.trim() || !selectedSubStatus) {
            alert("Fill the required field.");
            return;
        }
        const url = isSubCatEditing
            ? `http://localhost:8989/survey-sub-category/${selectedSubCatId}`
            : 'http://localhost:8989/survey-sub-category';
        const method = isSubCatEditing ? 'put' : 'post';
        const payload ={
            subCat: newSubCategory,
            status: selectedSubStatus,
            catId: selectedCategory?.id,
            ...(isSubCatEditing? 
                {createdBy: subCatCreatedBy, createdAt: subCatCreatedAt, updatedBy: empCode}:
                {createdBy: empCode}
            )
        }
        axios[method](url, payload)
            .then((res) => {
                if (isSubCatEditing) {
                    setSubCategories((prevSubCategories) =>
                        prevSubCategories.map((sub) =>

                            sub.id === selectedSubCatId ? { ...sub, subCat: newSubCategory, status: selectedSubStatus } : sub));
                } else {
                    setSubCategories((prevSubCategories) => [...prevSubCategories, res.data.data]);
                }
                closeSubCat();
            })
            .catch((err) => console.log(`Error during ${isSubCatEditing ? "updating" : "adding"}`, err));
    };

    const handleSubCatDelete = (id) => {
        axios.delete(`http://localhost:8989/survey-sub-category/${id}`)
            .then(() => {
                setSubCategories((prevSubCategories) => prevSubCategories.filter(sub => sub.id !== id));
            }).catch((err) => {
                console.log("Error during delete", err);
            });
    }
    const navigate = useNavigate();

    return (
        <><Header /><div>
            <div className='mt-20 h-screen'><Navbar />
            <div className='flex items-center gap-6 mx-4 mt-5 pb-5 '>
                <Button className="rounded-full bg-gray-700 py-1 px-1 text-sm/6 text-white data-[hover]:bg-gray-600" onClick={() => navigate("/survey")}><FaLongArrowAltLeft /></Button>
                <h1 className='text-blue-400 font-bold text-base'>Master Category - Sub Category</h1>
            </div>
            <div className='border-b border-gray-300 mb-4'></div>
            <div className='grid grid-cols-2 gap-10 items-start mx-16 mt-4'>
                <div className='mx-4'>
                    <div className='justify-end flex text-2xl cursor-pointer text-gray-800 pb-3'>
                        <IoAddCircleOutline onClick={() => handleAddCat()} />
                    </div>
                    <Transition appear show={addCatPopup}>
                        <Dialog as='div' className='relative z-10' onClose={close}>
                            <Transition.Child enter='ease-out duration-300' enterFrom='opacity-0 scale-95' enterTo='opacity-100 scale-100' leave='ease-in duration-200' leaveFrom='opacity-100 scale-100' leaveTo='opacity-0 scale-95'>
                                <div className='fixed inset-0 bg-black bg-opacity-50' />
                            </Transition.Child>
                            <div className='fixed inset-0 flex items-center justify-center'>
                                <Dialog.Panel className='w-full max-w-md rounded-lg shadow-xl'>

                                    <div className='bg-[#3AA1FF] flex items-center justify-between px-4 py-3'>
                                        <h1 className='text-white font-semibold'>{isCatEditing ? 'Category : : Edit' : 'Category : : Add'}</h1>
                                        <Button className="text-xl font-semibold text-white" onClick={() => close()}>
                                            <RxCross2 />
                                        </Button>
                                    </div>
                                    <div className='bg-[#F1F1F1] pb-2'>
                                        <Field>
                                            <Input
                                                className={(
                                                    'mt-3 border border-gray-400 mx-5 text-sm/6 w-3/5 rounded-lg bg-white py-1 px-3 text-gray-800 '
                                                )}
                                                placeholder='Category ... '
                                                value={newCategory}
                                                onChange={(e) => setNewCategory(e.target.value)} />
                                        </Field>
                                        <h1 className='mx-5 mt-3 text-base font-semibold text-gray-800'>Status :</h1>
                                        <RadioGroup value={selectedStatus} onChange={setSelectedStatus} className="mx-5 mt-2">
                                            <div className="flex items-center space-x-4">
                                                <RadioGroup.Option value="Active" className="flex items-center">
                                                    {({ checked }) => (
                                                        <>
                                                            <div
                                                                className={`w-4 h-4 rounded-full border-2 mr-2 ${checked ? 'bg-[#04EE00] border-[#04EE00]' : 'border-gray-400 bg-gray-400'}`} />
                                                            <span>Active</span>
                                                        </>
                                                    )}
                                                </RadioGroup.Option>
                                                <RadioGroup.Option value="Inactive" className="flex items-center">
                                                    {({ checked }) => (
                                                        <>
                                                            <div
                                                                className={`w-4 h-4 rounded-full border-2 mr-2 ${checked ? 'bg-[#04EE00] border-[#04EE00]' : 'border-gray-400 bg-gray-400'}`} />
                                                            <span>Inactive</span>
                                                        </>
                                                    )}
                                                </RadioGroup.Option>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                    <div className='border-t bg-[#F1F1F1] border-gray-300 py-3 text-right'>
                                        <Button className="items-center rounded-md bg-[#3AA1FF] py-1 px-4 mx-8 text-sm/6 font-semibold text-white data-[hover]:bg-blue-500" onClick={handleSave}>
                                            Save
                                        </Button>
                                    </div>
                                </Dialog.Panel>
                            </div>
                        </Dialog>
                    </Transition>
                    <div>
                        <table className='w-full border border-gray-400'>
                            <thead className='bg-gray-300 text-[#434242] text-sm'>
                                <tr>
                                    <th className='border border-gray-400 py-1 text-center w-1/3 font-medium'>Category</th>
                                    <th className='border border-gray-400 py-1 text-center w-1/3 font-medium'>Status</th>
                                    <div className='flex justify-center'>
                                        <th className='py-2 font-medium'><IoSettingsOutline /></th>
                                    </div>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((cat) => (
                                    <tr key={cat.id} className={`cursor-pointer ${selectedCategory?.id === cat.id ? 'bg-blue-100' : 'hover:bg-gray-100'} text-center `} onClick={() => setSelectedCategory(cat)}>
                                        <td className={`border border-gray-400 px-4 text-xs ${selectedCategory?.id === cat.id ? 'font-bold underline' : ''}`}>{cat.cat}</td>
                                        <td className='border border-gray-400 px-4 text-center'>
                                            <div className='flex justify-center'>
                                                {cat.status === 'Active' ? <RxDotFilled className='text-[#04EE00] text-2xl' /> : <RxDotFilled className='text-gray-500 text-2xl' />}
                                            </div>
                                        </td>
                                        <td className='border border-gray-400 px-4'>
                                            <div className='flex justify-center'>
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
                                                            <button className="py-2 flex px-3 transition" title='Edit' onClick={() => handleEdit(cat)}><FaPencil /></button>
                                                            <button className="py-2 flex px-3 transition" title='Delete' onClick={() => handleCatDelete(cat.id)}><RiDeleteBin6Line /></button>
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
                <div className="mx-4">
                    {!selectedCategory ? (
                        <p className="text-center py-3 text-gray-500">
                            Select a category to view subcategories
                        </p>
                    ) : (
                        <>
                            <div className='justify-end flex text-2xl text-gray-800 pb-3'>
                                <IoAddCircleOutline onClick={() => handleAddSubCat()} />
                            </div>
                            <Transition appear show={addSubCatPopup}>
                                <Dialog as='div' className='relative z-10' onClose={() => closeSubCat()}>
                                    <Transition.Child enter='ease-out duration-300' enterFrom='opacity-0 scale-95' enterTo='opacity-100 scale-100' leave='ease-in duration-200' leaveFrom='opacity-100 scale-100' leaveTo='opacity-0 scale-95'>
                                        <div className='fixed inset-0 bg-black bg-opacity-50' />
                                    </Transition.Child>
                                    <div className='fixed inset-0 flex items-center justify-center'>
                                        <Dialog.Panel className='w-full max-w-md rounded-lg shadow-xl'>
                                            <div className='bg-[#3AA1FF] flex items-center justify-between px-4 py-3'>
                                                <h1 className='text-white font-semibold'>{isSubCatEditing ? 'Sub Category : : Edit' : 'Sub Category : : Add'}</h1>
                                                <Button className="text-xl font-semibold text-white" onClick={() => closeSubCat()}>
                                                    <RxCross2 />
                                                </Button>
                                            </div>
                                            <div className='bg-[#F1F1F1] pb-2'>
                                                <div className='flex items-center mx-5  gap-3 text-sm'>
                                                    <h1 className='text-gray-400'>Category :</h1>
                                                    <h1>{selectedCategory?.cat || 'N/A'}</h1>
                                                </div>
                                                <Field>
                                                    <Input
                                                        className={(
                                                            'mt-3 border border-gray-400 mx-5 text-sm/6 w-3/5 rounded-lg bg-white py-1 px-3 text-gray-800 '
                                                        )}
                                                        placeholder='Sub Category... '
                                                        value={newSubCategory}
                                                        onChange={(e) => setNewSubCategory(e.target.value)} />
                                                </Field>
                                                <h1 className='mx-5 mt-3 text-base font-semibold text-gray-800'>Status :</h1>
                                                <RadioGroup value={selectedSubStatus} onChange={setSelectedSubStatus} className="mx-5 mt-2">
                                                    <div className="flex items-center space-x-4">
                                                        <RadioGroup.Option value="Active" className="flex items-center">
                                                            {({ checked }) => (
                                                                <>
                                                                    <div
                                                                        className={`w-4 h-4 rounded-full border-2 mr-2 ${checked ? 'bg-[#04EE00] border-[#04EE00]' : 'border-gray-400 bg-gray-400'}`} />
                                                                    <span>Active</span>
                                                                </>
                                                            )}
                                                        </RadioGroup.Option>
                                                        <RadioGroup.Option value="Inactive" className="flex items-center">
                                                            {({ checked }) => (
                                                                <>
                                                                    <div
                                                                        className={`w-4 h-4 rounded-full border-2 mr-2 ${checked ? 'bg-[#04EE00] border-[#04EE00]' : 'border-gray-400 bg-gray-400'}`} />
                                                                    <span>Inactive</span>
                                                                </>
                                                            )}
                                                        </RadioGroup.Option>
                                                    </div>
                                                </RadioGroup>
                                            </div>
                                            <div className='border-t bg-[#F1F1F1] border-gray-300 py-3 text-right'>
                                                <Button className="items-center rounded-md bg-[#3AA1FF] py-1 px-4 mx-8 text-sm/6 font-semibold text-white data-[hover]:bg-blue-500" onClick={handleSubCatSave}>
                                                    Save
                                                </Button>
                                            </div>
                                        </Dialog.Panel>
                                    </div>
                                </Dialog>
                            </Transition>
                            <table className="w-full border border-gray-400">
                                <thead className="bg-gray-300 text-[#434242] text-sm">
                                    <tr>
                                        <th className="border border-gray-400 py-1 text-center w-1/3 font-medium">Sub Category</th>
                                        <th className="border border-gray-400 py-1 text-center w-1/3 font-medium">Status</th>
                                        <div className='flex justify-center'>
                                            <th className='py-2 font-medium'><IoSettingsOutline /></th>
                                        </div>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subCategories.length > 0 ? (
                                        subCategories.map((sub) => (
                                            <tr key={sub.id} className="hover:bg-gray-100 text-center">
                                                <td className="text-xs border border-gray-400 px-4">{sub.subCat}</td>
                                                <td className="border border-gray-400 px-4">
                                                    <div className='flex justify-center'>
                                                        {sub.status === 'Active' ? <RxDotFilled className='text-[#04EE00] text-2xl' /> : <RxDotFilled className='text-gray-500 text-2xl' />}
                                                    </div>
                                                </td>
                                                <td className='border border-gray-400 px-4'>
                                                    <div className='flex justify-center'>
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
                                                                    <button className="py-2 flex px-3 transition" title='Edit' onClick={() => handleSubCatEdit(sub)}><FaPencil /></button>
                                                                    <button className="py-2 flex px-3 transition" title='Delete' onClick={() => handleSubCatDelete(sub.id)}><RiDeleteBin6Line /></button>
                                                                </div>
                                                            </PopoverPanel>
                                                        </Popover>

                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="text-center text-sm py-1 border border-gray-400 text-gray-500">
                                                No subcategories available
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </>
                    )}
                </div>
            </div>
        </div>
        </div>
        </>
    );
}

export default Categorys;