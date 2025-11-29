# Technical Documentation – Portfolio Web Application (Assignment 3)

## 1. Overview
This is a single-page portfolio web application built with HTML, CSS, and vanilla JavaScript.  
It demonstrates:
- External API integration (GitHub REST API)
- Complex UI logic (filtering, sorting, validation)
- Client-side state management
- Basic performance optimizations

## 2. Architecture

- **index.html** – Layout and semantic structure of the application.
- **css/styles.css** – Theme variables, layout, and component styling.
- **js/script.js** – Application logic, event handling, API calls, and state management.
- **docs/** – AI usage documentation and this technical documentation.

## 3. Main Features

### 3.1 Project List (Complex Logic)
- Data stored in `state.projects` as JavaScript objects.
- Filtered by type (`web`, `mobile`, `uiux`) using a `<select>`.
- Sorted by date or difficulty using another `<select>`.
- Rendering handled by `renderProjects()` which:
  - Copies and filters the array.
  - Sorts based on user selection.
  - Rebuilds the DOM list.
- Difficulty is displayed using a label (Easy/Medium/Hard) and star icons, and sorting by difficulty works both ascending and descending.

### 3.2 State Management
- `theme` state (light/dark) stored in `localStorage` key: `"theme"`.
- `visitorName` stored in `"visitorName"`.
- `projectsVisible` stored in `"projectsVisible"`.
- On page load:
  - `loadStateFromStorage()` initializes the `state` object.
  - UI is updated using functions like `applyTheme()` and `updateGreeting()`.

### 3.3 API Integration (GitHub)
- Endpoint: `https://api.github.com/users/<username>/repos?sort=updated&per_page=5`
- Logic in `fetchGitHubRepos()`:
  - Shows “Loading…” status while waiting.
  - If `response.ok` is false, throws an error and shows a friendly message.
  - On success, renders repo cards with name, description, language, and last updated date.

### 3.4 Contact Form Validation
- `setupContactForm()` attaches a submit handler that:
  - Prevents default submission.
  - Validates:
    - Non-empty name.
    - Valid email address via regex.
    - Non-empty message.
  - Displays inline error messages and a result message.

### 3.5 Timer
- `startTimer()` records `startTime` and uses `setInterval` every 1000ms to update text like “Time on site: 10s”.

### 3.6 Conditional Content
- `setupSkillLevel()` updates the message text and recommended projects based on the selected skill level (Beginner / Intermediate / Advanced).

## 4. Performance Considerations
- CSS is minimal and shared across components.
- No external JavaScript libraries, reducing bundle size.
- Tested using:
  - Observed quick load and minimal layout shifts.

