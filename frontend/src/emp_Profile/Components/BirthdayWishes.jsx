/* eslint-disable jsx-a11y/img-redundant-alt */
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaGift } from 'react-icons/fa';
import { BASE_URL } from '../../config/Config';

function BirthdayWishes() {
  const [birthdayData, setBirthdayData] = useState([]);

  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentDate = today.getDate();

  useEffect(() => {
    BirthdayData();
  }, []);

  const BirthdayData = () => {
    return axios
      .get(`${BASE_URL}:9020/employee/birthday/wishes/data`)
      .then((res) => {
        setBirthdayData(res.data);
        console.log('birthday');
        console.log(res.data);
      });
  };

  const openOutlookWithTemplate = (email, fullName) => {
    const subject = `Happy Birthday ${fullName}!`;
    const body = `Dear ${fullName},\n\nWishing you a very Happy Birthday! Have a wonderful day filled with joy and success.\n\nBest wishes,\n[Your Name]`;

    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="rounded-lg">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow sm:p-4 dark:bg-white">
        <div className="flex gap-2">
          <h1 className="text-sm font-bold leading-none text-gray-900 dark:text-black mt-2 ml-2">
            Celebrating Birthdays{' '}
          </h1>
          <FaGift className="text-red-600 mt-1" />
        </div>
        <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-grey-500 scrollbar-track-gray-300 scrollbar-track-rounded-full h-[270px]">
          {birthdayData.map((data, index) => {
            const { empResDTO, fileAndContentTypeBean } = data;
            const dateOfBirth = new Date(empResDTO.dateOfBirth);
            const empMonth = dateOfBirth.getMonth() + 1; // getMonth() is zero-based
            const empDay = dateOfBirth.getDate();
            const email = empResDTO.emailId; // Fetch employee email from API response

            const isBirthdayToday = empMonth === currentMonth && empDay === currentDate;
            const isBirthdayTomorrow = empMonth === currentMonth && empDay === currentDate + 1;

            return (
              <div className="flex justify-between items-center mb-2" key={index}>
                <div className="flex items-center gap-4 w-[250px] mt-4">
                  {fileAndContentTypeBean && fileAndContentTypeBean.file ? (
                    <img
                      src={`data:${fileAndContentTypeBean.contentType};base64,${fileAndContentTypeBean.file}`}
                      alt="image"
                      className="w-[30px] h-[30px] rounded-full"
                    />
                  ) : (
                    <img
                      src="https://imgcdn.stablediffusionweb.com/2024/5/3/16055462-ddd7-4167-a576-f2c605b507ed.jpg"
                      alt="default image"
                      className="w-[30px] h-[30px] rounded-full"
                    />
                  )}
                  <div>
                    <p className="text-xs">{empResDTO.fullNameAsAadhaar}</p>
                    <p className="mb-2 text-[10px] text-gray-400">
                      {empResDTO.designationResDTO?.designationName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-x-2">
                  <p
                    className={
                      isBirthdayToday
                        ? 'text-green-500 text-xs'
                        : isBirthdayTomorrow
                        ? 'text-orange-500 text-xs'
                        : 'text-gray-500 font-bold'
                    }
                  >
                    {isBirthdayToday
                      ? 'Today'
                      : isBirthdayTomorrow
                      ? 'Tomorrow'
                      : new Date(empResDTO.dateOfBirth).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'long',
                        })}
                  </p>
                  {isBirthdayToday && (
                    <button
                      onClick={() => openOutlookWithTemplate(email, empResDTO.fullNameAsAadhaar)}
                      className="ml-2 bg-blue-500 text-white py-1 px-2 rounded cursor-pointer text-xs"
                    >
                      Wish
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default BirthdayWishes;
