import { useState, useRef } from "react"
import Papa from "papaparse"

export default function useUpload(options = {}) {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fileName, setFileName] = useState("");
    const fileInputRef = useRef(null);

    const defaultOptions = {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        ...options
    };

    const handleUpload = (file) => {
        setError(null);
        setData(null);
        setLoading(true);
        setFileName(file.name);

        Papa.parse(file, {
            ...defaultOptions,
            
            complete: function(results) {
                setLoading(false);
                
                if (results.errors.length > 0) {
                    setError(results.errors);
                } else {
                    setData(results.data);
                }
            },
            
            error: function(err) {
                setLoading(false);
                setError(err.message);
            }
        });
    };

    const reset = () => {
        setData(null);
        setError(null);
        setLoading(false);
        setFileName("");
        
        // Clear the file input so same file can be uploaded again
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return {
        data,
        error,
        loading,
        fileName,
        handleUpload,
        reset,
        fileInputRef  // Return ref to attach to input
    };
}