# Experiment Apparatus Code

This folder contains the source code for the experimental apparatus used in our team's project.

## URLs to GitHub Pages Hosted UIs

- **Main Landing Page (Internal Usage):** [https://akshatavedam.github.io/cs4249-craigslist-posting/](https://akshatavedam.github.io/cs4249-craigslist-posting/)
- **Original Interface:** [https://akshatavedam.github.io/cs4249-craigslist-posting/original/](https://akshatavedam.github.io/cs4249-craigslist-posting/original/)
- **Redesigned Interface:** [https://akshatavedam.github.io/cs4249-craigslist-posting/redesigned/](https://akshatavedam.github.io/cs4249-craigslist-posting/redesigned/)

## Description of Files and Folders

- `/original`: Source code for the "Original" version of the Craigslist posting interface, built with React and Vite. This represents the baseline system for comparison.
- `/redesigned`: Source code for the "Redesigned" version of the Craigslist posting interface, also built with React and Vite. This includes the improved UI/UX and guided tour.
- `/.github/workflows/deploy.yml`: GitHub Actions workflow configuration used to automatically build and deploy both applications to GitHub Pages.
- `index.html`: A simple landing page located at the root of the deployment that provides links to both the original and redesigned interfaces.
- `googlesender.py`: Python script used for processing or forwarding log data to Google Forms/Sheets.
- `package-lock.json`: Dependency lock file for any potential root-level scripts or configurations.

## Running Locally

If you need to run the applications locally instead of using the hosted versions:

**Prerequisites:** Node.js

1. Navigate to the desired folder (`cd original` or `cd redesigned`)
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`