// Form submission handler
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('resume-form');
    const submitBtn = document.getElementById('submit-btn');
    const messageDiv = document.getElementById('message');
    const loadSampleBtn = document.getElementById('load-sample-btn');
    
    // Initialize character counters
    initCharacterCounters();
    
    // Restore form data from localStorage
    restoreFormData();
    
    // Auto-save form data
    initAutoSave();
    
    // Load sample data button
    if (loadSampleBtn) {
        loadSampleBtn.addEventListener('click', loadSampleData);
    }
    
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Hide previous messages
            messageDiv.innerHTML = '';
            messageDiv.className = 'message';
            
            // Disable submit button
            submitBtn.disabled = true;
            submitBtn.innerHTML = '✨ Generating Resume... <span class="spinner"></span>';
            
            // Collect form data
            const formData = {
                fullName: document.getElementById('fullName').value.trim(),
                jobTitle: document.getElementById('jobTitle').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                location: document.getElementById('location').value.trim(),
                portfolio: document.getElementById('portfolio').value.trim(),
                skills: document.getElementById('skills').value.trim(),
                experience: document.getElementById('experience').value.trim(),
                jobDescription: document.getElementById('jobDescription').value.trim()
            };
            
            // Validate required fields
            const requiredFields = ['fullName', 'jobTitle', 'skills', 'experience', 'jobDescription'];
            const missingFields = requiredFields.filter(field => !formData[field]);
            
            if (missingFields.length > 0) {
                showError('Please fill in all required fields: ' + missingFields.join(', '));
                submitBtn.disabled = false;
                submitBtn.innerHTML = '✨ Generate Resume';
                return;
            }
            
            try {
                // Call backend API
                const response = await fetch('http://localhost:5000/generate-resume', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });
                
                const result = await response.json();
                
                if (result.status === 'success') {
                    // Store resume data in localStorage
                    localStorage.setItem('resumeData', JSON.stringify(result.data));
                    
                    // Clear form draft
                    localStorage.removeItem('resumeFormDraft');
                    
                    // Show success message briefly before redirect
                    showSuccess('Resume generated successfully! Redirecting...');
                    
                    setTimeout(() => {
                        window.location.href = 'resume.html';
                    }, 500);
                } else {
                    showError(result.message || 'An error occurred while generating the resume.');
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '✨ Generate Resume';
                }
            } catch (error) {
                console.error('Error:', error);
                showError('Unable to connect to the server. Please make sure the backend is running on http://localhost:5000');
                submitBtn.disabled = false;
                submitBtn.innerHTML = '✨ Generate Resume';
            }
        });
    }
    
    function initCharacterCounters() {
        const experienceTextarea = document.getElementById('experience');
        const jobDescriptionTextarea = document.getElementById('jobDescription');
        const experienceCount = document.getElementById('experience-count');
        const jobDescriptionCount = document.getElementById('jobDescription-count');
        
        if (experienceTextarea && experienceCount) {
            experienceTextarea.addEventListener('input', function() {
                experienceCount.textContent = this.value.length;
            });
            experienceCount.textContent = experienceTextarea.value.length;
        }
        
        if (jobDescriptionTextarea && jobDescriptionCount) {
            jobDescriptionTextarea.addEventListener('input', function() {
                jobDescriptionCount.textContent = this.value.length;
            });
            jobDescriptionCount.textContent = jobDescriptionTextarea.value.length;
        }
    }
    
    function initAutoSave() {
        const formFields = ['fullName', 'jobTitle', 'email', 'phone', 'location', 'portfolio', 'skills', 'experience', 'jobDescription'];
        
        formFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('input', function() {
                    saveFormData();
                });
            }
        });
    }
    
    function saveFormData() {
        const formData = {
            fullName: document.getElementById('fullName').value,
            jobTitle: document.getElementById('jobTitle').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            location: document.getElementById('location').value,
            portfolio: document.getElementById('portfolio').value,
            skills: document.getElementById('skills').value,
            experience: document.getElementById('experience').value,
            jobDescription: document.getElementById('jobDescription').value
        };
        localStorage.setItem('resumeFormDraft', JSON.stringify(formData));
    }
    
    function restoreFormData() {
        const savedData = localStorage.getItem('resumeFormDraft');
        if (savedData) {
            try {
                const formData = JSON.parse(savedData);
                Object.keys(formData).forEach(key => {
                    const field = document.getElementById(key);
                    if (field && formData[key]) {
                        field.value = formData[key];
                    }
                });
                
                // Update character counters
                const experienceTextarea = document.getElementById('experience');
                const jobDescriptionTextarea = document.getElementById('jobDescription');
                const experienceCount = document.getElementById('experience-count');
                const jobDescriptionCount = document.getElementById('jobDescription-count');
                
                if (experienceTextarea && experienceCount) {
                    experienceCount.textContent = experienceTextarea.value.length;
                }
                if (jobDescriptionTextarea && jobDescriptionCount) {
                    jobDescriptionCount.textContent = jobDescriptionTextarea.value.length;
                }
            } catch (e) {
                console.error('Error restoring form data:', e);
            }
        }
    }
    
    function loadSampleData() {
        const sampleData = {
            fullName: 'John Doe',
            jobTitle: 'Senior Software Engineer',
            email: 'john.doe@email.com',
            phone: '+1 (555) 123-4567',
            location: 'San Francisco, CA',
            portfolio: 'https://johndoe.dev',
            skills: 'Python, JavaScript, React, Node.js, AWS, Docker, Kubernetes, PostgreSQL, Git, Agile',
            experience: 'Led a team of 5 developers to build and maintain a scalable microservices architecture using Python and React. Improved system performance by 40% through optimization and caching strategies. Implemented CI/CD pipelines reducing deployment time by 60%. Collaborated with cross-functional teams to deliver features on time and within budget.',
            jobDescription: 'We are seeking a Senior Software Engineer with 5+ years of experience in Python and JavaScript. The ideal candidate will have experience with React, Node.js, cloud platforms (AWS), containerization (Docker), and modern development practices. You will work on building scalable applications, leading a team, and collaborating with stakeholders. Experience with microservices, CI/CD, and database design is a plus.'
        };
        
        Object.keys(sampleData).forEach(key => {
            const field = document.getElementById(key);
            if (field) {
                field.value = sampleData[key];
                // Trigger input event to update character counters and save
                field.dispatchEvent(new Event('input'));
            }
        });
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    function showError(message) {
        messageDiv.className = 'message message-error';
        messageDiv.textContent = message;
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    function showSuccess(message) {
        messageDiv.className = 'message message-success';
        messageDiv.textContent = message;
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
});

// Resume page loader
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the resume page
    if (document.getElementById('resume-content')) {
        loadResume();
    }
});

