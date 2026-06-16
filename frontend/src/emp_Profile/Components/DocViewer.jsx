import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../config/Config';

function DocViewer() {

    const { docId } = useParams();
    const [fileUrl, setFileUrl] = useState('');

    useEffect(() => {
        const showFile = () => {
            axios
                .get(`${BASE_URL}:8080/employee/download/education/document/${docId}`, { responseType: 'arraybuffer' })
                .then(async (res) => {
                    const contentType = res.headers['content-type'];
                    const blob = new Blob([res.data], { type: contentType });
                    if (contentType.includes('pdf') || contentType.includes('msword')) {
                        const pdfUrl = URL.createObjectURL(blob);
                        setFileUrl(pdfUrl);
                    } else if (contentType.includes('image/jpeg') || contentType.includes('image/jpg')) {
                        const imageUrl = URL.createObjectURL(blob);
                        setFileUrl(imageUrl);
                    } else {
                        alert('Unsupported file format');
                    }
                })
                .catch((err) => {
                    alert(err);
                });
        }

        showFile();

    }, []);

    return (
        <div >
            <div className='flex justify-center'>
                {
                    <embed src={fileUrl} width="1000" height="1120" />
                }
                <div className='h-[100px]'></div>
            </div>
        </div>
    )
}

export default DocViewer;