/**
 * STUDYHUB - Modern Student Dashboard JavaScript Application
 */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // INITIAL APP STATE & STORAGE HANDLERS
    // ==========================================
    const DEFAULT_SUBJECTS = [
        {
            id: 'sub-1',
            name: 'English',
            icon: '🇬🇧',
            color: '#6366f1',
            progress: 85,
            hoursSpent: 18,
            topics: ['Shakespearean Drama', 'Modern Poetry', 'Critical Essay Writing']
        },
        {
            id: 'sub-2',
            name: 'Economics',
            icon: '📈',
            color: '#10b981',
            progress: 70,
            hoursSpent: 24,
            topics: ['Microeconomics Supply & Demand', 'Macro Fiscal Policy', 'Global Trade']
        },
        {
            id: 'sub-3',
            name: 'History',
            icon: '🏛️',
            color: '#f59e0b',
            progress: 60,
            hoursSpent: 15,
            topics: ['World War II Timeline', 'The Industrial Revolution', 'Ancient Civilizations']
        },
        {
            id: 'sub-4',
            name: 'Political Science',
            icon: '⚖️',
            color: '#a855f7',
            progress: 75,
            hoursSpent: 20,
            topics: ['Constitutional Law', 'International Relations', 'Political Thought']
        },
        {
            id: 'sub-5',
            name: 'Sociology',
            icon: '👥',
            color: '#06b6d4',
            progress: 90,
            hoursSpent: 22,
            topics: ['Social Institutions', 'Cultural Dynamics', 'Research Methods']
        },
        {
            id: 'sub-6',
            name: 'Arabic',
            icon: '📖',
            color: '#f43f5e',
            progress: 65,
            hoursSpent: 16,
            topics: ['Advanced Grammar (Nahw)', 'Vocabulary & Idioms', 'Classical Prose']
        }
    ];

    const DEFAULT_TASKS = [
        {
            id: 'task-1',
            title: 'Read Chapter 4 Macroeconomics - Fiscal Policy',
            subject: 'Economics',
            priority: 'High',
            dueDate: '2026-10-02',
            completed: false
        },
        {
            id: 'task-2',
            title: 'Write Essay on Industrial Revolution Impact',
            subject: 'History',
            priority: 'Medium',
            dueDate: '2026-10-05',
            completed: true
        },
        {
            id: 'task-3',
            title: 'Arabic Grammar Practice Quiz Exercises',
            subject: 'Arabic',
            priority: 'High',
            dueDate: '2026-10-01',
            completed: false
        },
        {
            id: 'task-4',
            title: 'Sociology Research Paper Outline Draft',
            subject: 'Sociology',
            priority: 'Medium',
            dueDate: '2026-10-10',
            completed: false
        },
        {
            id: 'task-5',
            title: 'Political Systems Comparison Chart',
            subject: 'Political Science',
            priority: 'Low',
            dueDate: '2026-10-04',
            completed: false
        },
        {
            id: 'task-6',
            title: 'English Poetry Stanza Analysis Work',
            subject: 'English',
            priority: 'High',
            dueDate: '2026-09-30',
            completed: true
        }
    ];

    // Load or initialize state from localStorage
    let subjects = JSON.parse(localStorage.getItem('studyhub_subjects')) || DEFAULT_SUBJECTS;
    let tasks = JSON.parse(localStorage.getItem('studyhub_tasks')) || DEFAULT_TASKS;
    let completedSessions = parseInt(localStorage.getItem('studyhub_sessions') || '3', 10);
    let totalFocusMins = parseInt(localStorage.getItem('studyhub_focus_mins') || '75', 10);
    let activeTheme = localStorage.getItem('studyhub_theme') || 'dark';

    // Apply theme
    document.documentElement.setAttribute('data-theme', activeTheme);

    // Save helpers
    function saveSubjects() {
        localStorage.setItem('studyhub_subjects', JSON.stringify(subjects));
        updateOverallProgress();
        renderAnalyticsView();
    }

    function saveTasks() {
        localStorage.setItem('studyhub_tasks', JSON.stringify(tasks));
        updateOverallProgress();
        renderUpcomingTasksWidget();
        renderTasksView();
    }

    function saveStats() {
        localStorage.setItem('studyhub_sessions', completedSessions);
        localStorage.setItem('studyhub_focus_mins', totalFocusMins);
    }

    // ==========================================
    // DATE & GREETING
    // ==========================================
    function initHeaderDate() {
        const dateElement = document.getElementById('currentDateDisplay');
        const now = new Date();
        const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
        dateElement.textContent = now.toLocaleDateString('en-US', options);
    }

    // ==========================================
    // OVERALL PROGRESS RE-CALCULATION
    // ==========================================
    function updateOverallProgress() {
        if (!subjects.length) return;
        const totalSubjectScore = subjects.reduce((sum, s) => sum + s.progress, 0);
        const avgSubjectProgress = Math.round(totalSubjectScore / subjects.length);

        const totalTasks = tasks.length;
        const doneTasks = tasks.filter(t => t.completed).length;
        const taskCompletionPercent = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 100;

        // Weighted overall score: 70% subject mastery + 30% task completion
        const overallScore = Math.round((avgSubjectProgress * 0.7) + (taskCompletionPercent * 0.3));

        // Update UI elements
        const headerCircle = document.getElementById('headerProgressCircle');
        const headerVal = document.getElementById('headerProgressVal');
        const headerStatus = document.getElementById('headerProgressStatus');
        const heroPercent = document.getElementById('heroProgressPercent');
        const heroFill = document.getElementById('heroProgressFill');

        const doneStat = document.getElementById('statDoneCount');
        const completedHero = document.getElementById('completedTasksHero');
        const totalHero = document.getElementById('totalTasksHero');
        const pendingBadge = document.getElementById('navPendingTasksCount');

        if (headerVal) headerVal.textContent = `${overallScore}%`;
        if (heroPercent) heroPercent.textContent = `${overallScore}%`;
        if (heroFill) heroFill.style.width = `${overallScore}%`;

        if (headerCircle) {
            headerCircle.setAttribute('stroke-dasharray', `${overallScore}, 100`);
        }

        if (headerStatus) {
            if (overallScore >= 80) headerStatus.textContent = 'Excellent 🌟';
            else if (overallScore >= 60) headerStatus.textContent = 'On Track 👍';
            else headerStatus.textContent = 'Needs Focus ⚠️';
        }

        if (doneStat) doneStat.textContent = `${doneTasks} / ${totalTasks}`;
        if (completedHero) completedHero.textContent = doneTasks;
        if (totalHero) totalHero.textContent = totalTasks;

        const pendingCount = totalTasks - doneTasks;
        if (pendingBadge) {
            pendingBadge.textContent = pendingCount;
            pendingBadge.style.display = pendingCount > 0 ? 'inline-block' : 'none';
        }
    }

    // ==========================================
    // SIDEBAR & NAVIGATION TABS
    // ==========================================
    const navItems = document.querySelectorAll('.nav-item');
    const viewSections = document.querySelectorAll('.view-section');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const closeSidebarBtn = document.getElementById('closeSidebarBtn');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    function switchView(viewName) {
        navItems.forEach(item => {
            if (item.getAttribute('data-view') === viewName) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        viewSections.forEach(section => {
            if (section.id === `view-${viewName}`) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });

        // Close sidebar on mobile
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('active');
    }

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const viewName = item.getAttribute('data-view');
            switchView(viewName);
        });
    });

    document.querySelectorAll('[data-switch-view]').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetView = btn.getAttribute('data-switch-view');
            switchView(targetView);
        });
    });

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.add('open');
            sidebarOverlay.classList.add('active');
        });
    }

    if (closeSidebarBtn) {
        closeSidebarBtn.addEventListener('click', () => {
            sidebar.classList.remove('open');
            sidebarOverlay.classList.remove('active');
        });
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            sidebarOverlay.classList.remove('active');
        });
    }

    // ==========================================
    // THEME SWITCHER
    // ==========================================
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', nextTheme);
        localStorage.setItem('studyhub_theme', nextTheme);
        showToast(`Switched to ${nextTheme.toUpperCase()} theme mode! 🌙☀️`);
    });

    // ==========================================
    // RENDER SUBJECTS (DASHBOARD & FULL VIEW)
    // ==========================================
    function renderDashboardSubjects() {
        const container = document.getElementById('dashboardSubjectsGrid');
        if (!container) return;

        container.innerHTML = subjects.map(s => `
            <div class="subject-card">
                <div class="subject-card-header">
                    <div class="subject-badge">
                        <div class="subject-icon-box" style="background-color: ${s.color}20;">
                            ${s.icon}
                        </div>
                        <span>${s.name}</span>
                    </div>
                    <span class="subject-progress-val" style="color: ${s.color};">${s.progress}%</span>
                </div>
                <div class="subject-progress-bar-wrap">
                    <div class="subject-bar-track">
                        <div class="subject-bar-fill" style="width: ${s.progress}%; background-color: ${s.color};"></div>
                    </div>
                </div>
                <div class="subject-meta-footer">
                    <span>${s.topics.length} Key Topics</span>
                    <span>${s.hoursSpent} hrs studied</span>
                </div>
            </div>
        `).join('');
    }

    function renderFullSubjects() {
        const container = document.getElementById('fullSubjectsGrid');
        if (!container) return;

        container.innerHTML = subjects.map(s => `
            <div class="full-subject-card">
                <div class="full-subject-top">
                    <div class="subject-banner-icon" style="background-color: ${s.color}20;">
                        ${s.icon}
                    </div>
                    <div class="subject-info-titles">
                        <h3>${s.name}</h3>
                        <p>${s.hoursSpent} hours logged this semester</p>
                    </div>
                </div>

                <div class="slider-control-group">
                    <div class="slider-label-row">
                        <span>Mastery Progress</span>
                        <strong style="color: ${s.color};">${s.progress}%</strong>
                    </div>
                    <input type="range" class="progress-slider" min="0" max="100" value="${s.progress}" data-subject-id="${s.id}">
                </div>

                <div class="subject-topics-list">
                    <div class="form-group label" style="font-size: 0.78rem; font-weight:700; color:var(--text-muted);">CHAPTER TOPICS</div>
                    ${s.topics.map(t => `<div class="topic-item"><span>✔️</span> ${t}</div>`).join('')}
                </div>
            </div>
        `).join('');

        // Attach event listeners for range sliders
        document.querySelectorAll('.progress-slider').forEach(slider => {
            slider.addEventListener('input', (e) => {
                const subId = e.target.getAttribute('data-subject-id');
                const newVal = parseInt(e.target.value, 10);
                const sub = subjects.find(s => s.id === subId);
                if (sub) {
                    sub.progress = newVal;
                    saveSubjects();
                    renderDashboardSubjects();
                    // Update value display text inline
                    e.target.previousElementSibling.querySelector('strong').textContent = `${newVal}%`;
                }
            });
        });
    }

    // ==========================================
    // RENDER UPCOMING TASKS & TASKS CRUD VIEW
    // ==========================================
    function renderUpcomingTasksWidget() {
        const container = document.getElementById('dashboardUpcomingTasks');
        if (!container) return;

        const pending = tasks.filter(t => !t.completed);

        if (!pending.length) {
            container.innerHTML = `<div style="text-align:center; padding:16px; font-size:0.85rem; color:var(--text-muted);">🎉 All tasks completed! Great job!</div>`;
            return;
        }

        container.innerHTML = pending.map(t => `
            <div class="quick-task-item" data-task-id="${t.id}">
                <div class="quick-task-left">
                    <div class="custom-checkbox task-check-btn" data-task-id="${t.id}" title="Mark task completed">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" style="display:none;"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <div>
                        <div class="quick-task-title">${t.title}</div>
                        <div class="quick-task-subject">${t.subject}</div>
                    </div>
                </div>
                <button class="icon-btn delete-task-btn" data-delete-id="${t.id}" title="Delete task" style="width:28px; height:28px;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                </button>
            </div>
        `).join('');

        // Attach check handlers
        container.querySelectorAll('.task-check-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const taskId = btn.getAttribute('data-task-id');
                toggleTaskComplete(taskId);
            });
        });

        // Attach delete handlers
        container.querySelectorAll('.delete-task-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const deleteId = btn.getAttribute('data-delete-id');
                deleteTask(deleteId);
            });
        });
    }

    // Inline Dashboard Quick Task Form Handler
    const dashQuickTaskForm = document.getElementById('dashQuickTaskForm');
    if (dashQuickTaskForm) {
        dashQuickTaskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const titleInput = document.getElementById('dashQuickTaskTitle');
            const subjectSelect = document.getElementById('dashQuickTaskSubject');
            const title = titleInput.value.trim();
            const subject = subjectSelect.value;

            if (!title) return;

            const newTask = {
                id: 'task-' + Date.now(),
                title: title,
                subject: subject,
                priority: 'Medium',
                dueDate: new Date().toISOString().split('T')[0],
                completed: false
            };

            tasks.unshift(newTask);
            saveTasks();
            titleInput.value = '';
            showToast(`Added task: "${newTask.title}" (${newTask.subject}) 🚀`);
        });
    }

    let currentFilter = 'all';
    let currentSubjectFilter = 'all';
    let searchQuery = '';

    const taskSearchInput = document.getElementById('taskSearchInput');
    const filterTabs = document.querySelectorAll('.filter-tab');
    const taskSubjectFilter = document.getElementById('taskSubjectFilter');

    if (taskSearchInput) {
        taskSearchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase().trim();
            renderTasksView();
        });
    }

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentFilter = tab.getAttribute('data-filter');
            renderTasksView();
        });
    });

    if (taskSubjectFilter) {
        taskSubjectFilter.addEventListener('change', (e) => {
            currentSubjectFilter = e.target.value;
            renderTasksView();
        });
    }

    function renderTasksView() {
        const container = document.getElementById('tasksList');
        if (!container) return;

        let filtered = tasks.filter(t => {
            // Status filter
            if (currentFilter === 'pending' && t.completed) return false;
            if (currentFilter === 'completed' && !t.completed) return false;

            // Subject filter
            if (currentSubjectFilter !== 'all' && t.subject !== currentSubjectFilter) return false;

            // Search query
            if (searchQuery) {
                const matchesTitle = t.title.toLowerCase().includes(searchQuery);
                const matchesSubject = t.subject.toLowerCase().includes(searchQuery);
                if (!matchesTitle && !matchesSubject) return false;
            }

            return true;
        });

        if (!filtered.length) {
            container.innerHTML = `
                <div class="empty-tasks-state">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                    <p>No study tasks found matching your filters.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filtered.map(t => {
            const priorityClass = t.priority === 'High' ? 'tag-priority-high' : (t.priority === 'Medium' ? 'tag-priority-medium' : 'tag-priority-low');
            return `
                <div class="task-card-item ${t.completed ? 'completed' : ''}" data-task-id="${t.id}">
                    <div class="task-left-meta">
                        <div class="task-checkbox-lg task-check-btn" data-task-id="${t.id}">
                            ${t.completed ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
                        </div>
                        <div>
                            <div class="task-main-title">${t.title}</div>
                            <div class="task-tags-row">
                                <span class="task-tag tag-subject">${t.subject}</span>
                                <span class="task-tag ${priorityClass}">${t.priority} Priority</span>
                                ${t.dueDate ? `<span class="task-due-date">📅 Due ${t.dueDate}</span>` : ''}
                            </div>
                        </div>
                    </div>
                    <div class="task-right-actions">
                        <button class="icon-btn delete-task-btn" data-delete-id="${t.id}" title="Delete task">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        // Event Listeners for completion & delete
        container.querySelectorAll('.task-check-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const taskId = btn.getAttribute('data-task-id');
                toggleTaskComplete(taskId);
            });
        });

        container.querySelectorAll('.delete-task-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const deleteId = btn.getAttribute('data-delete-id');
                deleteTask(deleteId);
            });
        });
    }

    function toggleTaskComplete(taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            saveTasks();
            showToast(task.completed ? `Task completed: "${task.title}" 🎉` : `Task marked pending`);
        }
    }

    function deleteTask(taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            tasks = tasks.filter(t => t.id !== taskId);
            saveTasks();
            showToast(`Deleted task: "${task.title}"`);
        }
    }

    // ==========================================
    // ADD TASK MODAL DIALOG
    // ==========================================
    const addTaskModal = document.getElementById('addTaskModal');
    const openAddTaskModalBtn = document.getElementById('openAddTaskModalBtn');
    const openAddTaskModalBtn2 = document.getElementById('openAddTaskModalBtn2');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelModalBtn = document.getElementById('cancelModalBtn');
    const addTaskForm = document.getElementById('addTaskForm');

    function openModal() {
        if (addTaskModal) addTaskModal.classList.add('active');
    }

    function closeModal() {
        if (addTaskModal) addTaskModal.classList.remove('active');
        if (addTaskForm) addTaskForm.reset();
    }

    if (openAddTaskModalBtn) openAddTaskModalBtn.addEventListener('click', openModal);
    if (openAddTaskModalBtn2) openAddTaskModalBtn2.addEventListener('click', openModal);
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeModal);

    if (addTaskForm) {
        addTaskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const titleInput = document.getElementById('taskTitleInput').value.trim();
            const subjectSelect = document.getElementById('taskSubjectSelect').value;
            const prioritySelect = document.getElementById('taskPrioritySelect').value;
            const dueDateInput = document.getElementById('taskDueDateInput').value;

            if (!titleInput) return;

            const newTask = {
                id: 'task-' + Date.now(),
                title: titleInput,
                subject: subjectSelect,
                priority: prioritySelect,
                dueDate: dueDateInput,
                completed: false
            };

            tasks.unshift(newTask);
            saveTasks();
            closeModal();
            showToast(`New task added: "${newTask.title}" 🚀`);
        });
    }

    // ==========================================
    // STUDY TIMER LOGIC (25-MIN POMODORO)
    // ==========================================
    const TIMER_MODES = {
        study: { label: '25 min Study', durationSec: 25 * 60 },
        shortBreak: { label: '5 min Break', durationSec: 5 * 60 },
        longBreak: { label: '15 min Break', durationSec: 15 * 60 }
    };

    let currentTimerMode = 'study';
    let timeLeft = TIMER_MODES[currentTimerMode].durationSec;
    let timerInterval = null;
    let isTimerRunning = false;

    const fullTimerDisplay = document.getElementById('fullTimerDisplay');
    const dashTimerDisplay = document.getElementById('dashTimerDisplay');
    const timerStatusText = document.getElementById('timerStatusText');
    const timerToggleBtn = document.getElementById('timerToggleBtn');
    const timerPlayIcon = document.getElementById('timerPlayIcon');
    const timerPauseIcon = document.getElementById('timerPauseIcon');
    const timerToggleText = document.getElementById('timerToggleText');
    const timerResetBtn = document.getElementById('timerResetBtn');
    const dashTimerStartBtn = document.getElementById('dashTimerStartBtn');
    const dashTimerResetBtn = document.getElementById('dashTimerResetBtn');
    const timerProgressCircle = document.getElementById('timerProgressCircle');
    const timerModeTabs = document.querySelectorAll('.timer-tab');
    const completedSessionsCount = document.getElementById('completedSessionsCount');
    const totalTimerMins = document.getElementById('totalTimerMins');
    const statStudyTime = document.getElementById('statStudyTime');

    function formatTime(seconds) {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }

    function updateTimerDisplays() {
        const formatted = formatTime(timeLeft);
        if (fullTimerDisplay) fullTimerDisplay.textContent = formatted;
        if (dashTimerDisplay) dashTimerDisplay.textContent = formatted;

        // Update SVG circle stroke dashoffset
        if (timerProgressCircle) {
            const total = TIMER_MODES[currentTimerMode].durationSec;
            const circumference = 2 * Math.PI * 130; // 816.8
            const fraction = 1 - (timeLeft / total);
            const offset = circumference * fraction;
            timerProgressCircle.style.strokeDashoffset = offset;
        }

        if (completedSessionsCount) completedSessionsCount.textContent = completedSessions;
        if (totalTimerMins) totalTimerMins.textContent = `${totalFocusMins} mins`;
        if (statStudyTime) statStudyTime.textContent = `${totalFocusMins} mins`;
    }

    function startTimer() {
        if (isTimerRunning) return;
        isTimerRunning = true;

        if (timerPlayIcon) timerPlayIcon.style.display = 'none';
        if (timerPauseIcon) timerPauseIcon.style.display = 'inline-block';
        if (timerToggleText) timerToggleText.textContent = 'Pause Session';
        if (timerStatusText) timerStatusText.textContent = 'Focus in progress... Stay on task!';

        timerInterval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateTimerDisplays();
            } else {
                pauseTimer();
                playCompletionChime();
                if (currentTimerMode === 'study') {
                    completedSessions++;
                    totalFocusMins += 25;
                    saveStats();
                    showToast('🎉 Great work! 25-minute study session completed!');
                } else {
                    showToast('🔔 Break time finished! Ready to resume studying?');
                }
                resetTimer();
            }
        }, 1000);
    }

    function pauseTimer() {
        isTimerRunning = false;
        clearInterval(timerInterval);
        if (timerPlayIcon) timerPlayIcon.style.display = 'inline-block';
        if (timerPauseIcon) timerPauseIcon.style.display = 'none';
        if (timerToggleText) timerToggleText.textContent = 'Resume Session';
        if (timerStatusText) timerStatusText.textContent = 'Timer paused';
    }

    function resetTimer() {
        pauseTimer();
        timeLeft = TIMER_MODES[currentTimerMode].durationSec;
        if (timerToggleText) timerToggleText.textContent = 'Start Session';
        if (timerStatusText) timerStatusText.textContent = 'Ready to start?';
        updateTimerDisplays();
    }

    if (timerToggleBtn) {
        timerToggleBtn.addEventListener('click', () => {
            if (isTimerRunning) pauseTimer();
            else startTimer();
        });
    }

    if (timerResetBtn) timerResetBtn.addEventListener('click', resetTimer);

    if (dashTimerStartBtn) {
        dashTimerStartBtn.addEventListener('click', () => {
            switchView('timer');
            startTimer();
        });
    }

    if (dashTimerResetBtn) dashTimerResetBtn.addEventListener('click', resetTimer);

    timerModeTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            timerModeTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentTimerMode = tab.getAttribute('data-mode');
            const dashBadge = document.getElementById('dashTimerModeBadge');
            if (dashBadge) dashBadge.textContent = TIMER_MODES[currentTimerMode].label;
            resetTimer();
        });
    });

    // Web Audio Synthesizer for Timer Bell
    function playCompletionChime() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5 note
            osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5 note
            
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.start();
            osc.stop(ctx.currentTime + 1.2);
        } catch (e) {
            console.log('Audio chime error:', e);
        }
    }

    // ==========================================
    // ANALYTICS VIEW
    // ==========================================
    function renderAnalyticsView() {
        const container = document.getElementById('analyticsBars');
        if (!container) return;

        container.innerHTML = subjects.map(s => `
            <div class="analytics-bar-item">
                <div class="bar-meta">
                    <span>${s.icon} ${s.name}</span>
                    <span style="color: ${s.color}; font-weight:700;">${s.progress}%</span>
                </div>
                <div class="bar-track">
                    <div style="height: 100%; width: ${s.progress}%; background-color: ${s.color}; border-radius: var(--radius-full);"></div>
                </div>
            </div>
        `).join('');
    }

    // ==========================================
    // TOAST NOTIFICATIONS
    // ==========================================
    function showToast(message) {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<span>⚡</span> <span>${message}</span>`;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // ==========================================
    // INITIALIZATION
    // ==========================================
    initHeaderDate();
    updateOverallProgress();
    renderDashboardSubjects();
    renderFullSubjects();
    renderUpcomingTasksWidget();
    renderTasksView();
    updateTimerDisplays();
    renderAnalyticsView();
});