function loadResume() {
    // Get resume data from localStorage
    const resumeDataStr = localStorage.getItem('resumeData');
    
    if (!resumeDataStr) {
        // No resume data found, redirect to index
        alert('No resume data found. Please fill out the form first.');
        window.location.href = 'index.html';
        return;
    }
    
    try {
        const resumeData = JSON.parse(resumeDataStr);
        renderResume(resumeData);
    } catch (error) {
        console.error('Error parsing resume data:', error);
        alert('Error loading resume data. Please try again.');
        window.location.href = 'index.html';
    }
}

function renderResume(data) {
    // Set name
    const nameEl = document.getElementById('resume-name');
    if (nameEl) nameEl.textContent = data.fullName || '';
    
    // Set job title
    const titleEl = document.getElementById('resume-title');
    if (titleEl) titleEl.textContent = data.jobTitle || '';
    
    // Set contact information
    const contactEl = document.getElementById('resume-contact');
    if (contactEl) {
        let contactHTML = '';
        if (data.email) {
            contactHTML += `<span class="resume-contact-item"><strong>Email:</strong> ${escapeHtml(data.email)}</span>`;
        }
        if (data.phone) {
            contactHTML += `<span class="resume-contact-item"><strong>Phone:</strong> ${escapeHtml(data.phone)}</span>`;
        }
        if (data.location) {
            contactHTML += `<span class="resume-contact-item"><strong>Location:</strong> ${escapeHtml(data.location)}</span>`;
        }
        if (data.portfolio) {
            contactHTML += `<span class="resume-contact-item"><strong>Portfolio:</strong> <a href="${escapeHtml(data.portfolio)}" target="_blank">${escapeHtml(data.portfolio)}</a></span>`;
        }
        contactEl.innerHTML = contactHTML;
    }
    
    // Set skills
    const skillsEl = document.getElementById('resume-skills');
    if (skillsEl && data.skills && Array.isArray(data.skills)) {
        skillsEl.innerHTML = data.skills.map(skill => 
            `<span class="skill-item">${escapeHtml(skill)}</span>`
        ).join('');
    }
    
    // Set experience
    const experienceEl = document.getElementById('resume-experience');
    if (experienceEl) {
        // Convert bullet points to HTML
        const experienceHTML = data.experience
            .split('\n')
            .map(line => line.trim())
            .filter(line => line)
            .map(line => {
                // If line already starts with bullet, use it as is
                if (line.startsWith('•') || line.startsWith('-')) {
                    return line.replace(/^[•\-]\s*/, '<li>') + '</li>';
                }
                return '<li>' + line + '</li>';
            })
            .join('');
        
        experienceEl.innerHTML = '<ul>' + experienceHTML + '</ul>';
    }
    
    // Set match score
    const scoreEl = document.getElementById('resume-score');
    if (scoreEl && data.score !== undefined) {
        const score = data.score;
        let scoreClass = 'low';
        if (score >= 70) scoreClass = 'high';
        else if (score >= 40) scoreClass = 'medium';
        
        scoreEl.textContent = `Job Match Score: ${score}%`;
        scoreEl.className = `score-badge ${scoreClass}`;
    }
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Print functionality
function printResume() {
    window.print();
}

// Back to form button
function backToForm() {
    window.location.href = 'index.html';
}

