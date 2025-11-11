import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import "../styles/HomePage.css";

const HomePage = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [days, setDays] = useState(0);
    const [loading, setLoading] = useState(false);

    const onDrop = (acceptedFiles) => {
        setFile(acceptedFiles[0]);
    };

    const handleSubmit = () => {
        if (!file) {
            alert("Please upload an Excel file.");
            return;
        }
        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("days", days);
        formData.append("slots", 2);
        formData.append("strength", 1000);

        fetch("http://localhost:5000/upload", {
            method: "POST",
            body: formData,
        })
            .then((response) => {
                console.log("Backend responded:", response);
                return response.json();
            })
            .then((data) => {
                console.log("Parsed JSON:", data);
                navigate("/timetable", { state: { timetableData: data } });
            })
            .catch((error) => console.error("Error uploading file:", error))
            .finally(() => setLoading(false)); // Optional: hide loader on error too
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: ".xlsx" });

    return (
        <div className="home-container">
            <div className="body">
                <h1 className="homepage-title">📅 Smart Exam Timetable Generator</h1>

                <div {...getRootProps()} className="dropzone">
                    <input {...getInputProps()} />
                    <p>Drag & drop an Excel file here, or click to select one</p>
                </div>

                {file && <p className="file-name">Selected: {file.name}</p>}

                <div className="options">
                    <label>Number of Days:</label>
                    <input type="number" value={days} min="1" onChange={(e) => setDays(e.target.value)} />
                </div>

                <button onClick={handleSubmit} className="generate-btn">Generate Timetable</button>
            </div>
            <footer className="footer">
                <p>Project Mentor: Dr. Sandeep Saini</p>
                <p>Developed by: Ayush Khandal, Yatharth Patil</p>
            </footer>
            {loading && (
                <div className="loader-overlay">
                    <img src="/Timetablelogonew2.png" alt="Loading..." className="loader-logo" />
                </div>
            )}
        </div>
    );
};

export default HomePage;