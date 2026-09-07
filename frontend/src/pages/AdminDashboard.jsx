import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { useToast } from '../components/Toast';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { resolveImageUrl } from '../utils/imageUrl';
import {
  Users,
  Calendar,
  Layers,
  FileText,
  UserCheck,
  Settings,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  Clock,
  Save,
  Download,
  AlertCircle,
  Eye,
  BookOpen,
  Shield,
  Upload,
  Image as ImageIcon,
  Search,
  X,
  Globe2,
  Briefcase,
  Building2,
  RotateCcw,
  Lock,
  CheckCircle2,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  ExternalLink
} from 'lucide-react';

export const AdminDashboard = () => {
  const { user, token, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { tab } = useParams();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState(tab || 'overview');
  const [conference, setConference] = useState({
    title: "2027 International Conference on Cognitive Computing and Networking Systems",
    shortName: "ICC-CNS 2027",
    subTitle: "Department of Computer Science and Engineering",
    institution: "Vignan's Foundation for Science, Technology and Research (Deemed to be University)",
    location: "Vadlamudi, Guntur, Andhra Pradesh, India",
    venueLocation: "Vadlamudi, Guntur, Andhra Pradesh - 522213",
    year: 2027,
    edition: "3rd",
    dates: "June 11-12, 2027",
    targetDate: "2027-06-11T09:00:00.000Z",
    publicationInfo: {
      notice: "Technical Co-Sponsorship by IEEE / IEEE ComSoc. All registered and presented papers will be submitted for inclusion into IEEE Xplore.",
      status: "Technical Co-Sponsorship Approved",
      publisher: "IEEE Xplore Digital Library"
    }
  });
  const [speakers, setSpeakers] = useState([]);
  const [dates, setDates] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [committee, setCommittee] = useState([]);
  const [committeeError, setCommitteeError] = useState(null);
  const [isSavingConference, setIsSavingConference] = useState(false);
  const [loading, setLoading] = useState(true);

  // Modal / Form States
  const [editingSpeaker, setEditingSpeaker] = useState(null);
  const [editingDate, setEditingDate] = useState(null);
  const [editingTrack, setEditingTrack] = useState(null);
  const [viewingPaper, setViewingPaper] = useState(null);
  const [acceptConfirmPaper, setAcceptConfirmPaper] = useState(null);
  const [acceptRemarks, setAcceptRemarks] = useState('');
  const [rejectConfirmPaper, setRejectConfirmPaper] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmittingDecision, setIsSubmittingDecision] = useState(false);
  const [pdfZoom, setPdfZoom] = useState(100);
  const [pdfActiveTab, setPdfActiveTab] = useState('pdf');
  const [pdfFullscreen, setPdfFullscreen] = useState(false);
  const [editingCommitteeMember, setEditingCommitteeMember] = useState(null);
  const [committeeFilter, setCommitteeFilter] = useState('All');
  const [committeeSearch, setCommitteeSearch] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [speakerPhotoFile, setSpeakerPhotoFile] = useState(null);
  const [speakerPhotoPreview, setSpeakerPhotoPreview] = useState(null);
  const [speakerPhotoRemoved, setSpeakerPhotoRemoved] = useState(false);
  const [isUploadingSpeakerPhoto, setIsUploadingSpeakerPhoto] = useState(false);

  // Available unique categories for filtering and datalist
  const availableCommitteeCategories = useMemo(() => {
    if (!Array.isArray(committee)) return [];
    const cats = new Set();
    committee.forEach((m) => {
      if (m && m.category && typeof m.category === 'string') {
        cats.add(m.category.trim());
      }
    });
    if (cats.size === 0) {
      return [
        'Chief Patrons',
        'Patrons',
        'General Chairs',
        'Program Chairs',
        'Honorary Chairs',
        'Advisory Committee',
        'Technical Program Committee',
        'Organizing Committee',
        'Finance Committee',
        'Publication Committee',
        'Publicity Committee',
        'Hospitality Committee',
        'Website & IT Committee'
      ];
    }
    return Array.from(cats);
  }, [committee]);

  // Filtered members for Admin Table
  const filteredCommitteeForAdmin = useMemo(() => {
    if (!Array.isArray(committee)) return [];
    return committee.filter((mem) => {
      if (!mem) return false;
      const memCat = (mem.category || '').trim();
      const matchesCat =
        committeeFilter === 'All' ||
        memCat.toLowerCase() === committeeFilter.toLowerCase();

      const q = (committeeSearch || '').toLowerCase().trim();
      if (!q) return matchesCat;

      const matchesSearch =
        (mem.name && String(mem.name).toLowerCase().includes(q)) ||
        (mem.role && String(mem.role).toLowerCase().includes(q)) ||
        (mem.institution && String(mem.institution).toLowerCase().includes(q)) ||
        (mem.org && String(mem.org).toLowerCase().includes(q)) ||
        (mem.category && String(mem.category).toLowerCase().includes(q)) ||
        (mem.country && String(mem.country).toLowerCase().includes(q)) ||
        (mem.email && String(mem.email).toLowerCase().includes(q)) ||
        (mem.designation && String(mem.designation).toLowerCase().includes(q));

      return matchesCat && matchesSearch;
    });
  }, [committee, committeeFilter, committeeSearch]);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/login');
    }
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (tab && ['overview', 'submissions', 'registrations', 'speakers', 'committee', 'dates', 'tracks', 'settings'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [tab]);

  const fetchAllData = async () => {
    if (!token) return;
    try {
      const results = await Promise.allSettled([
        api.getConference(),
        api.getSpeakers(),
        api.getDates(),
        api.getTracks(),
        api.getSubmissions(token),
        api.getRegistrations(token),
        api.getCommittee('includeInactive=true')
      ]);

      const [confRes, spRes, dtRes, trRes, subRes, regRes, commRes] = results;

      if (confRes.status === 'fulfilled' && confRes.value) {
        setConference(confRes.value.data || confRes.value);
      }
      if (spRes.status === 'fulfilled' && spRes.value) {
        setSpeakers(Array.isArray(spRes.value.data) ? spRes.value.data : (Array.isArray(spRes.value) ? spRes.value : []));
      }
      if (dtRes.status === 'fulfilled' && dtRes.value) {
        setDates(Array.isArray(dtRes.value.data) ? dtRes.value.data : (Array.isArray(dtRes.value) ? dtRes.value : []));
      }
      if (trRes.status === 'fulfilled' && trRes.value) {
        setTracks(Array.isArray(trRes.value.data) ? trRes.value.data : (Array.isArray(trRes.value) ? trRes.value : []));
      }
      if (subRes.status === 'fulfilled' && subRes.value) {
        setSubmissions(Array.isArray(subRes.value.data) ? subRes.value.data : (Array.isArray(subRes.value) ? subRes.value : []));
      }
      if (regRes.status === 'fulfilled' && regRes.value) {
        setRegistrations(Array.isArray(regRes.value.data) ? regRes.value.data : (Array.isArray(regRes.value) ? regRes.value : []));
      }
      if (commRes.status === 'fulfilled' && commRes.value) {
        const commData = Array.isArray(commRes.value.data)
          ? commRes.value.data
          : (Array.isArray(commRes.value) ? commRes.value : []);
        setCommittee(commData);
        setCommitteeError(null);
      } else if (commRes.status === 'rejected') {
        console.error('Failed to load committee:', commRes.reason);
        setCommitteeError(commRes.reason?.message || 'Unable to load committee members.');
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      showToast(err.message || 'Error loading dashboard', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && isAdmin) {
      fetchAllData();
    }
  }, [token, isAdmin]);

  // --- CONFERENCE SETTINGS CRUD ---
  const handleSaveConference = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsSavingConference(true);
    try {
      await api.updateConference(conference, token);
      showToast('Conference settings saved successfully!');
      fetchAllData();
    } catch (err) {
      console.error('Failed to save conference settings:', err);
      showToast(err.message || 'Failed to save conference settings', 'error');
    } finally {
      setIsSavingConference(false);
    }
  };

  // --- DATES CRUD ---
  const handleSaveDate = async (e) => {
    e.preventDefault();
    try {
      if (editingDate.id && !editingDate.id.startsWith('new-')) {
        await api.updateDate(editingDate.id, editingDate, token);
        showToast('Important Date updated successfully!');
      } else {
        await api.createDate(editingDate, token);
        showToast('New Date added successfully!');
      }
      setEditingDate(null);
      fetchAllData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteDate = async (id) => {
    if (!window.confirm('Are you sure you want to delete this date?')) return;
    try {
      await api.deleteDate(id, token);
      showToast('Date deleted successfully');
      fetchAllData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // --- SPEAKERS CRUD ---
  const handleSpeakerPhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      showToast('Please upload a JPG, PNG, or WEBP image under 5 MB.', 'error');
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Please upload a JPG, PNG, or WEBP image under 5 MB.', 'error');
      e.target.value = '';
      return;
    }

    setSpeakerPhotoFile(file);
    setSpeakerPhotoPreview(URL.createObjectURL(file));
    setSpeakerPhotoRemoved(false);
  };

  const handleRemoveSpeakerPhoto = () => {
    setSpeakerPhotoFile(null);
    setSpeakerPhotoPreview(null);
    setSpeakerPhotoRemoved(true);
    setEditingSpeaker((prev) => ({ ...prev, image: null }));
  };

  const handleSaveSpeaker = async (e) => {
    e.preventDefault();
    try {
      let targetId = editingSpeaker.id;
      const speakerPayload = {
        ...editingSpeaker,
        image: speakerPhotoRemoved && !speakerPhotoFile ? null : editingSpeaker.image
      };

      if (targetId && !targetId.startsWith('new-')) {
        await api.updateSpeaker(targetId, speakerPayload, token);
        showToast('Speaker profile updated!');
      } else {
        const createRes = await api.createSpeaker(speakerPayload, token);
        targetId = createRes.data.id || createRes.data._id;
        showToast('New Speaker added successfully!');
      }

      // If photo was explicitly removed on existing speaker, call delete endpoint
      if (speakerPhotoRemoved && !speakerPhotoFile && targetId && !targetId.startsWith('new-')) {
        try {
          await api.deleteSpeakerImage(targetId, token);
        } catch (delErr) {
          console.warn('Could not delete speaker image:', delErr);
        }
      }

      // If a new photo file was selected, upload it
      if (speakerPhotoFile && targetId) {
        setIsUploadingSpeakerPhoto(true);
        const formData = new FormData();
        formData.append('photo', speakerPhotoFile);
        await api.uploadSpeakerImage(targetId, formData, token);
        showToast('Speaker photograph saved successfully!');
      }

      setEditingSpeaker(null);
      setSpeakerPhotoFile(null);
      setSpeakerPhotoPreview(null);
      setSpeakerPhotoRemoved(false);
      setIsUploadingSpeakerPhoto(false);
      fetchAllData();
    } catch (err) {
      setIsUploadingSpeakerPhoto(false);
      showToast(err.message || 'Failed to save speaker profile', 'error');
    }
  };

  const handleDeleteSpeaker = async (id) => {
    if (!window.confirm('Delete this speaker profile?')) return;
    try {
      await api.deleteSpeaker(id, token);
      showToast('Speaker deleted');
      fetchAllData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // --- TRACKS CRUD ---
  const handleSaveTrack = async (e) => {
    e.preventDefault();
    try {
      if (editingTrack.id && !editingTrack.id.startsWith('new-')) {
        await api.updateTrack(editingTrack.id, editingTrack, token);
        showToast('Track updated successfully!');
      } else {
        await api.createTrack(editingTrack, token);
        showToast('New Track created!');
      }
      setEditingTrack(null);
      fetchAllData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteTrack = async (id) => {
    if (!window.confirm('Delete this track?')) return;
    try {
      await api.deleteTrack(id, token);
      showToast('Track removed');
      fetchAllData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // --- SUBMISSIONS STATUS & WORKFLOW ---
  const handleOpenPdfReview = async (paper) => {
    setViewingPaper(paper);
    setPdfZoom(100);
    setPdfActiveTab('pdf');
    setPdfFullscreen(false);

    if (token && paper && (paper.fileStorageKey || paper.id || paper._id)) {
      try {
        const res = await api.getSubmissionDownloadUrl(paper.id || paper._id, token);
        if (res && res.downloadUrl) {
          setViewingPaper((prev) => (prev && (prev.id === paper.id || prev._id === paper._id) ? { ...prev, filePath: res.downloadUrl } : prev));
        }
      } catch (err) {
        console.error('Failed to get presigned manuscript URL:', err);
      }
    }
  };

  const handleConfirmAccept = async () => {
    if (!acceptConfirmPaper) return;
    setIsSubmittingDecision(true);
    try {
      const res = await api.updateSubmission(
        acceptConfirmPaper.id,
        {
          status: 'Accepted',
          reviewNotes: acceptRemarks || 'Paper accepted for publication and presentation at ICC-CNS 2027.'
        },
        token
      );
      showToast(`Manuscript ${acceptConfirmPaper.id} accepted and permanently locked.`);
      if (viewingPaper && viewingPaper.id === acceptConfirmPaper.id) {
        setViewingPaper((prev) => ({
          ...prev,
          status: 'Accepted',
          isLocked: true,
          decisionDate: new Date().toISOString(),
          decidedBy: user?.name || user?.email || 'Conference Administrator',
          reviewNotes: acceptRemarks || 'Paper accepted for publication and presentation at ICC-CNS 2027.'
        }));
      }
      setAcceptConfirmPaper(null);
      setAcceptRemarks('');
      fetchAllData();
    } catch (err) {
      showToast(err.message || 'Failed to accept manuscript', 'error');
    } finally {
      setIsSubmittingDecision(false);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectConfirmPaper) return;
    setIsSubmittingDecision(true);
    try {
      const res = await api.updateSubmission(
        rejectConfirmPaper.id,
        {
          status: 'Rejected',
          rejectionReason: rejectionReason || 'Does not meet peer-review criteria for ICC-CNS 2027.',
          reviewNotes: rejectionReason || 'Does not meet peer-review criteria for ICC-CNS 2027.'
        },
        token
      );
      showToast(`Manuscript ${rejectConfirmPaper.id} rejected and permanently locked.`);
      if (viewingPaper && viewingPaper.id === rejectConfirmPaper.id) {
        setViewingPaper((prev) => ({
          ...prev,
          status: 'Rejected',
          isLocked: true,
          decisionDate: new Date().toISOString(),
          decidedBy: user?.name || user?.email || 'Conference Administrator',
          rejectionReason: rejectionReason || 'Does not meet peer-review criteria for ICC-CNS 2027.',
          reviewNotes: rejectionReason || 'Does not meet peer-review criteria for ICC-CNS 2027.'
        }));
      }
      setRejectConfirmPaper(null);
      setRejectionReason('');
      fetchAllData();
    } catch (err) {
      showToast(err.message || 'Failed to reject manuscript', 'error');
    } finally {
      setIsSubmittingDecision(false);
    }
  };

  // --- COMMITTEE CRUD & IMAGE MANAGEMENT ---
  const handleSaveCommitteeMember = async (e) => {
    e.preventDefault();
    try {
      let targetId = editingCommitteeMember.id;
      if (targetId && !targetId.startsWith('new-')) {
        await api.updateCommitteeMember(targetId, editingCommitteeMember, token);
        showToast('Committee member updated successfully!');
      } else {
        const createRes = await api.createCommitteeMember(editingCommitteeMember, token);
        targetId = createRes.data.id || createRes.data._id;
        showToast('New committee member created!');
      }

      // If a photo file was selected, upload it
      if (photoFile && targetId) {
        setIsUploadingPhoto(true);
        const formData = new FormData();
        formData.append('photo', photoFile);
        await api.uploadCommitteeImage(targetId, formData, token);
        showToast('Photograph uploaded and linked to member!');
      }

      setEditingCommitteeMember(null);
      setPhotoFile(null);
      setPhotoPreview(null);
      setIsUploadingPhoto(false);
      fetchAllData();
    } catch (err) {
      setIsUploadingPhoto(false);
      showToast(err.message || 'Failed to save committee member', 'error');
    }
  };

  const handleDeleteCommitteeMember = async (id) => {
    if (!window.confirm('Are you sure you want to delete this committee member?')) return;
    try {
      await api.deleteCommitteeMember(id, token);
      showToast('Committee member deleted successfully');
      fetchAllData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleRemoveCommitteePhoto = async () => {
    if (!editingCommitteeMember || !editingCommitteeMember.id) return;
    if (!window.confirm("Remove this member's photograph?")) return;
    try {
      if (!editingCommitteeMember.id.startsWith('new-')) {
        await api.deleteCommitteeImage(editingCommitteeMember.id, token);
      }
      setEditingCommitteeMember((prev) => ({ ...prev, imageUrl: null }));
      setPhotoPreview(null);
      setPhotoFile(null);
      showToast('Photograph removed');
      fetchAllData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleToggleMemberActive = async (member) => {
    try {
      const nextStatus = member.isActive === false ? true : false;
      await api.updateCommitteeMember(member.id || member._id, { isActive: nextStatus }, token);
      showToast(`Member marked as ${nextStatus ? 'Active' : 'Inactive'}`);
      fetchAllData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
    }
  };

  const handleTabClick = (tabKey) => {
    setActiveTab(tabKey);
    navigate(tabKey === 'overview' ? '/admin' : `/admin/${tabKey}`, { replace: true });
  };

  if (authLoading || loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading Admin Portal...</p>
      </div>
    );
  }

  const pendingSubmissionsCount = submissions.filter((s) => s.status === 'Under Review').length;

  return (
    <div className="admin-page">
      <section className="page-header-section" style={{ padding: '7.5rem 0 2rem' }}>
        <div className="content-container">
          <span className="page-header-badge">Vignan University Admin Portal</span>
          <h1 className="page-header-title">Conference Management Suite</h1>
          <p className="page-header-subtitle">
            Manage 2027 conference metadata, important deadlines, keynote speakers, tracks, review submitted manuscripts, and monitor attendee registrations.
          </p>
        </div>
      </section>

      <section className="page-body-section" style={{ paddingTop: '1rem' }}>
        <div className="content-container">
          <div className="admin-layout">
            {/* Sidebar Navigation */}
            <aside className="admin-sidebar">
              <button
                onClick={() => handleTabClick('overview')}
                className={`admin-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              >
                <Layers size={18} /> Overview & Stats
              </button>
              <button
                onClick={() => handleTabClick('submissions')}
                className={`admin-tab-btn ${activeTab === 'submissions' ? 'active' : ''}`}
              >
                <FileText size={18} /> Papers ({submissions.length})
              </button>
              <button
                onClick={() => handleTabClick('registrations')}
                className={`admin-tab-btn ${activeTab === 'registrations' ? 'active' : ''}`}
              >
                <UserCheck size={18} /> Registrations ({registrations.length})
              </button>
              <button
                onClick={() => handleTabClick('speakers')}
                className={`admin-tab-btn ${activeTab === 'speakers' ? 'active' : ''}`}
              >
                <Users size={18} /> Speakers ({speakers.length})
              </button>
              <button
                onClick={() => handleTabClick('committee')}
                className={`admin-tab-btn ${activeTab === 'committee' ? 'active' : ''}`}
              >
                <Shield size={18} /> Committee ({committee.length})
              </button>
              <button
                onClick={() => handleTabClick('dates')}
                className={`admin-tab-btn ${activeTab === 'dates' ? 'active' : ''}`}
              >
                <Calendar size={18} /> Dates & Milestones
              </button>
              <button
                onClick={() => handleTabClick('tracks')}
                className={`admin-tab-btn ${activeTab === 'tracks' ? 'active' : ''}`}
              >
                <Layers size={18} /> Tracks & Topics
              </button>
              <button
                onClick={() => handleTabClick('settings')}
                className={`admin-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
              >
                <Settings size={18} /> Conference Meta
              </button>
            </aside>

            {/* Main Content Pane */}
            <main className="admin-content-area">
              <ErrorBoundary title="Admin Dashboard content could not be loaded." onRetry={fetchAllData}>
                {/* TAB 1: OVERVIEW METRICS */}
                {activeTab === 'overview' && (
                <>
                  <div className="admin-metrics-grid">
                    <div className="metric-card">
                      <div className="metric-icon-wrap" style={{ background: 'rgba(0, 163, 199, 0.12)', color: 'var(--primary-cyan)' }}>
                        <Users size={24} />
                      </div>
                      <div>
                        <div className="metric-val">{speakers.length}</div>
                        <div className="metric-lbl">Keynote Speakers</div>
                      </div>
                    </div>

                    <div className="metric-card">
                      <div className="metric-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10B981' }}>
                        <UserCheck size={24} />
                      </div>
                      <div>
                        <div className="metric-val">{registrations.length}</div>
                        <div className="metric-lbl">Registrations</div>
                      </div>
                    </div>

                    <div className="metric-card">
                      <div className="metric-icon-wrap" style={{ background: 'rgba(0, 163, 199, 0.12)', color: 'var(--primary-cyan)' }}>
                        <FileText size={24} />
                      </div>
                      <div>
                        <div className="metric-val">{submissions.length}</div>
                        <div className="metric-lbl">Papers Submitted</div>
                      </div>
                    </div>

                    <div className="metric-card">
                      <div className="metric-icon-wrap" style={{ background: 'rgba(234, 179, 8, 0.12)', color: '#D97706' }}>
                        <Clock size={24} />
                      </div>
                      <div>
                        <div className="metric-val">{pendingSubmissionsCount}</div>
                        <div className="metric-lbl">Pending Review</div>
                      </div>
                    </div>

                    <div className="metric-card">
                      <div className="metric-icon-wrap" style={{ background: 'rgba(168, 85, 247, 0.12)', color: '#9333EA' }}>
                        <Shield size={24} />
                      </div>
                      <div>
                        <div className="metric-val">{committee.length}</div>
                        <div className="metric-lbl">Committee Members</div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Submissions Quick Table */}
                  <div className="admin-panel">
                    <div className="admin-panel-header">
                      <h3 style={{ color: 'var(--primary-navy)', fontSize: '1.25rem' }}>Recent Paper Submissions</h3>
                      <button onClick={() => setActiveTab('submissions')} className="card-link-more">
                        View All Papers →
                      </button>
                    </div>

                    <div className="admin-table-container">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Paper ID</th>
                            <th>Title</th>
                            <th>Track</th>
                            <th>Author Email</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {submissions.length === 0 ? (
                            <tr>
                              <td colSpan="5" style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
                                <FileText size={28} color="var(--text-muted)" style={{ margin: '0 auto 0.5rem', display: 'block', opacity: 0.5 }} />
                                <div>No manuscript submissions recorded yet.</div>
                              </td>
                            </tr>
                          ) : (
                            submissions.slice(0, 5).map((sub) => (
                              <tr key={sub.id}>
                                <td style={{ fontWeight: 700, color: 'var(--primary-cyan)' }}>{sub.id}</td>
                                <td style={{ color: 'var(--primary-navy)', fontWeight: 600 }}>{sub.title}</td>
                                <td style={{ color: 'var(--primary-cyan)' }}>{sub.track}</td>
                                <td>{sub.primaryAuthorEmail}</td>
                                <td>
                                  <span className={`status-tag ${sub.status === 'Accepted' ? 'accepted' : sub.status === 'Rejected' ? 'rejected' : 'review'}`}>
                                    {sub.status}
                                  </span>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}

              {/* TAB 2: SUBMISSIONS MANAGEMENT */}
              {activeTab === 'submissions' && (
                <div className="admin-panel">
                  <div className="admin-panel-header">
                    <div>
                      <h3 style={{ color: 'var(--primary-navy)', fontSize: '1.3rem' }}>Submitted Manuscripts (2027)</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Review peer-review evaluations and update manuscript status.</p>
                    </div>
                  </div>

                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Paper ID</th>
                          <th>Title & Track</th>
                          <th>Author</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {submissions.length === 0 ? (
                          <tr>
                            <td colSpan="5" style={{ textAlign: 'center', padding: '3.5rem 1.5rem', color: 'var(--text-muted)' }}>
                              <FileText size={40} color="var(--primary-cyan)" style={{ margin: '0 auto 0.8rem', display: 'block', opacity: 0.6 }} />
                              <div style={{ color: 'var(--primary-navy)', fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                                No manuscript submissions available yet.
                              </div>
                              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '420px', margin: '0 auto' }}>
                                Papers submitted by authors through the online Submission portal will appear here in real-time.
                              </p>
                            </td>
                          </tr>
                        ) : (
                          submissions.map((paper) => (
                            <tr key={paper.id}>
                              <td style={{ fontWeight: 800, color: 'var(--primary-cyan)' }}>{paper.id}</td>
                              <td>
                                <div style={{ fontWeight: 600, color: 'var(--primary-navy)' }}>{paper.title}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--primary-cyan)' }}>{paper.track}</div>
                              </td>
                              <td>
                                <div>{paper.authors}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{paper.primaryAuthorEmail}</div>
                              </td>
                              <td>
                                <span className={`status-tag ${paper.status === 'Accepted' ? 'accepted' : paper.status === 'Rejected' ? 'rejected' : 'review'}`}>
                                  {paper.status}
                                </span>
                              </td>
                              <td>
                                <div className="action-btn-group">
                                  <button
                                    onClick={() => handleOpenPdfReview(paper)}
                                    className="action-icon-btn edit"
                                    title="Open PDF & Review Manuscript"
                                  >
                                    <Eye size={16} />
                                  </button>

                                  {paper.status === 'Accepted' ? (
                                    <span className="badge badge-emerald" style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem' }} title="Decision Locked">
                                      <Lock size={11} style={{ marginRight: 3 }} /> Accepted
                                    </span>
                                  ) : paper.status === 'Rejected' ? (
                                    <span className="badge" style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem', color: '#EF4444', borderColor: 'rgba(239, 68, 68, 0.4)' }} title="Decision Locked">
                                      <Lock size={11} style={{ marginRight: 3 }} /> Rejected
                                    </span>
                                  ) : (
                                    <>
                                      <button
                                        onClick={() => {
                                          setAcceptConfirmPaper(paper);
                                          setAcceptRemarks('');
                                        }}
                                        className="action-icon-btn"
                                        style={{ color: '#10B981', borderColor: 'rgba(16, 185, 129, 0.4)' }}
                                        title="Accept Manuscript"
                                      >
                                        <CheckCircle size={16} />
                                      </button>
                                      <button
                                        onClick={() => {
                                          setRejectConfirmPaper(paper);
                                          setRejectionReason('');
                                        }}
                                        className="action-icon-btn delete"
                                        title="Reject Manuscript"
                                      >
                                        <XCircle size={16} />
                                      </button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: REGISTRATIONS MANAGEMENT */}
              {activeTab === 'registrations' && (
                <div className="admin-panel">
                  <div className="admin-panel-header">
                    <div>
                      <h3 style={{ color: 'var(--primary-navy)', fontSize: '1.3rem' }}>Participant Registrations</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>List of registered authors, scholars, and attendees.</p>
                    </div>
                  </div>

                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Reg ID</th>
                          <th>Participant</th>
                          <th>Category</th>
                          <th>Mode</th>
                          <th>Paper ID</th>
                          <th>Fee</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {registrations.map((reg) => (
                          <tr key={reg.id}>
                            <td style={{ fontWeight: 700, color: 'var(--primary-cyan)' }}>{reg.id}</td>
                            <td>
                              <div style={{ color: 'var(--primary-navy)', fontWeight: 600 }}>{reg.fullName}</div>
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{reg.email}</div>
                              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{reg.institution}</div>
                            </td>
                            <td>{reg.participantType}</td>
                            <td>
                              <span className={`badge ${reg.mode.includes('Online') ? 'badge-cyan' : 'badge-emerald'}`}>
                                {reg.mode}
                              </span>
                            </td>
                            <td>{reg.paperId || 'N/A'}</td>
                            <td style={{ fontWeight: 700, color: 'var(--primary-navy)' }}>{reg.amountPaid}</td>
                            <td>
                              <span className="badge badge-emerald">{reg.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 4: SPEAKERS MANAGEMENT */}
              {activeTab === 'speakers' && (
                <div className="admin-panel">
                  <div className="admin-panel-header">
                    <div>
                      <h3 style={{ color: 'var(--primary-navy)', fontSize: '1.3rem' }}>Keynote & Invited Speakers</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Manage keynote speaker profiles and session topics.</p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingSpeaker({
                          id: `new-${Date.now()}`,
                          name: '',
                          designation: 'Keynote Speaker',
                          institution: '',
                          country: 'India',
                          track: 'Cognitive Computing & AI',
                          topic: '',
                          bio: '',
                          image: null,
                          type: 'Keynote'
                        });
                        setSpeakerPhotoFile(null);
                        setSpeakerPhotoPreview(null);
                        setSpeakerPhotoRemoved(false);
                      }}
                      className="btn-primary-glow"
                    >
                      <Plus size={16} /> Add New Speaker
                    </button>
                  </div>

                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Speaker</th>
                          <th>Institution</th>
                          <th>Topic</th>
                          <th>Type</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {speakers.map((sp) => (
                          <tr key={sp.id}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                {sp.image ? (
                                  <img
                                    src={resolveImageUrl(sp.image)}
                                    alt={sp.name}
                                    style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                                    }}
                                  />
                                ) : null}
                                <div
                                  style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    background: 'rgba(0, 163, 199, 0.1)',
                                    border: '1px solid rgba(0, 163, 199, 0.3)',
                                    display: sp.image ? 'none' : 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 700,
                                    fontSize: '0.8rem',
                                    color: 'var(--primary-cyan)',
                                    flexShrink: 0
                                  }}
                                >
                                  {sp.name ? sp.name.replace(/^(Dr\.|Prof\.|Mr\.|Mrs\.|Ms\.)\s+/i, '').charAt(0).toUpperCase() : 'S'}
                                </div>
                                <div>
                                  <div style={{ fontWeight: 700, color: 'var(--primary-navy)' }}>{sp.name}</div>
                                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{sp.designation}</div>
                                </div>
                              </div>
                            </td>
                            <td>{sp.institution} ({sp.country})</td>
                            <td style={{ color: 'var(--text-primary)', maxWidth: '240px' }}>{sp.topic}</td>
                            <td>
                              <span className="badge badge-cyan">{sp.type}</span>
                            </td>
                            <td>
                              <div className="action-btn-group">
                                <button
                                  onClick={() => {
                                    setEditingSpeaker(sp);
                                    setSpeakerPhotoFile(null);
                                    setSpeakerPhotoPreview(sp.image || null);
                                    setSpeakerPhotoRemoved(false);
                                  }}
                                  className="action-icon-btn edit"
                                  title="Edit Speaker"
                                >
                                  <Edit2 size={15} />
                                </button>
                                <button
                                  onClick={() => handleDeleteSpeaker(sp.id)}
                                  className="action-icon-btn delete"
                                  title="Delete Speaker"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB: COMMITTEE MANAGEMENT */}
              {activeTab === 'committee' && (
                <ErrorBoundary
                  title="Committee Management could not be loaded."
                  message={committeeError || 'An error occurred while rendering committee data.'}
                  onRetry={fetchAllData}
                >
                  <div className="admin-panel">
                    <div className="admin-panel-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
                      <div>
                        <h3 style={{ color: 'var(--primary-navy)', fontSize: '1.3rem' }}>
                          Committee Members & Leadership ({filteredCommitteeForAdmin.length})
                        </h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          Manage conference patrons, advisory board, technical program committee, and organizing faculty ({committee.length} Total).
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setEditingCommitteeMember({
                            id: `new-${Date.now()}`,
                            name: '',
                            role: '',
                            category: 'Organizing Committee',
                            institution: "Vignan's Foundation for Science, Technology and Research (VFSTR)",
                            department: 'Department of Computer Science & Engineering',
                            designation: 'Assistant Professor',
                            country: 'India',
                            email: '',
                            bio: '',
                            imageUrl: null,
                            displayOrder: (Array.isArray(committee) ? committee.length : 0) + 1,
                            isActive: true
                          });
                          setPhotoFile(null);
                          setPhotoPreview(null);
                        }}
                        className="btn-primary-glow"
                      >
                        <Plus size={16} /> Add Committee Member
                      </button>
                    </div>

                    {committeeError && (
                      <div style={{
                        margin: '1rem 0',
                        padding: '1rem',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#EF4444' }}>
                          <AlertCircle size={18} />
                          <span style={{ fontSize: '0.9rem' }}>{committeeError}</span>
                        </div>
                        <button
                          onClick={fetchAllData}
                          className="btn-secondary-glass"
                          style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem', cursor: 'pointer' }}
                        >
                          <RotateCcw size={14} style={{ marginRight: '0.3rem' }} /> Retry
                        </button>
                      </div>
                    )}

                    {/* Filter & Search Bar */}
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '1rem',
                      marginBottom: '1.5rem',
                      padding: '1rem',
                      background: 'var(--surface-light)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-cyan)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: '240px' }}>
                        <Search size={16} color="var(--text-muted)" />
                        <input
                          type="text"
                          placeholder="Search member, role, institution, category..."
                          value={committeeSearch}
                          onChange={(e) => setCommitteeSearch(e.target.value)}
                          className="form-input"
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.88rem' }}
                        />
                        {committeeSearch && (
                          <button
                            onClick={() => setCommitteeSearch('')}
                            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Category:</label>
                        <select
                          value={committeeFilter}
                          onChange={(e) => setCommitteeFilter(e.target.value)}
                          className="form-select"
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', width: 'auto' }}
                        >
                          <option value="All">All Categories ({Array.isArray(committee) ? committee.length : 0})</option>
                          {availableCommitteeCategories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Committee Table */}
                    <div className="admin-table-container">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Member</th>
                            <th>Role</th>
                            <th>Category</th>
                            <th>Institution / Dept</th>
                            <th>Order</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredCommitteeForAdmin.length === 0 ? (
                            <tr>
                              <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                {committee.length === 0 ? 'No committee members found.' : 'No committee members match your filters.'}
                              </td>
                            </tr>
                          ) : (
                            filteredCommitteeForAdmin.map((mem) => {
                              if (!mem) return null;
                              return (
                                <tr key={mem.id || mem._id || Math.random()}>
                                  <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                      {mem.imageUrl ? (
                                        <img
                                          src={resolveImageUrl(mem.imageUrl)}
                                          alt={mem.name || 'Member'}
                                          style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            objectFit: 'contain',
                                            background: 'rgba(0, 163, 199, 0.1)',
                                            border: '1px solid rgba(0, 163, 199, 0.3)'
                                          }}
                                          onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.style.display = 'none';
                                          }}
                                        />
                                      ) : null}
                                      {!mem.imageUrl && (
                                        <div style={{
                                          width: '40px',
                                          height: '40px',
                                          borderRadius: '50%',
                                          background: 'rgba(0, 163, 199, 0.1)',
                                          color: 'var(--primary-cyan)',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          fontWeight: 700,
                                          fontSize: '0.9rem',
                                          border: '1px dashed rgba(0, 163, 199, 0.4)',
                                          flexShrink: 0
                                        }}>
                                          {((mem.name || 'C').trim())[0]}
                                        </div>
                                      )}
                                      <div>
                                        <div style={{ fontWeight: 700, color: 'var(--primary-navy)' }}>{mem.name || 'Unnamed Member'}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                          {mem.designation || mem.email || mem.country || '—'}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <span style={{ color: 'var(--primary-cyan)', fontWeight: 600, fontSize: '0.88rem' }}>
                                      {mem.role || '—'}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="badge badge-outline" style={{ fontSize: '0.78rem' }}>
                                      {mem.category || 'General'}
                                    </span>
                                  </td>
                                  <td>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                      {mem.institution || mem.org || '—'}
                                    </div>
                                    {mem.department && (
                                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                        {mem.department}
                                      </div>
                                    )}
                                  </td>
                                  <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--primary-cyan)' }}>
                                    {mem.displayOrder || '—'}
                                  </td>
                                  <td>
                                    <button
                                      onClick={() => handleToggleMemberActive(mem)}
                                      className={`badge ${mem.isActive !== false ? 'badge-emerald' : 'badge-outline'}`}
                                      style={{ cursor: 'pointer', border: 'none' }}
                                      title="Click to toggle Active / Inactive"
                                    >
                                      {mem.isActive !== false ? 'Active' : 'Inactive'}
                                    </button>
                                  </td>
                                  <td>
                                    <div className="action-btn-group">
                                      <button
                                        onClick={() => {
                                          setEditingCommitteeMember(mem);
                                          setPhotoFile(null);
                                          setPhotoPreview(mem.imageUrl || null);
                                        }}
                                        className="action-icon-btn edit"
                                        title="Edit Member & Photo"
                                      >
                                        <Edit2 size={15} />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteCommitteeMember(mem.id || mem._id)}
                                        className="action-icon-btn delete"
                                        title="Delete Member"
                                      >
                                        <Trash2 size={15} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </ErrorBoundary>
              )}

              {/* TAB 5: DATES MANAGEMENT */}
              {activeTab === 'dates' && (
                <div className="admin-panel">
                  <div className="admin-panel-header">
                    <div>
                      <h3 style={{ color: 'var(--primary-navy)', fontSize: '1.3rem' }}>Important Dates & Deadlines</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Update deadlines dynamically from the dashboard.</p>
                    </div>
                    <button
                      onClick={() =>
                        setEditingDate({
                          id: `new-${Date.now()}`,
                          title: '',
                          date: '2027-05-15',
                          displayDate: '15 MAY 2027',
                          description: '',
                          status: 'Upcoming',
                          highlight: false
                        })
                      }
                      className="btn-primary-glow"
                    >
                      <Plus size={16} /> Add Date
                    </button>
                  </div>

                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Display Date</th>
                          <th>Title</th>
                          <th>Description</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dates.map((d) => (
                          <tr key={d.id}>
                            <td style={{ fontWeight: 800, color: 'var(--primary-cyan)' }}>
                              {d.displayDate || d.date}
                            </td>
                            <td style={{ color: 'var(--primary-navy)', fontWeight: 600 }}>{d.title}</td>
                            <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{d.description}</td>
                            <td>
                              <span className={`badge ${d.status === 'Open' ? 'badge-emerald' : 'badge-outline'}`}>
                                {d.status}
                              </span>
                            </td>
                            <td>
                              <div className="action-btn-group">
                                <button
                                  onClick={() => setEditingDate(d)}
                                  className="action-icon-btn edit"
                                  title="Edit Date"
                                >
                                  <Edit2 size={15} />
                                </button>
                                <button
                                  onClick={() => handleDeleteDate(d.id)}
                                  className="action-icon-btn delete"
                                  title="Delete Date"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 6: TRACKS MANAGEMENT */}
              {activeTab === 'tracks' && (
                <div className="admin-panel">
                  <div className="admin-panel-header">
                    <div>
                      <h3 style={{ color: 'var(--primary-navy)', fontSize: '1.3rem' }}>Conference Tracks & Topics</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Manage research tracks and technical sub-topics.</p>
                    </div>
                    <button
                      onClick={() =>
                        setEditingTrack({
                          id: `new-${Date.now()}`,
                          number: `0${tracks.length + 1}`,
                          code: `TRACK-0${tracks.length + 1}`,
                          name: '',
                          summary: '',
                          topics: []
                        })
                      }
                      className="btn-primary-glow"
                    >
                      <Plus size={16} /> Add Track
                    </button>
                  </div>

                  <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {tracks.map((track) => (
                      <div key={track.id} className="glass-panel" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <div className="track-num-badge">{track.number}</div>
                            <h4 style={{ color: 'var(--primary-navy)', fontSize: '1.2rem' }}>{track.name}</h4>
                          </div>
                          <div className="action-btn-group">
                            <button onClick={() => setEditingTrack(track)} className="action-icon-btn edit">
                              <Edit2 size={15} />
                            </button>
                            <button onClick={() => handleDeleteTrack(track.id)} className="action-icon-btn delete">
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                          {(track.topics || []).map((tp, idx) => (
                            <span key={idx} className="badge badge-outline" style={{ fontSize: '0.75rem' }}>
                              {tp}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 7: CONFERENCE METADATA & PUBLICATION SETTINGS */}
              {activeTab === 'settings' && (
                <ErrorBoundary
                  title="Conference Settings could not be loaded."
                  onRetry={fetchAllData}
                >
                  <div className="admin-panel">
                    <div className="admin-panel-header">
                      <div>
                        <h3 style={{ color: 'var(--primary-navy)', fontSize: '1.3rem' }}>Conference & Publication Settings</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          Configure institutional titles, year (2027/2028), venue, countdown date, and publication information.
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleSaveConference}>
                      <div className="form-grid-2">
                        <div className="form-group">
                          <label className="form-label">Conference Title</label>
                          <input
                            type="text"
                            value={conference?.title || ''}
                            onChange={(e) => setConference({ ...conference, title: e.target.value })}
                            className="form-input"
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">Short Name / Identifier</label>
                          <input
                            type="text"
                            value={conference?.shortName || ''}
                            onChange={(e) => setConference({ ...conference, shortName: e.target.value })}
                            className="form-input"
                          />
                        </div>
                      </div>

                      <div className="form-grid-3">
                        <div className="form-group">
                          <label className="form-label">Year</label>
                          <input
                            type="number"
                            value={conference?.year || 2027}
                            onChange={(e) => setConference({ ...conference, year: parseInt(e.target.value) || 2027 })}
                            className="form-input"
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">Edition</label>
                          <input
                            type="text"
                            value={conference?.edition || '3rd'}
                            onChange={(e) => setConference({ ...conference, edition: e.target.value })}
                            className="form-input"
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">Dates Display</label>
                          <input
                            type="text"
                            value={conference?.dates || ''}
                            onChange={(e) => setConference({ ...conference, dates: e.target.value })}
                            className="form-input"
                          />
                        </div>
                      </div>

                      <div className="form-grid-2">
                        <div className="form-group">
                          <label className="form-label">University / Institution</label>
                          <input
                            type="text"
                            value={conference?.institution || ''}
                            onChange={(e) => setConference({ ...conference, institution: e.target.value })}
                            className="form-input"
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">School / Department</label>
                          <input
                            type="text"
                            value={conference?.subTitle || ''}
                            onChange={(e) => setConference({ ...conference, subTitle: e.target.value })}
                            className="form-input"
                          />
                        </div>
                      </div>

                      <div className="form-grid-2">
                        <div className="form-group">
                          <label className="form-label">Venue Location / City</label>
                          <input
                            type="text"
                            value={conference?.venueLocation || ''}
                            onChange={(e) => setConference({ ...conference, venueLocation: e.target.value })}
                            className="form-input"
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">Countdown Target Date (ISO)</label>
                          <input
                            type="text"
                            value={conference?.targetDate || '2027-06-11T09:00:00.000Z'}
                            onChange={(e) => setConference({ ...conference, targetDate: e.target.value })}
                            className="form-input"
                          />
                        </div>
                      </div>

                      {/* Publication Section Config */}
                      <div style={{
                        marginTop: '1.5rem',
                        padding: '1.2rem',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--surface-light)',
                        border: '1px solid var(--border-cyan)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem' }}>
                          <BookOpen size={18} color="var(--primary-cyan)" />
                          <h4 style={{ color: 'var(--primary-navy)', fontSize: '1.1rem' }}>Publication & Proceedings Settings</h4>
                        </div>

                        <div className="form-group">
                          <label className="form-label">Publication Notice Text</label>
                          <textarea
                            value={conference?.publicationInfo?.notice || ''}
                            onChange={(e) =>
                              setConference({
                                ...conference,
                                publicationInfo: { ...(conference?.publicationInfo || {}), notice: e.target.value }
                              })
                            }
                            className="form-textarea"
                            rows={3}
                          />
                        </div>

                        <div className="form-grid-2">
                          <div className="form-group">
                            <label className="form-label">Publication Status</label>
                            <input
                              type="text"
                              value={conference?.publicationInfo?.status || 'Announced by Organizers'}
                              onChange={(e) =>
                                setConference({
                                  ...conference,
                                  publicationInfo: { ...(conference?.publicationInfo || {}), status: e.target.value }
                                })
                              }
                              className="form-input"
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Publisher Series Name</label>
                            <input
                              type="text"
                              value={conference?.publicationInfo?.publisher || 'Conference Proceedings Series'}
                              onChange={(e) =>
                                setConference({
                                  ...conference,
                                  publicationInfo: { ...(conference?.publicationInfo || {}), publisher: e.target.value }
                                })
                              }
                              className="form-input"
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSavingConference}
                        className="btn-primary-glow"
                        style={{ marginTop: '1.5rem' }}
                      >
                        <Save size={18} /> {isSavingConference ? 'Saving Settings...' : 'Save Conference Settings'}
                      </button>
                    </form>
                  </div>
                </ErrorBoundary>
              )}
            </ErrorBoundary>
          </main>
          </div>
        </div>
      </section>

      {/* --- EDIT SPEAKER MODAL --- */}
      {editingSpeaker && (
        <div className="modal-backdrop" onClick={() => setEditingSpeaker(null)}>
          <div className="modal-card" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <h3 style={{ color: 'var(--primary-navy)', fontSize: '1.4rem' }}>
                {editingSpeaker.id.startsWith('new-') ? 'Add Keynote Speaker' : 'Edit Speaker Profile'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingSpeaker(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveSpeaker}>
              {/* Speaker Photo Upload & Management Section */}
              <div style={{
                background: 'var(--surface-light)',
                border: '1px solid var(--border-cyan)',
                borderRadius: 'var(--radius-md)',
                padding: '1.2rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                flexWrap: 'wrap'
              }}>
                {/* Photo Preview */}
                <div style={{
                  width: '96px',
                  height: '112px',
                  borderRadius: '16px',
                  background: 'var(--background-light)',
                  border: '1px dashed rgba(0, 163, 199, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(11, 45, 107, 0.08)',
                  position: 'relative'
                }}>
                  {speakerPhotoPreview || (!speakerPhotoRemoved && editingSpeaker.image) ? (
                    <img
                      src={speakerPhotoPreview || resolveImageUrl(editingSpeaker.image)}
                      alt="Speaker Preview"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'top center'
                      }}
                    />
                  ) : (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem', padding: '0.5rem' }}>
                      <ImageIcon size={26} color="var(--primary-cyan)" style={{ marginBottom: '0.2rem' }} />
                      <div>No Photo</div>
                    </div>
                  )}
                </div>

                {/* Upload, Change & Remove Controls */}
                <div style={{ flex: 1, minWidth: '220px' }}>
                  <label className="form-label" style={{ marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Upload size={15} color="var(--primary-cyan)" />
                    Speaker Photo
                  </label>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                    <label className="btn-secondary-glass" style={{
                      cursor: 'pointer',
                      padding: '0.4rem 0.9rem',
                      fontSize: '0.82rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}>
                      <Upload size={14} />
                      {speakerPhotoPreview || (!speakerPhotoRemoved && editingSpeaker.image) ? 'Change Photo' : 'Upload Photo'}
                      <input
                        type="file"
                        accept="image/jpeg, image/png, image/webp, image/jpg"
                        onChange={handleSpeakerPhotoSelect}
                        style={{ display: 'none' }}
                      />
                    </label>

                    {(speakerPhotoPreview || (!speakerPhotoRemoved && editingSpeaker.image)) && (
                      <button
                        type="button"
                        onClick={handleRemoveSpeakerPhoto}
                        className="btn-secondary-glass"
                        style={{
                          padding: '0.4rem 0.9rem',
                          fontSize: '0.82rem',
                          color: '#EF4444',
                          borderColor: 'rgba(239, 68, 68, 0.3)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem'
                        }}
                      >
                        <Trash2 size={14} />
                        Remove Photo
                      </button>
                    )}
                  </div>

                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                    JPG, PNG, or WEBP under 5 MB. Portrait photograph recommended.
                  </p>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editingSpeaker.name}
                    onChange={(e) => setEditingSpeaker({ ...editingSpeaker, name: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Designation / Title</label>
                  <input
                    type="text"
                    required
                    value={editingSpeaker.designation}
                    onChange={(e) => setEditingSpeaker({ ...editingSpeaker, designation: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Institution / University</label>
                  <input
                    type="text"
                    required
                    value={editingSpeaker.institution}
                    onChange={(e) => setEditingSpeaker({ ...editingSpeaker, institution: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Country</label>
                  <input
                    type="text"
                    value={editingSpeaker.country}
                    onChange={(e) => setEditingSpeaker({ ...editingSpeaker, country: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Track / Domain</label>
                  <select
                    value={editingSpeaker.track}
                    onChange={(e) => setEditingSpeaker({ ...editingSpeaker, track: e.target.value })}
                    className="form-select"
                  >
                    <option value="Cognitive Computing & AI">Cognitive Computing & AI</option>
                    <option value="Intelligent Networking & Next-Gen Systems">Intelligent Networking & Next-Gen Systems</option>
                    <option value="Data Science, Blockchain & Computational Systems">Data Science, Blockchain & Computational Systems</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Speaker Type</label>
                  <select
                    value={editingSpeaker.type}
                    onChange={(e) => setEditingSpeaker({ ...editingSpeaker, type: e.target.value })}
                    className="form-select"
                  >
                    <option value="Keynote">Keynote Speaker</option>
                    <option value="Invited">Invited Speaker</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Speech / Session Topic</label>
                <input
                  type="text"
                  required
                  value={editingSpeaker.topic}
                  onChange={(e) => setEditingSpeaker({ ...editingSpeaker, topic: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Biography</label>
                <textarea
                  value={editingSpeaker.bio}
                  onChange={(e) => setEditingSpeaker({ ...editingSpeaker, bio: e.target.value })}
                  className="form-textarea"
                  rows={3}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setEditingSpeaker(null)} className="btn-secondary-glass">
                  Cancel
                </button>
                <button type="submit" className="btn-primary-glow">
                  Save Speaker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- EDIT DATE MODAL --- */}
      {editingDate && (
        <div className="modal-backdrop" onClick={() => setEditingDate(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ color: 'var(--primary-navy)', fontSize: '1.4rem', marginBottom: '1.2rem' }}>
              {editingDate.id.startsWith('new-') ? 'Add Important Date' : 'Edit Date Milestone'}
            </h3>

            <form onSubmit={handleSaveDate}>
              <div className="form-group">
                <label className="form-label">Title / Milestone Name</label>
                <input
                  type="text"
                  required
                  value={editingDate.title}
                  onChange={(e) => setEditingDate({ ...editingDate, title: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Date (ISO / YYYY-MM-DD)</label>
                  <input
                    type="date"
                    required
                    value={editingDate.date}
                    onChange={(e) => setEditingDate({ ...editingDate, date: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Display Date Text (e.g. 10 APR 2027)</label>
                  <input
                    type="text"
                    value={editingDate.displayDate}
                    onChange={(e) => setEditingDate({ ...editingDate, displayDate: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <input
                  type="text"
                  value={editingDate.description}
                  onChange={(e) => setEditingDate({ ...editingDate, description: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    value={editingDate.status}
                    onChange={(e) => setEditingDate({ ...editingDate, status: e.target.value })}
                    className="form-select"
                  >
                    <option value="Open">Open</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Closed">Closed</option>
                    <option value="Major Event">Major Event</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setEditingDate(null)} className="btn-secondary-glass">
                  Cancel
                </button>
                <button type="submit" className="btn-primary-glow">
                  Save Date
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- EDIT TRACK MODAL --- */}
      {editingTrack && (
        <div className="modal-backdrop" onClick={() => setEditingTrack(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ color: 'var(--primary-navy)', fontSize: '1.4rem', marginBottom: '1.2rem' }}>
              {editingTrack.id.startsWith('new-') ? 'Add Track' : 'Edit Track Details'}
            </h3>

            <form onSubmit={handleSaveTrack}>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Track Number (e.g. 01, 02, 03)</label>
                  <input
                    type="text"
                    value={editingTrack.number}
                    onChange={(e) => setEditingTrack({ ...editingTrack, number: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Track Code</label>
                  <input
                    type="text"
                    value={editingTrack.code}
                    onChange={(e) => setEditingTrack({ ...editingTrack, code: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Track Name</label>
                <input
                  type="text"
                  required
                  value={editingTrack.name}
                  onChange={(e) => setEditingTrack({ ...editingTrack, name: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Summary</label>
                <input
                  type="text"
                  value={editingTrack.summary}
                  onChange={(e) => setEditingTrack({ ...editingTrack, summary: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Topics (One per line)</label>
                <textarea
                  value={Array.isArray(editingTrack.topics) ? editingTrack.topics.join('\n') : editingTrack.topics}
                  onChange={(e) => setEditingTrack({ ...editingTrack, topics: e.target.value })}
                  className="form-textarea"
                  rows={5}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setEditingTrack(null)} className="btn-secondary-glass">
                  Cancel
                </button>
                <button type="submit" className="btn-primary-glow">
                  Save Track
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- PDF REVIEW & WORKFLOW MODAL --- */}
      {viewingPaper && (
        <div className="modal-backdrop" onClick={() => setViewingPaper(null)}>
          <div
            className="pdf-review-modal-card"
            style={pdfFullscreen ? { width: '98vw', maxWidth: '98vw', height: '96vh', maxHeight: '96vh' } : {}}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="pdf-review-header">
              <div style={{ flex: 1, minWidth: '240px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary-cyan)', fontWeight: 800, fontSize: '1.25rem', letterSpacing: '0.05em' }}>
                    {viewingPaper.id}
                  </span>
                  <span className={`status-tag ${viewingPaper.status === 'Accepted' ? 'accepted' : viewingPaper.status === 'Rejected' ? 'rejected' : 'review'}`}>
                    {viewingPaper.status === 'Accepted' ? '✓ Accepted' : viewingPaper.status === 'Rejected' ? '✕ Rejected' : '⏳ Under Review'}
                  </span>
                  {viewingPaper.isLocked && (
                    <span className="badge" style={{ fontSize: '0.72rem', background: 'rgba(11, 45, 107, 0.06)', color: 'var(--text-muted)' }}>
                      <Lock size={12} style={{ marginRight: '4px' }} /> Locked
                    </span>
                  )}
                </div>
                <h3 style={{ color: 'var(--primary-navy)', fontSize: '1.15rem', fontWeight: 600, lineHeight: '1.35', margin: 0 }}>
                  {viewingPaper.title}
                </h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setPdfFullscreen(!pdfFullscreen)}
                  className="pdf-tool-btn"
                  title={pdfFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                >
                  {pdfFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
                <button
                  type="button"
                  onClick={() => setViewingPaper(null)}
                  style={{
                    background: 'var(--surface-light)',
                    border: '1px solid var(--glass-border)',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                  title="Close"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Sub-nav / Tab switcher */}
            <div className="pdf-toolbar">
              <div className="pdf-toolbar-group">
                <button
                  type="button"
                  onClick={() => setPdfActiveTab('pdf')}
                  className={`pdf-tool-btn ${pdfActiveTab === 'pdf' ? 'active' : ''}`}
                >
                  <FileText size={15} /> PDF Manuscript
                </button>
                <button
                  type="button"
                  onClick={() => setPdfActiveTab('abstract')}
                  className={`pdf-tool-btn ${pdfActiveTab === 'abstract' ? 'active' : ''}`}
                >
                  <BookOpen size={15} /> Metadata & Abstract
                </button>
              </div>

              {pdfActiveTab === 'pdf' && (
                <div className="pdf-toolbar-group">
                  <button
                    type="button"
                    onClick={() => setPdfZoom((z) => Math.max(50, z - 15))}
                    className="pdf-tool-btn"
                    title="Zoom Out"
                  >
                    <ZoomOut size={15} />
                  </button>
                  <span style={{ fontSize: '0.8rem', color: 'var(--primary-cyan)', fontWeight: 600, minWidth: '42px', textAlign: 'center' }}>
                    {pdfZoom}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setPdfZoom((z) => Math.min(200, z + 15))}
                    className="pdf-tool-btn"
                    title="Zoom In"
                  >
                    <ZoomIn size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPdfZoom(100)}
                    className="pdf-tool-btn"
                    title="Reset Zoom"
                  >
                    <RotateCcw size={14} /> Reset
                  </button>
                  <a
                    href={viewingPaper.filePath ? (viewingPaper.filePath.startsWith('http') ? viewingPaper.filePath : viewingPaper.filePath.startsWith('/') ? viewingPaper.filePath : '/' + viewingPaper.filePath) : '/uploads/papers/sample_paper.pdf'}
                    target="_blank"
                    rel="noreferrer"
                    className="pdf-tool-btn"
                    style={{ textDecoration: 'none' }}
                    title="Open in new tab / Download PDF"
                  >
                    <ExternalLink size={14} /> Open Tab
                  </a>
                </div>
              )}
            </div>

            {/* Modal Body */}
            <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
              {pdfActiveTab === 'pdf' ? (
                <div className="pdf-frame-container" style={{ height: pdfFullscreen ? '65vh' : '48vh' }}>
                  <iframe
                    src={`${viewingPaper.filePath ? (viewingPaper.filePath.startsWith('http') ? viewingPaper.filePath : viewingPaper.filePath.startsWith('/') ? viewingPaper.filePath : '/' + viewingPaper.filePath) : '/uploads/papers/sample_paper.pdf'}#zoom=${pdfZoom}&toolbar=1&navpanes=0`}
                    title={`PDF Review - ${viewingPaper.id}`}
                    className="pdf-frame"
                    style={{
                      transform: pdfZoom !== 100 ? `scale(${pdfZoom / 100})` : 'none',
                      transformOrigin: 'top center',
                      transition: 'transform 0.2s ease'
                    }}
                  />
                  <div className="pdf-fallback-strip">
                    <span>File: <strong>{viewingPaper.fileName || 'manuscript.pdf'}</strong></span>
                    <span>•</span>
                    <a
                      href={viewingPaper.filePath ? (viewingPaper.filePath.startsWith('http') ? viewingPaper.filePath : viewingPaper.filePath.startsWith('/') ? viewingPaper.filePath : '/' + viewingPaper.filePath) : '/uploads/papers/sample_paper.pdf'}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: 'var(--primary-cyan)', textDecoration: 'underline', fontWeight: 600 }}
                    >
                      Download Original PDF
                    </a>
                  </div>
                </div>
              ) : (
                <div style={{ background: 'var(--surface-light)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                    <div><strong style={{ color: 'var(--primary-navy)' }}>Primary Author:</strong> {viewingPaper.authors}</div>
                    <div><strong style={{ color: 'var(--primary-navy)' }}>Author Email:</strong> {viewingPaper.primaryAuthorEmail}</div>
                    <div><strong style={{ color: 'var(--primary-navy)' }}>Institution:</strong> {viewingPaper.institution}</div>
                    <div><strong style={{ color: 'var(--primary-navy)' }}>Country:</strong> {viewingPaper.country || 'India'}</div>
                    <div><strong style={{ color: 'var(--primary-navy)' }}>Conference Track:</strong> <span style={{ color: 'var(--primary-cyan)', fontWeight: 600 }}>{viewingPaper.track}</span></div>
                    <div><strong style={{ color: 'var(--primary-navy)' }}>Submission Date:</strong> {new Date(viewingPaper.submittedAt).toLocaleDateString()}</div>
                    <div><strong style={{ color: 'var(--primary-navy)' }}>Uploaded File:</strong> {viewingPaper.fileName || 'manuscript.pdf'}</div>
                    <div><strong style={{ color: 'var(--primary-navy)' }}>Keywords:</strong> {viewingPaper.keywords || 'N/A'}</div>
                  </div>

                  <div style={{ background: '#FFF', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--primary-cyan)', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                      ABSTRACT SUMMARY
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: '1.6', margin: 0, whiteSpace: 'pre-line' }}>
                      {viewingPaper.abstract}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Decision Status Banner & Actions */}
            {viewingPaper.status === 'Accepted' || viewingPaper.status === 'Rejected' ? (
              <div className={`decision-audit-banner ${viewingPaper.status === 'Accepted' ? 'accepted' : 'rejected'}`}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: viewingPaper.status === 'Accepted' ? '#10B981' : '#EF4444', fontSize: '0.95rem' }}>
                    <Lock size={16} />
                    <span>PERMANENT DECISION LOCKED: {viewingPaper.status.toUpperCase()}</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    Decided by <strong>{viewingPaper.decidedBy || 'Conference Administrator'}</strong> on {viewingPaper.decisionDate ? new Date(viewingPaper.decisionDate).toLocaleString() : new Date(viewingPaper.updatedAt || viewingPaper.submittedAt).toLocaleString()}
                  </div>
                  {viewingPaper.reviewNotes && (
                    <div style={{ fontSize: '0.85rem', color: 'var(--primary-navy)', marginTop: '0.35rem', fontStyle: 'italic' }}>
                      "{viewingPaper.reviewNotes}"
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span className={`badge ${viewingPaper.status === 'Accepted' ? 'badge-emerald' : ''}`} style={viewingPaper.status === 'Rejected' ? { color: '#EF4444', borderColor: 'rgba(239, 68, 68, 0.4)' } : {}}>
                    {viewingPaper.status === 'Accepted' ? '✓ Registered for IEEE Xplore' : '✕ Rejection Final'}
                  </span>
                  <button type="button" onClick={() => setViewingPaper(null)} className="btn-secondary-glass">
                    Close Review
                  </button>
                </div>
              </div>
            ) : (
              <div className="decision-audit-banner review">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--primary-cyan)', fontSize: '0.95rem' }}>
                    <Clock size={16} />
                    <span>MANUSCRIPT UNDER ACTIVE PEER REVIEW</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    Review the uploaded PDF above before submitting your final decision. Submitting will permanently lock this manuscript.
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setRejectConfirmPaper(viewingPaper);
                      setRejectionReason('');
                    }}
                    className="action-icon-btn delete"
                    style={{ width: 'auto', padding: '0.55rem 1.1rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <XCircle size={16} /> Reject Paper
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAcceptConfirmPaper(viewingPaper);
                      setAcceptRemarks('Paper accepted for presentation and publication in IEEE Xplore proceedings.');
                    }}
                    className="btn-primary-glow"
                    style={{ padding: '0.55rem 1.25rem', fontSize: '0.88rem' }}
                  >
                    <CheckCircle size={16} /> Accept Manuscript
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- ACCEPT CONFIRMATION MODAL --- */}
      {acceptConfirmPaper && (
        <div className="modal-backdrop" style={{ zIndex: 1100 }} onClick={() => setAcceptConfirmPaper(null)}>
          <div className="modal-card" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: '#10B981' }}>
              <CheckCircle2 size={28} />
              <h3 style={{ color: 'var(--primary-navy)', fontSize: '1.25rem', margin: 0 }}>Confirm Manuscript Acceptance</h3>
            </div>

            <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.2rem' }}>
              <div style={{ fontWeight: 700, color: 'var(--primary-cyan)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                {acceptConfirmPaper.id}
              </div>
              <div style={{ color: 'var(--primary-navy)', fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                {acceptConfirmPaper.title}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Primary Author: <strong>{acceptConfirmPaper.authors}</strong> ({acceptConfirmPaper.primaryAuthorEmail})
              </div>
            </div>

            <div style={{ marginBottom: '1.2rem' }}>
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Reviewer Remarks & Instructions for Author</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sent to author</span>
              </label>
              <textarea
                value={acceptRemarks}
                onChange={(e) => setAcceptRemarks(e.target.value)}
                className="form-textarea"
                rows={3}
                placeholder="e.g. Paper accepted for presentation and publication in IEEE Xplore. Please prepare camera-ready version."
              />
            </div>

            <div style={{ fontSize: '0.8rem', color: '#EF4444', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Lock size={14} />
              <span>Warning: This decision is permanent. The manuscript will be locked immediately.</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem' }}>
              <button
                type="button"
                onClick={() => setAcceptConfirmPaper(null)}
                className="btn-secondary-glass"
                disabled={isSubmittingDecision}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAccept}
                className="btn-primary-glow"
                disabled={isSubmittingDecision}
                style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}
              >
                {isSubmittingDecision ? 'Accepting & Locking...' : 'Confirm Acceptance'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- REJECT CONFIRMATION MODAL --- */}
      {rejectConfirmPaper && (
        <div className="modal-backdrop" style={{ zIndex: 1100 }} onClick={() => setRejectConfirmPaper(null)}>
          <div className="modal-card" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: '#EF4444' }}>
              <XCircle size={28} />
              <h3 style={{ color: 'var(--primary-navy)', fontSize: '1.25rem', margin: 0 }}>Confirm Manuscript Rejection</h3>
            </div>

            <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.2rem' }}>
              <div style={{ fontWeight: 700, color: 'var(--primary-cyan)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                {rejectConfirmPaper.id}
              </div>
              <div style={{ color: 'var(--primary-navy)', fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                {rejectConfirmPaper.title}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Primary Author: <strong>{rejectConfirmPaper.authors}</strong> ({rejectConfirmPaper.primaryAuthorEmail})
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.2rem' }}>
              <label className="form-label">
                Rejection Reason / Peer-Review Feedback *
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="form-textarea"
                rows={3}
                required
                placeholder="e.g. Does not meet technical rigor / out of conference scope / insufficient experimental evaluation."
              />
            </div>

            <div style={{ fontSize: '0.8rem', color: '#EF4444', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Lock size={14} />
              <span>Warning: This decision is permanent. The manuscript will be locked immediately.</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem' }}>
              <button
                type="button"
                onClick={() => setRejectConfirmPaper(null)}
                className="btn-secondary-glass"
                disabled={isSubmittingDecision}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="action-icon-btn delete"
                disabled={isSubmittingDecision}
                style={{ width: 'auto', padding: '0.6rem 1.4rem', fontSize: '0.88rem' }}
              >
                {isSubmittingDecision ? 'Rejecting & Locking...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* --- EDIT / ADD COMMITTEE MEMBER MODAL --- */}
      {editingCommitteeMember && (
        <div className="modal-backdrop" onClick={() => setEditingCommitteeMember(null)}>
          <div className="modal-card" style={{ maxWidth: '650px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <h3 style={{ color: 'var(--primary-navy)', fontSize: '1.4rem' }}>
                {editingCommitteeMember.id.startsWith('new-') ? 'Add Committee Member' : 'Edit Committee Member'}
              </h3>
              <button
                onClick={() => setEditingCommitteeMember(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveCommitteeMember}>
              {/* Photo Upload & Preview Section */}
              <div style={{
                background: 'var(--surface-light)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-md)',
                padding: '1.2rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                flexWrap: 'wrap'
              }}>
                {/* Photo Preview */}
                <div style={{
                  width: '90px',
                  height: '100px',
                  borderRadius: '16px',
                  background: '#FFFFFF',
                  border: '1px dashed var(--primary-cyan)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  flexShrink: 0
                }}>
                  {photoPreview || editingCommitteeMember.imageUrl ? (
                    <img
                      src={photoPreview || resolveImageUrl(editingCommitteeMember.imageUrl)}
                      alt="Cutout Preview"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        filter: 'drop-shadow(0 4px 8px rgba(11, 45, 107, 0.15))'
                      }}
                    />
                  ) : (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem', padding: '0.5rem' }}>
                      <ImageIcon size={24} color="var(--primary-cyan)" style={{ marginBottom: '0.2rem' }} />
                      <div>No Photo</div>
                    </div>
                  )}
                </div>

                {/* Upload & Actions */}
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label className="form-label" style={{ marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Upload size={15} color="var(--primary-cyan)" />
                    Member Portrait / Photo
                  </label>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handlePhotoSelect}
                    className="form-input"
                    style={{ padding: '0.35rem 0.6rem', fontSize: '0.82rem', marginBottom: '0.5rem' }}
                  />
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                    Transparent PNG or cutout portrait recommended for 3D floating effect.
                  </p>

                  {(editingCommitteeMember.imageUrl || photoPreview) && (
                    <button
                      type="button"
                      onClick={handleRemoveCommitteePhoto}
                      className="btn-secondary-glass"
                      style={{ padding: '0.3rem 0.8rem', fontSize: '0.78rem', marginTop: '0.5rem', color: '#EF4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                    >
                      <Trash2 size={13} style={{ marginRight: 4 }} />
                      Remove Photograph
                    </button>
                  )}
                </div>
              </div>

              {/* Main Fields */}
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={editingCommitteeMember.name || ''}
                    onChange={(e) => setEditingCommitteeMember({ ...editingCommitteeMember, name: e.target.value })}
                    className="form-input"
                    placeholder="e.g. Dr. L. Rathaiah"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Conference Role *</label>
                  <input
                    type="text"
                    required
                    value={editingCommitteeMember.role || ''}
                    onChange={(e) => setEditingCommitteeMember({ ...editingCommitteeMember, role: e.target.value })}
                    className="form-input"
                    placeholder="e.g. Chairman / General Chair / TPC Member"
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <input
                    list="committee-categories-list"
                    type="text"
                    required
                    value={editingCommitteeMember.category || ''}
                    onChange={(e) => setEditingCommitteeMember({ ...editingCommitteeMember, category: e.target.value })}
                    className="form-input"
                    placeholder="Select or type category"
                  />
                  <datalist id="committee-categories-list">
                    {availableCommitteeCategories.map((cat) => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                </div>

                <div className="form-group">
                  <label className="form-label">Academic Designation</label>
                  <input
                    type="text"
                    value={editingCommitteeMember.designation || ''}
                    onChange={(e) => setEditingCommitteeMember({ ...editingCommitteeMember, designation: e.target.value })}
                    className="form-input"
                    placeholder="e.g. Professor / Dean / HOD"
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Institution / Organization *</label>
                  <input
                    type="text"
                    required
                    value={editingCommitteeMember.institution || editingCommitteeMember.org || ''}
                    onChange={(e) => setEditingCommitteeMember({ ...editingCommitteeMember, institution: e.target.value, org: e.target.value })}
                    className="form-input"
                    placeholder="e.g. Vignan's Group / IIT Mandi / MIT"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Department / School</label>
                  <input
                    type="text"
                    value={editingCommitteeMember.department || ''}
                    onChange={(e) => setEditingCommitteeMember({ ...editingCommitteeMember, department: e.target.value })}
                    className="form-input"
                    placeholder="e.g. Department of CSE"
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Country</label>
                  <input
                    type="text"
                    value={editingCommitteeMember.country || 'India'}
                    onChange={(e) => setEditingCommitteeMember({ ...editingCommitteeMember, country: e.target.value })}
                    className="form-input"
                    placeholder="e.g. India / USA / Japan"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email (Optional)</label>
                  <input
                    type="email"
                    value={editingCommitteeMember.email || ''}
                    onChange={(e) => setEditingCommitteeMember({ ...editingCommitteeMember, email: e.target.value })}
                    className="form-input"
                    placeholder="e.g. faculty@vignan.ac.in"
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Display Order (Lower appears first)</label>
                  <input
                    type="number"
                    value={editingCommitteeMember.displayOrder || 1}
                    onChange={(e) => setEditingCommitteeMember({ ...editingCommitteeMember, displayOrder: Number(e.target.value) })}
                    className="form-input"
                  />
                </div>

                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginTop: '1.8rem' }}>
                  <input
                    type="checkbox"
                    id="member-active-toggle"
                    checked={editingCommitteeMember.isActive !== false}
                    onChange={(e) => setEditingCommitteeMember({ ...editingCommitteeMember, isActive: e.target.checked })}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--primary-cyan)' }}
                  />
                  <label htmlFor="member-active-toggle" style={{ color: 'var(--primary-navy)', fontSize: '0.9rem', cursor: 'pointer' }}>
                    Active (Visible on public Committee page)
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Short Biography / Profile Notes</label>
                <textarea
                  value={editingCommitteeMember.bio || ''}
                  onChange={(e) => setEditingCommitteeMember({ ...editingCommitteeMember, bio: e.target.value })}
                  className="form-textarea"
                  rows={3}
                  placeholder="Optional academic bio or achievements..."
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setEditingCommitteeMember(null)} className="btn-secondary-glass">
                  Cancel
                </button>
                <button type="submit" disabled={isUploadingPhoto} className="btn-primary-glow">
                  <Save size={16} />
                  <span>{isUploadingPhoto ? 'Uploading & Saving...' : 'Save Member'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
