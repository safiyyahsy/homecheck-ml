// File: static/js/about.js
// This file contains JavaScript for the About page of HomeCheck
// It handles animations, scroll effects, and team member interactions
        // Initialize page
        document.addEventListener('DOMContentLoaded', function() {
            console.log('📄 About page loaded');
            
            // Add scroll animations
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, observerOptions);
            
            // Observe all content sections
            document.querySelectorAll('.content-section').forEach(section => {
                section.style.opacity = '0.8';
                section.style.transform = 'translateY(20px)';
                section.style.transition = 'all 0.6s ease';
                observer.observe(section);
            });
            
            // Add hover effects to team members
            document.querySelectorAll('.team-member').forEach(member => {
                member.addEventListener('mouseenter', function() {
                    this.style.borderColor = 'var(--cottage-blue)';
                });
                
                member.addEventListener('mouseleave', function() {
                    this.style.borderColor = 'rgba(74, 144, 164, 0.1)';
                });
            });
            
            console.log('✨ About page animations initialized');
        });