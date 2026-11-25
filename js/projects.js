// IMAGES DES PROJETS
// Les chemins sont relatifs à la page projets.html.
// screen dans /assets/projets/dossier_du_projet_en_question
//
// NOTE pour ajouter une image :
// 1. Retirer les // devant une ligne d'exemple.
// 2. Adapte le chemin, la description et la légende.
// 3. Duplique la ligne pour ajouter d'autres images.
//
// Un tableau vide [] n'affiche aucune galerie.

const projectImages = {
    mirage: [
        // { src: '../assets/projets/mirage/truc.png', alt: 'Description de la capture MIRAGE', caption: 'MIRAGE' },
    ],

    todo: [
         { src: '../assets/projets/todo/ecran-accueil.png', alt: 'Interface de gestion des tâches', caption: 'Application Flask' },
         { src: '../assets/projets/todo/trivy1.png', alt: 'Supervision Trivy', caption: 'Supervision avec Trivy' },
         { src: '../assets/projets/todo/trivy2.png', alt: 'Supervision Trivy2', caption: 'Supervision avec Trivy' },
         { src: '../assets/projets/todo/trivy3.png', alt: 'Supervision Trivy3', caption: 'Supervision avec Trivy' }
    ],

    hash: [
         { src: '../assets/projets/hash/1.png', alt: 'Interface du générateur et vérificateur de hash', caption: "Génération le hash d'un texte" },
         { src: '../assets/projets/hash/2.png', alt: 'Interface du générateur et vérificateur de hash', caption: "Génération le hash d'un fichier" },
         { src: '../assets/projets/hash/3.png', alt: 'Interface du générateur et vérificateur de hash', caption: "Vérification du hash d'un mot de passe" },
    ],

    maildeleter: [
        // pas d'image, enfin pas interessant c'est des lignes de commandes, classique 
    ],

    chess: [
         { src: '../assets/projets/chess/pion.png', alt: "Simulation des mouvements des pièces d’échecs", caption: "Simulation des déplacements d'un pion" },
         { src: '../assets/projets/chess/cavalier.png', alt: "Simulation des mouvements des pièces d’échecs", caption: "Simulation des déplacements d'un cavalier" },
         { src: '../assets/projets/chess/fou.png', alt: "Simulation des mouvements des pièces d’échecs", caption: "Simulation des déplacements d'un fou" },
         { src: '../assets/projets/chess/tour.png', alt: "Simulation des mouvements des pièces d’échecs", caption: "Simulation des déplacements d'une tour" },
         { src: '../assets/projets/chess/reine.png', alt: "Simulation des mouvements des pièces d’échecs", caption: "Simulation des déplacements d'une reine" },
         { src: '../assets/projets/chess/roi.png', alt: "Simulation des mouvements des pièces d’échecs", caption: "Simulation des déplacements d'un roi" },
    ],
};

document.addEventListener('DOMContentLoaded', () => {
    // Accordéon des projets.
    document.querySelectorAll('.project-header').forEach(button => {
        button.addEventListener('click', () => {
            const project = button.closest('.project-item');
            const open = !project.classList.contains('active');

            document.querySelectorAll('.project-item').forEach(item => {
                const active = item === project && open;

                item.classList.toggle('active', active);

                item.querySelector('.project-header')
                    ?.setAttribute('aria-expanded', String(active));
            });
        });
    });

    // Un carrousel indépendant pour chaque projet.
    document.querySelectorAll('.project-item[data-project]').forEach(project => {
        const images = (projectImages[project.dataset.project] || [])
            .filter(image => image.src);

        const details = project.querySelector('.project-details-inner');

        if (!details || !images.length) return;

        const section = document.createElement('section');
        section.className = 'project-detail-section project-carousel';

        section.setAttribute(
            'aria-label',
            `Images : ${project.querySelector('h3').textContent}`
        );

        section.innerHTML = `
            <h4>En images</h4>

            <div class="carousel-viewport"></div>

            <div class="carousel-controls">
                <button type="button" aria-label="Image précédente">←</button>

                <span
                    role="status"
                    aria-live="polite"
                    aria-atomic="true"
                ></span>

                <button type="button" aria-label="Image suivante">→</button>
            </div>
        `;

        const viewport = section.querySelector('.carousel-viewport');
        const controls = section.querySelector('.carousel-controls');
        const [previous, next] = controls.querySelectorAll('button');
        const counter = controls.querySelector('span');

        let current = 0;

        const slides = images.map(({ src, alt, caption }, index) => {
            const figure = document.createElement('figure');
            figure.hidden = index !== 0;

            const link = document.createElement('a');
            link.href = src;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';

            link.setAttribute(
                'aria-label',
                `${alt || caption || 'Capture'} — ouvrir en grand dans un nouvel onglet`
            );

            const image = document.createElement('img');
            image.alt = alt || caption || 'Capture du projet';
            image.loading = 'lazy';
            image.decoding = 'async';
            image.draggable = false;

            image.addEventListener('error', () => {
                const message = document.createElement('span');
                message.className = 'carousel-error';
                message.textContent = 'Image indisponible';
                image.replaceWith(message);
            }, { once: true });

            image.src = src;

            link.append(image);
            figure.append(link);

            if (caption) {
                const legend = document.createElement('figcaption');
                legend.textContent = caption;
                figure.append(legend);
            }

            viewport.append(figure);

            return figure;
        });

        function show(index) {
            current = (index + slides.length) % slides.length;

            slides.forEach((slide, i) => {
                slide.hidden = i !== current;
            });

            counter.textContent = `${current + 1} / ${slides.length}`;
        }

        // Masque les commandes lorsqu'il n'y a qu'une image.
        controls.hidden = slides.length < 2;

        previous.addEventListener('click', () => show(current - 1));
        next.addEventListener('click', () => show(current + 1));

        // Navigation au clavier lorsque le carrousel a le focus.
        section.addEventListener('keydown', event => {
            if (
                slides.length < 2 ||
                event.altKey ||
                event.ctrlKey ||
                event.metaKey
            ) return;

            if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;

            event.preventDefault();

            // Garde le focus sur un élément visible.
            if (viewport.contains(document.activeElement)) {
                (event.key === 'ArrowRight' ? next : previous).focus();
            }

            show(current + (event.key === 'ArrowRight' ? 1 : -1));
        });

        // Balayage sur mobile, sans bloquer le défilement vertical.
        let start = null;
        let suppressClickUntil = 0;

        viewport.addEventListener('touchstart', event => {
            start = event.touches.length === 1
                ? {
                    x: event.touches[0].clientX,
                    y: event.touches[0].clientY,
                }
                : null;
        }, { passive: true });

        viewport.addEventListener('touchcancel', () => {
            start = null;
        });

        viewport.addEventListener('touchend', event => {
            if (!start) return;

            const dx = event.changedTouches[0].clientX - start.x;
            const dy = event.changedTouches[0].clientY - start.y;

            start = null;

            if (
                slides.length > 1 &&
                Math.abs(dx) > 50 &&
                Math.abs(dx) > Math.abs(dy) * 1.5
            ) {
                show(current + (dx < 0 ? 1 : -1));
                suppressClickUntil = Date.now() + 500;
            }
        }, { passive: true });

        // Évite d'ouvrir l'image à la fin d'un balayage.
        viewport.addEventListener('click', event => {
            if (Date.now() < suppressClickUntil) {
                event.preventDefault();
            }
        });

        show(0);

        details.insertBefore(
            section,
            details.querySelector('.project-link')
        );
    });
});