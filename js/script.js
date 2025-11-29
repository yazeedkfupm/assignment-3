// ----- STATE -----
const state = {
  theme: 'light',
  visitorName: null,
  projectsVisible: true,
  projects: [
    {
      id: 1,
      title: 'Portfolio Website',
      type: 'web',
      level: 'beginner',
      difficulty: 1,
      date: '2024-05-01',
      description: 'My personal portfolio built with HTML, CSS, and JS.',
    },
    {
      id: 2,
      title: 'Mobile Habit Tracker',
      type: 'mobile',
      level: 'intermediate',
      difficulty: 2,
      date: '2024-07-15',
      description: 'A progressive web app to track daily habits.',
    },
    {
      id: 3,
      title: 'UI Design System',
      type: 'uiux',
      level: 'advanced',
      difficulty: 3,
      date: '2024-09-10',
      description: 'Reusable design components for web apps.',
    },
    {
      id: 4,
      title: 'Blog CMS',
      type: 'web',
      level: 'intermediate',
      difficulty: 2,
      date: '2024-08-02',
      description: 'A simple content management system for blogging.',
    },
    {
      id: 5,
      title: 'Task Manager App',
      type: 'web',
      level: 'intermediate',
      difficulty: 2,
      date: '2024-10-05',
      description: 'Task manager with filters and local storage.',
    },
    {
      id: 6,
      title: 'Mini Game – Memory Cards',
      type: 'web',
      level: 'advanced',
      difficulty: 3,
      date: '2024-11-01',
      description: 'A browser-based memory card game with scoring.',
    },
  ],
};

// ----- UTILITIES -----
function loadStateFromStorage() {
  const storedTheme = localStorage.getItem('theme');
  const storedName = localStorage.getItem('visitorName');
  const storedProjectsVisible = localStorage.getItem('projectsVisible');

  if (storedTheme) state.theme = storedTheme;
  if (storedName) state.visitorName = storedName;
  if (storedProjectsVisible !== null) {
    state.projectsVisible = storedProjectsVisible === 'true';
  }
}

function saveTheme() {
  localStorage.setItem('theme', state.theme);
}

function saveVisitorName() {
  if (state.visitorName) {
    localStorage.setItem('visitorName', state.visitorName);
  } else {
    localStorage.removeItem('visitorName');
  }
}

function saveProjectsVisible() {
  localStorage.setItem('projectsVisible', String(state.projectsVisible));
}

// ----- TIMER -----
function startTimer() {
  const timerEl = document.getElementById('timer');
  const startTime = Date.now();

  setInterval(() => {
    const seconds = Math.floor((Date.now() - startTime) / 1000);
    timerEl.textContent = `Time on site: ${seconds}s`;
  }, 1000);
}

// ----- THEME -----
function applyTheme() {
  document.documentElement.setAttribute('data-theme', state.theme);
}

function setupThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  btn.addEventListener('click', () => {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    applyTheme();
    saveTheme();
  });
}

// ----- GREETING / NAME -----
function updateGreeting() {
  const greetingEl = document.getElementById('greeting');
  if (state.visitorName) {
    greetingEl.textContent = `Welcome, ${state.visitorName}!`;
  } else {
    greetingEl.textContent = 'Welcome to my portfolio';
  }
}

function setupNameForm() {
  const form = document.getElementById('name-form');
  const input = document.getElementById('visitor-name');

  if (state.visitorName) {
    input.value = state.visitorName;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = input.value.trim();
    state.visitorName = name || null;
    saveVisitorName();
    updateGreeting();
  });
}

// ----- PROJECTS (FILTER, SORT, SHOW/HIDE) -----
function getDifficultyLabel(difficulty) {
  switch (difficulty) {
    case 1:
      return 'Easy';
    case 2:
      return 'Medium';
    case 3:
      return 'Hard';
    default:
      return 'N/A';
  }
}

function getDifficultyStars(difficulty) {
  return '★'.repeat(difficulty) + '☆'.repeat(3 - difficulty);
}

function renderProjects() {
  const listEl = document.getElementById('project-list');
  const filterSelect = document.getElementById('project-filter');
  const sortSelect = document.getElementById('project-sort');

  const filterValue = filterSelect.value;
  const sortValue = sortSelect.value;

  let projects = [...state.projects];

  // Filter
  if (filterValue !== 'all') {
    projects = projects.filter((p) => p.type === filterValue);
  }

  // Sort (date or difficulty)
  projects.sort((a, b) => {
    switch (sortValue) {
      case 'date-asc':
        return new Date(a.date) - new Date(b.date);
      case 'date-desc':
        return new Date(b.date) - new Date(a.date);
      case 'difficulty-asc':
        return a.difficulty - b.difficulty;
      case 'difficulty-desc':
        return b.difficulty - a.difficulty;
      default:
        return 0;
    }
  });

  // Render
  listEl.innerHTML = '';
  projects.forEach((project) => {
    const li = document.createElement('li');
    li.className = 'card';
    const difficultyLabel = getDifficultyLabel(project.difficulty);
    const difficultyStars = getDifficultyStars(project.difficulty);
    li.innerHTML = `
      <h3>${project.title}</h3>
      <p>${project.description}</p>
      <p>
        <strong>Type:</strong> ${project.type.toUpperCase()} |
        <strong>Level:</strong> ${project.level}
      </p>
      <p class="difficulty-badge">
        <strong>Difficulty:</strong> ${difficultyLabel} (${difficultyStars})
        &nbsp;|&nbsp;
        <strong>Date:</strong> ${project.date}
      </p>
    `;
    listEl.appendChild(li);
  });
}

