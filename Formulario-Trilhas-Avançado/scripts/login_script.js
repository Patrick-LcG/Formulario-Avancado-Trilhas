document.addEventListener("DOMContentLoaded", function() {
    document.body.classList.add("fade-in"); 
});

function direcionarPagina(url) {
    document.body.classList.add("fade-out"); 
    setTimeout(() => {
        window.location.href = url; 
    }, 300); 
}