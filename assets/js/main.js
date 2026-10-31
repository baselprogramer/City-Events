// main.js - all the javascript of the site
// every page calls its own init function from <body onload="...">
// the events themselves are in data.js

var MONTHS = ["كانون الثاني", "شباط", "آذار", "نيسان", "أيار", "حزيران",
              "تموز", "آب", "أيلول", "تشرين الأول", "تشرين الثاني", "كانون الأول"];
var DAYS = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
var ONE_DAY = 24 * 60 * 60 * 1000; // one day in milliseconds

// arabic (hindi) numbers like on the old damascus posters
var ARABIC_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

// 20:00 -> ٢٠:٠٠ (only for showing on the page, not for calculations)
function toArabicDigits(text) {
  text = "" + text;
  var result = "";
  for (var i = 0; i < text.length; i++) {
    var ch = text.charAt(i);
    if (ch >= "0" && ch <= "9") {
      result += ARABIC_DIGITS[parseInt(ch, 10)];
    } else {
      result += ch;
    }
  }
  return result;
}

// "2026-11-07" -> Date object
function toDate(text) {
  var parts = text.split("-");
  return new Date(parts[0], parts[1] - 1, parts[2]);
}

// today without the hours, so we compare days only
function getToday() {
  var now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function lastDay(ev) {
  if (ev.endDate) {
    return toDate(ev.endDate);
  }
  return toDate(ev.date);
}

function shortDate(text) {
  var d = toDate(text);
  return toArabicDigits(d.getDate()) + " " + MONTHS[d.getMonth()];
}

function longDate(text) {
  var d = toDate(text);
  return DAYS[d.getDay()] + " " + toArabicDigits(d.getDate()) + " " + MONTHS[d.getMonth()] + " " + toArabicDigits(d.getFullYear());
}

function dateText(ev) {
  if (ev.endDate) {
    return shortDate(ev.date) + " – " + shortDate(ev.endDate);
  }
  return shortDate(ev.date);
}

// returns "past", "today" or "upcoming"
function getStatus(ev) {
  var today = getToday();
  if (lastDay(ev) < today) {
    return "past";
  }
  if (toDate(ev.date) <= today) {
    return "today";
  }
  return "upcoming";
}

function daysLeft(ev) {
  return Math.round((toDate(ev.date) - getToday()) / ONE_DAY);
}

function findEvent(id) {
  for (var i = 0; i < EVENTS.length; i++) {
    if (EVENTS[i].id == id) {
      return EVENTS[i];
    }
  }
  return null;
}

// upcoming events first, finished ones go to the end
function sortEvents() {
  var list = EVENTS.slice(); // copy, so the original array doesn't change
  list.sort(function (a, b) {
    var aPast = getStatus(a) == "past";
    var bPast = getStatus(b) == "past";
    if (aPast != bPast) {
      return aPast ? 1 : -1;
    }
    return toDate(a.date) - toDate(b.date);
  });
  return list;
}

// reads a value from the url, ex: events.html?cat=music
function getParam(name) {
  var query = location.search.substring(1);
  var pairs = query.split("&");
  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i].split("=");
    if (pair[0] == name) {
      return decodeURIComponent(pair[1]);
    }
  }
  return "";
}

// these functions return html as text, then we put it in the page with innerHTML
function categoryBadge(cat) {
  return '<span class="badge cat-badge cat-' + cat + '">' +
         '<i class="bi ' + CATEGORIES[cat].icon + '"></i> ' + CATEGORIES[cat].name + '</span>';
}

function ticket(ev) {
  var d = toDate(ev.date);
  return '<div class="ticket cat-' + ev.category + '">' +
         '<span class="ticket-day">' + toArabicDigits(d.getDate()) + '</span>' +
         '<span class="ticket-month">' + MONTHS[d.getMonth()] + '</span></div>';
}

function statusLabel(ev) {
  var status = getStatus(ev);
  if (status == "today") {
    return '<span class="status-flag is-today">الحدث اليوم</span>';
  }
  if (status == "past") {
    return '<span class="status-flag is-past">انتهت</span>';
  }
  var n = daysLeft(ev);
  if (n == 1) {
    return '<span class="status-flag">غداً</span>';
  }
  if (n <= 7) {
    return '<span class="status-flag">بعد ' + toArabicDigits(n) + ' أيام</span>';
  }
  return "";
}

