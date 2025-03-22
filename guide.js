const searchInput = document.getElementById('searchInput');
const clearButton = document.getElementById('clearSearch');
const sections = document.querySelectorAll('.section');
const tips = document.querySelectorAll('.tip');

function clearSearch() {
    searchInput.value = '';
    sections.forEach(section => {
        section.classList.remove('hidden');
        removeHighlights(section);
    });
}

function removeHighlights(element) {
    element.innerHTML = element.innerHTML.replace(/<mark class="highlight">(.*?)<\/mark>/g, '$1');
}

function highlightText(element, searchTerm) {
    if (!searchTerm) return;
    const regex = new RegExp(searchTerm, 'gi');
    element.innerHTML = element.innerHTML.replace(regex, match => 
        `<mark class="highlight">${match}</mark>`
    );
}

searchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    
    sections.forEach(section => {
        removeHighlights(section);
        const content = section.textContent.toLowerCase();
        
        if (searchTerm && content.includes(searchTerm)) {
            section.classList.remove('hidden');
            highlightText(section, searchTerm);
        } else if (searchTerm) {
            section.classList.add('hidden');
        } else {
            section.classList.remove('hidden');
        }
    });
});

clearButton.addEventListener('click', clearSearch);
