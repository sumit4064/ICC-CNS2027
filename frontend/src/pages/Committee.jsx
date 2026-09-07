import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { api } from '../services/api';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { resolveImageUrl } from '../utils/imageUrl';
import {
  Shield,
  Award,
  Users,
  Search,
  Sparkles,
  Building2,
  Globe2,
  Mail,
  Briefcase,
  X,
  RotateCcw,
  UserCheck,
  GraduationCap,
  ChevronRight
} from 'lucide-react';

export const Committee = () => {
  const [committee, setCommittee] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedMember, setSelectedMember] = useState(null);

  const fetchCommitteeData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getCommittee();
      if (res.success && res.data) {
        setCommittee(res.data);
      } else {
        setError('Unable to load committee members.');
      }
    } catch (err) {
      console.error('Failed to load committee:', err);
      setError(err.message || 'Unable to load committee members.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCommitteeData();
  }, [fetchCommitteeData]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedMember(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filterTabs = [
    'All',
    'Patrons & Leadership',
    'Advisory Committees',
    'Technical Program (TPC)',
    'Organizing Committees'
  ];

  // Map individual category string to top-level filter tab
  const getTabForCategory = (categoryName = '') => {
    const name = categoryName.toLowerCase();
    if (
      name.includes('patron') ||
      name.includes('general chair') ||
      name.includes('organizing chair') ||
      name.includes('honorary chair') ||
      name.includes('conference chair') ||
      name.includes('publication chair') ||
      name.includes('leadership')
    ) {
      return 'Patrons & Leadership';
    }
    if (name.includes('advisory')) {
      return 'Advisory Committees';
    }
    if (name.includes('technical program committee') || name.includes('tpc')) {
      return 'Technical Program (TPC)';
    }
    return 'Organizing Committees';
  };

  // Canonical preferred order of categories
  const categoryOrderMap = {
    'chief patrons': 1,
    'patrons': 2,
    'general chair': 3,
    'organizing chair': 4,
    'honorary chairs': 5,
    'conference chair': 6,
    'publication chair': 7,
    'conference leadership': 8,
    'international advisory chairs': 9,
    'international advisory committee': 10,
    'national advisory committee': 11,
    'technical program committee': 12,
    'conference co-convenors': 13,
    'technical chairs': 14,
    'publication co-chairs': 15,
    'conference core committee': 16,
    'technical program associates': 17,
    'coordinators - registration & session management committee': 18,
    'coordinators - finance committee': 19,
    'coordinators - websites, brochure & event promotion committee': 20,
    'coordinators - media & publicity committee': 21,
    'coordinators - organizing & hospitality committee': 22
  };

  // Group and filter members dynamically
  const { groupedSections, totalMatchingMembers } = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    // 1. Filter members by search & category tab
    const filtered = committee.filter((member) => {
      // Must be active
      if (member.isActive === false) return false;

      // Filter Tab match
      if (selectedFilter !== 'All') {
        const memberTab = getTabForCategory(member.category);
        if (memberTab !== selectedFilter) return false;
      }

      // Search Query match
      if (query) {
        const nameMatch = (member.name || '').toLowerCase().includes(query);
        const roleMatch = (member.role || '').toLowerCase().includes(query);
        const orgMatch = (member.institution || member.org || '').toLowerCase().includes(query);
        const deptMatch = (member.department || '').toLowerCase().includes(query);
        const desigMatch = (member.designation || '').toLowerCase().includes(query);
        const catMatch = (member.category || '').toLowerCase().includes(query);
        const countryMatch = (member.country || '').toLowerCase().includes(query);

        if (!nameMatch && !roleMatch && !orgMatch && !deptMatch && !desigMatch && !catMatch && !countryMatch) {
          return false;
        }
      }

      return true;
    });

    // 2. Group filtered members by category
    const groupMap = new Map();

    filtered.forEach((member) => {
      const cat = member.category || 'Organizing Committee';
      if (!groupMap.has(cat)) {
        groupMap.set(cat, []);
      }
      groupMap.get(cat).push(member);
    });

    // 3. Sort categories according to preferred sequence
    const sortedCategories = Array.from(groupMap.keys()).sort((a, b) => {
      const orderA = categoryOrderMap[a.toLowerCase()] || 99;
      const orderB = categoryOrderMap[b.toLowerCase()] || 99;
      if (orderA !== orderB) return orderA - orderB;
      return a.localeCompare(b);
    });

    // Sort members within each group by displayOrder, then name
    const resultGroups = sortedCategories.map((category) => {
      const members = groupMap.get(category).sort((a, b) => {
        const oA = typeof a.displayOrder === 'number' ? a.displayOrder : 9999;
        const oB = typeof b.displayOrder === 'number' ? b.displayOrder : 9999;
        if (oA !== oB) return oA - oB;
        return (a.name || '').localeCompare(b.name || '');
      });
      return {
        category,
        members
      };
    });

    return {
      groupedSections: resultGroups,
      totalMatchingMembers: filtered.length
    };
  }, [committee, selectedFilter, searchQuery]);

  // Initials generator for placeholder avatar
  const getInitials = (name = '') => {
    const clean = name.replace(/^(Dr\.|Prof\.|Sri|Mr\.|Mrs\.|Ms\.)\s+/i, '').trim();
    const parts = clean.split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return (parts[0] || 'C')[0].toUpperCase();
  };

  return (
    <ErrorBoundary title="Conference Committee could not be loaded." onRetry={fetchCommitteeData}>
      <div className="committee-page">
        {/* 1. HERO SECTION */}
        <section className="page-header-section">
        <div className="content-container">
          <span className="page-header-badge">
            <Sparkles size={14} style={{ marginRight: 6, display: 'inline' }} />
            ICC-CNS 2027
          </span>
          <h1 className="page-header-title">Conference Committee</h1>
          <p className="page-header-subtitle">
            Meet the distinguished leaders, researchers, academicians and professionals contributing to ICC-CNS 2027.
          </p>
        </div>
      </section>

      {/* 2. BODY SECTION */}
      <section className="page-body-section" style={{ paddingTop: '2rem' }}>
        <div className="content-container" style={{ maxWidth: '1240px' }}>

          {/* Short Introduction */}
          <div className="committee-intro-card">
            <div className="committee-intro-icon">
              <GraduationCap size={24} />
            </div>
            <p className="committee-intro-text">
              The ICC-CNS 2027 organizing and technical committees bring together distinguished academic leaders, researchers and professionals who contribute their expertise to the successful organization of the conference.
            </p>
          </div>

          {/* 3. FILTER & SEARCH BAR */}
          <div className="committee-controls-panel">
            {/* Filter Pills */}
            <div className="committee-filter-tabs">
              {filterTabs.map((tab) => (
                <button
                  key={tab}
                  className={`committee-filter-btn ${selectedFilter === tab ? 'active' : ''}`}
                  onClick={() => setSelectedFilter(tab)}
                >
                  {tab === 'All' && <Users size={16} />}
                  {tab === 'Patrons & Leadership' && <Shield size={16} />}
                  {tab === 'Advisory Committees' && <Globe2 size={16} />}
                  {tab === 'Technical Program (TPC)' && <Award size={16} />}
                  {tab === 'Organizing Committees' && <Building2 size={16} />}
                  <span>{tab}</span>
                </button>
              ))}
            </div>

            {/* Search Input Row */}
            <div className="committee-search-row">
              <div className="committee-search-box">
                <Search size={18} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                <input
                  type="text"
                  className="committee-search-input"
                  placeholder="Search member, role, or institution..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    className="committee-search-clear"
                    onClick={() => setSearchQuery('')}
                    title="Clear search"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Dynamic Results Counter */}
              <div className="committee-results-badge">
                {loading ? 'Loading...' : `${totalMatchingMembers} ${totalMatchingMembers === 1 ? 'member' : 'members'} found`}
              </div>
            </div>
          </div>

          {/* 4. LOADING SKELETON */}
          {loading && (
            <div className="committee-skeleton-grid">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="committee-skeleton-card">
                  <div className="skeleton-photo-circle" />
                  <div className="skeleton-line title" />
                  <div className="skeleton-line subtitle" />
                  <div className="skeleton-line org" />
                </div>
              ))}
            </div>
          )}

          {/* 5. ERROR RETRY STATE */}
          {!loading && error && (
            <div style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              background: 'var(--surface-white)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: '20px',
              maxWidth: '540px',
              margin: '0 auto',
              boxShadow: 'var(--card-shadow)'
            }}>
              <p style={{ color: 'var(--primary-navy)', fontSize: '1.1rem', marginBottom: '1.2rem' }}>
                {error}
              </p>
              <button
                onClick={fetchCommitteeData}
                className="btn-primary-glow"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}
              >
                <RotateCcw size={16} />
                <span>Retry Loading</span>
              </button>
            </div>
          )}

          {/* 6. EMPTY SEARCH STATE */}
          {!loading && !error && groupedSections.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '5rem 2rem',
              background: 'var(--surface-white)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '24px',
              boxShadow: 'var(--card-shadow)'
            }}>
              <Users size={48} color="var(--primary-cyan)" style={{ marginBottom: '1rem', opacity: 0.6 }} />
              <h3 style={{ color: 'var(--primary-navy)', fontSize: '1.3rem', marginBottom: '0.5rem' }}>
                No committee members found
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                No records matched your search query "{searchQuery}" under the selected filter.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedFilter('All');
                }}
                className="btn-secondary-glass"
              >
                Reset Filters & Search
              </button>
            </div>
          )}

          {/* 7. DYNAMIC CATEGORY SECTIONS & MEMBER CARDS */}
          {!loading && !error && groupedSections.map((group, gIdx) => (
            <div key={group.category} className="committee-category-section">
              {/* Category Header */}
              <div className="committee-category-header">
                <div className="committee-category-title-wrap">
                  <div className="committee-category-icon">
                    <Shield size={20} />
                  </div>
                  <h2 className="committee-category-title">
                    {group.category}
                  </h2>
                </div>
                <span className="committee-category-count">
                  {group.members.length} {group.members.length === 1 ? 'Member' : 'Members'}
                </span>
              </div>

              {/* Members Grid */}
              <div className="committee-grid">
                {group.members.map((member) => {
                  const resolvedPhotoUrl = resolveImageUrl(member.imageUrl);
                  const hasPhoto = Boolean(resolvedPhotoUrl);
                  const institutionText = member.institution || member.org || '';

                  return (
                    <div
                      key={member.id || member._id}
                      className="committee-card"
                      onClick={() => setSelectedMember(member)}
                      title="Click to view member profile"
                    >
                      {/* Photo Area with Balanced Rounded Frame */}
                      <div className="member-photo-wrapper">
                        {hasPhoto ? (
                          <img
                            src={resolvedPhotoUrl}
                            alt={member.name}
                            className="member-photo"
                            loading="lazy"
                            decoding="async"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              const placeholderEl = e.target.parentElement?.querySelector('.member-placeholder');
                              if (placeholderEl) placeholderEl.style.display = 'flex';
                            }}
                          />
                        ) : null}

                        {/* Theme Placeholder Avatar (shown if no photo or error) */}
                        <div
                          className="member-placeholder"
                          style={{ display: hasPhoto ? 'none' : 'flex' }}
                        >
                          <div className="member-placeholder-avatar">
                            {getInitials(member.name)}
                          </div>
                          <span className="member-placeholder-tag">Faculty</span>
                        </div>
                      </div>

                      {/* Subtle Visual Divider */}
                      <div className="member-card-divider" />

                      {/* Information Area */}
                      <div className="member-info-content">
                        <h3 className="member-name">
                          {member.name}
                        </h3>

                        {(member.role || member.designation) && (
                          <div className="member-role">
                            {member.role || member.designation}
                          </div>
                        )}

                        {institutionText && (
                          <div className="member-institution">
                            {institutionText}
                          </div>
                        )}

                        {/* Country Tag */}
                        {member.country && member.country !== 'India' && (
                          <div className="member-badge-row">
                            <span className="member-country-tag">
                              {member.country}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

        </div>
      </section>

      {/* 8. MEMBER DETAILS MODAL */}
      {selectedMember && (
        <div
          className="committee-modal-overlay"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="committee-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="committee-modal-close"
              onClick={() => setSelectedMember(null)}
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {/* Modal Left: Portrait Cutout */}
            <div className="committee-modal-left">
              {resolveImageUrl(selectedMember.imageUrl) ? (
                <img
                  src={resolveImageUrl(selectedMember.imageUrl)}
                  alt={selectedMember.name}
                  className="committee-modal-photo"
                />
              ) : (
                <div className="member-placeholder" style={{ width: '160px', height: '190px' }}>
                  <div className="member-placeholder-avatar" style={{ width: '70px', height: '70px', fontSize: '1.7rem' }}>
                    {getInitials(selectedMember.name)}
                  </div>
                  <span className="member-placeholder-tag">ICC-CNS 2027</span>
                </div>
              )}
            </div>

            {/* Modal Right: Details */}
            <div className="committee-modal-right">
              <span className="committee-modal-category">
                {selectedMember.category}
              </span>

              <h2 className="committee-modal-name">
                {selectedMember.name}
              </h2>

              {selectedMember.role && (
                <div className="committee-modal-role">
                  {selectedMember.role}
                </div>
              )}

              <div className="committee-modal-detail-list">
                {(selectedMember.institution || selectedMember.org) && (
                  <div className="committee-modal-detail-item">
                    <Building2 size={16} color="var(--accent-teal)" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span>{selectedMember.institution || selectedMember.org}</span>
                  </div>
                )}

                {selectedMember.department && (
                  <div className="committee-modal-detail-item">
                    <Briefcase size={16} color="var(--accent-cyan)" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span>{selectedMember.department}</span>
                  </div>
                )}

                {selectedMember.country && (
                  <div className="committee-modal-detail-item">
                    <Globe2 size={16} color="#10B981" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span>{selectedMember.country}</span>
                  </div>
                )}

                {selectedMember.email && (
                  <div className="committee-modal-detail-item">
                    <Mail size={16} color="var(--accent-orange)" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span>{selectedMember.email}</span>
                  </div>
                )}
              </div>

              {selectedMember.bio && (
                <p className="committee-modal-bio">
                  {selectedMember.bio}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  </ErrorBoundary>
);
};


