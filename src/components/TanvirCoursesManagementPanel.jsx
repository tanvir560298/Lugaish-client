import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Users, 
  Calendar, 
  MapPin, 
  Sparkles, 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  Layers, 
  ExternalLink, 
  X, 
  Search, 
  Award, 
  AlertCircle, 
  Filter, 
  ShieldCheck,
  Zap,
  ArrowRight,
  Compass,
  Upload,
  Download,
  PlayCircle,
  FileText,
  Mic,
  HelpCircle,
  Video,
  Copy,
  Check,
  Eye,
  Headphones,
  Lightbulb
} from 'lucide-react';
import { 
  loadTanvirCourses, 
  saveTanvirCourses,
  loadCoursePlan,
  saveCoursePlan,
  DEFAULT_COURSE_PLANS,
  IELTS_BAND_7_MONTH_THEMES,
  SPOKEN_ENGLISH_MONTH_THEMES
} from '../data/tanvirCoursesData.js';
import { useNavigate } from 'react-router-dom';

const STATUS_CONFIG = {
  active: {
    label: 'Active & Running',
    badgeClass: 'border-emerald-400/40 bg-emerald-500/10 text-emerald-300',
    pingClass: 'bg-emerald-400',
  },
  enrolling: {
    label: 'Enrolling Now',
    badgeClass: 'border-cyan-400/40 bg-cyan-500/10 text-cyan-300',
    pingClass: 'bg-cyan-400',
  },
  upcoming: {
    label: 'Upcoming Cohort',
    badgeClass: 'border-amber-400/40 bg-amber-500/10 text-amber-300',
    pingClass: 'bg-amber-400',
  },
  draft: {
    label: 'Draft (Hidden)',
    badgeClass: 'border-slate-500/40 bg-slate-500/10 text-slate-400',
    pingClass: 'bg-slate-400',
  },
};

