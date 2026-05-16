/**
 * Explore Nassau — SunFun Resort & Hotel
 * scripts.js
 *
 * Modules
 * -------
 * 1. Mobile Navigation
 * 2. Activity + Carousel Filter
 * 3. Experiences Carousel
 * 4. Explore Map (Leaflet)
 * 5. Dish Image Fallbacks
 * 6. Scroll Fade-up Observer
 */


/* ============================================================
   1. Mobile Navigation
   ============================================================ */

(function initMobileNav() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  function openMenu() {
    hamburger.classList.add('hamburger--open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.style.display = 'block';
    mobileMenu.classList.add('mobile-menu--open');
  }

  function closeMenu() {
    hamburger.classList.remove('hamburger--open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('mobile-menu--open');
  }

  hamburger.addEventListener('click', function () {
    const isOpen = mobileMenu.classList.contains('mobile-menu--open');
    isOpen ? closeMenu() : openMenu();
  });

  // Close menu when any link inside it is tapped
  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });
})();


/* ============================================================
   2. Activity + Carousel Filter
   ============================================================ */

(function initFilters() {
  /**
   * Show/hide cards based on the selected category.
   * Reads data-category from each card element.
   */
  function applyFilter(category, activeBtn) {
    // Update active state on filter buttons
    document.querySelectorAll('.filter-btn').forEach(function (btn) {
      btn.classList.remove('filter-btn--active');
    });
    activeBtn.classList.add('filter-btn--active');

    // Activity grid cards
    document.querySelectorAll('.activity-card').forEach(function (card) {
      var match = category === 'all' || card.dataset.category === category;
      card.style.display = match ? '' : 'none';
    });

    // Carousel cards
    document.querySelectorAll('.exp-card').forEach(function (card) {
      var match = category === 'all' || card.dataset.category === category;
      card.style.display = match ? '' : 'none';
    });
  }

  // Attach listeners to every filter button using the data-category attribute
  document.querySelectorAll('.filter-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      applyFilter(btn.dataset.category, btn);
    });
  });
})();


/* ============================================================
   3. Experiences Carousel
   ============================================================ */

(function initCarousel() {
  var track    = document.getElementById('exp-track');
  var dotsEl   = document.getElementById('exp-dots');
  var fillEl   = document.getElementById('exp-fill');

  if (!track || !dotsEl || !fillEl) return;

  var CARDS        = Array.from(track.children);
  var TOTAL        = CARDS.length;
  var AUTO_PLAY_MS = 4500;  // ms between auto-advances

  var currentIndex = 0;
  var autoPlayTimer = null;
  var isPaused = false;

  /**
   * How many cards are visible at once, based on container width.
   * Breakpoints match the CSS @media queries.
   */
  function getVisibleCount() {
    var containerWidth = track.parentElement.offsetWidth;
    if (containerWidth < 560) return 1;
    if (containerWidth < 900) return 2;
    return 3;
  }

  /** Total number of slide positions (so the last card can be rightmost). */
  function getTotalSlides() {
    return Math.max(1, TOTAL - getVisibleCount() + 1);
  }

  /** Width of a single card, accounting for the 16px gap. */
  function getCardWidth() {
    var gap           = 16;
    var containerWidth = track.parentElement.offsetWidth;
    var n             = getVisibleCount();
    return (containerWidth - gap * (n - 1)) / n;
  }

  function slideTo(index) {
    var offset = index * (getCardWidth() + 16);
    track.style.transform = 'translateX(-' + offset + 'px)';
  }

  function updateDots() {
    dotsEl.querySelectorAll('.carousel__dot').forEach(function (dot, i) {
      dot.classList.toggle('carousel__dot--active', i === currentIndex);
    });
  }

  function goTo(index) {
    currentIndex = Math.max(0, Math.min(index, getTotalSlides() - 1));
    slideTo(currentIndex);
    updateDots();
    resetProgressBar();
  }

  function goNext() { goTo((currentIndex + 1) % getTotalSlides()); }
  function goPrev() { goTo((currentIndex - 1 + getTotalSlides()) % getTotalSlides()); }

  function resetProgressBar() {
    clearInterval(autoPlayTimer);
    fillEl.style.transition = 'none';
    fillEl.style.width = '0%';

    // Force a reflow so the transition reset takes effect before re-applying
    fillEl.getBoundingClientRect();

    fillEl.style.transition = 'width ' + AUTO_PLAY_MS + 'ms linear';
    fillEl.style.width = '100%';

    if (!isPaused) {
      autoPlayTimer = setInterval(goNext, AUTO_PLAY_MS);
    }
  }

  function buildDots() {
    dotsEl.innerHTML = '';
    for (var i = 0; i < getTotalSlides(); i++) {
      var dot = document.createElement('button');
      dot.className = 'carousel__dot' + (i === currentIndex ? ' carousel__dot--active' : '');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));

      // Closure to capture the correct index per dot
      dot.addEventListener('click', (function (idx) {
        return function () { goTo(idx); };
      }(i)));

      dotsEl.appendChild(dot);
    }
  }

  // Arrow buttons
  document.getElementById('exp-prev').addEventListener('click', function () {
    isPaused = false;
    goPrev();
  });

  document.getElementById('exp-next').addEventListener('click', function () {
    isPaused = false;
    goNext();
  });

  // Pause auto-play on hover
  var trackWrapper = track.parentElement;

  trackWrapper.addEventListener('mouseenter', function () {
    isPaused = true;
    clearInterval(autoPlayTimer);
    fillEl.style.transition = 'none';
  });

  trackWrapper.addEventListener('mouseleave', function () {
    isPaused = false;
    resetProgressBar();
  });

  // Swipe support
  var touchStartX = 0;

  track.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
    isPaused = true;
    clearInterval(autoPlayTimer);
  }, { passive: true });

  track.addEventListener('touchend', function (e) {
    var delta = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) {
      delta > 0 ? goNext() : goPrev();
    }
    isPaused = false;
    resetProgressBar();
  }, { passive: true });

  // Re-measure on resize (debounced to avoid rapid firing)
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      buildDots();
      slideTo(currentIndex);
    }, 100);
  });

  // Init
  buildDots();
  slideTo(0);
  resetProgressBar();
})();


