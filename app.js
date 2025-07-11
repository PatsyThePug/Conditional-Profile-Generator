// Global variables object - this will store all the profile data
window.variables = {
    includeCover: true,
    background: "https://images.unsplash.com/photo-1511974035430-5de47d3b95da",
    avatarURL: "https://randomuser.me/api/portraits/men/32.jpg",
    socialMediaPosition: "right",
    twitter: null,
    github: "alesanchezr",
    linkedin: null,
    instagram: null,
    name: "Ryan",
    lastName: "Boylett",
    role: "Web Developer",
    country: "USA",
    city: "Miami"
};

/**
 * Main render function that generates the profile card HTML
 * @param {Object} variables - Object containing all profile data
 */
function render(variables = {}) {
    // Update global variables
    window.variables = { ...window.variables, ...variables };
    
    const {
        includeCover,
        background,
        avatarURL,
        socialMediaPosition,
        twitter,
        github,
        linkedin,
        instagram,
        name,
        lastName,
        role,
        country,
        city
    } = window.variables;

    // Build the full name - conditional display
    const fullName = [name, lastName].filter(Boolean).join(' ') || null;
    
    // Build location string - conditional display
    const location = [city, country].filter(Boolean).join(', ') || null;
    
    // Generate cover HTML - conditional based on includeCover
    let coverHTML = '';
    if (includeCover && background) {
        coverHTML = `<div class="cover"><img src="${background}" /></div>`;
    }

    // Generate avatar HTML - conditional based on avatarURL
    let avatarHTML = '';
    if (avatarURL) {
        avatarHTML = `<img src="${avatarURL}" class="photo" />`;
    }

    // Generate profile info HTML - conditional display
    let profileInfoHTML = '';
    if (fullName) {
        profileInfoHTML += `<h1>${fullName}</h1>`;
    }
    if (role) {
        profileInfoHTML += `<h2>${role}</h2>`;
    }
    if (location) {
        profileInfoHTML += `<h3>${location}</h3>`;
    }

    // Generate social media HTML - conditional display and positioning
    let socialMediaHTML = '';
    const socialLinks = [];
    
    if (twitter) {
        socialLinks.push(`<li><a href="https://twitter.com/${twitter}"><i class="fa fa-twitter"></i></a></li>`);
    }
    if (github) {
        socialLinks.push(`<li><a href="https://github.com/${github}"><i class="fa fa-github"></i></a></li>`);
    }
    if (linkedin) {
        socialLinks.push(`<li><a href="https://linkedin.com/${linkedin}"><i class="fa fa-linkedin"></i></a></li>`);
    }
    if (instagram) {
        socialLinks.push(`<li><a href="https://instagram.com/${instagram}"><i class="fa fa-instagram"></i></a></li>`);
    }
    
    // Only create social media HTML if there are links
    if (socialLinks.length > 0) {
        socialMediaHTML = `<ul class="position-${socialMediaPosition}">${socialLinks.join('')}</ul>`;
    }

    // Always render the widget container, even if empty
    // This matches the expected behavior from the instructions
    document.querySelector("#widget_content").innerHTML = `
        <div class="widget">
            ${coverHTML}
            ${avatarHTML}
            ${profileInfoHTML}
            ${socialMediaHTML}
        </div>
    `;
}

/**
 * Initialize form event listeners
 */