// one event card (bootstrap card inside a grid column)
function eventCard(ev) {
  var pastClass = "";
  if (getStatus(ev) == "past") {
    pastClass = " is-past";
  }
  return '<div class="col-sm-6 col-lg-4">' +
    '<article class="card event-card h-100 cat-' + ev.category + pastClass + '">' +
      '<div class="event-card-media">' +
        '<img src="assets/img/event-' + ev.id + '.svg" class="card-img-top" alt="' + ev.title + '" loading="lazy">' +
        ticket(ev) + statusLabel(ev) +
      '</div>' +
      '<div class="card-body d-flex flex-column">' +
        '<div class="mb-2">' + categoryBadge(ev.category) + '</div>' +
        '<h3 class="card-title h5">' + ev.title + '</h3>' +
        '<ul class="event-meta list-unstyled">' +
          '<li><i class="bi bi-calendar3"></i> ' + dateText(ev) + '، الساعة ' + toArabicDigits(ev.time) + '</li>' +
          '<li><i class="bi bi-geo-alt"></i> ' + ev.location + '، ' + ev.area + '</li>' +
        '</ul>' +
        '<p class="card-text">' + ev.short + '</p>' +
        '<a href="event.html?id=' + ev.id + '" class="btn btn-outline-primary mt-auto align-self-start">التفاصيل</a>' +
      '</div>' +
    '</article></div>';
}

// things that every page needs
function initCommon() {
  loadTheme();
  document.getElementById("year").innerHTML = new Date().getFullYear();
  window.onscroll = toggleScrollButton;
}

// dark mode (bonus) - saved in localStorage so it stays when you change page
function loadTheme() {
  if (localStorage.getItem("theme") == "dark") {
    document.body.className = "dark-mode";
  }
  updateThemeIcon();
}

function toggleTheme() {
  if (document.body.className == "dark-mode") {
    document.body.className = "";
    localStorage.setItem("theme", "light");
  } else {
    document.body.className = "dark-mode";
    localStorage.setItem("theme", "dark");
  }
  updateThemeIcon();
}

function updateThemeIcon() {
  var btn = document.getElementById("themeToggle");
  if (document.body.className == "dark-mode") {
    btn.innerHTML = '<i class="bi bi-sun"></i>';
    btn.title = "الوضع النهاري";
  } else {
    btn.innerHTML = '<i class="bi bi-moon-stars"></i>';
    btn.title = "الوضع الليلي";
  }
}

// scroll to top button (bonus), shows after 400px
function toggleScrollButton() {
  var btn = document.getElementById("scrollTop");
  if (window.pageYOffset > 400) {
    btn.style.display = "block";
  } else {
    btn.style.display = "none";
  }
}

function scrollToTop() {
  window.scrollTo(0, 0);
}


// ---------- home page ----------
var currentSlide = 0;
var slideTimer = null;

function initHome() {
  initCommon();
  showSlide(0);
  showSpotlight();
  showLatestEvents();
}

// slider: we only change the 'active' class, the fade effect is in the css
// and it moves by itself every 5 seconds with setTimeout
function showSlide(n) {
  var slides = document.getElementsByClassName("slide");
  var dots = document.getElementsByClassName("slider-dot");

  // after the last slide go back to the first one
  if (n >= slides.length) {
    n = 0;
  }
  if (n < 0) {
    n = slides.length - 1;
  }

  for (var i = 0; i < slides.length; i++) {
    slides[i].className = "slide";
    dots[i].className = "slider-dot";
  }
  slides[n].className = "slide active";
  dots[n].className = "slider-dot active";
  currentSlide = n;

  startSlider();
}

function nextSlide() {
  showSlide(currentSlide + 1);
}

function prevSlide() {
  showSlide(currentSlide - 1);
}

function startSlider() {
  clearTimeout(slideTimer);
  slideTimer = setTimeout(nextSlide, 5000);
}

