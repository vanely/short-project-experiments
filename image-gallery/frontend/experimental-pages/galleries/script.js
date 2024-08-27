document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault(); // Prevent default anchor click behavior
    const targetGallery = document.querySelector(this.getAttribute('href'));

    // Hide all galleries
    document.querySelectorAll('.gallery').forEach(gallery => {
      gallery.classList.remove('active');
    });

    // Remove active class from all links
    document.querySelectorAll('nav a').forEach(link => {
      link.classList.remove('active');
    });

    // Show the clicked gallery
    targetGallery.classList.add('active');
    this.classList.add('active');
  });
});