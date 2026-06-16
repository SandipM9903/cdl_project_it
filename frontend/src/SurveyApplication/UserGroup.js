import React, { useEffect, useState } from 'react';
import { Button, Field, Input, Popover, PopoverButton, PopoverPanel, Dialog, Transition, RadioGroup, Combobox, ComboboxOptions, ComboboxOption, ComboboxInput } from '@headlessui/react';
import { FaLongArrowAltLeft } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import axios from 'axios';
import { PiDotsThreeOutlineVerticalLight } from "react-icons/pi";
import { RxDotFilled, RxCross2 } from "react-icons/rx";
import { FaPencil, FaPlus } from "react-icons/fa6";
import { RiDeleteBin6Line } from "react-icons/ri";
import Navbar from './Navbar';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';

function UserGroup() {

    const [groups, setGroups] = useState([]);
    const [addGroupPopup, setAddGroupPopup] = useState(false);
    const [isGroupEditing, setIsGroupEditing] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [createdAt, setCreatedAt] = useState('');
    const [createdBy, setCreatedBy] = useState('');
    const [newGroup, setNewGroup] = useState('');
    const [selectedGroupId, setSelectedGroupId] = useState('')
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [users, setUsers] = useState([]);
    const [people, setPeople] = useState([]);
    const location = useLocation();
    const empCode = location?.state?.empCode || "";

    useEffect(() => {
        fetchGroups();
        fetchPeople();
    }, []);

    const fetchPeople = () => {
        axios.get('http://localhost:8989/users/api')
            .then((res) => {
                setPeople(res.data);
            }).catch((err) => {
                console.log("erroe during fetching", err);
            });
    };

    const fetchGroups = () => {
        axios.get('http://localhost:8989/userGroup')
            .then((res) => {
                setGroups(res.data.data);
            }).catch((err) => {
                console.log("Error during fetching", err)
            });
    };

    function handleAddGroup() {
        setAddGroupPopup(true);
        setIsGroupEditing(false);
        setSelectedStatus(null);
        setNewGroup('');
    }

    function closePopUp() {
        setAddGroupPopup(false);
        setIsGroupEditing(false);
        setSelectedStatus(null);
        setNewGroup('');
        setCreatedAt('');
        setCreatedBy('');
    }
    const handleEditGroup = (group) => {
        setIsGroupEditing(true);
        setAddGroupPopup(true);
        setSelectedStatus(group.status)
        setNewGroup(group.groupName);
        setSelectedGroupId(group.id)
        setCreatedAt(group.createdAt);
        setCreatedBy(group.createdBy);
    }

    const handleSave = () => {
        if (!newGroup?.trim() || !selectedStatus) {
            alert("Group Name and Status are required.");
            return;
        }
        const payload = {
            groupName: newGroup.trim(),
            status: selectedStatus,
            ...(isGroupEditing
                ? {createdAt: createdAt, createdBy: createdBy, updatedBy: empCode}
                : {createdBy: empCode}
            )
        }
        const url = isGroupEditing ? `http://localhost:8989/userGroup/${selectedGroupId}` : 'http://localhost:8989/userGroup';
        const method = isGroupEditing ? 'put' : 'post';
        axios[method](url, payload)
        .then(() => {
            closePopUp();
            fetchGroups();
        }).catch((err) => {
            console.log(`Error during ${isGroupEditing ? "updating" : "adding"}`, err);
        });
    };

    const handleDeleteGroup = (id) => {
        axios.delete(`http://localhost:8989/userGroup/${id}`)
            .then(() => {
                if(id===selectedGroupId){
                    setSelectedGroupId(null);
                    setSelectedGroup(false);
                    setUsers([]);
                }
                fetchGroups();
            }).catch((err) => {
                console.log("Error during deleting", err);
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

    const getUsers = (group) => {
        setSelectedGroup(true);
        setSelectedGroupId(group.id);

        axios.get(`http://localhost:8989/user-group-members/${group.id}`)
            .then((res) => {
                const userGroupData = res.data.data; // This contains additional user-group-member fields
                // Fetch full user details for each userId
                return Promise.all(userGroupData.map(user =>
                    axios.get(`http://localhost:8989/users/api/${user.userGroupMembersPId.userId}`)
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

    const handleUserDelete = (user, selectedGroupId) => {
        axios.delete(`http://localhost:8989/user-group-members/${selectedGroupId}/${user.userId}/groupId-userId`)
            .then(() => {
                setUsers(prevUsers => prevUsers.filter(u => u.userId !== user.userId));
            }).catch((err) => {
                console.log("Error during delete", err);
            });
    };

    const handleAddUser = (selectedPerson) => {
        if (!selectedPerson || !selectedGroupId) {
            alert("Please select a user and a group.");
            return;
        }
        const userExists = users.some(user => user.userId === selectedPerson.userId);
        if (userExists) {
            alert("User already exists in this group.");
            setSelectedPerson(null)
            return;
        }
        axios.post('http://localhost:8989/user-group-members',
            {
                userGroupMembersPId: {
                    groupId: selectedGroupId,
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

    const navigate = useNavigate();

    return (
        <div>
            <Header/>
            <div className='mt-20 h-screen'>
                <Navbar/>
            
            <div className='flex items-center gap-6 mx-4 mt-5 pb-5 '>
                <Button className="rounded-full bg-gray-700 py-1 px-1 text-sm/6 text-white data-[hover]:bg-gray-600" onClick={()=>navigate("/survey")}><FaLongArrowAltLeft /></Button>
                <h1 className='text-blue-400 font-bold text-base'>Groups and Users</h1>
            </div>
            <div className='border-b border-gray-300 mb-4'></div>
            <div className='grid grid-cols-2 gap-10 items-start mx-16 mt-4'>
                <div className='mx-4'>
                    <div className='justify-end flex mx-1 text-xl text-gray-800 pb-3'>
                        <FaPlus className='text-white bg-[#3AA1FF]' onClick={() => handleAddGroup()} />
                    </div>
                    <Transition appear show={addGroupPopup}>
                        <Dialog as='div' className='relative z-10' onClose={closePopUp}>
                            <Transition.Child enter='ease-out duration-300' enterFrom='opacity-0 scale-95' enterTo='opacity-100 scale-100' leave='ease-in duration-200' leaveFrom='opacity-100 scale-100' leaveTo='opacity-0 scale-95'>
                                <div className='fixed inset-0 bg-black bg-opacity-50' />
                            </Transition.Child>
                            <div className='fixed inset-0 flex items-center justify-center'>
                                <Dialog.Panel className='w-full max-w-md rounded-lg shadow-xl'>
                                    <div className='bg-[#3AA1FF] flex items-center justify-between px-4 py-3'>
                                        <h1 className='text-white font-semibold'>{isGroupEditing ? 'Group : : Edit' : 'Group : : Add'}</h1>
                                        <Button className="text-xl font-semibold text-white" onClick={() => closePopUp()}>
                                            <RxCross2 />
                                        </Button>
                                    </div>
                                    <div className='bg-[#F1F1F1] pb-2'>
                                        <Field>
                                            <Input
                                                className={(
                                                    'mt-3 border border-gray-400 mx-5 text-sm/6 w-3/5 rounded-lg bg-white py-1 px-3 text-gray-800 '
                                                )}
                                                placeholder='Group... '
                                                value={newGroup}
                                                onChange={(e) => setNewGroup(e.target.value)}
                                            />
                                        </Field>
                                        <h1 className='mx-5 mt-3 text-base font-semibold text-gray-800'>Status :</h1>
                                        <RadioGroup value={selectedStatus} onChange={setSelectedStatus} className="mx-5 mt-2">
                                            <div className="flex items-center space-x-4">
                                                <RadioGroup.Option value="Active" className="flex items-center">
                                                    {({ checked }) => (
                                                        <>
                                                            <div
                                                                className={`w-4 h-4 rounded-full border-2 mr-2 ${checked ? 'bg-[#04EE00] border-[#04EE00]' : 'border-gray-400 bg-gray-400'
                                                                    }`}
                                                            />
                                                            <span>Active</span>
                                                        </>
                                                    )}
                                                </RadioGroup.Option>
                                                <RadioGroup.Option value="Inactive" className="flex items-center">
                                                    {({ checked }) => (
                                                        <>
                                                            <div
                                                                className={`w-4 h-4 rounded-full border-2 mr-2 ${checked ? 'bg-[#04EE00] border-[#04EE00]' : 'border-gray-400 bg-gray-400'
                                                                    }`}
                                                            />
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
                    <table className='w-full border border-gray-400'>
                        <thead className='bg-gray-300 text-[#434242] text-sm'>
                            <tr>
                                <th className='border border-gray-400 py-1 text-center w-1/3 font-medium'>Group</th>
                                <th className='border border-gray-400 py-1 text-center w-1/3 font-medium'>Status</th>
                                <div className='flex justify-center'>
                                    <th className='py-1 font-medium'><IoSettingsOutline /></th>
                                </div>
                            </tr>
                        </thead>
                        <tbody>
                            {groups.map((group) => (
                                <tr key={group.id} className={`text-center cursor-pointer ${selectedGroupId === group.id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}  onClick={() => getUsers(group)}>
                                    <td className={`border border-gray-400 px-4 text-xs ${selectedGroupId === group.id ? 'font-bold underline' : ''}`}>{group.groupName}</td>
                                    <td className='border border-gray-400 px-4 text-center'>
                                        <div className='flex justify-center'>
                                            {group.status === 'Active' ? <RxDotFilled className='text-[#04EE00] text-2xl' /> : <RxDotFilled className='text-gray-500 text-2xl' />}
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
                                                        <button className="py-2 flex px-3 transition" title='Edit' onClick={() => handleEditGroup(group)}><FaPencil /></button>
                                                        <button className="py-2 flex px-3 transition" title='Delete' onClick={() => handleDeleteGroup(group.id)}><RiDeleteBin6Line /></button>
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
                <div className='mt-8 '>
                    {selectedGroup && (
                        <div className='mx-24 flex gap-16'>
                            <Combobox value={selectedPerson} onChange={setSelectedPerson} onClose={() => setQuery('')}>
                                <ComboboxInput
                                    className={('rounded-lg border border-[#B6B5B5] bg-gray-100 py-1.5 px-3 text-sm text-gray-800 ')}
                                    placeholder='Add User...'
                                    displayValue={(person) => person ? `${person.firstName || ''} ${person.lastName || ''}`.trim() : ''}
                                    onChange={(event) => setQuery(event.target.value)}
                                />
                                {filteredPeople.length > 0 && (
                                    <ComboboxOptions anchor="bottom" className={`w-[var(--input-width)] border border-gray-300 shadow-xl bg-gray-100 mt-1 px-1 py-1 overflow-y-auto ${filteredPeople.length > 4 ? 'h-36' : 'h-auto'}`}>
                                        {filteredPeople.map((person) => (
                                            <ComboboxOption key={person.id} value={person} className="group flex cursor-default hover:bg-gray-300 items-center text-md gap-2 py-1 px-2 rounded-lg">
                                                {person.firstName} {person.lastName}
                                            </ComboboxOption>
                                        ))}
                                    </ComboboxOptions>
                                )}

                            </Combobox>
                            <Button className="rounded-md bg-[#3E3E3E] py-1.5 px-3 text-sm font-semibold text-white shadow-inner shadow-white/10 " onClick={() => handleAddUser(selectedPerson)}>Add</Button>
                        </div>
                    )}
                    <div className='mx-20'>
                        <table className='w-[80%] border mt-4 border-gray-400'>
                            {selectedGroup && (
                                <thead className='bg-gray-300 text-[#1E1E1E]'>
                                    <tr>
                                        <th className='border border-gray-400 py-1 text-sm text-center w-1/2 font-semibold'>Username(s)</th>
                                        <div className='flex justify-center'>
                                            <th className='py-1 text-black'><IoSettingsOutline /></th>
                                        </div>
                                    </tr>
                                </thead>
                            )}
                            {selectedGroupId && users.length > 0 ?
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id} className='hover:bg-gray-100 text-center'>
                                            <td className='border border-gray-400 px-4 text-xs py-1'>{user.firstName} {user.lastName}</td>
                                            <td className='border border-gray-400 px-4 text-center py-1'>
                                                <div className='flex justify-center'>
                                                    <Button><RiDeleteBin6Line onClick={() => handleUserDelete(user, selectedGroupId)} /></Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                : selectedGroup ? (
                                    <tr>
                                        <td colSpan="3" className="text-center py-2 border border-gray-400 text-gray-500">
                                            Add Users
                                        </td>
                                    </tr>) : ''
                            }
                        </table>
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
}

export default UserGroup;
