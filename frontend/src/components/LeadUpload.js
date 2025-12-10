import React, { useState } from 'react';
import axios from 'axios'; // You'll need to install axios: npm install axios

function LeadUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // NOTE: Ensure your Flask server is running on this port
  const UPLOAD_URL = 'http://127.0.0.1:5000/api/leads/upload'; 

  const handleFileChange = (event) => {
    // Only allow CSV files
    if (event.target.files[0] && event.target.files[0].name.endsWith('.csv')) {
      setFile(event.target.files[0]);
      setMessage(`File selected: ${event.target.files[0].name}`);
    } else {
      setFile(null);
      setMessage('Please select a valid CSV file.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!file) {
      setMessage('No file selected for upload.');
      return;
    }

    setLoading(true);
    setMessage('Uploading and processing leads...');

    // 1. Create FormData object
    const formData = new FormData();
    // The key 'file' must match the key expected by Flask: request.files['file']
    formData.append('file', file); 

    try {
      // 2. Send POST request
      const response = await axios.post(UPLOAD_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // 3. Handle success response
      const inserted = response.data.inserted;
      let successMessage = `✅ Success! Inserted ${inserted} leads into the database.`;
      
      // Handle warnings (if your backend returns them for skipped rows)
      if (response.data.warnings && response.data.warnings.length > 0) {
        successMessage += ` (Note: ${response.data.warnings.length} rows were skipped due to errors.)`;
      }
      setMessage(successMessage);

    } catch (error) {
      // 4. Handle error response
      console.error('Upload Error:', error.response ? error.response.data : error.message);
      setMessage(`❌ Upload failed: ${error.response ? error.response.data.error : error.message}`);
    } finally {
      setLoading(false);
      // Clear file input after attempt
      setFile(null);
      document.getElementById('file-input').value = null; 
    }
  };

  return (
    <div style={styles.container}>
      <h2>Manual Lead Upload (CSV)</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input 
          id="file-input"
          type="file" 
          accept=".csv"
          onChange={handleFileChange} 
          disabled={loading}
          style={styles.input}
        />
        <button 
          type="submit" 
          disabled={!file || loading}
          style={styles.button}
        >
          {loading ? 'Uploading...' : 'Upload & Process Leads'}
        </button>
      </form>
      {message && <p style={styles.message}>{message}</p>}
      <p style={styles.note}>
        *Your CSV file must contain columns like: **name, email, company, job_title**, etc.
      </p>
    </div>
  );
}

const styles = {
    container: {
        maxWidth: '500px',
        margin: '50px auto',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
    },
    input: {
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '4px'
    },
    button: {
        padding: '10px 20px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px'
    },
    message: {
        marginTop: '20px',
        padding: '10px',
        backgroundColor: '#f0f0f0',
        borderRadius: '4px',
        whiteSpace: 'pre-wrap' // important for showing full error messages
    },
    note: {
        fontSize: '12px',
        color: '#666',
        marginTop: '15px'
    }
};

export default LeadUpload;