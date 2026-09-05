// gestion de l'accordéon des projets
document.addEventListener('DOMContentLoaded', () => {

    const projectHeaders = document.querySelectorAll('.project-header');

    projectHeaders.forEach(button => {

        button.addEventListener('click', () => {

            const project = button.closest('.project-item');
            const isActive = project.classList.contains('active');

            // ferme les autres projets
            document.querySelectorAll('.project-item.active').forEach(item => {

                if (item !== project) {

                    item.classList.remove('active');

                    const otherButton = item.querySelector('.project-header');

                    if (otherButton) {
                        otherButton.setAttribute('aria-expanded', 'false');
                    }

                }

            });

            // ouvre ou ferme le projet
            project.classList.toggle('active');

            button.setAttribute(
                'aria-expanded',
                !isActive
            );

        });

    });

});