function setupProjectControls() {
  const filterSelect = document.getElementById('project-filter');
  const sortSelect = document.getElementById('project-sort');
  const toggleBtn = document.getElementById('toggle-projects');
  const listEl = document.getElementById('project-list');

  filterSelect.addEventListener('change', renderProjects);
  sortSelect.addEventListener('change', renderProjects);

  function updateVisibility() {
    listEl.style.display = state.projectsVisible ? 'grid' : 'none';
    toggleBtn.textContent = state.projectsVisible ? 'Hide Projects' : 'Show Projects';
  }

  toggleBtn.addEventListener('click', () => {
    state.projectsVisible = !state.projectsVisible;
    updateVisibility();
    saveProjectsVisible();
  });

  updateVisibility();
  renderProjects();
}

// ----- SKILL LEVEL CONDITIONAL CONTENT -----
function setupSkillLevel() {
  const select = document.getElementById('skill-level');
  const messageEl = document.getElementById('skill-message');

  function updateMessage() {
    const value = select.value;
    if (value === 'beginner') {
      messageEl.textContent =
        'Great! Start by exploring my beginner-friendly web projects like the Portfolio Website.';
    } else if (value === 'intermediate') {
      messageEl.textContent =
        'You might enjoy intermediate projects such as the Mobile Habit Tracker or Blog CMS.';
    } else {
      messageEl.textContent =
        'Check out my more advanced work like the UI Design System and Memory Cards game.';
    }
  }

  select.addEventListener('change', updateMessage);
  updateMessage();
}

// ----- CONTACT FORM VALIDATION -----
function setupContactForm() {
  const form = document.getElementById('contact-form');
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const messageInput = document.getElementById('contact-message');
  const resultEl = document.getElementById('contact-result');

  function setError(input, message) {
    const msgEl = document.querySelector(`.error-message[data-for="${input.id}"]`);
    msgEl.textContent = message;
  }

  function clearError(input) {
    const msgEl = document.querySelector(`.error-message[data-for="${input.id}"]`);
    msgEl.textContent = '';
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    // Name
    if (!nameInput.value.trim()) {
      setError(nameInput, 'Name is required.');
      valid = false;
    } else {
      clearError(nameInput);
    }

    // Email
    if (!emailInput.value.trim()) {
      setError(emailInput, 'Email is required.');
      valid = false;
    } else if (!isValidEmail(emailInput.value.trim())) {
      setError(emailInput, 'Please enter a valid email address.');
      valid = false;
    } else {
      clearError(emailInput);
    }

    // Message
    if (!messageInput.value.trim()) {
      setError(messageInput, 'Message is required.');
      valid = false;
    } else {
      clearError(messageInput);
    }

    if (!valid) {
      resultEl.textContent = 'Please fix the errors above.';
      return;
    }

    // Simulated successful submission
    resultEl.textContent = 'Thank you! Your message has been (pretend) sent.';
    form.reset();
  });
}

// ----- GITHUB API INTEGRATION -----
async function fetchGitHubRepos() {
  const statusEl = document.getElementById('github-status');
  const listEl = document.getElementById('github-repos');

  statusEl.textContent = 'Loading repositories...';

  try {
    const response = await fetch(
      'https://api.github.com/users/yazeedkfupm/repos?sort=updated&per_page=5'
    );

    if (!response.ok) {
      throw new Error(`GitHub API returned ${response.status}`);
    }

    const repos = await response.json();
    listEl.innerHTML = '';

    if (!repos.length) {
      statusEl.textContent = 'No repositories found.';
      return;
    }

    repos.forEach((repo) => {
      const li = document.createElement('li');
      li.className = 'card';
      li.innerHTML = `
        <h3><a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">${repo.name}</a></h3>
        <p>${repo.description || 'No description provided.'}</p>
        <p><strong>Language:</strong> ${repo.language || 'N/A'} |
           <strong>Updated:</strong> ${new Date(repo.updated_at).toLocaleDateString()}</p>
      `;
      listEl.appendChild(li);
    });

    statusEl.textContent = 'Showing your latest repositories from GitHub.';
  } catch (error) {
    console.error(error);
    statusEl.textContent =
      'Unable to load repositories right now. Please try again later.';
  }
}

// ----- INIT -----
document.addEventListener('DOMContentLoaded', () => {
  loadStateFromStorage();
  applyTheme();
  updateGreeting();
  setupThemeToggle();
  setupNameForm();
  setupProjectControls();
  setupSkillLevel();
  setupContactForm();
  fetchGitHubRepos();
  startTimer();

  // footer year
  document.getElementById('year').textContent = new Date().getFullYear();
});
