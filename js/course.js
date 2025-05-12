// Course Data (updated)
const courses = [
    {
        subject: 'CSE',
        number: 110,
        title: 'Introduction to Programming',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course will introduce students to programming...',
        technology: ['Python'],
        completed: true  // Marked as completed
    },
    {
        subject: 'WDD',
        number: 130,
        title: 'Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course introduces students to the World Wide Web...',
        technology: ['HTML', 'CSS'],
        completed: true  // Marked as completed
    },
    {
        subject: 'CSE',
        number: 111,
        title: 'Programming with Functions',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'CSE 111 students become more organized...',
        technology: ['Python'],
        completed: true  // Marked as completed
    },
    {
        subject: 'CSE',
        number: 210,
        title: 'Programming with Classes',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course will introduce the notion of classes...',
        technology: ['C#'],
        completed: false  // Not completed
    },
    {
        subject: 'WDD',
        number: 131,
        title: 'Dynamic Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course builds on prior experience in Web Fundamentals...',
        technology: ['HTML', 'CSS', 'JavaScript'],
        completed: false  // Not completed
    },
    {
        subject: 'WDD',
        number: 231,
        title: 'Frontend Web Development I',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course focuses on user experience...',
        technology: ['HTML', 'CSS', 'JavaScript'],
        completed: false  // Not completed
    }
];

// Global variable to track selected courses and total credit units
let selectedCourses = []; // Store selected course numbers
let totalCredits = 0; // Total credits

// Function to display courses based on filter
function displayCourses(filteredCourses) {
    const courseContainer = document.getElementById('course-cards');
    courseContainer.innerHTML = '';  // Clear previous content

    filteredCourses.forEach(course => {
        const courseCard = createCourseCard(course);
        courseContainer.appendChild(courseCard);
    });

    // Update the total selected courses count after filtering
    updateSelectedCoursesCount(filteredCourses.length);
}

// Create Course Card Element
function createCourseCard(course) {
    const courseCard = document.createElement('div');
    courseCard.classList.add('course-card', course.completed ? 'completed' : 'not-completed');
    courseCard.setAttribute('data-credits', course.credits); // Store credits for each course
    courseCard.setAttribute('data-course-number', `${course.subject} ${course.number}`); // Store course number
    
    // Show only course code initially (subject and number)
    courseCard.innerHTML = `
        <h3>${course.subject} ${course.number}</h3>
    `;
    
    // Show additional details on click
    courseCard.addEventListener('click', () => toggleCourseSelection(course));

    return courseCard;
}

// Toggle Credit Units and Selection for a Course
function toggleCourseSelection(course) {
    const courseNumber = `${course.subject} ${course.number}`;

    if (selectedCourses.includes(courseNumber)) {
        // If course is already selected, remove it
        selectedCourses = selectedCourses.filter(item => item !== courseNumber);
        totalCredits -= course.credits; // Subtract credits
    } else {
        // If course is not selected, add it
        selectedCourses.push(courseNumber);
        totalCredits += course.credits; // Add credits
    }

    updateSelectedCoursesCount(selectedCourses.length);
    updateTotalCredits();
}

// Update Total Credits Display
function updateTotalCredits() {
    const totalCreditsElement = document.getElementById('total-credits');
    totalCreditsElement.textContent = `Total Credit Units: ${totalCredits}`;
}

// Update Total Selected Courses Count
function updateSelectedCoursesCount(count) {
    const selectedCoursesElement = document.getElementById('selected-courses-count');
    selectedCoursesElement.textContent = `The total number of courses listed below is: ${count}`;
}

// Filter Courses based on category (all, wdd, cse)
function filterCourses(category) {
    let filteredCourses;
    
    if (category === 'all') {
        filteredCourses = courses;  // Show all courses
    } else {
        filteredCourses = courses.filter(course => course.subject.toLowerCase() === category);  // Filter by subject
    }

    displayCourses(filteredCourses);  // Display filtered courses
}

// Initialize - Display all courses on page load
window.onload = () => {
    displayCourses(courses);  // Display all courses initially
};
