//NOT IN USE
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const DocumentViewer: React.FC = () => {
  const { filename } = useParams<{ filename: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState<string>("Loading document...");

  // 1. Fetch document on mount
  useEffect(() => {
    fetch(`http://localhost:8080/api/docs/${filename}`)
      .then(res => res.blob())
      .then(blob => {
        // Logic to load into your editor (e.g., Syncfusion or TipTap)
        console.log("Fetched file for viewing:", filename);
      });
  }, [filename]);

  const handleSave = async () => {
    // In a real scenario, get the blob from your editor state
    const mockBlob = new Blob(["Updated Content"], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    
    const formData = new FormData();
    formData.append('file', mockBlob);
    formData.append('filename', filename || '');

    const response = await fetch('http://localhost:8080/api/docs/save', {
        method: 'POST',
        body: formData,
    });

    if (response.ok) {
        alert(`${filename} saved under TAG-CASE#1`);
        navigate('/docs-management'); // Return to list
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h2 className="text-xl font-semibold">Viewing: {filename}</h2>
        <div className="space-x-2">
          <button onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-200 rounded">Back</button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded">Save Version</button>
        </div>
      </div>
      
      {/* Container for your DOCX Editor */}
      <div className="border h-[80vh] bg-white shadow-inner p-10 overflow-auto">
        <p className="text-gray-400 italic">Document Editor Interface for {filename} goes here...</p>
      </div>
    </div>
  );
};