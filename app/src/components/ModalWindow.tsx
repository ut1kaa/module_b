import React, { useState } from 'react';
import axios from 'axios';
import { FileModel } from '../pages/Index';

type FileModalProps = {
    file: FileModel;
    onClose: () => void;
    refreshFiles: () => void;
};

const FileModal: React.FC<FileModalProps> = ({ file, onClose, refreshFiles }) => {
    const [newName, setNewName] = useState('');
    const [email, setEmail] = useState('');
    const [accesses, setAccesses] = useState<any[]>([]);

    const modalStyles = {
        modal: {
            position: 'fixed' as 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
        },
        modalContent: {
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '500px',
            width: '100%',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        },
        input: {
            width: 'calc(100% - 20px)',
            padding: '10px',
            marginBottom: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
        },
        button: {
            margin: '10px 0',
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
        },
        buttonDelete: {
            backgroundColor: '#dc3545',
        },
        listItem: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
    };

    const renameFile = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.patch(`http://127.0.0.1:8000/files/${file.file_id}?new_name=${encodeURIComponent(newName)}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            refreshFiles();
            onClose();
        } catch (error) {
            console.error("Error renaming file:", error);
        }
    };

    const deleteFile = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://127.0.0.1:8000/files/${file.file_id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            refreshFiles();
            onClose();
        } catch (error) {
            console.error("Error deleting file:", error);
        }
    };

    const addFileAccess = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(`http://127.0.0.1:8000/files/${file.file_id}/accesses?email=${encodeURIComponent(email)}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAccesses(response.data);
        } catch (error) {
            console.error("Error adding file access:", error);
        }
    };

    const deleteFileAccess = async (email: string) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://127.0.0.1:8000/files/${file.file_id}/accesses?email=${encodeURIComponent(email)}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            refreshFiles();
            onClose();
        } catch (error) {
            console.error("Error deleting file access:", error);
        }
    };

    const downloadFile = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`http://127.0.0.1:8000/files/${file.file_id}`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', file.name);
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error("Error downloading file:", error);
        }
    };

    return (
        <div style={modalStyles.modal}>
            <div style={modalStyles.modalContent}>
                <h4>{file.name}</h4>
                
                <input
                    type="text"
                    placeholder="New name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    style={modalStyles.input}
                />
                <button onClick={renameFile} style={modalStyles.button}>Rename</button>
                <button onClick={deleteFile} style={{ ...modalStyles.button, ...modalStyles.buttonDelete }}>Delete</button>
                
                <hr />
                <h5>Manage File Access:</h5>
                <input
                    type="email"
                    placeholder="User email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={modalStyles.input}
                />
                <button onClick={addFileAccess} style={modalStyles.button}>Add Access</button>
                
                <ul>
                    {accesses.map((access) => (
                        <li key={access.email} style={modalStyles.listItem}>
                            {access.fullname} ({access.email}) - {access.type}
                            <button onClick={() => deleteFileAccess(access.email)} style={{ ...modalStyles.button, ...modalStyles.buttonDelete }}>Remove Access</button>
                        </li>
                    ))}
                </ul>

                <hr />
                <button onClick={downloadFile} style={modalStyles.button}>Download</button>
                <button onClick={onClose} style={modalStyles.button}>Close</button>
            </div>
        </div>
    );
};

export default FileModal;
