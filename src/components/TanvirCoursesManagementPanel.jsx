import React, { useState, useMemo } from 'react';
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
  Check
} from 'lucide-react';
import { 
  loadTanvirCourses, 
  saveTanvirCourses,
  loadCoursePlan,
  saveCoursePlan,
  DEFAULT_COURSE_PLANS
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

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
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
    </div>
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

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg overflow-y-auto">
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
    </div>
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
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  
  // Modals inside planner
  const [editingDay, setEditingDay] = useState(null);
  const [isAddingDay, setIsAddingDay] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [simulatedAction, setSimulatedAction] = useState(null);
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

  // Filtered day roadmap
  const filteredDays = useMemo(() => {
    return plan.filter(d => {
      const matchesAction = filterAction === 'all' ? true : d.actionType === filterAction;
      const matchesSearch = search.trim() === '' ? true : (
        d.title.toLowerCase().includes(search.toLowerCase()) ||
        d.studyTopic?.toLowerCase().includes(search.toLowerCase()) ||
        d.studentOutput?.toLowerCase().includes(search.toLowerCase()) ||
        String(d.day).includes(search)
      );
      return matchesAction && matchesSearch;
    }).sort((a, b) => (a.day || 0) - (b.day || 0));
  }, [plan, filterAction, search]);

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
      showToast('Plan JSON copied to clipboard!');
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
    showToast('Reset plan to official starter template.');
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-xl overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 20 }}
        className="relative w-full max-w-5xl rounded-3xl border border-emerald-500/30 bg-slate-950 p-5 sm:p-8 shadow-2xl my-6 flex flex-col max-h-[92vh] overflow-hidden"
      >
        {/* Decorative glows */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-600/15 blur-[80px] pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-teal-600/10 blur-[80px] pointer-events-none" />

        {/* Header Strip */}
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-white/10 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-500/15 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-300">
                <Compass size={13} /> Course Plan & Curriculum Manager
              </span>
              {course.duration && (
                <span className="rounded-full border border-amber-400/30 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-black text-amber-300 uppercase">
                  ⏳ {course.duration}
                </span>
              )}
            </div>
            <h3 className="mt-2 text-2xl sm:text-3xl font-black text-white">
              {course.title}
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              Instructor: <span className="text-white font-bold">{course.instructor}</span> • Schedule: <span className="text-slate-300">{course.schedule || 'Regular'}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAddingDay(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-3.5 py-2 text-xs font-black uppercase tracking-wider text-white shadow-md transition active:scale-95"
            >
              <Plus size={15} /> Add Day
            </button>
            <button
              type="button"
              onClick={() => setIsUploadOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 px-3.5 py-2 text-xs font-bold text-slate-200 transition"
              title="Upload / Paste Syllabus Plan"
            >
              <Upload size={14} /> Upload Plan
            </button>
            <button
              type="button"
              onClick={handleExportPlan}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 px-3 py-2 text-xs font-bold text-slate-200 transition"
              title="Copy Plan JSON"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span className="hidden sm:inline">Export</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white transition ml-1"
            >
              <X size={20} />
            </button>
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

        {/* Metrics & Filter Controls */}
        <div className="relative z-10 mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between shrink-0">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-slate-400">
              Configured Days: <span className="text-emerald-300 font-extrabold">{plan.length}</span> / {course.totalDays || 90} Target Days
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">
              Outputs Configured: <span className="text-cyan-300 font-bold">{plan.filter(d => d.studentOutput).length}</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[200px]">
              <Search size={13} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search day or topic..."
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

        {/* Scrollable Day Roadmap List */}
        <div className="relative z-10 mt-4 flex-1 overflow-y-auto pr-1 space-y-3.5">
          {filteredDays.map(item => {
            const actionConfig = PLAN_ACTION_TYPES[item.actionType] || PLAN_ACTION_TYPES.ai_speaking;

            return (
              <div
                key={item.day}
                className="rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-4 sm:p-5 transition hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-950/20"
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  {/* Left Column: Day # & Content */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-lg bg-emerald-500/20 border border-emerald-400/30 px-2.5 py-0.5 text-xs font-black text-emerald-300 uppercase tracking-widest">
                        Day {item.day}
                      </span>
                      <h4 className="text-base font-black text-white">
                        {item.title}
                      </h4>
                    </div>

                    {/* কোনদিন কী পড়ব (Study Topic) */}
                    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs">
                      <p className="font-bold text-slate-400 text-[10px] uppercase tracking-wider mb-0.5">
                        📖 কোনদিন কী পড়ব (Lesson Concept & Study Scope):
                      </p>
                      <p className="text-slate-200 leading-relaxed font-medium">
                        {item.studyTopic || 'Standard daily lecture and guided concept review.'}
                      </p>
                    </div>

                    {/* কী আউটপুট ব্যবহার করব (Student Output) */}
                    <div className="rounded-xl border border-cyan-500/15 bg-cyan-500/[0.03] p-3 text-xs">
                      <p className="font-bold text-cyan-300 text-[10px] uppercase tracking-wider mb-0.5">
                        🎯 কী আউটপুট তৈরি/ব্যবহার করবে (Expected Student Output):
                      </p>
                      <p className="text-cyan-100 leading-relaxed font-medium">
                        {item.studentOutput || 'Submit voice recording or complete test exercise.'}
                      </p>
                    </div>
                  </div>

                  {/* Right Column: ক্লিক করলে কী হবে (Click Action) & Controls */}
                  <div className="lg:w-72 shrink-0 space-y-3 pt-2 lg:pt-0 lg:pl-4 lg:border-l lg:border-white/10">
                    <div>
                      <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">
                        ⚡ ক্লিক করলে কী হবে (Action Trigger):
                      </span>

                      <div className="flex items-center gap-1.5 mb-2">
                        <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-bold ${actionConfig.badgeClass}`}>
                          {actionConfig.icon} {actionConfig.label}
                        </span>
                      </div>

                      {/* Click Action Button (Interactive Tester) */}
                      <button
                        type="button"
                        onClick={() => setSimulatedAction({
                          day: item.day,
                          title: item.title,
                          actionType: item.actionType,
                          actionLabel: item.actionLabel,
                          actionTarget: item.actionTarget,
                          studyTopic: item.studyTopic,
                          studentOutput: item.studentOutput,
                        })}
                        className={`w-full inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-black uppercase tracking-wider shadow transition active:scale-95 ${actionConfig.btnClass}`}
                        title="Click to simulate / test what learners experience"
                      >
                        {actionConfig.icon}
                        <span className="truncate">{item.actionLabel || 'Start Day Action'}</span>
                        <ArrowRight size={13} className="shrink-0" />
                      </button>

                      {item.actionTarget && (
                        <p className="mt-1 text-[9px] text-slate-500 truncate text-center font-mono">
                          Target: {item.actionTarget}
                        </p>
                      )}
                    </div>

                    {/* Day Edit / Delete Buttons */}
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                      <button
                        type="button"
                        onClick={() => setEditingDay(item)}
                        className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-bold text-slate-300 hover:bg-white/10 transition"
                      >
                        <Edit3 size={12} /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteDay(item.day)}
                        className="inline-flex items-center gap-1 rounded-lg border border-red-500/20 bg-red-500/10 px-2 py-1 text-[11px] font-bold text-red-400 hover:bg-red-500/20 transition"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredDays.length === 0 && (
            <div className="py-14 text-center rounded-3xl border border-dashed border-white/10 bg-white/[0.01]">
              <Compass size={36} className="mx-auto text-slate-600 mb-3" />
              <p className="text-sm font-bold text-slate-400">No days match your search or filter.</p>
              <div className="mt-3 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddingDay(true)}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-black uppercase tracking-wider text-white"
                >
                  + Add First Day
                </button>
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-white/10"
                >
                  Load Official Starter Plan
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer info & close */}
        <div className="relative z-10 mt-4 flex items-center justify-between border-t border-white/10 pt-3 shrink-0">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="text-[11px] font-bold text-slate-500 hover:text-slate-300 transition"
          >
            Reset to Official Starter Plan
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-white/10 hover:bg-white/20 px-6 py-2 text-xs font-black uppercase tracking-wider text-white"
          >
            Close Plan
          </button>
        </div>
      </motion.div>

      {/* --- SUB-MODAL A: ADD OR EDIT DAY --- */}
      <AnimatePresence>
        {(isAddingDay || editingDay) && (
          <PlanDayEditorModal
            initialData={editingDay || {
              day: plan.length > 0 ? Math.max(...plan.map(d => d.day || 0)) + 1 : 1,
              title: '',
              studyTopic: '',
              studentOutput: '',
              actionType: 'ai_speaking',
              actionLabel: 'Launch Day Drill',
              actionTarget: '/speaking-practice',
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

      {/* --- SUB-MODAL B: UPLOAD / PASTE PLAN --- */}
      <AnimatePresence>
        {isUploadOpen && (
          <PlanUploadModal
            course={course}
            onClose={() => setIsUploadOpen(false)}
            onImport={handleImportPlan}
          />
        )}
      </AnimatePresence>

      {/* --- SUB-MODAL C: ACTION SIMULATION PREVIEW ("CLICK KORLE KI HOBE") --- */}
      <AnimatePresence>
        {simulatedAction && (
          <PlanSimulationModal
            action={simulatedAction}
            onClose={() => setSimulatedAction(null)}
            navigate={navigate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- SUB-MODAL A: DAY EDITOR MODAL ---------------- */
function PlanDayEditorModal({ initialData, isEdit, onClose, onSubmit }) {
  const [formData, setFormData] = useState(initialData);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      day: Number(formData.day) || 1,
    });
  };

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-xl rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl my-8"
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <h4 className="text-lg font-black text-white">
            {isEdit ? `Edit Day ${formData.day}` : `Add Day to Plan`}
          </h4>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                Day Number *
              </label>
              <input
                required
                type="number"
                min="1"
                max="365"
                value={formData.day}
                onChange={e => setFormData({ ...formData, day: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                Lesson Title *
              </label>
              <input
                required
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Hesitation Breakdown"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
              কোনদিন কী পড়ব (Study Scope & Concepts) *
            </label>
            <textarea
              required
              rows={2}
              value={formData.studyTopic}
              onChange={e => setFormData({ ...formData, studyTopic: e.target.value })}
              placeholder="What core concepts, grammar points, or speaking strategies will be taught on this day?"
              className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
              কী আউটপুট তৈরি/ব্যবহার করবে (Expected Student Output) *
            </label>
            <textarea
              required
              rows={2}
              value={formData.studentOutput}
              onChange={e => setFormData({ ...formData, studentOutput: e.target.value })}
              placeholder="e.g. Record 60-second self-introduction audio / Complete Task 2 essay outline"
              className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white outline-none focus:border-emerald-400"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                ক্লিক করলে কী হবে (Action Type)
              </label>
              <select
                value={formData.actionType}
                onChange={e => setFormData({ ...formData, actionType: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs font-bold text-white outline-none focus:border-emerald-400"
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
                বাটন লেবেল (Action Button Label)
              </label>
              <input
                required
                type="text"
                value={formData.actionLabel}
                onChange={e => setFormData({ ...formData, actionLabel: e.target.value })}
                placeholder="e.g. Launch AI Pronunciation Drill"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
              টার্গেট লিংক বা রাউট (Action Target URL / Route)
            </label>
            <input
              type="text"
              value={formData.actionTarget}
              onChange={e => setFormData({ ...formData, actionTarget: e.target.value })}
              placeholder="e.g. /speaking-practice?language=english&day=1"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-mono text-white outline-none focus:border-emerald-400"
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
              className="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-6 py-2 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-emerald-600/30"
            >
              Save Day
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

/* ---------------- SUB-MODAL B: UPLOAD / PASTE PLAN ---------------- */
function PlanUploadModal({ course, onClose, onImport }) {
  const [pasteText, setPasteText] = useState('');
  const [error, setError] = useState('');

  const handleParseAndImport = () => {
    setError('');
    if (!pasteText.trim()) {
      setError('Please paste your curriculum JSON or text.');
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
      // Try simple line-by-line format:
      // Day 1: Title | Study Topic | Student Output | ActionLabel
      try {
        const lines = pasteText.split('\n').map(l => l.trim()).filter(Boolean);
        const imported = lines.map((line, idx) => {
          const parts = line.split('|').map(p => p.trim());
          const dayNum = idx + 1;
          return {
            day: dayNum,
            title: parts[0] || `Lesson Day ${dayNum}`,
            studyTopic: parts[1] || 'Core lesson topics and guided drills.',
            studentOutput: parts[2] || 'Practice exercise submission.',
            actionType: 'ai_speaking',
            actionLabel: parts[3] || 'Launch Practice Drill',
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
      setError('Could not parse plan. Please paste a valid JSON array of days.');
    }
  };

  const handleLoadSample = () => {
    const sample = DEFAULT_COURSE_PLANS[course.id] || [];
    setPasteText(JSON.stringify(sample, null, 2));
    setError('');
  };

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-900 p-6 sm:p-8 shadow-2xl my-8"
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
              Bulk Curriculum Uploader
            </span>
            <h4 className="text-xl font-black text-white">Upload Course Plan</h4>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <p className="mt-3 text-xs text-slate-300 leading-relaxed">
          Paste your day-by-day course plan in JSON format. You can also click <strong>"Load Official Starter Plan Template"</strong> below to populate the starter plan template for this track.
        </p>

        {error && (
          <div className="mt-3 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-xs text-red-300">
            {error}
          </div>
        )}

        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Paste Plan JSON
            </span>
            <button
              type="button"
              onClick={handleLoadSample}
              className="text-[10px] font-black uppercase tracking-wider text-emerald-400 hover:underline"
            >
              Load Official Starter Plan Template
            </button>
          </div>
          <textarea
            rows={10}
            value={pasteText}
            onChange={e => setPasteText(e.target.value)}
            placeholder={`[\n  {\n    "day": 1,\n    "title": "Pronunciation Foundations",\n    "studyTopic": "Vowel length and intonation rules",\n    "studentOutput": "Record 60-second speech",\n    "actionType": "ai_speaking",\n    "actionLabel": "Launch AI Pronunciation Drill",\n    "actionTarget": "/speaking-practice?day=1"\n  }\n]`}
            className="w-full rounded-2xl border border-white/10 bg-slate-950 p-3 font-mono text-xs text-emerald-300 outline-none focus:border-emerald-400/60"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-5 border-t border-white/10 mt-4">
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
    </div>
  );
}

/* ---------------- SUB-MODAL C: ACTION SIMULATION PREVIEW ---------------- */
function PlanSimulationModal({ action, onClose, navigate }) {
  const actionConfig = PLAN_ACTION_TYPES[action.actionType] || PLAN_ACTION_TYPES.ai_speaking;

  const handleOpenPage = () => {
    onClose();
    if (action.actionTarget) {
      navigate(action.actionTarget);
    }
  };

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-md rounded-3xl border border-emerald-500/40 bg-slate-900 p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/20">
              <Zap size={16} />
            </span>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Click Simulation</p>
              <h4 className="text-base font-black text-white">Day {action.day} Action Trigger</h4>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 space-y-3 text-xs">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Lesson Title</p>
            <p className="text-sm font-black text-white mt-0.5">{action.title}</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Action Button Clicked</p>
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
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Destination Route / Target</p>
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
              Open Live Page <ExternalLink size={13} />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

