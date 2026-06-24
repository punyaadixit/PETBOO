import { useState, useEffect, useCallback } from 'react';
import {
  Plus, FileText, Trash2, Edit3, Download, Image, File,
  Calendar, User, Building2, Pill, AlertCircle, ClipboardList,
  ChevronDown, ChevronUp, X, UploadCloud, Sparkles
} from 'lucide-react';
import { api } from '../lib/api';
import AddMedicalRecordModal from './AddMedicalRecordModal';
import './MedicalRecordsTab.css';

const rawApiUrl = import.meta.env.VITE_API_URL;
const BASE_URL = rawApiUrl ? rawApiUrl.replace(/\/$/, '') : '';

function buildApiPath(path) {
  return BASE_URL ? `${BASE_URL}${path}` : path;
}

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function FileIcon({ type }) {
  if (type?.startsWith('image/')) return <Image size={16} />;
  return <File size={16} />;
}

function FileChip({ file, onDelete }) {
  return (
    <div className="file-chip">
      <FileIcon type={file.fileType} />
      <a
        href={`${BASE_URL}${file.fileUrl}`}
        target="_blank"
        rel="noreferrer"
        className="file-chip__name"
        title={file.fileName}
      >
        {file.fileName.length > 20 ? file.fileName.slice(0, 18) + '…' : file.fileName}
      </a>
      <a href={`${BASE_URL}${file.fileUrl}`} download={file.fileName} className="file-chip__action" title="Download">
        <Download size={12} />
      </a>
      {onDelete && (
        <button className="file-chip__action file-chip__delete" onClick={() => onDelete(file.id)} title="Delete">
          <X size={12} />
        </button>
      )}
    </div>
  );
}

