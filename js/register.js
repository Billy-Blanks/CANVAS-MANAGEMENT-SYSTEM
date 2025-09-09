document.addEventListener('DOMContentLoaded', function () {
    const registrationForm = document.getElementById('registration-form');
    const userTypeSelect = document.getElementById('user-type');
    const tenantFields = document.getElementById('tenant-fields');
    const staffFields = document.getElementById('staff-fields');
    const successMessage = document.getElementById('registration-success');

    // Show/hide fields based on user type
    userTypeSelect.addEventListener('change', function () {
        const userType = this.value;

        if (userType === 'tenant') {
            tenantFields.style.display = 'block';
            staffFields.style.display = 'none';
        } else {
            tenantFields.style.display = 'none';
            staffFields.style.display = 'block';
        }
    });

    // Form validation and submission
    registrationForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Reset previous error messages
        document.querySelectorAll('.error-message').forEach(msg => {
            msg.style.display = 'none';
        });

        let valid = true;

        // Validate first name
        const firstName = document.getElementById('first-name').value.trim();
        if (firstName === '') {
            document.getElementById('first-name-error').style.display = 'block';
            valid = false;
        }

        // Validate last name
        const lastName = document.getElementById('last-name').value.trim();
        if (lastName === '') {
            document.getElementById('last-name-error').style.display = 'block';
            valid = false;
        }

        // Validate email
        const email = document.getElementById('email').value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            document.getElementById('email-error').style.display = 'block';
            valid = false;
        }

        // Validate phone number (simple validation, can be enhanced for Kenya format)
        const phone = document.getElementById('phone').value.trim();
        if (phone.length < 10) {
            document.getElementById('phone-error').style.display = 'block';
            valid = false;
        }

        // Validate password
        const password = document.getElementById('password').value;
        // We're commenting out strict password validation as per your pasted code
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            document.getElementById('password-error').style.display = 'block';
            valid = false;
        }

        // Validate password confirmation
        const confirmPassword = document.getElementById('confirm-password').value;
        // We're commenting out confirmation validation as per your pasted code
        if (password !== confirmPassword) {
            document.getElementById('confirm-password-error').style.display = 'block';
            valid = false;
        }

        // Validate terms agreement
        const termsAgreed = document.getElementById('terms-agreement').checked;
        if (!termsAgreed) {
            document.getElementById('terms-error').style.display = 'block';
            valid = false;
        }

        // Tenant-specific validation: room number required for tenants to satisfy backend
        const selectedUserType = userTypeSelect.value;
        const roomNumberInput = document.getElementById('room-number');
        const roomNumberRaw = roomNumberInput ? roomNumberInput.value.trim() : '';
        if (selectedUserType === 'tenant' && !roomNumberRaw) {
            // No dedicated error element exists; provide a quick inline feedback and block submit
            roomNumberInput.style.borderColor = 'var(--accent-color)';
            alert('Please enter your room number (required for tenants).');
            valid = false;
        } else if (roomNumberInput) {
            roomNumberInput.style.borderColor = '';
        }

        // If form is valid, submit it
        if (valid) {
            // Create a FormData object for multipart/form-data submission
            const formData = new FormData();

            // Append all form fields to the FormData object
            formData.append('userType', userTypeSelect.value);
            formData.append('firstName', firstName);
            formData.append('lastName', lastName);
            formData.append('email', email);
            formData.append('phone', phone);
            formData.append('password', password);
            // Backend requires roomNumber; send the actual value for tenants, send 'N/A' for non-tenants
            const roomNumberValue = selectedUserType === 'tenant' ? roomNumberRaw : 'N/A';
            formData.append('roomNumber', roomNumberValue);
            formData.append('position', document.getElementById('position').value);

            // Log the form data (for debugging)
            console.log('Sending registration data to server...');

            // Send data to the server
            fetch("http://localhost:3000/register", {
                method: "POST",
                body: formData
            })
                .then(async response => {
                    const contentType = response.headers.get("content-type") || "";
                    if (!response.ok) {
                        try {
                            if (contentType.includes("application/json")) {
                                const errorData = await response.json();
                                throw new Error(errorData.error || 'Server responded with an error');
                            }
                            const text = await response.text();
                            throw new Error(text || 'Server responded with an error');
                        } catch (err) {
                            if (err instanceof Error) throw err;
                            throw new Error('Server responded with an error');
                        }
                    }
                    if (contentType.includes("application/json")) {
                        return response.json();
                    }
                    // If server returned HTML/text for success, treat as generic success
                    await response.text();
                    return { message: 'Registration successful' };
                })
                .then(data => {
                    if (data.error) {
                        alert('Error during registration: ' + data.error);
                        return
                    }
                    console.log('Registration successful:', data.message || 'Success');

                    successMessage.style.display = 'block';
                    successMessage.innerHTML = 'Registration successful! Redirecting to login...';
                    registrationForm.reset();
                    successMessage.scrollIntoView({ behavior: 'smooth' });

                    // Redirect to login on index page after short delay
                    setTimeout(() => {
                        window.location.href = 'index.html#login';
                    }, 1500);
                })
                .catch(error => {
                    console.error('Registration error:', error);
                    // Attempt to extract readable message from potential HTML error page
                    let message = error.message || 'Registration failed';
                    try {
                        const match = message.match(/<pre>([\s\S]*?)<\\\/pre>/i);
                        if (match && match[1]) {
                            message = match[1]
                                .replace(/<br\s*\/?\s*>/gi, '\n')
                                .replace(/&nbsp;/gi, ' ')
                                .trim();
                        }
                    } catch (_) {}
                    alert('Error during registration: ' + message);
                });

        } else {
            // Scroll to the first error
            const firstError = document.querySelector('.error-message[style="display: block"]');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });

    // Add real-time validation for password strength (optional enhancement)
    const passwordInput = document.getElementById('password');
    passwordInput.addEventListener('input', function () {
        const password = this.value;
        const passwordError = document.getElementById('password-error');

        // We're commenting out real-time password validation as per your pasted code
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (password && !passwordRegex.test(password)) {
            passwordError.style.display = 'block';
        } else {
            passwordError.style.display = 'none';
        }
    });

    // Add real-time validation for password confirmation
    const confirmPasswordInput = document.getElementById('confirm-password');
    confirmPasswordInput.addEventListener('input', function () {
        const password = passwordInput.value;
        const confirmPassword = this.value;
        const confirmError = document.getElementById('confirm-password-error');

        // We're commenting out real-time confirmation validation as per your pasted code
        if (confirmPassword && password !== confirmPassword) {
            confirmError.style.display = 'block';
        } else {
            confirmError.style.display = 'none';
        }
    });
});