import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PDF from "../assets/pdf.png";
import axios from "axios";

const Index = () => {
    const [files, setFiles] = useState<any[]>([]); // Список файлов
    const [selectedFile, setSelectedFile] = useState<File | null>(null); // Выбранный файл

    // Функция для загрузки файлов с сервера
    const fetchFiles = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://127.0.0.1:8000/files", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFiles(response.data); // Устанавливаем файлы
        } catch (error) {
            console.error("Error fetching files:", error);
        }
    };

    // Функция для загрузки файла на сервер
    const handleFileUpload = async () => {
        if (!selectedFile) return;
        const token = localStorage.getItem("token");

        const formData = new FormData();
        formData.append("files", selectedFile);

        try {
            const response = await axios.post("http://127.0.0.1:8000/files", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });
            alert(response.data.message);
            setSelectedFile(null); // Сбрасываем выбранный файл
            fetchFiles(); // Обновляем список файлов после загрузки
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    // Получаем файлы при загрузке компонента
    useEffect(() => {
        fetchFiles();
    }, []);

    return (
        <div className="wrapper">
            <div className="iq-sidebar sidebar-default">
                <div className="data-scrollbar" data-scroll="1">
                    <nav className="iq-sidebar-menu">
                        <ul id="iq-sidebar-toggle" className="iq-menu">
                            <li className="active">
                                <Link to="/" className="">
                                    <i className="las la-hdd"></i>
                                    <span>Мой диск</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/files" className="">
                                    <i className="lar la-file-alt iq-arrow-left"></i>
                                    <span>Доступные файлы</span>
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            <div className="content-page">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card-transparent card-block card-stretch card-height mb-3">
                                <div className="d-flex justify-content-between">
                                    <h3>Мой диск</h3>
                                    <div className="d-flex align-items-center">
                                        <div className="mr-4">
                                            <input
                                                type="file"
                                                onChange={(e) =>
                                                    setSelectedFile(e.target.files?.[0] || null)
                                                }
                                            />
                                            <button
                                                className="btn btn-primary"
                                                onClick={handleFileUpload}
                                            >
                                                <i className="las la-plus pr-2"></i>
                                                Добавить
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Отображение файлов */}
                        {files.map((file) => (
                            <div
                                className="col-lg-3 col-md-6 col-sm-6"
                                key={file.file_id}
                            >
                                <div className="card card-block card-stretch card-height">
                                    <div className="card-body image-thumb">
                                        <a href={file.url}>
                                            <div className="mb-4 text-center p-3 rounded iq-thumb">
                                                <div className="iq-image-overlay"></div>
                                                <img
                                                    src={PDF}
                                                    className="img-fluid"
                                                    alt="image1"
                                                />
                                            </div>
                                            <h6>{file.name}</h6>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Index;