// stops when the mouse is over the slider (onmouseover)
function stopSlider() {
  clearTimeout(slideTimer);
}

// shows today's event, if there is nothing today we show the next one
function showSpotlight() {
  var list = sortEvents();
  var chosen = null;
  var label = "";

  for (var i = 0; i < list.length; i++) {
    if (getStatus(list[i]) == "today") {
      chosen = list[i];
      label = "الحدث اليوم";
      break;
    }
  }
  if (chosen == null) {
    for (var j = 0; j < list.length; j++) {
      if (getStatus(list[j]) == "upcoming") {
        chosen = list[j];
        label = "أقرب فعالية: بعد " + toArabicDigits(daysLeft(chosen)) + " يوماً";
        if (daysLeft(chosen) == 1) {
          label = "أقرب فعالية: غداً";
        }
        break;
      }
    }
  }
  if (chosen == null) {
    return;
  }

  document.getElementById("spotlight").innerHTML =
    '<div class="spotlight cat-' + chosen.category + '">' +
      ticket(chosen) +
      '<div class="spotlight-body">' +
        '<span class="spotlight-label">' + label + '</span>' +
        '<h2 class="mb-1">' + chosen.title + '</h2>' +
        '<p class="mb-0"><i class="bi bi-geo-alt"></i> ' + chosen.location + '، الساعة ' + toArabicDigits(chosen.time) + '</p>' +
      '</div>' +
      '<a class="btn btn-primary" href="event.html?id=' + chosen.id + '">التفاصيل والحجز</a>' +
    '</div>';
}

function showLatestEvents() {
  var list = sortEvents();
  var html = "";
  var count = 0;
  for (var i = 0; i < list.length && count < 6; i++) {
    if (getStatus(list[i]) != "past") {
      html += eventCard(list[i]);
      count++;
    }
  }
  document.getElementById("latestEvents").innerHTML = html;
}


// ---------- events page ----------
var currentCategory = "all";

function initEvents() {
  initCommon();

  // fill the area list from the data without repeating
  var select = document.getElementById("areaFilter");
  var added = [];
  for (var i = 0; i < EVENTS.length; i++) {
    var area = EVENTS[i].area;
    if (added.indexOf(area) == -1) {
      added.push(area);
      select.innerHTML += '<option value="' + area + '">' + area + '</option>';
    }
  }

  // category comes from the link (buttons on the home page) or from the saved choice
  var cat = getParam("cat");
  if (cat == "") {
    cat = localStorage.getItem("preferredCategory");
  }
  if (cat == null || (cat != "all" && !CATEGORIES[cat])) {
    cat = "all";
  }
  setCategory(cat, false);
}

function setCategory(cat, save) {
  currentCategory = cat;

  var buttons = document.getElementsByClassName("cat-pill");
  for (var i = 0; i < buttons.length; i++) {
    var key = buttons[i].getAttribute("data-cat");
    if (key == cat) {
      buttons[i].className = "btn cat-pill cat-" + key + " active";
    } else {
      buttons[i].className = "btn cat-pill cat-" + key;
    }
  }

  // remember the category for the next visit (bonus)
  if (save) {
    localStorage.setItem("preferredCategory", cat);
    var note = document.getElementById("prefNote");
    if (cat == "all") {
      note.innerHTML = "";
    } else {
      note.innerHTML = '<i class="bi bi-bookmark-check"></i> حفظنا اختيارك، سنعرض "' +
                       CATEGORIES[cat].name + '" تلقائياً في زيارتك القادمة.';
    }
  }

  filterEvents();
}

