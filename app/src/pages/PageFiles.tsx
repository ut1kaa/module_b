import { Link } from "react-router-dom";
import "../styles/backend.css?v=1.0.0"
import "../styles/line-awesome.min.css"
import PDF from "../assets/pdf.png"


const PageFiles = () => {

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
                    <div className="col-lg-3 col-md-6 col-sm-6">
                        <div className="card card-block card-stretch card-height">
                            <div className="card-body image-thumb">
                                <a href="#" data-title="Terms.pdf" data-load-file="file"
                                    data-load-target="#resolte-contaniner"
                                    data-url="../assets/vendor/doc-viewer/files/demo.pdf" data-toggle="modal"
                                    data-target="#exampleModal">
                                    <div className="mb-4 text-center p-3 rounded iq-thumb">
                                        <div className="iq-image-overlay"></div>
                                        <img src={PDF} className="img-fluid"
                                            alt="image1"/>
                                    </div>
                                    <h6>Файл</h6>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )

};

export default PageFiles;