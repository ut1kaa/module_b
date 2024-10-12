import { Link } from "react-router-dom";
import "../styles/backend.css?v=1.0.0"
import "../styles/line-awesome.min.css"
import PDF from "../assets/pdf.png"
import { useEffect, useState } from "react";
import axios from "axios";


const PageFiles = () => {
    const [files, setFiles] = useState<any[]>([]); // Список файлов

    const fetchFiles = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://127.0.0.1:8000/shared", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFiles(response.data); // Устанавливаем файлы
        } catch (error) {
            console.error("Error fetching files:", error);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);


    return (
<div className="wrapper">
        <div className="iq-sidebar  sidebar-default ">
            <div className="data-scrollbar" data-scroll="1">
                <nav className="iq-sidebar-menu">
                    <ul id="iq-sidebar-toggle" className="iq-menu">
                        <li>
                            <Link to="/" className="">
                                <i className="las la-hdd"></i><span>Мой диск</span>
                            </Link>
                        </li>
                        <li className="active">
                            <Link to="files" className="">
                                <i className="lar la-file-alt iq-arrow-left"></i><span>Доступные файлы</span>
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
                                <h3>
                                    Доступные файлы
                                </h3>
                            </div>
                        </div>
                    </div>
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
    )

};

export default PageFiles;