function initializeEventListeners() {
    // Add event listeners to all form inputs
    document.querySelectorAll(".picker").forEach(function(elm) {
        elm.addEventListener("change", function(e) {
            const attribute = e.target.getAttribute("for");
            let values = {};
            
            // Parse the value based on type
            let value = this.value;
            if (value === "" || value === "null") {
                value = null;
            } else if (value === "true") {
                value = true;
            } else if (value === "false") {
                value = false;
            }
            
            values[attribute] = value;
            
            // Re-render with updated values
            render(Object.assign(window.variables, values));
        });

        // Also listen for input events for real-time updates on text fields
        if (elm.type === 'text' || elm.type === 'url') {
            elm.addEventListener("input", function(e) {
                const attribute = e.target.getAttribute("for");
                let values = {};
                
                let value = this.value.trim();
                if (value === "") {
                    value = null;
                }
                
                values[attribute] = value;
                
                // Re-render with updated values
                render(Object.assign(window.variables, values));
            });
        }
    });

    // Reset button functionality
    document.getElementById('resetBtn').addEventListener('click', function() {
        // Reset to default values
        window.variables = {
            includeCover: true,
            background: "https://images.unsplash.com/photo-1511974035430-5de47d3b95da",
            avatarURL: "https://randomuser.me/api/portraits/men/32.jpg",
            socialMediaPosition: "right",
            twitter: null,
            github: "alesanchezr",
            linkedin: null,
            instagram: null,
            name: "Ryan",
            lastName: "Boylett",
            role: "Web Developer",
            country: "USA",
            city: "Miami"
        };

        // Reset form values
        document.querySelectorAll('.picker').forEach(input => {
            const attribute = input.getAttribute('for');
            if (window.variables[attribute] !== null) {
                input.value = window.variables[attribute];
            } else {
                input.value = '';
            }
        });

        // Re-render
        render(window.variables);
    });

    // Save profile functionality
    document.getElementById('saveBtn').addEventListener('click', async function() {
        try {
            const response = await fetch('/api/profiles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(window.variables)
            });

            if (response.ok) {
                const result = await response.json();
                showAlert('Profile saved successfully!', 'success');
                console.log('Profile saved with ID:', result.id);
            } else {
                throw new Error('Failed to save profile');
            }
        } catch (error) {
            console.error('Error saving profile:', error);
            showAlert('Error saving profile. Please try again.', 'danger');
        }
    });

    // Load profiles functionality
    document.getElementById('loadBtn').addEventListener('click', async function() {
        try {
            const response = await fetch('/api/profiles');
            if (response.ok) {
                const profiles = await response.json();
                populateProfileSelect(profiles);
                document.getElementById('savedProfiles').style.display = 'block';
                showAlert(`Found ${profiles.length} saved profiles!`, 'info');
            } else {
                throw new Error('Failed to load profiles');
            }
        } catch (error) {
            console.error('Error loading profiles:', error);
            showAlert('Error loading profiles. Please try again.', 'danger');
        }
    });

    // Load selected profile functionality
    document.getElementById('loadSelectedBtn').addEventListener('click', async function() {
        const profileId = document.getElementById('profileSelect').value;
        if (!profileId) {
            showAlert('Please select a profile to load.', 'warning');
            return;
        }

        try {
            const response = await fetch(`/api/profiles/${profileId}`);
            if (response.ok) {
                const profile = await response.json();
                
                // Update variables with loaded profile
                window.variables = {
                    includeCover: profile.includeCover,
                    background: profile.background,
                    avatarURL: profile.avatarURL,
                    socialMediaPosition: profile.socialMediaPosition,
                    twitter: profile.twitter,
                    github: profile.github,
                    linkedin: profile.linkedin,
                    instagram: profile.instagram,
                    name: profile.name,
                    lastName: profile.lastName,
                    role: profile.role,
                    country: profile.country,
                    city: profile.city
                };

                // Update form values
                updateFormValues();
                
                // Re-render
                render(window.variables);
                
                showAlert('Profile loaded successfully!', 'success');
            } else {
                throw new Error('Failed to load profile');
            }
        } catch (error) {
            console.error('Error loading profile:', error);
            showAlert('Error loading profile. Please try again.', 'danger');
        }
    });

    // Delete selected profile functionality
    document.getElementById('deleteSelectedBtn').addEventListener('click', async function() {
        const profileId = document.getElementById('profileSelect').value;
        if (!profileId) {
            showAlert('Please select a profile to delete.', 'warning');
            return;
        }

        if (!confirm('Are you sure you want to delete this profile? This action cannot be undone.')) {
            return;
        }

        try {
            const response = await fetch(`/api/profiles/${profileId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                showAlert('Profile deleted successfully!', 'success');
                // Refresh the profile list
                document.getElementById('loadBtn').click();
            } else {
                throw new Error('Failed to delete profile');
            }
        } catch (error) {
            console.error('Error deleting profile:', error);
            showAlert('Error deleting profile. Please try again.', 'danger');
        }
    });
}

/**
 * Helper function to show alerts to the user
 */
function showAlert(message, type = 'info') {
    // Remove existing alerts
    const existingAlert = document.querySelector('.alert-notification');
    if (existingAlert) {
        existingAlert.remove();
    }

    // Create new alert
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show alert-notification`;
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '9999';
    alertDiv.style.minWidth = '300px';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(alertDiv);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

/**
 * Helper function to populate the profile select dropdown
 */
function populateProfileSelect(profiles) {
    const select = document.getElementById('profileSelect');
    select.innerHTML = '<option value="">Select a profile...</option>';
    
    profiles.forEach(profile => {
        const option = document.createElement('option');
        option.value = profile.id;
        const displayName = [profile.name, profile.lastName].filter(Boolean).join(' ') || 
                           profile.role || 
                           `Profile #${profile.id}`;
        option.textContent = displayName;
        select.appendChild(option);
    });
}

/**
 * Helper function to update form values from current variables
 */
function updateFormValues() {
    document.querySelectorAll('.picker').forEach(input => {
        const attribute = input.getAttribute('for');
        if (window.variables[attribute] !== null) {
            input.value = window.variables[attribute];
        } else {
            input.value = '';
        }
    });
}

/**
 * Initialize form values with default data
 */
function initializeFormValues() {
    updateFormValues();
}

/**
 * Initialize the application
 */
function initialize() {
    // Set up event listeners
    initializeEventListeners();
    
    // Initialize form with default values
    initializeFormValues();
    
    // Initial render
    render(window.variables);
    
    console.log("Profile Card Generator initialized!");
    console.log("Current variables:", window.variables);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initialize);

// Make render function globally accessible for debugging
window.render = render;