function RecordCard({ record, petId, onEdit, onDelete, onFileUpload, onFileDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      await onFileUpload(record.id, file);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const hasDetails = record.symptoms || record.diagnosis || record.prescriptionNotes || record.medicines || record.additionalNotes;

  return (
    <div className="record-card">
      {/* Timeline dot */}
      <div className="record-card__timeline-dot" />

      <div className="record-card__inner">
        {/* Header */}
        <div className="record-card__header">
          <div className="record-card__date-badge">
            <Calendar size={13} />
            {formatDate(record.visitDate)}
          </div>
          <div className="record-card__actions">
            <button className="record-action-btn" onClick={() => onEdit(record)} title="Edit"><Edit3 size={14} /></button>
            <button className="record-action-btn record-action-btn--danger" onClick={() => onDelete(record.id)} title="Delete"><Trash2 size={14} /></button>
          </div>
        </div>

        {/* Doctor / Clinic */}
        <div className="record-card__meta">
          {record.doctorName && (
            <span className="record-meta-item">
              <User size={13} /> {record.doctorName}
            </span>
          )}
          {record.clinicName && (
            <span className="record-meta-item">
              <Building2 size={13} /> {record.clinicName}
            </span>
          )}
        </div>

        {/* Quick symptom / diagnosis preview */}
        {record.symptoms && (
          <div className="record-card__preview">
            <AlertCircle size={13} />
            <span>{record.symptoms}</span>
          </div>
        )}
        {record.diagnosis && (
          <div className="record-card__preview record-card__preview--diagnosis">
            <ClipboardList size={13} />
            <span><strong>Dx:</strong> {record.diagnosis}</span>
          </div>
        )}

        {/* Expand/collapse */}
        {hasDetails && (
          <button className="record-card__expand-btn" onClick={() => setExpanded(x => !x)}>
            {expanded ? <><ChevronUp size={14} /> Show less</> : <><ChevronDown size={14} /> Show more</>}
          </button>
        )}

        {expanded && (
          <div className="record-card__details">
            {record.prescriptionNotes && (
              <div className="record-detail">
                <span className="record-detail__label"><FileText size={13} /> Prescription Notes</span>
                <p className="record-detail__value">{record.prescriptionNotes}</p>
              </div>
            )}
            {record.medicines && (
              <div className="record-detail">
                <span className="record-detail__label"><Pill size={13} /> Medicines</span>
                <p className="record-detail__value">{record.medicines}</p>
              </div>
            )}
            {record.additionalNotes && (
              <div className="record-detail">
                <span className="record-detail__label"><ClipboardList size={13} /> Additional Notes</span>
                <p className="record-detail__value">{record.additionalNotes}</p>
              </div>
            )}
            {record.nextVisitDate && (
              <div className="record-detail record-detail--next-visit">
                <Calendar size={13} />
                <span>Next Visit: <strong>{formatDate(record.nextVisitDate)}</strong></span>
              </div>
            )}
          </div>
        )}

        {/* Files */}
        <div className="record-card__files">
          {(record.files || []).map(f => (
            <FileChip key={f.id} file={f} onDelete={(fid) => onFileDelete(record.id, fid)} />
          ))}
          <label className={`file-upload-chip${uploading ? ' file-upload-chip--loading' : ''}`}>
            {uploading ? <div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> : <Plus size={13} />}
            <span>{uploading ? 'Uploading…' : 'Attach file'}</span>
            <input type="file" accept="image/*,.pdf,.doc,.docx" hidden onChange={handleFileUpload} disabled={uploading} />
          </label>
        </div>
      </div>
    </div>
  );
}

export default function MedicalRecordsTab({ petId, petName }) {
  const [records, setRecords]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing]     = useState(null);
  const [deleteId, setDeleteId]   = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/pets/${petId}/medical`);
      setRecords(res.records || []);
    } catch (err) {
      console.error('Failed to fetch medical records:', err);
    } finally {
      setLoading(false);
    }
  }, [petId]);

  useEffect(() => { fetchRecords(); }, [fetchRecords]);

  const handleSave = async (formData) => {
    if (editing) {
      await api.put(`/pets/${petId}/medical/${editing.id}`, formData);
    } else {
      await api.post(`/pets/${petId}/medical`, formData);
    }
    setModalOpen(false);
    setEditing(null);
    fetchRecords();
  };

  const handleDelete = async (id) => {
    await api.delete(`/pets/${petId}/medical/${id}`);
    setDeleteId(null);
    fetchRecords();
  };

  const handleFileUpload = async (recordId, file) => {
    let token = 'demo-token';
    try {
      const stored = JSON.parse(localStorage.getItem('petsphere_auth') || '{}');
      token = stored.token || token;
      if (localStorage.getItem('petsphere_demo') === 'true') token = 'demo-token';
    } catch { /* use default */ }
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch(
      buildApiPath(`/api/v1/pets/${petId}/medical/${recordId}/files`),
      { method: 'POST', body: fd, headers: { Authorization: `Bearer ${token}` } }
    );
    if (!res.ok) throw new Error('Upload failed');
    fetchRecords();
  };

  const handleFileDelete = async (recordId, fileId) => {
    await api.delete(`/pets/${petId}/medical/files/${fileId}`);
    fetchRecords();
  };

  const handleAutoExtract = async (files) => {
    if (!files || files.length === 0) return;
    
    let token = 'demo-token';
    try {
      const stored = JSON.parse(localStorage.getItem('petsphere_auth') || '{}');
      token = stored.token || token;
      if (localStorage.getItem('petsphere_demo') === 'true') token = 'demo-token';
    } catch { /* use default */ }

    setIsAnalyzing(true);
    const fd = new FormData();
    for (let i = 0; i < files.length; i++) {
      fd.append('files', files[i]);
    }

    try {
      const res = await fetch(buildApiPath(`/api/v1/pets/${petId}/medical/auto-extract`), {
        method: 'POST',
        body: fd,
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Auto-extract failed');
      await fetchRecords();
    } catch (err) {
      console.error(err);
      alert('Failed to analyze files. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const onDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = () => { setIsDragging(false); };
  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleAutoExtract(e.dataTransfer.files);
    }
  };

  const onFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleAutoExtract(e.target.files);
    }
    e.target.value = '';
  };

  const openAdd = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (r) => { setEditing(r); setModalOpen(true); };

  return (
    <div className="medical-tab">
      {/* Header */}
      <div className="medical-tab__header">
        <div>
          <h2 className="medical-tab__title">Medical Records</h2>
          <p className="medical-tab__subtitle">{petName}'s complete health history</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <Plus size={16} /> Add Record
        </button>
      </div>

      {/* Drag & Drop AI Auto-Extract Zone */}
      <div 
        className={`drag-drop-zone ${isDragging ? 'drag-drop-zone--active' : ''} ${isAnalyzing ? 'drag-drop-zone--analyzing' : ''}`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        {isAnalyzing ? (
          <div className="drag-drop-content">
            <div className="spinner spinner-lg drag-drop-spinner" />
            <h3>AI is analyzing your reports...</h3>
            <p>Extracting dates, doctors, symptoms, and medicines magically ✨</p>
          </div>
        ) : (
          <div className="drag-drop-content">
            <div className="drag-drop-icon">
              <UploadCloud size={40} />
              <div className="drag-drop-sparkle"><Sparkles size={20} /></div>
            </div>
            <h3>Drag & Drop PDF Reports</h3>
            <p>Drop medical reports here to instantly extract and save them using AI.</p>
            <label className="btn btn-secondary btn-sm drag-drop-btn">
              Browse Files
              <input type="file" multiple accept=".pdf,image/*" hidden onChange={onFileInputChange} />
            </label>
          </div>
        )}
      </div>

      {/* Timeline */}
      {loading ? (
        <div className="medical-tab__loading">
          {[1,2,3].map(i => <div key={i} className="record-skeleton" />)}
        </div>
      ) : records.length === 0 ? (
        <div className="medical-tab__empty">
          <div className="medical-tab__empty-icon">🏥</div>
          <h3>No medical records yet</h3>
          <p>Start tracking {petName}'s health by adding the first medical record.</p>
          <button className="btn btn-primary" onClick={openAdd}>
            <Plus size={16} /> Add First Record
          </button>
        </div>
      ) : (
        <div className="record-timeline">
          {records.map(record => (
            <RecordCard
              key={record.id}
              record={record}
              petId={petId}
              onEdit={openEdit}
              onDelete={(id) => setDeleteId(id)}
              onFileUpload={handleFileUpload}
              onFileDelete={handleFileDelete}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {modalOpen && (
        <AddMedicalRecordModal
          open={modalOpen}
          onClose={() => { setModalOpen(false); setEditing(null); }}
          onSave={handleSave}
          initial={editing}
        />
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="medical-delete-overlay" onClick={() => setDeleteId(null)}>
          <div className="medical-delete-dialog" onClick={e => e.stopPropagation()}>
            <div className="medical-delete-dialog__icon">🗑️</div>
            <h3>Delete Record?</h3>
            <p>This will permanently delete the medical record and all attached files.</p>
            <div className="medical-delete-dialog__actions">
              <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteId)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