// goes over all events and only shows the ones that match every filter
function filterEvents() {
  var text = document.getElementById("searchInput").value.toLowerCase();
  var when = document.getElementById("dateFilter").value;
  var area = document.getElementById("areaFilter").value;
  var dayInput = document.getElementById("customDate");

  if (when == "custom") {
    dayInput.style.display = "block";
  } else {
    dayInput.style.display = "none";
  }

  // find the date range [from, to] for the chosen option
  var today = getToday();
  var from = null;
  var to = null;
  if (when == "today") {
    from = today;
    to = today;
  } else if (when == "week") {
    from = today;
    to = new Date(today.getTime() + 6 * ONE_DAY);
  } else if (when == "month") {
    from = today;
    to = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  } else if (when == "custom" && dayInput.value != "") {
    from = toDate(dayInput.value);
    to = from;
  }

  var list = sortEvents();
  var html = "";
  var count = 0;

  for (var i = 0; i < list.length; i++) {
    var ev = list[i];

    if (currentCategory != "all" && ev.category != currentCategory) {
      continue;
    }
    if (area != "" && ev.area != area) {
      continue;
    }
    // event shows if its days overlap with the range
    if (from != null && (toDate(ev.date) > to || lastDay(ev) < from)) {
      continue;
    }
    var allText = (ev.title + " " + ev.short + " " + ev.location).toLowerCase();
    if (text != "" && allText.indexOf(text) == -1) {
      continue;
    }

    html += eventCard(ev);
    count++;
  }

  document.getElementById("eventsGrid").innerHTML = html;
  document.getElementById("resultsCount").innerHTML = toArabicDigits(count) + " من " + toArabicDigits(EVENTS.length) + " فعالية";

  if (count == 0) {
    document.getElementById("emptyState").style.display = "block";
  } else {
    document.getElementById("emptyState").style.display = "none";
  }
}

function resetFilters() {
  document.getElementById("filtersForm").reset();
  setCategory("all", true);
}


// ---------- event details page ----------
// one page for all the events, it reads the id from the url (event.html?id=3)
function initEvent() {
  initCommon();

  var ev = findEvent(getParam("id"));
  if (ev == null) {
    document.getElementById("eventContent").style.display = "none";
    document.getElementById("notFound").style.display = "block";
    return;
  }

  document.title = ev.title + " | مشوار";
  // category color on the wrapper so everything inside uses it
  document.getElementById("eventContent").className = "cat-" + ev.category;
  document.getElementById("crumbTitle").innerHTML = ev.title;
  document.getElementById("eventTitle").innerHTML = ev.title;
  document.getElementById("eventBadges").innerHTML = categoryBadge(ev.category) + " " + statusLabel(ev);
  document.getElementById("eventTicket").innerHTML = ticket(ev);
  document.getElementById("eventImage").src = "assets/img/event-" + ev.id + ".svg";
  document.getElementById("eventImage").alt = ev.title;
  document.getElementById("eventDescription").innerHTML = ev.description;
  document.getElementById("mapCaption").innerHTML = ev.location + " — " + ev.area + "، دمشق";

  var when = longDate(ev.date);
  if (ev.endDate) {
    when = "من " + longDate(ev.date) + "<br>إلى " + longDate(ev.endDate);
  }
  document.getElementById("eventDate").innerHTML = when;
  document.getElementById("eventTime").innerHTML = toArabicDigits(ev.time);
  document.getElementById("eventPlace").innerHTML = ev.location + "، " + ev.area;
  document.getElementById("eventPrice").innerHTML = ev.price;

  showGallery(ev);
  setCalendarLink(ev);
  setShareLinks(ev);
  showRelated(ev);

  document.getElementById("bookingEventName").innerHTML = ev.title;
  if (getStatus(ev) == "past") {
    var bookBtn = document.getElementById("bookBtn");
    bookBtn.disabled = true;
    bookBtn.innerHTML = "انتهت الفعالية";
  }
}

function showGallery(ev) {
  var pictures = [
    "assets/img/event-" + ev.id + ".svg",
    "assets/img/gallery-" + ev.category + "-1.svg",
    "assets/img/gallery-" + ev.category + "-2.svg",
    "assets/img/gallery-" + ev.category + "-3.svg"
  ];
  var html = "";
  for (var i = 0; i < pictures.length; i++) {
    html += '<div class="col-3">' +
      '<button type="button" class="gallery-thumb" data-bs-toggle="modal" data-bs-target="#imageModal"' +
      ' onclick="openImage(\'' + pictures[i] + '\')" title="تكبير الصورة">' +
      '<img src="' + pictures[i] + '" alt="صورة ' + (i + 1) + ' من الفعالية"></button></div>';
  }
  document.getElementById("gallery").innerHTML = html;
}