/* ============================================================
   4. Explore Map (Leaflet)
   ============================================================ */

(function initMap() {
  var mapEl = document.getElementById('leaflet-map');
  if (!mapEl) return;

  // ── Data ────────────────────────────────────────────────────
  // Resort coordinates (used for the "you are here" pin)
  var RESORT = { lat: 25.073278842292073, lng: -77.43926705202382 };

  var PLACES = [
    /* Beaches */
    { cat:'beach',      name:'Cable Beach',                          note:'Quiet & beautiful — 10 min walk from the resort',                  rating:4.2, lat:25.0779,             lng:-77.4117              },
    { cat:'beach',      name:'Junkanoo Beach',                       note:'Lively beach with music, food & ocean views',                      rating:4.2, lat:25.0795,             lng:-77.3480              },
    { cat:'beach',      name:'Cabbage Beach',                        note:'Stunning turquoise water & white sand',                            rating:4.5, lat:25.0846,             lng:-77.3069              },
    { cat:'beach',      name:'Balmoral Island',                      note:'Private island escape — dolphins & stingrays',                     rating:4.3, lat:25.0902,             lng:-77.4062              },
    { cat:'beach',      name:'Clifton Heritage Park',                note:'Snorkel the underwater sculpture garden',                          rating:4.4, lat:25.0073,             lng:-77.5470              },
    /* Activities */
    { cat:'activity',   name:'Bay West Adventures',                  note:'Sea turtles, snorkeling & island hopping',                        rating:4.9, lat:25.0715,             lng:-77.3838              },
    { cat:'activity',   name:'Nassau Snorkeling',                    note:'Swim with turtles & explore coral reefs',                         rating:4.9, lat:25.0773,             lng:-77.3304              },
    { cat:'activity',   name:'Bahamas Water Toys & Tours',           note:'Pig swim, turtle tours & island adventures',                      rating:4.8, lat:25.0801,             lng:-77.3207              },
    { cat:'activity',   name:'Made in Water Excursions',             note:'5-star scuba diving & snorkeling',                               rating:5.0, lat:24.9815,             lng:-77.4588              },
    { cat:'activity',   name:'Sun Bahamas Water Sports',             note:'Speedboat turtle & snorkel adventures',                          rating:4.5, lat:25.0785,             lng:-77.3419              },
    /* Restaurants */
    { cat:'restaurant', name:'Meze Grill',                           note:'Award-winning steaks & Mediterranean — Cable Beach area',         rating:4.4, lat:25.0754,             lng:-77.4120              },
    { cat:'restaurant', name:'The Pink Shack',                       note:'Beloved local gem — authentic island flavour',                    rating:4.4, lat:25.07748847019194,  lng:-77.43308055952744    },
    { cat:'restaurant', name:'Solemar',                              note:'Elegant waterfront dining, best views on island',                 rating:4.3, lat:25.0641,             lng:-77.4802              },
    { cat:'restaurant', name:'Sushi Rokkan',                         note:"Authentic sushi — Nassau's favourite Japanese restaurant since 2012", rating:4.3, lat:25.048514721510223, lng:-77.49104177480757 },
    { cat:'restaurant', name:'Sapodilla Estate',                     note:'Mediterranean-influenced fine dining & event venue',              rating:4.3, lat:25.07071635780525,  lng:-77.44331495931179    },
    { cat:'restaurant', name:'Aquafire',                             note:'Beachfront — conch, lobster & great vibes',                       rating:4.3, lat:25.0639,             lng:-77.4794              },
    { cat:'restaurant', name:'Blue Sail Bar & Grill',                note:'Stunning Cable Beach views, walk-up ocean access',               rating:3.8, lat:25.0776,             lng:-77.4300              },
    { cat:'restaurant', name:'Bahama Grill',                         note:'Authentic Bahamian food — cracked conch & fish',                  rating:4.0, lat:25.0795,             lng:-77.3629              },
    { cat:'restaurant', name:"Captain's Deck",                       note:'Great seafood & bay views, downtown Nassau',                     rating:4.1, lat:25.0784,             lng:-77.3445              },
    { cat:'restaurant', name:'Cricket Club Restaurant & Pub',        note:'Classic pub fare & conch chowder — close to the resort on W Bay St', rating:4.2, lat:25.07814487113442, lng:-77.35856725961963  },
    { cat:'restaurant', name:'Twisted Lime Sports Bar & Grill',      note:'High-energy waterfront hangout',                                 rating:4.2, lat:25.074789267603215, lng:-77.4293668345183     },
    { cat:'restaurant', name:'Café Johnny Canoe',                    note:'Live music, Bahamian classics & cocktails — W Bay St',           rating:4.1, lat:25.0801,             lng:-77.4198              },
    { cat:'restaurant', name:'Lukka Kairi',                          note:'Casual waterfront at Baha Mar — cracked conch & lobster',        rating:4.3, lat:25.079791343257018,  lng:-77.34519013439751    },
    { cat:'restaurant', name:'The Poop Deck (West)',                 note:'Beloved institution for fresh seafood',                          rating:4.4, lat:25.078393754020816,  lng:-77.43105954538275    },
    { cat:'restaurant', name:'Sante Fe Mexican Grill',               note:'Fan favourite for tacos & margaritas — W Bay St',               rating:4.2, lat:25.0808,             lng:-77.4155              },
    { cat:'restaurant', name:'Baha Mar Grand Hyatt Pool Bar',        note:'Laidback luxury — grab a Bahama Mama poolside',                  rating:4.5, lat:25.07279014047694,  lng:-77.39592111591463    },
    /* Grocery */
    { cat:'grocery',    name:"Solomon's Fresh Market",               note:'Upscale & well-stocked — closest to a US grocery',              rating:4.2, lat:25.0727,             lng:-77.3137              },
    { cat:'grocery',    name:'Super Value Food Store',               note:'Best prices on island — locals shop here',                      rating:4.1, lat:25.0710,             lng:-77.3244              },
    { cat:'grocery',    name:'Quality Markets',                      note:'Convenient on W Bay St — open daily',                           rating:4.0, lat:25.0754,             lng:-77.4135              },
    /* Landmarks */
    { cat:'landmark',   name:"Queen's Staircase",                    note:'Historic 66-step limestone staircase & waterfall',              rating:4.5, lat:25.0730,             lng:-77.3376              },
    { cat:'landmark',   name:'Pirates of Nassau Museum',             note:'Fascinating pirate history — great for families',               rating:4.4, lat:25.0774,             lng:-77.3447              },
    { cat:'landmark',   name:'Parliament Square',                    note:'Colonial architecture & Bahamian history',                     rating:4.5, lat:25.0778,             lng:-77.3405              },
  ];

  // Category display config: colour, emoji, readable label
  var CAT_CONFIG = {
    beach:      { color: '#1E8FD5', emoji: '🏖️', label: 'Beach'      },
    activity:   { color: '#1DB87A', emoji: '🤿',  label: 'Activity'   },
    restaurant: { color: '#E8593F', emoji: '🍽️', label: 'Restaurant' },
    grocery:    { color: '#D4A017', emoji: '🛒',  label: 'Grocery'    },
    landmark:   { color: '#A370F7', emoji: '🏛️', label: 'Landmark'   },
  };

  // ── State ────────────────────────────────────────────────────
  var currentCategory = 'all';
  var activeMarkers   = [];  // Leaflet marker instances currently on the map

  // ── Map init ────────────────────────────────────────────────
  var map = L.map('leaflet-map', {
    center: [25.073, -77.41],
    zoom: 13,
    scrollWheelZoom: true,
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19,
  }).addTo(map);

  // ── Resort pin ──────────────────────────────────────────────
  var resortIcon = L.divIcon({
    html: '<div class="map-marker map-marker--resort">🏨</div>',
    className: '',
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });

  L.marker([RESORT.lat, RESORT.lng], { icon: resortIcon })
    .addTo(map)
    .bindPopup(
      '<div style="padding:14px 16px 12px;">'
      + '<div style="font-size:.65rem;letter-spacing:.15em;text-transform:uppercase;color:#D4A017;margin-bottom:5px;font-weight:600;">📍 You are here</div>'
      + '<div style="font-weight:700;color:#0C2340;font-size:.95rem;">SunFun Resort & Hotel</div>'
      + '<div style="font-size:.78rem;color:#5C6875;margin-top:3px;">642 W Bay St, Nassau, The Bahamas</div>'
      + '<a href="tel:+12423278827" style="display:inline-flex;align-items:center;gap:4px;margin-top:8px;font-size:.72rem;color:#1B6CA8;text-decoration:none;font-weight:500;">📞 +1 242-327-8827</a>'
      + '</div>',
      { maxWidth: 260 }
    )
    .openPopup();

  // ── Helpers ─────────────────────────────────────────────────

  /** Build a Leaflet divIcon for a given category. */
  function makeCategoryIcon(category) {
    var cfg = CAT_CONFIG[category];
    return L.divIcon({
      html: '<div class="map-marker" style="background:' + cfg.color + 'cc;">' + cfg.emoji + '</div>',
      className: '',
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -20],
    });
  }

  /** Star string, e.g. "★★★★☆" */
  function starsHTML(rating) {
    var full  = Math.round(rating);
    var empty = 5 - full;
    return '★'.repeat(full) + '☆'.repeat(empty);
  }

  /** HTML for a Leaflet popup. */
  function buildPopupHTML(place) {
    var cfg = CAT_CONFIG[place.cat];
    return '<div style="padding:14px 16px 12px;min-width:210px;">'
      + '<div style="font-size:.62rem;letter-spacing:.15em;text-transform:uppercase;color:' + cfg.color + ';margin-bottom:4px;font-weight:600;">' + cfg.label + '</div>'
      + '<div style="font-weight:700;color:#0C2340;font-size:.95rem;line-height:1.3;margin-bottom:4px;">' + place.name + '</div>'
      + '<div style="font-size:.74rem;color:#5C6875;line-height:1.5;margin-bottom:7px;">' + place.note + '</div>'
      + '<div style="font-size:.72rem;color:#D4A017;margin-bottom:10px;">' + starsHTML(place.rating) + ' <span style="color:#5C6875;">' + place.rating.toFixed(1) + '</span></div>'
      + '<a href="https://maps.google.com/?q=' + encodeURIComponent(place.name + ' Nassau Bahamas') + '" target="_blank" style="font-size:.7rem;letter-spacing:.08em;text-transform:uppercase;color:#1B6CA8;text-decoration:none;font-weight:500;">Get directions ↗</a>'
      + '</div>';
  }

  /** HTML for one place list item in the sidebar. */
  function buildListItemHTML(place, filteredIndex) {
    var cfg = CAT_CONFIG[place.cat];
    var directionsHref = 'https://maps.google.com/?q=' + encodeURIComponent(place.name + ' Nassau Bahamas');

    return '<div class="place-item" id="place-' + filteredIndex + '" data-index="' + filteredIndex + '">'
      + '<div class="place-item__icon" style="background:' + cfg.color + '25;">' + cfg.emoji + '</div>'
      + '<div class="place-item__content">'
      +   '<div class="place-item__category" style="color:' + cfg.color + ';">' + cfg.label + '</div>'
      +   '<div class="place-item__name">' + place.name + '</div>'
      +   '<div class="place-item__rating"><span class="place-item__stars">' + starsHTML(place.rating) + '</span><span>' + place.rating.toFixed(1) + '</span></div>'
      +   '<div class="place-item__note">' + place.note + '</div>'
      +   '<a class="place-item__directions" href="' + directionsHref + '" target="_blank">Directions ↗</a>'
      + '</div>'
      + '</div>';
  }

  // ── Render ───────────────────────────────────────────────────

  function getFilteredPlaces(category) {
    return PLACES.filter(function (p) {
      return category === 'all' || p.cat === category;
    });
  }

  function renderMarkers(category) {
    // Clear existing markers
    activeMarkers.forEach(function (m) { map.removeLayer(m); });
    activeMarkers = [];

    getFilteredPlaces(category).forEach(function (place, i) {
      var marker = L.marker([place.lat, place.lng], { icon: makeCategoryIcon(place.cat) })
        .addTo(map)
        .bindPopup(buildPopupHTML(place), { maxWidth: 270 });

      // Highlight the matching list item when the map pin is clicked
      marker.on('click', function () { highlightListItem(i); });
      activeMarkers.push(marker);
    });
  }

  function renderList(category) {
    var list    = document.getElementById('place-list');
    var places  = getFilteredPlaces(category);
    var html    = places.map(buildListItemHTML).join('');
    list.innerHTML = html;

    // Attach click handlers to each item
    list.querySelectorAll('.place-item').forEach(function (el) {
      el.addEventListener('click', function () {
        selectPlace(parseInt(el.dataset.index, 10));
      });
    });
  }

  function highlightListItem(index) {
    document.querySelectorAll('.place-item').forEach(function (el) {
      el.classList.remove('place-item--selected');
    });
    var target = document.getElementById('place-' + index);
    if (target) {
      target.classList.add('place-item--selected');
      target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function selectPlace(index) {
    highlightListItem(index);
    var place = getFilteredPlaces(currentCategory)[index];
    map.flyTo([place.lat, place.lng], 15, { duration: 0.8 });
    setTimeout(function () {
      if (activeMarkers[index]) activeMarkers[index].openPopup();
    }, 700);
  }

  function applyMapFilter(category, btn) {
    currentCategory = category;

    document.querySelectorAll('.map-filter-btn').forEach(function (b) {
      b.classList.remove('map-filter-btn--active');
    });
    btn.classList.add('map-filter-btn--active');

    renderList(category);
    renderMarkers(category);

    var filtered = getFilteredPlaces(category);

    if (!filtered.length || category === 'all') {
      map.flyTo([25.072, -77.41], 13, { duration: 0.7 });
    } else {
      var bounds = L.latLngBounds(filtered.map(function (p) { return [p.lat, p.lng]; }));
      map.flyToBounds(bounds, { padding: [50, 50], maxZoom: 14, duration: 0.8 });
    }
  }

  // Attach listeners to map filter buttons using data-category
  document.querySelectorAll('.map-filter-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      applyMapFilter(btn.dataset.category, btn);
    });
  });

  // Initial render
  renderMarkers('all');
  renderList('all');
})();


