document.addEventListener('DOMContentLoaded', function() {
  inicializarCarrusel();
  inicializarSliderTestimonios();
  activarAnimacionesDeServicios()
  inicializarMapa();
});

function inicializarCarrusel() {
  const carousel = crearCarrusel('.carousel-track', '.carousel-arrow--right', '.carousel-arrow--left', '.carousel-counter .dot');
  carousel.inicializar();

}

function crearCarrusel(trackSelector, nextButtonSelector, prevButtonSelector, dotsSelector) {
  // Seleccionamos elementos principales dentro del ámbito de esta función
  const track = document.querySelector(trackSelector);
  const slides = track ? Array.from(track.children) : [];
  const nextButton = document.querySelector(nextButtonSelector);
  const prevButton = document.querySelector(prevButtonSelector);
  const dots = document.querySelectorAll(dotsSelector);

  let currentIndex = 0;
  let autoSlideInterval;

  // Función para posicionar slides
  const positionSlides = () => {
    if (!slides.length) return;
    const slideWidth = slides[0].getBoundingClientRect().width;
    slides.forEach((slide, index) => {
      slide.style.left = slideWidth * index + 'px';
    });

    // Ajustar la posición del track al slide actual
    const currentSlide = slides[currentIndex];
    track.style.transform = 'translateX(-' + currentSlide.style.left + ')';
  };

  // Función para mover el carrusel a un índice dado
  const moveToSlide = (currentSlide, targetSlide) => {
    track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
    currentSlide.classList.remove('current-slide');
    targetSlide.classList.add('current-slide');
  };

  // Actualizamos el indicador (punto) activo
  const updateDots = (currentDot, targetDot) => {
    currentDot.classList.remove('active');
    targetDot.classList.add('active');
  };

  // Función para avanzar al siguiente slide
  const moveToNextSlide = () => {
    if (!slides.length) return;
    const currentSlide = slides[currentIndex];
    const currentDot = dots[currentIndex];
    currentIndex = (currentIndex + 1) % slides.length;
    const nextSlide = slides[currentIndex];
    const nextDot = dots[currentIndex];

    moveToSlide(currentSlide, nextSlide);
    updateDots(currentDot, nextDot);
  };

  // Función para retroceder al slide anterior
  const moveToPrevSlide = () => {
    if (!slides.length) return;
    const currentSlide = slides[currentIndex];
    const currentDot = dots[currentIndex];
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    const prevSlide = slides[currentIndex];
    const prevDot = dots[currentIndex];

    moveToSlide(currentSlide, prevSlide);
    updateDots(currentDot, prevDot);
  };

  // Configurar cambio automático cada 6 segundos
  const startAutoSlide = () => {
    autoSlideInterval = setInterval(() => {
      moveToNextSlide();
    }, 6000);
  };

  const restartAutoSlide = () => {
    clearInterval(autoSlideInterval);
    startAutoSlide();
  };

  // Función para inicializar el carrusel y agregar eventos
  const inicializar = () => {
    if (!track || !nextButton || !prevButton || !dots.length || !slides.length) {
      console.error("Elementos del carrusel no encontrados.");
      return;
    }

    positionSlides();
    startAutoSlide();

    // Eventos en botones de flecha
    nextButton.addEventListener('click', () => {
      moveToNextSlide();
      restartAutoSlide();
    });

    prevButton.addEventListener('click', () => {
      moveToPrevSlide();
      restartAutoSlide();
    });

    // Navegación al hacer clic en los puntos
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        const currentSlide = document.querySelector('.current-slide');
        const currentDot = document.querySelector('.dot.active');
        currentIndex = index;
        const targetSlide = slides[currentIndex];
        moveToSlide(currentSlide, targetSlide);
        updateDots(currentDot, dot);
        restartAutoSlide();
      });
    });

    // Recalcular cuando cambia el tamaño de pantalla
    window.addEventListener('resize', positionSlides);
  };

  // Retornamos un objeto con la función de inicialización
  return {
    inicializar: inicializar
    // Podrías exponer otras funciones si fuera necesario, por ejemplo:
    // moveToIndex: (index) => { ... }
  };
}