function openImage(src) {
  document.getElementById("modalImage").src = src;
}

function twoDigits(n) {
  if (n < 10) {
    return "0" + n;
  }
  return "" + n;
}

// google calendar link with the event info
function setCalendarLink(ev) {
  var time = ev.time.split(":");
  var endHour = parseInt(time[0], 10) + 2; // we assume the event is 2 hours
  if (endHour > 23) {
    endHour = 23;
  }
  var lastDate = ev.date;
  if (ev.endDate) {
    lastDate = ev.endDate;
  }
  var start = ev.date.split("-").join("") + "T" + time[0] + time[1] + "00";
  var end = lastDate.split("-").join("") + "T" + twoDigits(endHour) + time[1] + "00";

  document.getElementById("calendarBtn").href =
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    "&text=" + encodeURIComponent(ev.title) +
    "&dates=" + start + "/" + end +
    "&ctz=Asia/Damascus" +
    "&location=" + encodeURIComponent(ev.location + "، " + ev.area + "، دمشق") +
    "&details=" + encodeURIComponent(ev.short);
}

// share links for whatsapp, telegram and facebook
function setShareLinks(ev) {
  var url = encodeURIComponent(location.href);
  var text = encodeURIComponent(ev.title + " — " + ev.short);
  document.getElementById("shareWhatsapp").href = "https://wa.me/?text=" + text + "%20" + url;
  document.getElementById("shareTelegram").href = "https://t.me/share/url?url=" + url + "&text=" + text;
  document.getElementById("shareFacebook").href = "https://www.facebook.com/sharer/sharer.php?u=" + url;
  document.getElementById("shareLink").value = location.href;
}

function copyLink() {
  var input = document.getElementById("shareLink");
  input.select();
  document.execCommand("copy");
  document.getElementById("copyNote").innerHTML = "تم نسخ الرابط.";
}

// same category first, then the others, max 3
function showRelated(ev) {
  var list = sortEvents();
  var same = [];
  var other = [];
  for (var i = 0; i < list.length; i++) {
    if (list[i].id == ev.id || getStatus(list[i]) == "past") {
      continue;
    }
    if (list[i].category == ev.category) {
      same.push(list[i]);
    } else {
      other.push(list[i]);
    }
  }
  var related = same.concat(other).slice(0, 3);

  var html = "";
  for (var j = 0; j < related.length; j++) {
    var r = related[j];
    html += '<a href="event.html?id=' + r.id + '" class="related-item">' + ticket(r) +
            '<span><strong>' + r.title + '</strong><small>' + r.location + '، ' + dateText(r) + '</small></span></a>';
  }
  document.getElementById("relatedEvents").innerHTML = html;
}

function resetBooking() {
  document.getElementById("bookingForm").reset();
  document.getElementById("bookingForm").style.display = "block";
  document.getElementById("bookingResult").innerHTML = "";
  document.getElementById("bookName").className = "form-control";
  document.getElementById("bookPhone").className = "form-control";
}

// fake booking inside the modal (bonus)
function bookSeat() {
  var name = document.getElementById("bookName");
  var phone = document.getElementById("bookPhone");
  var seats = document.getElementById("bookSeats").value;
  var ok = true;

  if (name.value.length < 3) {
    name.className = "form-control is-invalid";
    ok = false;
  } else {
    name.className = "form-control is-valid";
  }

  if (phone.value.search(/^09\d{8}$/) == -1) { // syrian mobile: 09 + 8 numbers
    phone.className = "form-control is-invalid";
    ok = false;
  } else {
    phone.className = "form-control is-valid";
  }

  if (ok) {
    var word = "مقاعد";
    if (seats == "1") {
      word = "مقعد";
    }
    document.getElementById("bookingForm").style.display = "none";
    document.getElementById("bookingResult").innerHTML =
      '<div class="alert alert-success mb-0" role="alert"><i class="bi bi-check-circle"></i> ' +
      'تم حجز ' + toArabicDigits(seats) + ' ' + word + ' بنجاح. ستصلك رسالة تأكيد على الرقم ' + phone.value + '.</div>';
  }
  return false; // so the page doesn't reload
}