/* ============================================================
   5. Dish Image Fallbacks
   Replaces broken local dish images with Unsplash fallbacks.
   ============================================================ */

(function initDishFallbacks() {
  // Key = img alt attribute, value = fallback URL
  var FALLBACKS = {
    'Conch Salad':        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80',
    'Conch Chowder':      'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80',
    'Cracked Conch':      'https://images.unsplash.com/photo-1585325701956-60dd9c8553bc?w=600&q=80',
    'Stew Fish':          'https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=600&q=80',
    'Rock Lobster':       'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=600&q=80',
    'Peas and Rice':      'https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=600&q=80',
    'Guava Duff Dessert': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80',
    'Rum Cake':           'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600&q=80',
  };

  var DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80';

  document.querySelectorAll('.dish-card__image').forEach(function (img) {
    img.addEventListener('error', function () {
      var fallback = FALLBACKS[this.alt] || DEFAULT_FALLBACK;
      if (this.src !== fallback) this.src = fallback;
    });
  });
})();


/* ============================================================
   6. Scroll Fade-up Observer
   Adds .fade-up--visible to elements as they enter the viewport.
   ============================================================ */

(function initFadeUp() {
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry, i) {
      if (entry.isIntersecting) {
        // Stagger the animation slightly for grouped elements
        setTimeout(function () {
          entry.target.classList.add('fade-up--visible');
        }, i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.fade-up').forEach(function (el) {
    observer.observe(el);
  });
})();
