// script.js
document.addEventListener('DOMContentLoaded', () => {
  const scrollLeftBtn = document.getElementById('scroll-left');
  const scrollRightBtn = document.getElementById('scroll-right');
  const navLinks = document.querySelector('.nav-links');

  scrollLeftBtn.addEventListener('click', () => {
    navLinks.scrollBy({
      top: 0,
      left: -150, // Scroll left by 150 pixels
      behavior: 'smooth'
    });
  });

  scrollRightBtn.addEventListener('click', () => {
    navLinks.scrollBy({
      top: 0,
      left: 150, // Scroll right by 150 pixels
      behavior: 'smooth'
    });
  });
});