// --- Nueva funcionalidad del Slider de Testimonios ---
function crearSliderTestimonios(trackSelector, prevBtnSelector, nextBtnSelector, visibleCardsCount = 1) {
  const track = document.querySelector(trackSelector);
  const testimonios = track ? Array.from(track.children) : [];
  const prevBtn = document.querySelector(prevBtnSelector);
  const nextBtn = document.querySelector(nextBtnSelector);

  let currentIndex = 0;
  let autoplayInterval;
  const visibleCards = visibleCardsCount; // En este caso, 2

  /**
   * Calcula el ancho de una card y ajusta la posición del track.
   */
  function actualizarSlider() {
    if (!testimonios.length) return;
    const cardWidth = testimonios[0].getBoundingClientRect().width;
    track.style.transform = `translateX(-${cardWidth * currentIndex}px)`;

    // Aplica el efecto fade-in a las cards visibles
    testimonios.forEach((card, i) => {
      card.classList.remove('fade-in');
      if (i >= currentIndex && i < currentIndex + visibleCards) {
        requestAnimationFrame(() => {
          card.classList.add('fade-in');
        });
      }
    });
  }

  /**
   * Función para ir al siguiente testimonio.
   * totalSlides = testimonios.length - visibleCards + 1.
   */
  function siguiente() {
    if (!testimonios.length) return;
    const totalSlides = testimonios.length - visibleCards + 1;
    currentIndex = (currentIndex + 1) % totalSlides;
    actualizarSlider();
  }

  /**
   * Función para ir al testimonio anterior.
   */
  function anterior() {
    if (!testimonios.length) return;
    const totalSlides = testimonios.length - visibleCards + 1;
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    actualizarSlider();
  }

  /**
   * Inicia el autoplay del slider (cada 5 segundos).
   */
  function iniciarAutoplay() {
    autoplayInterval = setInterval(() => {
      siguiente();
    }, 5000);
  }

  /**
   * Reinicia el autoplay del slider.
   */
  function reiniciarAutoplay() {
    clearInterval(autoplayInterval);
    iniciarAutoplay();
  }

  /**
   * Inicializa el slider y sus eventos.
   */
  const inicializar = () => {
    if (!track || !prevBtn || !nextBtn || !testimonios.length) {
      console.error("Elementos del slider de testimonios no encontrados.");
      return;
    }

    actualizarSlider();
    iniciarAutoplay();

    nextBtn.addEventListener('click', () => {
      siguiente();
      reiniciarAutoplay();
    });

    prevBtn.addEventListener('click', () => {
      anterior();
      reiniciarAutoplay();
    });

    window.addEventListener('resize', actualizarSlider);
  };

  return {
    inicializar: inicializar
  };
}

function inicializarSliderTestimonios() {
  // Se muestran 2 cards a la vez
  const sliderTestimonios = crearSliderTestimonios('.slider-track', '.arrow-left', '.arrow-right', 2);
  sliderTestimonios.inicializar();
}
const contenedor = document.querySelector('.contenido-de-la-seccion');
const titulo = document.getElementById('titulo-principal');
const servicios = document.getElementById('bloques-servicios');

let mostrandoTitulo = true;

setInterval(() => {
  const startHeight = contenedor.offsetHeight;

  if (mostrandoTitulo) {
    // Ocultar título
    titulo.classList.add('fade-out');

    setTimeout(() => {
      titulo.classList.add('oculto');
      titulo.classList.remove('fade-out');

      // Mostrar servicios
      servicios.classList.remove('oculto');
      servicios.classList.add('fade-in');

      // Medimos altura después de que los servicios están visibles
      requestAnimationFrame(() => {
        const endHeight = contenedor.scrollHeight;
        contenedor.style.height = startHeight + 'px';

        requestAnimationFrame(() => {
          contenedor.style.height = endHeight + 'px';
        });

        // Limpieza final
        setTimeout(() => {
          contenedor.style.height = 'auto';
        }, 600);
      });

    }, 500);

  } else {
    // Ocultar servicios
    servicios.classList.remove('fade-in');
    servicios.classList.add('fade-out');

    servicios.addEventListener('animationend', () => {
      servicios.classList.add('oculto');
      servicios.classList.remove('fade-out');

      // Mostrar título con fade-in
      titulo.classList.remove('oculto');
      titulo.classList.add('fade-in');

      requestAnimationFrame(() => {
        const endHeight = contenedor.scrollHeight;

        contenedor.style.height = startHeight + 'px';
        requestAnimationFrame(() => {
          contenedor.style.height = endHeight + 'px';
        });

        // Limpieza
        setTimeout(() => {
          contenedor.style.height = 'auto';
          titulo.classList.remove('fade-in');
        }, 600);
      });
    }, { once: true });
  }

  mostrandoTitulo = !mostrandoTitulo;
}, 6000);

function activarAnimacionesDeServicios() {
  const servicios = document.querySelectorAll('.servicio');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 150); // delay progresivo para la animación
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2, // Umbral para detectar cuando las tarjetas entran en el viewport
  });

  servicios.forEach(servicio => {
    observer.observe(servicio);
  });
}


function inicializarMapa() {
  var map = L.map('map').setView([-25.5, -54.5], 10);  // Coordenadas centradas en Misiones

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // Datos de los puntos turísticos
  var lugares = [
    {
      name: 'Cataratas del Iguazú',
      coords: [-25.695, -54.444],
    },
    {
      name: 'Hito Tres Fronteras',
      coords: [-25.550, -54.590],
    },
    {
      name: 'Cruz de Santa Ana',
      coords: [-26.500, -53.970],
    },
    {
      name: 'Ruinas de San Ignacio',
      coords: [-27.158, -54.712],
    },
    {
      name: 'Minas de Wanda',
      coords: [-27.360, -54.636],
    }
  ];

  // Crear marcadores con los lugares
  lugares.forEach(function(lugar) {
    var marker = L.marker(lugar.coords).addTo(map); // Usar el marcador predeterminado

    // Agregar viñeta con nombre de lugar
    var label = document.createElement('div');
    label.className = 'marker-label';
    label.innerHTML = lugar.name;
    marker._icon.appendChild(label);

    // Mostrar información al pasar el ratón sobre el marcador (sin necesidad de clic)
    marker.bindTooltip(lugar.name, { permanent: true, direction: 'top', offset: [0, -25] }).openTooltip();
  });
}