// ---------- about page ----------
function initAbout() {
  initCommon();
  var places = [];
  for (var i = 0; i < EVENTS.length; i++) {
    if (places.indexOf(EVENTS[i].location) == -1) {
      places.push(EVENTS[i].location);
    }
  }
  document.getElementById("statEvents").innerHTML = toArabicDigits(EVENTS.length);
  document.getElementById("statPlaces").innerHTML = toArabicDigits(places.length);
}


// ---------- contact page ----------
// each check function returns true/false and shows the error under the field
function initContact() {
  initCommon();
}

function markField(field, errorText) {
  var base = "form-control";
  if (field.tagName == "SELECT") {
    base = "form-select";
  }
  if (errorText == "") {
    field.className = base + " is-valid";
  } else {
    field.className = base + " is-invalid";
  }
  document.getElementById(field.id + "Error").innerHTML = errorText;
  return errorText == "";
}

function checkName() {
  var field = document.getElementById("fullName");
  var value = field.value.trim();
  if (value == "") {
    return markField(field, "الاسم مطلوب.");
  }
  if (value.length < 3) {
    return markField(field, "اكتب اسماً من 3 أحرف على الأقل.");
  }
  return markField(field, "");
}

function checkEmail() {
  var field = document.getElementById("email");
  var value = field.value.trim();
  if (value == "") {
    return markField(field, "البريد الإلكتروني مطلوب.");
  }
  if (value.search(/^[\w.\-]+@[\w\-]+(\.[\w\-]+)*\.[a-zA-Z]{2,}$/) == -1) { // simple email check: name@site.com
    return markField(field, "صيغة البريد غير صحيحة، مثال: name@example.com");
  }
  return markField(field, "");
}

function checkTopic() {
  var field = document.getElementById("topic");
  if (field.value == "") {
    return markField(field, "اختر موضوع الرسالة.");
  }
  return markField(field, "");
}

function checkMessage() {
  var field = document.getElementById("message");
  var length = field.value.trim().length;
  if (length == 0) {
    return markField(field, "الرسالة مطلوبة.");
  }
  if (length < 10) {
    return markField(field, "الرسالة قصيرة، اكتب 10 أحرف على الأقل (كتبت " + length + ").");
  }
  return markField(field, "");
}

// check again while typing, only if the field already has an error
// (without this the send button was jumping when the error message disappeared)
function liveCheck(field) {
  if (field.className.indexOf("is-invalid") == -1) {
    return;
  }
  if (field.id == "fullName") {
    checkName();
  } else if (field.id == "email") {
    checkEmail();
  } else if (field.id == "message") {
    checkMessage();
  }
}

function countChars() {
  var length = document.getElementById("message").value.length;
  document.getElementById("msgCounter").innerHTML = length + " / 500";
}

// called from onsubmit="return validateContact()"
// we check all the fields so all the errors show at the same time
function validateContact() {
  var errors = 0;
  if (!checkName()) errors++;
  if (!checkEmail()) errors++;
  if (!checkTopic()) errors++;
  if (!checkMessage()) errors++;

  var box = document.getElementById("formAlert");

  if (errors > 0) {
    box.innerHTML = '<div class="alert alert-danger alert-dismissible fade show" role="alert">' +
      '<i class="bi bi-exclamation-triangle"></i> لم تُرسل الرسالة: يوجد ' + errors +
      ' من الحقول تحتاج إلى تصحيح.' +
      '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="إغلاق"></button></div>';
    return false;
  }

  // no server for a static site, so we just show the success message
  box.innerHTML = '<div class="alert alert-success alert-dismissible fade show" role="alert">' +
    '<i class="bi bi-check-circle"></i> شكراً لك، وصلت رسالتك وسنرد على بريدك خلال يومي عمل.' +
    '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="إغلاق"></button></div>';

  document.getElementById("contactForm").reset();
  document.getElementById("fullName").className = "form-control";
  document.getElementById("email").className = "form-control";
  document.getElementById("topic").className = "form-select";
  document.getElementById("message").className = "form-control";
  countChars();
  return false;
}
