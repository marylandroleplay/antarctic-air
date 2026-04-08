// Modal Handlers
function openModal(id) {
    document.getElementById(id).classList.add('active');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}



// Contact Form Submit
document.getElementById('contact-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const msgDiv = document.getElementById('contact-msg');
    btn.disabled = true;
    btn.textContent = 'Sending...';
    msgDiv.textContent = '';

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
        const res = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await res.json();

        if (res.ok) {
            msgDiv.textContent = 'Request sent successfully!';
            msgDiv.className = 'text-sm font-bold mt-2 text-primary';
            e.target.reset();
            setTimeout(() => closeModal('contact-modal'), 2000);
        } else {
            msgDiv.textContent = result.error || 'Failed to send request.';
            msgDiv.className = 'text-sm font-bold mt-2 text-error';
        }
    } catch (err) {
        msgDiv.textContent = 'Network error. Please try again later.';
        msgDiv.className = 'text-sm font-bold mt-2 text-error';
    } finally {
        btn.disabled = false;
        btn.textContent = 'Send Request';
    }
});

// Booking Form Submit
document.getElementById('booking-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const msgDiv = document.getElementById('booking-msg');
    btn.disabled = true;
    btn.textContent = 'Booking...';
    msgDiv.textContent = '';

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
        const res = await fetch('/api/appointments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await res.json();

        if (res.ok) {
            msgDiv.textContent = 'Appointment booked successfully!';
            msgDiv.className = 'text-sm font-bold mt-2 text-primary';
            e.target.reset();
            setTimeout(() => closeModal('booking-modal'), 2000);
        } else {
            msgDiv.textContent = result.error || 'Failed to book appointment.';
            msgDiv.className = 'text-sm font-bold mt-2 text-error';
        }
    } catch (err) {
        msgDiv.textContent = 'Network error. Please try again later.';
        msgDiv.className = 'text-sm font-bold mt-2 text-error';
    } finally {
        btn.disabled = false;
        btn.textContent = 'Confirm Booking';
    }
});

// Intersection Observer for scroll animations
document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const animateObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.reveal, .slide-right, .draw-line, .spin-icon');
    animatedElements.forEach(el => animateObserver.observe(el));

    // Thermostat Animation
    const tempEl = document.getElementById('thermostat-temp');
    if (tempEl) {
        let currentTemp = 85;
        const targetTemp = 68;
        
        // Wait for page to load mostly, then cool down
        setTimeout(() => {
            const interval = setInterval(() => {
                if(currentTemp > targetTemp) {
                    currentTemp--;
                    tempEl.textContent = currentTemp;
                } else {
                    clearInterval(interval);
                    // Add a bright pulse when target is reached
                    const container = tempEl.parentElement.parentElement;
                    container.classList.add('shadow-[0_0_100px_rgba(161,201,255,0.5)]');
                    setTimeout(() => {
                        container.classList.remove('shadow-[0_0_100px_rgba(161,201,255,0.5)]');
                    }, 1000);
                }
            }, 100); // speed of countdown
        }, 800);
    }
});
