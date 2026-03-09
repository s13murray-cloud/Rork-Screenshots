import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileText, X, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '../../../components/Button';
import { SubpageLayout } from '../../../layouts/SubpageLayout';

export function ChecklistImport() {
    const navigate = useNavigate();
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [isParsing, setIsParsing] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (selectedFile: File) => {
        // Allow PDF and DOCX
        if (selectedFile.type === 'application/pdf' || selectedFile.name.endsWith('.docx')) {
            setFile(selectedFile);
        } else {
            alert('Please upload a valid PDF or DOCX file.');
        }
    };

    const simulateParsing = () => {
        setIsParsing(true);
        // Simulate extraction time before redirecting to builder
        setTimeout(() => {
            navigate('/supervisor/checklists/builder', { state: { importedName: file?.name } });
        }, 2000);
    };

    return (
        <SubpageLayout title="Import Checklist" showBack>
            <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 var(--spacing-md)', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                <div style={{ textAlign: 'center' }}>
                    <h1 className="desktop-only" style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', fontWeight: 800 }}>Smart Checklist Importer</h1>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                        Upload an existing paper form (PDF or Word) and we'll convert it into a digital checklist.
                    </p>
                </div>

                {!file ? (
                    // Drag and Drop Zone
                    <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => inputRef.current?.click()}
                        style={{
                            height: '350px',
                            border: `2px dashed ${dragActive ? 'var(--primary)' : 'var(--border-color)'}`,
                            borderRadius: 'var(--radius-lg)',
                            backgroundColor: dragActive ? 'var(--primary-bg)' : 'white',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '1.5rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                        }}
                    >
                        <input
                            ref={inputRef}
                            type="file"
                            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            style={{ display: 'none' }}
                            onChange={handleChange}
                        />

                        <div style={{ padding: '1.5rem', backgroundColor: 'var(--surface-color)', borderRadius: '50%', color: dragActive ? 'var(--primary)' : 'var(--text-muted)' }}>
                            <UploadCloud size={48} strokeWidth={1.5} />
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.25rem', fontWeight: 600, color: dragActive ? 'var(--primary)' : 'var(--text-main)', marginBottom: '0.5rem' }}>
                                Drag and drop your document here
                            </div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                or click to browse from your computer
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', backgroundColor: 'var(--surface-color)', padding: '0.25rem 0.75rem', borderRadius: '1rem' }}>PDF</span>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', backgroundColor: 'var(--surface-color)', padding: '0.25rem 0.75rem', borderRadius: '1rem' }}>DOCX</span>
                        </div>
                    </div>
                ) : (
                    // File Selected State
                    <div className="card" style={{ padding: '3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>

                        <div style={{ position: 'relative' }}>
                            <div style={{ width: '80px', height: '80px', backgroundColor: 'var(--primary-bg)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                <FileText size={40} />
                            </div>
                            {!isParsing && (
                                <button
                                    onClick={() => setFile(null)}
                                    style={{ position: 'absolute', top: '-10px', right: '-10px', width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--danger)', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        <div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>{file.name}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                        </div>

                        {isParsing ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                                <Loader2 size={32} className="text-primary" style={{ animation: 'spin 1s linear infinite' }} />
                                <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>Extracting inspection items...</div>
                                <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
                            </div>
                        ) : (
                            <Button
                                onClick={simulateParsing}
                                style={{ padding: '1rem 2rem', fontSize: '1.1rem', marginTop: '1rem' }}
                                icon={<ArrowRight size={20} />}
                            >
                                Convert to Checklist
                            </Button>
                        )}
                    </div>
                )}

            </div>
        </SubpageLayout>
    );
}
