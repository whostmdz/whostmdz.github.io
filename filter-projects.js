// filtre les projets apr tags
document.addEventListener('DOMContentLoaded', () => {
  const projectsList = document.getElementById('projects-list');
  const tagsFilterContainer = document.getElementById('tags-filter');
  const resetBtn = document.getElementById('reset-filter');
  let selectedTags = new Set();

  // extrait les tags
  function extractAllTags() {
    const tags = new Set();
    const projects = projectsList.querySelectorAll('.project-item');
    projects.forEach(project => {
      const projectTags = project.getAttribute('data-tags').split(',');
      projectTags.forEach(tag => tags.add(tag.trim()));
    });
    return Array.from(tags).sort();
  }

  // bouton filtre
  function generateFilterButtons() {
    tagsFilterContainer.innerHTML = '';
    const allTags = extractAllTags();
    
    allTags.forEach(tag => {
      const btn = document.createElement('button');
      btn.className = 'filter-tag-btn';
      btn.textContent = tag;
      btn.dataset.tag = tag;
      
      btn.addEventListener('click', () => {
        toggleTag(tag, btn);
      });
      
      tagsFilterContainer.appendChild(btn);
    });
  }

  function toggleTag(tag, btn) {
    if (selectedTags.has(tag)) {
      selectedTags.delete(tag);
      btn.classList.remove('active');
    } else {
      selectedTags.add(tag);
      btn.classList.add('active');
    }
    filterProjects();
  }

  // projets filtres
  function filterProjects() {
    const projects = projectsList.querySelectorAll('.project-item');
    
    projects.forEach(project => {
      if (selectedTags.size === 0) {
        // !! javais oublie, c'set pour tout afficher si rien n'est selectionne. Erreur bidon
        project.style.display = 'block';
      } else {
        const projectTags = project.getAttribute('data-tags')
          .split(',')
          .map(tag => tag.trim());
        
        // si projets a les tags 
        const hasSelectedTag = Array.from(selectedTags).some(tag => 
          projectTags.includes(tag)
        );
        
        project.style.display = hasSelectedTag ? 'block' : 'none';
      }
    });
    
    updateNoProjectsMessage();
  }

  function updateNoProjectsMessage() {
    let noProjectsMsg = projectsList.querySelector('.no-projects-msg');
    const visibleProjects = projectsList.querySelectorAll('.project-item[style="display: block"]').length;
    
    if (visibleProjects === 0 && selectedTags.size > 0) {
      if (!noProjectsMsg) {
        noProjectsMsg = document.createElement('div');
        noProjectsMsg.className = 'no-projects-msg';
        projectsList.appendChild(noProjectsMsg);
      }
      noProjectsMsg.textContent = 'Aucun projet ne correspond à cette sélection.';
    } else if (noProjectsMsg) {
      noProjectsMsg.remove();
    }
  }

  // rester tags
  function resetFilters() {
    selectedTags.clear();
    const buttons = tagsFilterContainer.querySelectorAll('.filter-tag-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    filterProjects();
  }

  resetBtn.addEventListener('click', resetFilters);

  generateFilterButtons();
});