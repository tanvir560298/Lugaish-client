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
  ArrowRight
} from 'lucide-react';
import { loadTanvirCourses, saveTanvirCourses } from '../data/tanvirCoursesData.js';
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
                  onClick={() => setWorkingCourse(course)}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-md transition active:scale-95"
                >
                  <Layers size={14} /> Work on Course
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
