import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { BASE_URL } from '../config/Config';

export const DocViewerPassword = () => {
    const { docId } = useParams();
    const [fileUrl, setFileUrl] = useState('');

    const navigate = useNavigate();

    const backPage = () => {
        navigate('/dashboard');
    }

    useEffect(() => {
        showFile();
    }, [docId]);

    const showFile = () => {
        axios
            .get(`${BASE_URL}:9023/documents/access/enc/doc/${docId}`, { responseType: 'arraybuffer' })
            .then(async (res) => {
                const contentType = res.headers['content-type'];
                console.log(res);
                const blob = new Blob([res.data], { type: contentType });
                if (contentType.includes('pdf') || contentType.includes('msword')) {
                    const pdfUrl = URL.createObjectURL(blob);
                    setFileUrl(pdfUrl);
                } else if (contentType.includes('image/jpeg') || contentType.includes('image/jpg') || contentType.includes('octet-stream')) {
                    const imageUrl = URL.createObjectURL(blob);
                    setFileUrl(imageUrl);
                } else {
                    // alert('Unsupported file format');

                    const fileUrl = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = fileUrl;
                    link.download = 'downloaded_file'; // Optionally, set a default file name
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                }
            })
            .catch((err) => {
                alert(err);
            });
    }

    return (
        <div >

            <div className='flex justify-end mr-[30px]'>
                <button className='p-[10px] bg-black text-white' onClick={backPage}>Back</button>
            </div>

            <div>
                {
                    <embed className='object-contain mx-auto' src={fileUrl} width="1000" height="1120" />
                }

                <div className='h-[100px]'></div>
            </div>

        </div>
    )
}

