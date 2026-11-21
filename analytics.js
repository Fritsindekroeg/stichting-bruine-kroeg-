(function () {
  'use strict';
  var id = 'G-M0FRVJJH8T';
  var key = 'bruinekroeg-statistieken-v1';
  var lifetime = 180 * 24 * 60 * 60 * 1000;
  var banner, enabled = false, previousFocus;
  function storedChoice() {
    try {
      var value = JSON.parse(localStorage.getItem(key));
      if (value && (value.choice === 'yes' || value.choice === 'no') &&
          value.time <= Date.now() && Date.now() - value.time < lifetime) return value.choice;
    } catch (e) {}
    return null;
  }
  function save(choice) {
    try { localStorage.setItem(key, JSON.stringify({choice: choice, time: Date.now()})); } catch (e) {}
  }
  function cleanUrl(value) {
    try { var url = new URL(value); return url.origin + url.pathname; } catch (e) { return ''; }
  }
  function start() {
    if (enabled) return;
    enabled = true;
    window['ga-disable-' + id] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', {
      analytics_storage: 'denied', ad_storage: 'denied',
      ad_user_data: 'denied', ad_personalization: 'denied'
    });
    window.gtag('consent', 'update', {analytics_storage: 'granted'});
    window.gtag('js', new Date());
    window.gtag('config', id, {
      allow_google_signals: false, allow_ad_personalization_signals: false,
      cookie_expires: 15552000, send_page_view: false,
      page_location: cleanUrl(window.location.href),
      page_referrer: cleanUrl(document.referrer)
    });
    window.gtag('event', 'page_view', {
      page_location: cleanUrl(window.location.href),
      page_referrer: cleanUrl(document.referrer), page_title: document.title
    });
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    document.head.appendChild(script);
  }
  function clearCookies() {
    document.cookie.split(';').forEach(function (cookie) {
      var name = cookie.split('=')[0].trim();
      if (name !== '_ga' && name.indexOf('_ga_') !== 0) return;
      var domains = ['', window.location.hostname, '.' + window.location.hostname, 'bruinekroeg.com', '.bruinekroeg.com'];
      domains.forEach(function (domain) {
        document.cookie = name + '=; Max-Age=0; path=/; SameSite=Lax' + (domain ? '; domain=' + domain : '');
      });
    });
  }
  function close() {
    banner.hidden = true;
    if (previousFocus && previousFocus.isConnected) previousFocus.focus();
  }
  function choose(choice) {
    save(choice);
    close();
    if (choice === 'yes') { start(); return; }
    window['ga-disable-' + id] = true;
    clearCookies();
    // Unload the already running Google library on withdrawal.
    if (enabled) window.location.reload();
  }
  function init() {
    banner = document.createElement('section');
    banner.className = 'statistieken-keuze';
    banner.setAttribute('aria-label', 'Keuze voor bezoekersstatistieken');
    banner.hidden = true;
    banner.innerHTML = '<div><p class="statistieken-titel">Bezoekersstatistieken</p><p>Mogen wij met Google Analytics meten hoe onze website wordt gebruikt? Na toestemming plaatsen we statistische cookies en delen we gebruiksgegevens met Google. U kunt uw keuze later wijzigen via Statistiekvoorkeuren onderaan de pagina. <a href="contact.html#bezoekersstatistieken">Meer informatie</a></p></div><div class="statistieken-acties"><button type="button" data-keuze="no">Weigeren</button><button type="button" data-keuze="yes">Toestaan</button></div>';
    document.body.appendChild(banner);
    banner.querySelector('[data-keuze="no"]').addEventListener('click', function () { choose('no'); });
    banner.querySelector('[data-keuze="yes"]').addEventListener('click', function () { choose('yes'); });
    var settings = document.createElement('button');
    settings.type = 'button';
    settings.className = 'statistieken-instellingen';
    settings.textContent = 'Statistiekvoorkeuren';
    settings.addEventListener('click', function () {
      previousFocus = settings;
      banner.hidden = false;
      banner.querySelector('button').focus();
    });
    var footer = document.createElement('div');
    footer.className = 'statistieken-voet';
    footer.appendChild(settings);
    document.body.appendChild(footer);
    var choice = storedChoice();
    if (choice === 'yes') start();
    else if (!choice) banner.hidden = false;
    window.addEventListener('storage', function (event) {
      if (event.key !== key) return;
      if (storedChoice() !== 'yes') {
        window['ga-disable-' + id] = true;
        clearCookies();
        if (enabled) window.location.reload();
      }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