export function TanvirCoursesManagementPanel() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState(() => loadTanvirCourses());
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [workingCourse, setWorkingCourse] = useState(null);
  const [planningCourse, setPlanningCourse] = useState(null);
  const [notification, setNotification] = useState('');

  const triggerNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  // Sync to storage on state changes
  const updateCoursesState = (newCourses) => {
    setCourses(newCourses);
    saveTanvirCourses(newCourses);
  };

  // Filtered courses
  const filteredCourses = useMemo(() => {
    return courses.filter(c => {
      const matchesStatus = statusFilter === 'all' ? true : c.status === statusFilter;
      const matchesSearch = searchQuery.trim() === '' ? true : (
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return matchesStatus && matchesSearch;
    });
  }, [courses, statusFilter, searchQuery]);

  // Aggregate stats
  const stats = useMemo(() => {
    const total = courses.length;
    const activeOrEnrolling = courses.filter(c => ['active', 'enrolling'].includes(c.status)).length;
    const totalEnrolled = courses.reduce((acc, c) => acc + (Number(c.enrolledCount) || 0), 0);
    const totalSeats = courses.reduce((acc, c) => acc + (Number(c.seatLimit) || 0), 0);
    return { total, activeOrEnrolling, totalEnrolled, totalSeats };
  }, [courses]);

  // Handlers
  const handleCreateCourse = (formData) => {
    const newCourse = {
      ...formData,
      id: `tanvir-course-${Date.now()}`,
      instructor: 'Tanvir Ahmad',
      createdAt: new Date().toISOString(),
      enrolledCount: Number(formData.enrolledCount) || 0,
      seatLimit: Number(formData.seatLimit) || 20,
      totalDays: Number(formData.totalDays) || 30,
    };
    const updated = [newCourse, ...courses];
    updateCoursesState(updated);
    setCreateModalOpen(false);
    triggerNotification(`Created "${newCourse.title}" successfully!`);
  };

  const handleUpdateCourse = (id, updates) => {
    const updated = courses.map(c => c.id === id ? { ...c, ...updates } : c);
    updateCoursesState(updated);
    setEditingCourse(null);
    if (workingCourse?.id === id) {
      setWorkingCourse({ ...workingCourse, ...updates });
    }
    triggerNotification('Course updated successfully.');
  };

  const handleDeleteCourse = (id, title) => {
    if (window.confirm(`Are you sure you want to remove the course "${title}"?`)) {
      const updated = courses.filter(c => c.id !== id);
      updateCoursesState(updated);
      if (workingCourse?.id === id) setWorkingCourse(null);
      triggerNotification(`Removed "${title}".`);
    }
  };

  return (
    <div id="tanvir-courses-hub" className="section-card relative overflow-hidden p-6 sm:p-8 md:p-10 border border-purple-500/20 bg-slate-900/60 shadow-2xl backdrop-blur-xl">
      {/* Decorative ambient gradients */}
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-purple-600/10 blur-[90px] pointer-events-none" />
      <div className="absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-blue-600/10 blur-[90px] pointer-events-none" />

      {/* Header Banner */}
      <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-400/40 bg-purple-500/15 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-purple-300">
              <ShieldCheck size={13} /> Developer View Only
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-blue-300">
              Instructor: Tanvir Ahmad
            </span>
          </div>
          <h2 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight text-white">
            Courses Offered by Tanvir Ahmad
          </h2>
          <p className="mt-1 text-sm text-slate-400 max-w-2xl">
            View, launch, and manage all courses conducted and offered by Tanvir Ahmad. Work with cohorts, tune curriculum days, inspect student capacity, and launch new offerings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 px-5 py-3.5 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-purple-600/25 transition active:scale-95"
          >
            <Plus size={16} /> Create Course
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="relative z-10 mt-4 flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-500/15 p-3 text-xs font-bold text-emerald-200"
          >
            <CheckCircle2 size={16} className="text-emerald-400" />
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Metrics Row */}
      <div className="relative z-10 mt-6 grid gap-4 grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Courses</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white">{stats.total}</span>
            <span className="text-xs font-semibold text-purple-300">Curated</span>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Active Cohorts</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400">{stats.activeOrEnrolling}</span>
            <span className="text-xs font-semibold text-emerald-300/80">Open / Live</span>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Enrolled Learners</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-blue-300">{stats.totalEnrolled}</span>
            <span className="text-xs text-slate-400">/ {stats.totalSeats} seats</span>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Cohort Occupancy</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-amber-300">
              {stats.totalSeats > 0 ? Math.round((stats.totalEnrolled / stats.totalSeats) * 100) : 0}%
            </span>
            <span className="text-xs font-semibold text-slate-400">Filled</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="relative z-10 mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] p-1">
          {['all', 'active', 'enrolling', 'upcoming', 'draft'].map(statusKey => (
            <button
              key={statusKey}
              type="button"
              onClick={() => setStatusFilter(statusKey)}
              className={`rounded-lg px-3 py-1.5 text-[11px] font-black uppercase tracking-wider transition ${
                statusFilter === statusKey
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {statusKey === 'all' ? 'All Courses' : statusKey}
            </button>
          ))}
        </div>

        <div className="relative min-w-[220px]">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search offered courses..."
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 outline-none transition focus:border-purple-400/50"
          />
        </div>
      </div>

      {/* Courses Cards Grid */}
      <div className="relative z-10 mt-6 grid gap-5 lg:grid-cols-2">
        {filteredCourses.map(course => {
          const status = STATUS_CONFIG[course.status] || STATUS_CONFIG.draft;
          const percentFilled = course.seatLimit > 0 ? Math.min(Math.round((course.enrolledCount / course.seatLimit) * 100), 100) : 0;

          return (
            <div
              key={course.id}
              className="group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-5 sm:p-6 transition duration-300 hover:border-purple-500/40 hover:shadow-xl hover:shadow-purple-900/10"
            >
              <div>
                {/* Card Top Pill Row */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-black uppercase tracking-widest text-purple-300 border border-purple-400/20 bg-purple-500/10 px-2.5 py-0.5 rounded-full">
                      {course.category}
                    </span>
                    {course.duration && (
                      <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 border border-amber-400/25 bg-amber-500/10 px-2.5 py-0.5 rounded-full">
                        ⏳ {course.duration}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${status.badgeClass}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${status.pingClass} animate-ping`} />
                      {status.label}
                    </span>
                  </div>
                </div>

                {/* Course Title & Subtitle */}
                <h3 className="text-xl font-black text-white group-hover:text-purple-200 transition">
                  {course.title}
                </h3>
                {course.subtitle && (
                  <p className="mt-1 text-xs font-semibold text-slate-400">
                    {course.subtitle}
                  </p>
                )}

                {/* Instructor & Co-Instructor Badge */}
                <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-bold text-slate-300">
                    Lead Instructor: <span className="text-white font-extrabold">{course.instructor}</span>
                  </span>
                  {course.coInstructor && (
                    <span className="text-slate-400">
                      • Co-Lead: <span className="text-emerald-300 font-bold">{course.coInstructor}</span>
                    </span>
                  )}
                </div>

                {/* Description snippet */}
                <p className="mt-3 text-xs leading-relaxed text-slate-300 line-clamp-3">
                  {course.description}
                </p>

                {/* Metadata Pills */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                  <div className="flex items-center gap-1.5 rounded-xl border border-white/5 bg-white/[0.02] p-2">
                    <Clock size={14} className="text-purple-400 shrink-0" />
                    <span className="truncate">{course.totalDays} Days Curriculum</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-xl border border-white/5 bg-white/[0.02] p-2">
                    <Calendar size={14} className="text-cyan-400 shrink-0" />
                    <span className="truncate">{course.schedule || 'Scheduled Cohort'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-xl border border-white/5 bg-white/[0.02] p-2">
                    <MapPin size={14} className="text-emerald-400 shrink-0" />
                    <span className="truncate">{course.venue || course.format}</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-xl border border-white/5 bg-white/[0.02] p-2">
                    <Award size={14} className="text-amber-400 shrink-0" />
                    <span className="truncate">{course.price || 'Free'}</span>
                  </div>
                </div>

                {/* Capacity Bar */}
                <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/60 p-3">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Users size={13} className="text-blue-400" /> Learner Capacity
                    </span>
                    <span className="text-white">
                      {course.enrolledCount} / {course.seatLimit} seats ({percentFilled}%)
                    </span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        percentFilled >= 100 
                          ? 'bg-amber-400' 
                          : percentFilled >= 70 
                            ? 'bg-purple-400' 
                            : 'bg-emerald-400'
                      }`}
                      style={{ width: `${percentFilled}%` }}
                    />
                  </div>
                </div>

                {/* Tags */}
                {course.tags?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {course.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="rounded-md bg-white/5 px-2 py-0.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons Row ("oita nia kaj korte parbo") */}
              <div className="mt-6 flex flex-wrap items-center gap-2 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setPlanningCourse(course)}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-md shadow-emerald-950/40 transition active:scale-95"
                >
                  <Compass size={15} /> Open Plan
                </button>

                <button
                  type="button"
                  onClick={() => setWorkingCourse(course)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 px-3.5 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-md transition active:scale-95"
                  title="Workspace & Quick Operations"
                >
                  <Layers size={14} /> Workspace
                </button>

                <button
                  type="button"
                  onClick={() => setEditingCourse(course)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 px-3 py-2.5 text-xs font-bold text-slate-200 transition"
                  title="Edit details"
                >
                  <Edit3 size={14} /> Edit
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteCourse(course.id, course.title)}
                  className="inline-flex items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 p-2.5 text-xs text-red-400 transition"
                  title="Delete course"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}

        {filteredCourses.length === 0 && (
          <div className="col-span-full py-12 text-center rounded-3xl border border-dashed border-white/10 bg-white/[0.01]">
            <BookOpen size={36} className="mx-auto text-slate-600 mb-3" />
            <p className="text-sm font-bold text-slate-400">No courses match your filter.</p>
            <button
              type="button"
              onClick={() => { setStatusFilter('all'); setSearchQuery(''); }}
              className="mt-3 text-xs font-black text-purple-400 hover:underline"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>

      {/* --- MODAL 1: CREATE NEW COURSE --- */}
      <AnimatePresence>
        {createModalOpen && (
          <CourseFormModal
            title="Create Course Offered by Tanvir Ahmad"
            initialData={{
              title: '',
              subtitle: '',
              category: 'Language Immersion',
              format: 'In-Person (Dhaka Hub)',
              status: 'enrolling',
              totalDays: 30,
              seatLimit: 12,
              enrolledCount: 0,
              schedule: 'Fri & Sat • 6:00 PM',
              venue: 'Dhaka Hub / Online',
              price: '3,500 BDT',
              description: '',
              tags: 'Tanvir Ahmad, Interactive, Mentorship',
            }}
            onClose={() => setCreateModalOpen(false)}
            onSubmit={handleCreateCourse}
          />
        )}
      </AnimatePresence>

      {/* --- MODAL 2: EDIT COURSE DETAILS --- */}
      <AnimatePresence>
        {editingCourse && (
          <CourseFormModal
            title={`Edit Course: ${editingCourse.title}`}
            initialData={{
              ...editingCourse,
              tags: Array.isArray(editingCourse.tags) ? editingCourse.tags.join(', ') : editingCourse.tags || '',
            }}
            onClose={() => setEditingCourse(null)}
            onSubmit={(updates) => handleUpdateCourse(editingCourse.id, updates)}
          />
        )}
      </AnimatePresence>

      {/* --- MODAL 3: WORK ON COURSE / WORKSPACE HUB --- */}
      <AnimatePresence>
        {workingCourse && (
          <CourseWorkspaceModal
            course={workingCourse}
            onClose={() => setWorkingCourse(null)}
            onUpdateCourse={(updates) => handleUpdateCourse(workingCourse.id, updates)}
            navigate={navigate}
          />
        )}
      </AnimatePresence>

      {/* --- MODAL 4: OPEN PLAN (CURRICULUM & OUTPUT MANAGER) --- */}
      <AnimatePresence>
        {planningCourse && (
          <CoursePlanModal
            course={planningCourse}
            onClose={() => setPlanningCourse(null)}
            navigate={navigate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- MODAL COMPONENT: FORM MODAL ---------------- */
function CourseFormModal({ title, initialData, onClose, onSubmit }) {
  const [formData, setFormData] = useState(initialData);

  const handleSubmit = (e) => {
    e.preventDefault();
    const processedTags = typeof formData.tags === 'string'
      ? formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      : formData.tags || [];

    onSubmit({
      ...formData,
      tags: processedTags,
    });
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-900 p-6 sm:p-8 shadow-2xl my-8"
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">
              Instructor: Tanvir Ahmad
            </span>
            <h3 className="text-xl font-black text-white">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                Course Title *
              </label>
              <input
                required
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Spoken Fluency Cohort"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-purple-400"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                Subtitle / Motto
              </label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="e.g. Master conversation in 4 weeks"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-purple-400"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                Duration
              </label>
              <input
                type="text"
                value={formData.duration || ''}
                onChange={e => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g. 3 Months"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-purple-400"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                Category
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g. Spoken English"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-purple-400"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-purple-400"
              >
                <option value="enrolling">Enrolling Now</option>
                <option value="active">Active & Running</option>
                <option value="upcoming">Upcoming Cohort</option>
                <option value="draft">Draft (Hidden)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                Fee / Pricing
              </label>
              <input
                type="text"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
                placeholder="e.g. Upcoming or 3,500 BDT"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-purple-400"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                Total Days / Modules
              </label>
              <input
                type="number"
                min="1"
                max="365"
                value={formData.totalDays}
                onChange={e => setFormData({ ...formData, totalDays: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-purple-400"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                Seat Limit (Capacity)
              </label>
              <input
                type="number"
                min="1"
                max="1000"
                value={formData.seatLimit}
                onChange={e => setFormData({ ...formData, seatLimit: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-purple-400"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                Currently Enrolled
              </label>
              <input
                type="number"
                min="0"
                max="1000"
                value={formData.enrolledCount}
                onChange={e => setFormData({ ...formData, enrolledCount: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-purple-400"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                Schedule & Timings
              </label>
              <input
                type="text"
                value={formData.schedule}
                onChange={e => setFormData({ ...formData, schedule: e.target.value })}
                placeholder="e.g. Fri & Sat • 6:30 PM - 8:30 PM"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-purple-400"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                Venue or Platform
              </label>
              <input
                type="text"
                value={formData.venue}
                onChange={e => setFormData({ ...formData, venue: e.target.value })}
                placeholder="e.g. Banani Hub / Lugaish Portal"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-purple-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
              Course Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Explain the course curriculum, target students, and key learning outcomes..."
              className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white outline-none focus:border-purple-400"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={e => setFormData({ ...formData, tags: e.target.value })}
              placeholder="In-Person, Intensive, Speaking"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-purple-400"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-purple-600 hover:bg-purple-500 px-6 py-2 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-purple-600/20"
            >
              Save Course
            </button>
          </div>
        </form>
      </motion.div>
    </div>,
    document.body
  );
}

/* ---------------- MODAL COMPONENT: WORKSPACE MODAL ---------------- */
function CourseWorkspaceModal({ course, onClose, onUpdateCourse, navigate }) {
  const [quickSeatDelta, setQuickSeatDelta] = useState(0);

  const handleAdjustSeats = (delta) => {
    const nextEnrolled = Math.max(0, Math.min(course.seatLimit, (course.enrolledCount || 0) + delta));
    onUpdateCourse({ enrolledCount: nextEnrolled });
  };

  const handleStatusChange = (newStatus) => {
    onUpdateCourse({ status: newStatus });
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-3xl rounded-3xl border border-purple-500/30 bg-slate-900 p-6 sm:p-8 shadow-2xl my-8"
      >
        <div className="flex items-start justify-between pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-purple-300 border border-purple-400/20 bg-purple-500/10 px-2.5 py-0.5 rounded-full">
                Course Workspace
              </span>
              <span className="text-[10px] font-bold text-slate-400">
                Offered by Tanvir Ahmad
              </span>
            </div>
            <h3 className="mt-2 text-2xl font-black text-white">{course.title}</h3>
            {course.subtitle && (
              <p className="text-xs text-slate-400 mt-0.5">{course.subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Quick Operations Strip */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live Status</p>
            <div className="mt-2">
              <select
                value={course.status}
                onChange={e => handleStatusChange(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-2.5 py-2 text-xs font-bold text-white outline-none focus:border-purple-400"
              >
                <option value="enrolling">Enrolling Now</option>
                <option value="active">Active & Running</option>
                <option value="upcoming">Upcoming Cohort</option>
                <option value="draft">Draft (Hidden)</option>
              </select>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Quick Adjust Enrolled</p>
            <div className="mt-2 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => handleAdjustSeats(-1)}
                className="rounded-lg bg-white/10 hover:bg-white/20 px-3 py-1.5 text-xs font-black text-white"
              >
                -1
              </button>
              <span className="text-sm font-black text-white">
                {course.enrolledCount} / {course.seatLimit}
              </span>
              <button
                type="button"
                onClick={() => handleAdjustSeats(1)}
                className="rounded-lg bg-purple-600 hover:bg-purple-500 px-3 py-1.5 text-xs font-black text-white"
              >
                +1
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Cohort Format</p>
            <p className="mt-2 text-sm font-black text-emerald-300 truncate">{course.format || 'Hybrid'}</p>
            <p className="text-[11px] text-slate-400 truncate">{course.venue || 'Digital'}</p>
          </div>
        </div>

        {/* Detailed Info Card */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-3">
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-300">Course Brief & Description</h4>
          <p className="text-xs leading-relaxed text-slate-300">{course.description}</p>
          <div className="pt-2 text-xs text-slate-400 grid sm:grid-cols-2 gap-2">
            <div><span className="text-slate-500">Schedule:</span> {course.schedule || 'Flexible'}</div>
            <div><span className="text-slate-500">Curriculum:</span> {course.totalDays} Total Ascent Days</div>
            <div><span className="text-slate-500">Tuition/Fee:</span> {course.price || 'Free'}</div>
            <div><span className="text-slate-500">Instructor ID:</span> Tanvir Ahmad (Lead)</div>
          </div>
        </div>

        {/* Action Shortcuts ("oita nia kaj korte parbo") */}
        <div className="mt-6 space-y-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Management Shortcuts</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                navigate('/daily-lessons');
              }}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 text-left hover:border-purple-400/40 hover:bg-white/10 transition"
            >
              <div>
                <p className="text-sm font-black text-white">Daily Lessons & Plan</p>
                <p className="text-xs text-slate-400">Configure day modules, video uploads, and tasks</p>
              </div>
              <ArrowRight size={16} className="text-purple-400" />
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                // Scroll to in-person batch management if relevant
                const elem = document.getElementById('in-person-batch-management');
                if (elem) elem.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 text-left hover:border-purple-400/40 hover:bg-white/10 transition"
            >
              <div>
                <p className="text-sm font-black text-white">Review Cohort Applications</p>
                <p className="text-xs text-slate-400">Approve pending students & mark payment status</p>
              </div>
              <ArrowRight size={16} className="text-purple-400" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex items-center justify-end border-t border-white/10 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-white/10 hover:bg-white/20 px-6 py-2.5 text-xs font-black uppercase tracking-wider text-white"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}

/* ========================================================================= */
/* --- MODAL 4 COMPONENT: COURSE PLAN & CURRICULUM MANAGER ("OPEN PLAN") --- */
/* ========================================================================= */

const PLAN_ACTION_TYPES = {
  ai_speaking: {
    label: 'AI Speaking Practice',
    icon: <Mic size={14} />,
    badgeClass: 'border-cyan-400/30 bg-cyan-500/10 text-cyan-300',
    btnClass: 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-cyan-900/30',
  },
  pdf_resource: {
    label: 'PDF Material & Lecture',
    icon: <FileText size={14} />,
    badgeClass: 'border-blue-400/30 bg-blue-500/10 text-blue-300',
    btnClass: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-900/30',
  },
  quiz: {
    label: 'Daily Check Quiz',
    icon: <HelpCircle size={14} />,
    badgeClass: 'border-amber-400/30 bg-amber-500/10 text-amber-300',
    btnClass: 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-amber-900/30',
  },
  mock_interview: {
    label: 'Mock Interview / Room',
    icon: <Users size={14} />,
    badgeClass: 'border-purple-400/30 bg-purple-500/10 text-purple-300',
    btnClass: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-purple-900/30',
  },
  video_lecture: {
    label: 'Audio / Video Lecture',
    icon: <PlayCircle size={14} />,
    badgeClass: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300',
    btnClass: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-900/30',
  },
};

export function CoursePlanModal({ course, onClose, navigate }) {
  const [plan, setPlan] = useState(() => loadCoursePlan(course.id));
  const [planMode, setPlanMode] = useState('viewer'); // 'viewer' (Student View) | 'editor' (Instructor View)
  const [selectedMonth, setSelectedMonth] = useState('all'); // 'all' | '1' | '2' | '3'
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  
  // Modals inside planner
  const [editingDay, setEditingDay] = useState(null);
  const [isAddingDay, setIsAddingDay] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [simulatedAction, setSimulatedAction] = useState(null);
  const [selectedResourceDay, setSelectedResourceDay] = useState(null);
  const [planNotification, setPlanNotification] = useState('');
  const [copied, setCopied] = useState(false);

  const showToast = (msg) => {
    setPlanNotification(msg);
    setTimeout(() => setPlanNotification(''), 4000);
  };

  const persistPlan = (updatedPlan) => {
    setPlan(updatedPlan);
    saveCoursePlan(course.id, updatedPlan);
  };

  // Extract available months
  const availableMonths = useMemo(() => {
    const months = new Set();
    const isIelts = course.id === 'tanvir-ielts-comprehensive-band-7';
    plan.forEach(d => {
      if (d.month) {
        months.add(d.month);
      } else {
        const perMonth = isIelts ? 12 : 10;
        months.add(Math.min(isIelts ? 4 : 3, Math.ceil(d.day / perMonth)));
      }
    });
    return Array.from(months).sort((a, b) => a - b);
  }, [plan, course.id]);

  const monthThemes = course.id === 'tanvir-ielts-comprehensive-band-7'
    ? IELTS_BAND_7_MONTH_THEMES
    : SPOKEN_ENGLISH_MONTH_THEMES;

  // Filtered day roadmap
  const filteredDays = useMemo(() => {
    const isIelts = course.id === 'tanvir-ielts-comprehensive-band-7';
    return plan.filter(d => {
      // Month match
      let matchesMonth = true;
      if (selectedMonth !== 'all') {
        const targetM = Number(selectedMonth);
        if (d.month) {
          matchesMonth = d.month === targetM;
        } else {
          const perMonth = isIelts ? 12 : 10;
          matchesMonth = Math.ceil(d.day / perMonth) === targetM;
        }
      }

      // Action type match
      const matchesAction = filterAction === 'all' ? true : d.actionType === filterAction;

      // Search query match
      const matchesSearch = search.trim() === '' ? true : (
        (d.title && d.title.toLowerCase().includes(search.toLowerCase())) ||
        (d.coreStructure && d.coreStructure.toLowerCase().includes(search.toLowerCase())) ||
        (d.liveActivity && d.liveActivity.toLowerCase().includes(search.toLowerCase())) ||
        (d.actionItem && d.actionItem.toLowerCase().includes(search.toLowerCase())) ||
        (d.studyTopic && d.studyTopic.toLowerCase().includes(search.toLowerCase())) ||
        (d.studentOutput && d.studentOutput.toLowerCase().includes(search.toLowerCase())) ||
        String(d.day).includes(search)
      );

      return matchesMonth && matchesAction && matchesSearch;
    }).sort((a, b) => (a.day || 0) - (b.day || 0));
  }, [plan, selectedMonth, filterAction, search]);

  const handleAddDay = (newDay) => {
    const updated = [...plan, newDay].sort((a, b) => (a.day || 0) - (b.day || 0));
    persistPlan(updated);
    setIsAddingDay(false);
    showToast(`Added Day ${newDay.day}: "${newDay.title}"`);
  };

  const handleUpdateDay = (updatedDay) => {
    const updated = plan.map(d => d.day === updatedDay.day ? updatedDay : d);
    persistPlan(updated);
    setEditingDay(null);
    showToast(`Updated Day ${updatedDay.day}.`);
  };

  const handleDeleteDay = (dayNum) => {
    if (window.confirm(`Delete Day ${dayNum} from this course plan?`)) {
      const updated = plan.filter(d => d.day !== dayNum);
      persistPlan(updated);
      showToast(`Removed Day ${dayNum}.`);
    }
  };

  const handleExportPlan = () => {
    try {
      const jsonStr = JSON.stringify(plan, null, 2);
      navigator.clipboard.writeText(jsonStr);
      setCopied(true);
      showToast('Course Plan JSON copied to clipboard!');
      setTimeout(() => setCopied(false), 3000);
    } catch {
      showToast('Could not copy to clipboard.');
    }
  };

  const handleImportPlan = (importedDays) => {
    persistPlan(importedDays);
    setIsUploadOpen(false);
    showToast(`Successfully imported ${importedDays.length} plan days!`);
  };

  const handleResetToDefault = () => {
    const defaultTemplate = DEFAULT_COURSE_PLANS[course.id] || [];
    persistPlan(defaultTemplate);
    showToast('Reset plan to official 30-class starter template.');
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
      {/* Clickable dark backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
      />

      {/* Main Dialog Window */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        onClick={e => e.stopPropagation()}
        className="relative z-10 w-full max-w-6xl rounded-3xl border border-emerald-500/30 bg-slate-950 p-4 sm:p-6 md:p-7 shadow-[0_25px_80px_rgba(0,0,0,0.95)] flex flex-col h-[92vh] max-h-[92vh] overflow-hidden"
      >
        {/* Decorative glows */}
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-600/15 blur-[90px] pointer-events-none" />
        <div className="absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-teal-600/10 blur-[90px] pointer-events-none" />

        {/* Header Strip */}
        <div className="relative z-10 flex flex-col gap-3 pb-4 border-b border-white/10 shrink-0">
          {/* Row 1: Badges on left, Dedicated Close Button on right */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-500/15 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-300">
                <Compass size={13} /> Course Plan & Curriculum Hub
              </span>
              {course.duration && (
                <span className="rounded-full border border-amber-400/30 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-black text-amber-300 uppercase">
                  ⏳ {course.duration}
                </span>
              )}
              <span className="rounded-full border border-purple-400/30 bg-purple-500/10 px-2.5 py-0.5 text-[10px] font-black text-purple-300 uppercase">
                👨‍🏫 Instructor: {course.instructor || 'Tanvir Ahmad'}
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/15 hover:text-white transition shadow-sm"
              title="Close Modal"
            >
              <X size={18} />
            </button>
          </div>

          {/* Row 2: Title & Mode Switcher */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 pt-0.5">
            <div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
                {course.title}
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-300">
                Full 30-Day Live Syllabus • 60–70% Student Talking Time (STT) • Daily Speaking Drills & Action Outputs
              </p>
            </div>

            {/* Mode Controls & Editor Actions */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Dual Mode Switcher */}
              <div className="flex items-center rounded-2xl border border-white/15 bg-white/5 p-1 shadow-inner">
                <button
                  type="button"
                  onClick={() => setPlanMode('viewer')}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-black uppercase tracking-wider transition ${
                    planMode === 'viewer'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Switch to Student Viewer Mode"
                >
                  <Eye size={14} /> Student View
                </button>
                <button
                  type="button"
                  onClick={() => setPlanMode('editor')}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-black uppercase tracking-wider transition ${
                    planMode === 'editor'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Switch to Instructor Editor Mode"
                >
                  <Edit3 size={14} /> Editor Mode
                </button>
              </div>

              {/* In Editor Mode: Add Day, Upload, Export */}
              {planMode === 'editor' && (
                <>
                  <button
                    type="button"
                    onClick={() => setIsAddingDay(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-white shadow-md transition active:scale-95"
                  >
                    <Plus size={14} /> Add Day
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsUploadOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs font-bold text-slate-200 transition"
                    title="Upload / Paste Syllabus Plan"
                  >
                    <Upload size={13} /> Upload
                  </button>
                  <button
                    type="button"
                    onClick={handleExportPlan}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs font-bold text-slate-200 transition"
                    title="Copy Plan JSON"
                  >
                    {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                    <span className="hidden sm:inline">Export</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

          {/* Mode Indicator Banner */}
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className={`inline-block h-2 w-2 rounded-full ${planMode === 'viewer' ? 'bg-emerald-400 animate-pulse' : 'bg-purple-400 animate-pulse'}`} />
              <p className="text-xs text-slate-300 font-medium">
                {planMode === 'viewer' ? (
                  <>
                    <strong className="text-emerald-300">Viewer Mode (Student Syllabus Explorer)</strong>: View full 30-day curriculum with core speaking structures, live speaking drills, homework tasks, and class notes.
                  </>
                ) : (
                  <>
                    <strong className="text-purple-300">Editor Mode (Instructor Management)</strong>: Customize class days, attach lecture notes, PDF study links, audio drills, video classes, and action triggers.
                  </>
                )}
              </p>
            </div>

            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
              <span>Total Classes: <strong className="text-white">{plan.length}</strong></span>
              <span>•</span>
              <span>Month Filter: <strong className="text-cyan-300">{selectedMonth === 'all' ? 'All Months' : `Month ${selectedMonth}`}</strong></span>
            </div>
          </div>

        {/* Plan Toast */}
        <AnimatePresence>
          {planNotification && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="relative z-10 mt-3 flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-500/15 p-2.5 text-xs font-bold text-emerald-200 shrink-0"
            >
              <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
              {planNotification}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Tabs: Months & Filter Bar */}
        <div className="relative z-10 mt-3 flex flex-col gap-3 shrink-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Month Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-white/10 bg-white/[0.03] p-1.5">
              <button
                type="button"
                onClick={() => setSelectedMonth('all')}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-black uppercase tracking-wider transition ${
                  selectedMonth === 'all'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All Classes ({plan.length})
              </button>

              {availableMonths.map(m => {
                const isIelts = course.id === 'tanvir-ielts-comprehensive-band-7';
                const labelRange = isIelts
                  ? m === 1 ? '(1–12)' : m === 2 ? '(13–24)' : m === 3 ? '(25–36)' : '(37–48)'
                  : m === 1 ? '(1–10)' : m === 2 ? '(11–20)' : '(21–30)';
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setSelectedMonth(String(m))}
                    className={`rounded-xl px-3.5 py-1.5 text-xs font-black uppercase tracking-wider transition ${
                      selectedMonth === String(m)
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Month {m} {labelRange}
                  </button>
                );
              })}
            </div>

            {/* Search and Action Filter */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-[200px] sm:min-w-[240px]">
                <Search size={13} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search class, topic, or formula..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-1.5 pl-8 pr-3 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-400"
                />
              </div>

              <select
                value={filterAction}
                onChange={e => setFilterAction(e.target.value)}
                className="rounded-xl border border-white/10 bg-slate-900 px-3 py-1.5 text-xs font-bold text-white outline-none focus:border-emerald-400"
              >
                <option value="all">All Action Types</option>
                <option value="ai_speaking">AI Speaking</option>
                <option value="pdf_resource">PDF Material</option>
                <option value="quiz">Daily Quiz</option>
                <option value="mock_interview">Mock Interview</option>
                <option value="video_lecture">Audio/Video</option>
              </select>
            </div>
          </div>

          {/* Month Subtitle info if month is active */}
          {selectedMonth !== 'all' && monthThemes[Number(selectedMonth)] && (
            <div className="flex items-center gap-2 px-1 text-xs text-slate-400">
              <span className="font-bold uppercase tracking-wider text-emerald-400">Month {selectedMonth} Focus:</span>
              <span className="text-slate-200 font-medium">{monthThemes[Number(selectedMonth)]}</span>
            </div>
          )}
        </div>

        {/* Scrollable Curriculum Class Cards */}
        <div className="relative z-10 mt-3 flex-1 overflow-y-auto pr-1.5 space-y-4">
          {filteredDays.map(item => {
            const actionConfig = PLAN_ACTION_TYPES[item.actionType] || PLAN_ACTION_TYPES.ai_speaking;
            const isIelts = course.id === 'tanvir-ielts-comprehensive-band-7';
            const itemMonth = item.month || (isIelts 
              ? (item.day <= 12 ? 1 : item.day <= 24 ? 2 : item.day <= 36 ? 3 : 4)
              : (item.day <= 10 ? 1 : item.day <= 20 ? 2 : 3)
            );

            return (
              <React.Fragment key={item.day}>
                <div
                  className="rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/90 to-slate-950/95 p-4 sm:p-5 md:p-6 transition hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-950/20"
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-white/10">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-lg bg-emerald-500/20 border border-emerald-400/40 px-2.5 py-1 text-xs font-black text-emerald-300 uppercase tracking-wider">
                        Class {String(item.day).padStart(2, '0')}
                      </span>
                      <span className="rounded-lg bg-blue-500/15 border border-blue-400/30 px-2 py-0.5 text-[10px] font-bold text-blue-300 uppercase tracking-wider">
                        Month {itemMonth}
                      </span>
                      <h4 className="text-base sm:text-lg font-black text-white">
                        {item.title}
                      </h4>
                    </div>

                    {/* Resource Badges */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {item.classNotes && (
                        <span className="inline-flex items-center gap-1 rounded-md border border-amber-400/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                          <BookOpen size={11} /> Notes
                        </span>
                      )}
                      {item.pdfUrl && (
                        <span className="inline-flex items-center gap-1 rounded-md border border-blue-400/30 bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-300">
                          <FileText size={11} /> PDF
                        </span>
                      )}
                      {item.audioUrl && (
                        <span className="inline-flex items-center gap-1 rounded-md border border-cyan-400/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-bold text-cyan-300">
                          <Headphones size={11} /> Audio
                        </span>
                      )}
                      {item.videoUrl && (
                        <span className="inline-flex items-center gap-1 rounded-md border border-purple-400/30 bg-purple-500/10 px-2 py-0.5 text-[10px] font-bold text-purple-300">
                          <Video size={11} /> Video
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 3 Core Curriculum Blocks (High-Impact Structured Content) */}
                  <div className="mt-4 grid gap-3 lg:grid-cols-3">
                    {/* 1. Core Structure (মূল বাক্য ও গ্রামার টেকনিক) */}
                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-3.5 text-xs flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-amber-300 text-[11px] uppercase tracking-wider mb-1.5">
                          <Lightbulb size={13} className="text-amber-400 shrink-0" />
                          <span>Core Structure (মূল বাক্য ও টেকনিক)</span>
                        </div>
                        <p className="text-amber-100 font-medium leading-relaxed">
                          {item.coreStructure || item.studyTopic || 'Grammar blueprints and sentence formulas.'}
                        </p>
                      </div>
                    </div>

                    {/* 2. Live Activity (লাইভ ড্রিল ও সলভিং) */}
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-3.5 text-xs flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-emerald-300 text-[11px] uppercase tracking-wider mb-1.5">
                          <Mic size={13} className="text-emerald-400 shrink-0" />
                          <span>Live Activity (লাইভ ড্রিল ও সমাধান)</span>
                        </div>
                        <p className="text-emerald-100 font-medium leading-relaxed">
                          {item.liveActivity || 'Interactive live drills and problem solving with mentor.'}
                        </p>
                      </div>
                    </div>

                    {/* 3. Action Item & Submission (হোমওয়ার্ক ও আউটপুট) */}
                    <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/[0.04] p-3.5 text-xs flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-cyan-300 text-[11px] uppercase tracking-wider mb-1.5">
                          <Zap size={13} className="text-cyan-400 shrink-0" />
                          <span>Action Item (হোমওয়ার্ক ও আউটপুট)</span>
                        </div>
                        <p className="text-cyan-100 font-medium leading-relaxed">
                          {item.actionItem || item.studentOutput || 'Submit voice recording or practice task.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Footer Action Bar for this Class */}
                  <div className="mt-4 pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    {/* Left: View Notes & Resources Button */}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedResourceDay(item)}
                        className="inline-flex items-center gap-2 rounded-xl border border-amber-400/30 bg-amber-500/10 hover:bg-amber-500/20 px-3.5 py-2 text-xs font-bold text-amber-200 transition active:scale-95"
                      >
                        <BookOpen size={14} className="text-amber-400" />
                        <span>View Class Notes & Resources</span>
                      </button>

                      {item.actionTarget && (
                        <span className="hidden md:inline-block text-[10px] text-slate-500 font-mono">
                          Target: {item.actionTarget}
                        </span>
                      )}
                    </div>

                    {/* Right: Primary Action / Editor Controls */}
                    <div className="flex flex-wrap items-center gap-2 justify-end">
                      {/* Primary Practice / Action Launch Button */}
                      <button
                        type="button"
                        onClick={() => setSimulatedAction({
                          day: item.day,
                          title: item.title,
                          actionType: item.actionType,
                          actionLabel: item.actionLabel || 'Launch Action Drill',
                          actionTarget: item.actionTarget,
                          studyTopic: item.coreStructure || item.studyTopic,
                          studentOutput: item.actionItem || item.studentOutput,
                        })}
                        className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-wider shadow transition active:scale-95 ${actionConfig.btnClass}`}
                      >
                        {actionConfig.icon}
                        <span>{item.actionLabel || 'Launch Practice Task'}</span>
                        <ArrowRight size={13} className="shrink-0" />
                      </button>

                      {/* Instructor Edit / Delete Controls (Shown in Editor Mode) */}
                      {planMode === 'editor' && (
                        <div className="flex items-center gap-1.5 pl-2 border-l border-white/10">
                          <button
                            type="button"
                            onClick={() => setEditingDay(item)}
                            className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white transition"
                            title="Edit Day Curriculum & Notes"
                          >
                            <Edit3 size={13} /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteDay(item.day)}
                            className="inline-flex items-center gap-1 rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1.5 text-xs font-bold text-red-400 hover:bg-red-500/20 transition"
                            title="Delete Day"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Weekend Mock Test Milestone (Outside Class Hours) */}
                {item.weekendMock && (
                  <div className="relative overflow-hidden rounded-2xl border-2 border-rose-500/50 bg-gradient-to-r from-rose-950/80 via-slate-900/95 to-red-950/70 p-4 sm:p-5 shadow-2xl shadow-rose-950/40">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3.5">
                        <div className="rounded-2xl bg-gradient-to-br from-red-500/30 to-rose-600/30 border border-red-400/40 p-3 text-red-300 shrink-0 shadow-inner">
                          <Award size={24} className="animate-pulse text-red-400" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-lg bg-red-500/30 border border-red-400/50 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-red-300">
                              🔴 Weekend Mock Test {String(item.weekendMock.mockNum).padStart(2, '0')} (Outside Class Hours)
                            </span>
                            <span className="rounded-lg bg-white/10 px-2 py-0.5 text-[10px] font-bold text-slate-300">
                              Official Cambridge Simulation
                            </span>
                          </div>
                          <h5 className="text-base sm:text-lg font-black text-white tracking-wide">
                            {item.weekendMock.title}
                          </h5>
                          <p className="text-xs text-rose-200/90 font-medium">
                            <span className="text-white font-bold">Coverage:</span> {item.weekendMock.coverage}
                          </p>
                          <p className="text-xs text-slate-300">
                            <span className="text-amber-300 font-bold">Objective:</span> {item.weekendMock.objective}
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0 flex items-center gap-2 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => setSimulatedAction({
                            day: item.day,
                            title: item.weekendMock.title,
                            actionType: 'mock_interview',
                            actionLabel: `Mock ${item.weekendMock.mockNum} Protocol & Rubric`,
                            actionTarget: '/progress',
                            studyTopic: item.weekendMock.coverage,
                            studentOutput: item.weekendMock.objective,
                          })}
                          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white px-4 py-2.5 text-xs font-black uppercase tracking-wider shadow-lg shadow-red-950/50 transition active:scale-95"
                        >
                          <Award size={14} />
                          <span>Mock Details & Rubric</span>
                          <ArrowRight size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}

          {filteredDays.length === 0 && (
            <div className="py-14 text-center rounded-3xl border border-dashed border-white/10 bg-white/[0.01]">
              <Compass size={40} className="mx-auto text-slate-600 mb-3" />
              <p className="text-sm font-bold text-slate-300">No classes match your current search or month filter.</p>
              <p className="text-xs text-slate-500 mt-1">Try clearing the search input or selecting "All Classes".</p>
              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    setSelectedMonth('all');
                    setFilterAction('all');
                  }}
                  className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-white/10"
                >
                  Clear Filters
                </button>
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-black uppercase tracking-wider text-white hover:bg-emerald-500 shadow"
                >
                  Load Official 30-Day Syllabus
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer info & close */}
        <div className="relative z-10 mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-3 shrink-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="text-[11px] font-bold text-slate-500 hover:text-slate-300 transition underline underline-offset-4"
            >
              Reset to Official 30-Day Template
            </button>
            <span className="text-slate-600">•</span>
            <span className="text-[11px] text-slate-400">
              Tanvir Ahmad Curriculum System
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-white/10 hover:bg-white/20 px-6 py-2 text-xs font-black uppercase tracking-wider text-white transition"
          >
            Close Plan
          </button>
        </div>
      </motion.div>

      {/* --- SUB-MODAL 1: CLASS RESOURCE & STUDY NOTES READER (STUDENT VIEW) --- */}
      <AnimatePresence>
        {selectedResourceDay && (
          <ClassResourceModal
            dayItem={selectedResourceDay}
            courseTitle={course.title}
            onClose={() => setSelectedResourceDay(null)}
            onLaunchPractice={(dayData) => {
              setSelectedResourceDay(null);
              setSimulatedAction({
                day: dayData.day,
                title: dayData.title,
                actionType: dayData.actionType,
                actionLabel: dayData.actionLabel || 'Launch Practice Drill',
                actionTarget: dayData.actionTarget,
                studyTopic: dayData.coreStructure || dayData.studyTopic,
                studentOutput: dayData.actionItem || dayData.studentOutput,
              });
            }}
          />
        )}
      </AnimatePresence>

      {/* --- SUB-MODAL 2: ADD OR EDIT DAY MODAL --- */}
      <AnimatePresence>
        {(isAddingDay || editingDay) && (
          <PlanDayEditorModal
            initialData={editingDay || {
              day: plan.length > 0 ? Math.max(...plan.map(d => d.day || 0)) + 1 : 1,
              month: selectedMonth !== 'all' ? Number(selectedMonth) : 1,
              title: '',
              coreStructure: '',
              liveActivity: '',
              actionItem: '',
              studyTopic: '',
              studentOutput: '',
              classNotes: '',
              pdfUrl: '',
              audioUrl: '',
              videoUrl: '',
              actionType: 'ai_speaking',
              actionLabel: 'Launch Speaking Practice Drill',
              actionTarget: '/speaking-practice?language=english',
              status: 'published',
            }}
            isEdit={Boolean(editingDay)}
            onClose={() => {
              setIsAddingDay(false);
              setEditingDay(null);
            }}
            onSubmit={(dayData) => {
              if (editingDay) {
                handleUpdateDay(dayData);
              } else {
                handleAddDay(dayData);
              }
            }}
          />
        )}
      </AnimatePresence>

      {/* --- SUB-MODAL 3: UPLOAD / PASTE PLAN --- */}
      <AnimatePresence>
        {isUploadOpen && (
          <PlanUploadModal
            course={course}
            onClose={() => setIsUploadOpen(false)}
            onImport={handleImportPlan}
          />
        )}
      </AnimatePresence>

      {/* --- SUB-MODAL 4: ACTION SIMULATION PREVIEW ("CLICK KORLE KI HOBE") --- */}
      <AnimatePresence>
        {simulatedAction && (
          <PlanSimulationModal
            action={simulatedAction}
            onClose={() => setSimulatedAction(null)}
            navigate={navigate}
          />
        )}
      </AnimatePresence>
    </div>,
    document.body
  );
}

/* ---------------- SUB-MODAL 1: CLASS RESOURCE & STUDY NOTES READER ---------------- */
function ClassResourceModal({ dayItem, courseTitle, onClose, onLaunchPractice }) {
  const itemMonth = dayItem.month || (dayItem.day <= 10 ? 1 : dayItem.day <= 20 ? 2 : 3);
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Clickable dark backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={e => e.stopPropagation()}
        className="relative z-10 w-full max-w-3xl rounded-3xl border border-amber-500/30 bg-slate-900 p-5 sm:p-8 shadow-2xl my-6 flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Glow */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-600/10 blur-[80px] pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10 shrink-0">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-lg bg-amber-500/20 border border-amber-400/30 px-2.5 py-0.5 text-xs font-black text-amber-300 uppercase tracking-wider">
                Class {String(dayItem.day).padStart(2, '0')}
              </span>
              <span className="rounded-lg bg-blue-500/15 border border-blue-400/30 px-2 py-0.5 text-[10px] font-bold text-blue-300 uppercase tracking-wider">
                Month {itemMonth}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {courseTitle}
              </span>
            </div>
            <h4 className="mt-2 text-xl sm:text-2xl font-black text-white">
              {dayItem.title}
            </h4>
            <p className="mt-0.5 text-xs text-slate-300">
              Instructor: <strong className="text-white">Tanvir Ahmad</strong> • Guided Lecture & Output Blueprint
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/15 hover:text-white transition shadow-sm"
            title="Close Notes"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Resource Content */}
        <div className="mt-4 flex-1 overflow-y-auto space-y-4 pr-1">
          {/* 1. Core Structure Blueprint */}
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-2 font-black text-amber-300 text-xs sm:text-sm uppercase tracking-wider">
              <Lightbulb size={16} className="text-amber-400" />
              <span>Core Structure (মূল বাক্য ও গ্রামার টেকনিক)</span>
            </div>
            <p className="text-white text-sm sm:text-base font-semibold leading-relaxed">
              {dayItem.coreStructure || dayItem.studyTopic || 'Natural sentence formulas and conversation frameworks.'}
            </p>
          </div>

          {/* 2. In-Class Live Speaking Activity */}
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-2 font-black text-emerald-300 text-xs sm:text-sm uppercase tracking-wider">
              <Mic size={16} className="text-emerald-400" />
              <span>Live In-Class Activity (লাইভ স্পিকিং ড্রিল)</span>
            </div>
            <p className="text-slate-200 text-xs sm:text-sm font-medium leading-relaxed">
              {dayItem.liveActivity || 'Live interaction and spontaneous speaking drills.'}
            </p>
          </div>

          {/* 3. Action Item & Submission Requirement */}
          <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/5 p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-2 font-black text-cyan-300 text-xs sm:text-sm uppercase tracking-wider">
              <Zap size={16} className="text-cyan-400" />
              <span>Action Item & Homework (হোমওয়ার্ক ও আউটপুট সাবমিশন)</span>
            </div>
            <p className="text-cyan-100 text-xs sm:text-sm font-medium leading-relaxed">
              {dayItem.actionItem || dayItem.studentOutput || 'Submit voice recording or required assignment.'}
            </p>
          </div>

          {/* 4. Instructor Class Notes & Guidance */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-2 font-black text-slate-200 text-xs sm:text-sm uppercase tracking-wider">
              <BookOpen size={16} className="text-purple-400" />
              <span>Class Notes & Instructor Guidance from Tanvir Ahmad</span>
            </div>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
              {dayItem.classNotes || 'Focus on confident, natural delivery without memorizing exact sentences. Speak with natural pausing, intonation, and stress.'}
            </p>
          </div>

          {/* 5. Attached Materials & Media Links */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5 space-y-3">
            <h5 className="text-xs font-black uppercase tracking-wider text-slate-300">
              Attached Study Materials & Media
            </h5>

            <div className="grid gap-2 sm:grid-cols-2">
              {dayItem.pdfUrl ? (
                <a
                  href={dayItem.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-xl border border-blue-500/30 bg-blue-500/10 p-3 hover:bg-blue-500/20 transition text-xs font-bold text-blue-200"
                >
                  <span className="flex items-center gap-2">
                    <FileText size={16} className="text-blue-400" />
                    <span>Download Lecture PDF Sheet</span>
                  </span>
                  <ExternalLink size={13} />
                </a>
              ) : (
                <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.01] p-3 text-xs text-slate-500">
                  <FileText size={16} />
                  <span>PDF Lecture Sheet (Shared in Class)</span>
                </div>
              )}

              {dayItem.videoUrl ? (
                <a
                  href={dayItem.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-xl border border-purple-500/30 bg-purple-500/10 p-3 hover:bg-purple-500/20 transition text-xs font-bold text-purple-200"
                >
                  <span className="flex items-center gap-2">
                    <Video size={16} className="text-purple-400" />
                    <span>Watch Class Recording / Lecture</span>
                  </span>
                  <ExternalLink size={13} />
                </a>
              ) : (
                <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.01] p-3 text-xs text-slate-500">
                  <Video size={16} />
                  <span>Live Video Class via Portal</span>
                </div>
              )}
            </div>

            {dayItem.audioUrl && (
              <div className="mt-3 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-3">
                <p className="text-[11px] font-bold text-cyan-300 mb-1 flex items-center gap-1.5">
                  <Headphones size={13} /> Listening Drill Audio Sample:
                </p>
                <audio controls className="w-full h-8 mt-1" src={dayItem.audioUrl} />
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
          >
            Close Notes
          </button>

          <button
            type="button"
            onClick={() => onLaunchPractice(dayItem)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 px-5 py-2 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-emerald-900/40 active:scale-95 transition"
          >
            <Zap size={14} />
            <span>Launch Action / Practice Task</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}

/* ---------------- SUB-MODAL 2: DAY EDITOR MODAL (INSTRUCTOR) ---------------- */
function PlanDayEditorModal({ initialData, isEdit, onClose, onSubmit }) {
  const [formData, setFormData] = useState(initialData);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      day: Number(formData.day) || 1,
      month: Number(formData.month) || 1,
    });
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Clickable dark backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={e => e.stopPropagation()}
        className="relative z-10 w-full max-w-2xl rounded-3xl border border-white/15 bg-slate-900 p-5 sm:p-7 shadow-2xl my-6 flex flex-col max-h-[92vh] overflow-hidden"
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">
              Instructor Curriculum Editor
            </span>
            <h4 className="text-lg sm:text-xl font-black text-white">
              {isEdit ? `Edit Class ${formData.day}` : `Add Class to Course Plan`}
            </h4>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-2xl border border-white/10 bg-white/5 text-slate-400 hover:bg-white/15 hover:text-white transition"
            title="Close editor"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 flex-1 overflow-y-auto pr-1 space-y-4">
          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                Class / Day # *
              </label>
              <input
                required
                type="number"
                min="1"
                max="365"
                value={formData.day}
                onChange={e => setFormData({ ...formData, day: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-purple-400"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                Month # *
              </label>
              <select
                value={formData.month || 1}
                onChange={e => setFormData({ ...formData, month: Number(e.target.value) })}
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm font-bold text-white outline-none focus:border-purple-400"
              >
                <option value={1}>Month 1</option>
                <option value={2}>Month 2</option>
                <option value={3}>Month 3</option>
                <option value={4}>Month 4</option>
                <option value={5}>Month 5</option>
                <option value={6}>Month 6</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                Class / Lesson Title *
              </label>
              <input
                required
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Breaking the Ice — High-Impact Self-Introduction"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-purple-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-amber-300 mb-1">
              Core Structure (মূল বাক্য ও গ্রামার টেকনিক) *
            </label>
            <textarea
              required
              rows={2}
              value={formData.coreStructure}
              onChange={e => setFormData({ ...formData, coreStructure: e.target.value, studyTopic: e.target.value })}
              placeholder="e.g. Name + Background + Current Focus + 1 Unique Passion (মুখস্থ ছাড়া ন্যাচারাল ডেলিভারি)।"
              className="w-full rounded-xl border border-amber-500/20 bg-white/5 p-3 text-xs text-white outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-emerald-300 mb-1">
              Live Activity (লাইভ স্পিকিং ড্রিল) *
            </label>
            <textarea
              required
              rows={2}
              value={formData.liveActivity}
              onChange={e => setFormData({ ...formData, liveActivity: e.target.value })}
              placeholder="e.g. 'Elevator Pitch' — প্রত্যেকে ৯০ সেকেন্ডে নিজের পরিচয় দেবে কোনো বাংলা শব্দ ব্যবহার না করে।"
              className="w-full rounded-xl border border-emerald-500/20 bg-white/5 p-3 text-xs text-white outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-cyan-300 mb-1">
              Action Item & Submission (হোমওয়ার্ক ও আউটপুট) *
            </label>
            <textarea
              required
              rows={2}
              value={formData.actionItem}
              onChange={e => setFormData({ ...formData, actionItem: e.target.value, studentOutput: e.target.value })}
              placeholder="e.g. নিজের ১ মিনিটের সেলফ-ইন্ট্রো অডিও রেকর্ড করে সাবমিট করা।"
              className="w-full rounded-xl border border-cyan-500/20 bg-white/5 p-3 text-xs text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-purple-300 mb-1">
              Class Notes & Guidance from Tanvir Ahmad
            </label>
            <textarea
              rows={2}
              value={formData.classNotes || ''}
              onChange={e => setFormData({ ...formData, classNotes: e.target.value })}
              placeholder="Tips, common pronunciation mistakes, or delivery pointers for this class..."
              className="w-full rounded-xl border border-purple-500/20 bg-white/5 p-3 text-xs text-white outline-none focus:border-purple-400"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                PDF Resource URL (লেকচার শিট)
              </label>
              <input
                type="text"
                value={formData.pdfUrl || ''}
                onChange={e => setFormData({ ...formData, pdfUrl: e.target.value })}
                placeholder="https://.../notes.pdf"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-mono text-white outline-none focus:border-purple-400"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                Video Lecture URL (ভিডিও রেকর্ডিং)
              </label>
              <input
                type="text"
                value={formData.videoUrl || ''}
                onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                placeholder="https://.../lecture-video"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-mono text-white outline-none focus:border-purple-400"
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                Action Type (ক্লিক করলে কী হবে)
              </label>
              <select
                value={formData.actionType}
                onChange={e => setFormData({ ...formData, actionType: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs font-bold text-white outline-none focus:border-purple-400"
              >
                <option value="ai_speaking">AI Speaking Practice</option>
                <option value="pdf_resource">PDF Lesson Material</option>
                <option value="quiz">Daily Knowledge Quiz</option>
                <option value="mock_interview">Mock Interview / Room</option>
                <option value="video_lecture">Audio/Video Lecture</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                Button Label (বাটন নাম)
              </label>
              <input
                required
                type="text"
                value={formData.actionLabel}
                onChange={e => setFormData({ ...formData, actionLabel: e.target.value })}
                placeholder="e.g. Record 1-Min Self-Intro Audio"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-purple-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
              Target Link / Route
            </label>
            <input
              type="text"
              value={formData.actionTarget}
              onChange={e => setFormData({ ...formData, actionTarget: e.target.value })}
              placeholder="e.g. /speaking-practice?language=english&day=1"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-mono text-white outline-none focus:border-purple-400"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-purple-600 hover:bg-purple-500 px-6 py-2 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-purple-600/30"
            >
              Save Class Day
            </button>
          </div>
        </form>
      </motion.div>
    </div>,
    document.body
  );
}

/* ---------------- SUB-MODAL 3: UPLOAD / PASTE PLAN ---------------- */
function PlanUploadModal({ course, onClose, onImport }) {
  const [pasteText, setPasteText] = useState('');
  const [error, setError] = useState('');

  const handleParseAndImport = () => {
    setError('');
    if (!pasteText.trim()) {
      setError('Please paste your curriculum JSON or formatted lines.');
      return;
    }

    try {
      // Try JSON parse first
      const parsed = JSON.parse(pasteText);
      if (Array.isArray(parsed) && parsed.length > 0) {
        onImport(parsed);
        return;
      }
      throw new Error('JSON is not an array of days.');
    } catch {
      // Line-by-line fallback format:
      // Day 1: Title | CoreStructure | LiveActivity | ActionItem
      try {
        const lines = pasteText.split('\n').map(l => l.trim()).filter(Boolean);
        const imported = lines.map((line, idx) => {
          const parts = line.split('|').map(p => p.trim());
          const dayNum = idx + 1;
          const monthNum = dayNum <= 10 ? 1 : dayNum <= 20 ? 2 : 3;
          return {
            day: dayNum,
            month: monthNum,
            title: parts[0] || `Lesson Day ${dayNum}`,
            coreStructure: parts[1] || 'Core sentence patterns and grammar structures.',
            liveActivity: parts[2] || 'In-class speaking drill.',
            actionItem: parts[3] || 'Submit voice recording homework.',
            studyTopic: parts[1] || 'Core lesson topics.',
            studentOutput: parts[3] || 'Practice output submission.',
            actionType: 'ai_speaking',
            actionLabel: 'Launch Practice Drill',
            actionTarget: `/speaking-practice?day=${dayNum}`,
            status: 'published',
          };
        });

        if (imported.length > 0) {
          onImport(imported);
          return;
        }
      } catch (err) {
        setError(`Failed to parse: ${err.message}. Please use valid JSON.`);
      }
      setError('Could not parse plan. Please paste a valid JSON array of class days.');
    }
  };

  const handleLoadSample = () => {
    const sample = DEFAULT_COURSE_PLANS[course.id] || [];
    setPasteText(JSON.stringify(sample, null, 2));
    setError('');
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Clickable dark backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={e => e.stopPropagation()}
        className="relative z-10 w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-900 p-5 sm:p-7 shadow-2xl my-6 flex flex-col max-h-[90vh] overflow-hidden"
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
              Bulk Curriculum Uploader
            </span>
            <h4 className="text-lg sm:text-xl font-black text-white">Upload Course Plan</h4>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-2xl border border-white/10 bg-white/5 text-slate-400 hover:bg-white/15 hover:text-white transition"
            title="Close uploader"
          >
            <X size={18} />
          </button>
        </div>

        <p className="mt-3 text-xs text-slate-300 leading-relaxed shrink-0">
          Paste your day-by-day curriculum in JSON format or click <strong>"Load Official 30-Day Starter Template"</strong> to populate the ready-to-use curriculum for this course.
        </p>

        {error && (
          <div className="mt-3 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-xs text-red-300 shrink-0">
            {error}
          </div>
        )}

        <div className="mt-4 flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-1.5 shrink-0">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Paste Plan JSON
            </span>
            <button
              type="button"
              onClick={handleLoadSample}
              className="text-[10px] font-black uppercase tracking-wider text-emerald-400 hover:underline"
            >
              Load Official 30-Day Starter Template
            </button>
          </div>
          <textarea
            rows={10}
            value={pasteText}
            onChange={e => setPasteText(e.target.value)}
            placeholder={`[\n  {\n    "day": 1,\n    "month": 1,\n    "title": "Breaking the Ice — High-Impact Self-Introduction",\n    "coreStructure": "Name + Background + Current Focus + 1 Unique Passion",\n    "liveActivity": "Elevator Pitch (90 seconds)",\n    "actionItem": "Submit 1-min self-intro audio",\n    "actionType": "ai_speaking",\n    "actionLabel": "Record Audio",\n    "actionTarget": "/speaking-practice?day=1"\n  }\n]`}
            className="w-full flex-1 min-h-[220px] rounded-2xl border border-white/10 bg-slate-950 p-3 font-mono text-xs text-emerald-300 outline-none focus:border-emerald-400/60"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10 mt-4 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleParseAndImport}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-6 py-2 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-emerald-600/30"
          >
            <Upload size={14} /> Import Plan
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}

/* ---------------- SUB-MODAL 4: ACTION SIMULATION PREVIEW ---------------- */
function PlanSimulationModal({ action, onClose, navigate }) {
  const actionConfig = PLAN_ACTION_TYPES[action.actionType] || PLAN_ACTION_TYPES.ai_speaking;

  const handleOpenPage = () => {
    onClose();
    if (action.actionTarget) {
      navigate(action.actionTarget);
    }
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Clickable dark backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={e => e.stopPropagation()}
        className="relative z-10 w-full max-w-md rounded-3xl border border-emerald-500/40 bg-slate-900 p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/20">
              <Zap size={16} />
            </span>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Action Simulation</p>
              <h4 className="text-base font-black text-white">Class {action.day} Action Trigger</h4>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-2xl border border-white/10 bg-white/5 text-slate-400 hover:bg-white/15 hover:text-white transition"
            title="Close preview"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-4 space-y-3 text-xs">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Lesson Title</p>
            <p className="text-sm font-black text-white mt-0.5">{action.title}</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Action Button Triggered</p>
            <div className="mt-2">
              <span className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-black uppercase tracking-wider ${actionConfig.btnClass}`}>
                {actionConfig.icon} {action.actionLabel}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Expected Student Output</p>
            <p className="text-xs text-cyan-200 mt-1 leading-relaxed">{action.studentOutput}</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Target Route / URL</p>
            <p className="text-xs text-slate-300 font-mono mt-1">{action.actionTarget || 'None specified'}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-5 border-t border-white/10 mt-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
          >
            Close Preview
          </button>
          {action.actionTarget && (
            <button
              type="button"
              onClick={handleOpenPage}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-5 py-2 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-emerald-900/40"
            >
              Open Live Route <ExternalLink size={13} />
            </button>
          )}
        </div>
      </motion.div>
    </div>,
    document.body
  );
}

