// data.js - all the events are here (we don't have a database, the site is static)
// to add an event: copy one object, change the id and add its picture in assets/img

// categories: arabic name + bootstrap icon (the colors are in styles.css)
var CATEGORIES = {
  culture: { name: "ثقافة",   icon: "bi-book" },
  sports:  { name: "رياضة",   icon: "bi-trophy" },
  music:   { name: "موسيقى",  icon: "bi-music-note-beamed" },
  family:  { name: "عائلي",   icon: "bi-balloon" }
};

// dates are YYYY-MM-DD so they are easy to compare
// endDate is only for events that are more than one day
// photos go in assets/img/photos as event-ID.jpg, credit = who took the photo (optional)
// map = what we search on google maps (place name, or lat,lng if google doesn't know the place)
var EVENTS = [
  {
    id: 1, title: "ليلة طرب في خان أسعد باشا", category: "music",
    date: "2026-11-07", time: "20:00", location: "خان أسعد باشا", area: "دمشق القديمة",
    price: "تذاكر عند الباب", featured: true,
    short: "فرقة تخت شرقي تعزف موشحات وقدود حلبية تحت قبة الخان.",
    credit: "Vyacheslav Argenberg — CC BY 4.0 (Wikimedia Commons)",
    address: "سوق البزورية، دمشق القديمة",
    map: "Khan As'ad Pasha, Damascus",
    description: "أمسية موسيقية تجمع فرقة تخت شرقي من عود وقانون وناي وإيقاع، تقدّم برنامجاً من الموشحات الأندلسية والقدود الحلبية وأغاني الطرب القديم. الخان مفتوح للجمهور من السابعة مساءً، والجلوس على أساس الأسبقية. ننصح بالحضور مبكراً لأن المقاعد محدودة."
  },
  {
    id: 2, title: "معرض الحِرف الدمشقية", category: "culture",
    date: "2026-11-05", endDate: "2026-11-12", time: "10:00", location: "التكية السليمانية", area: "المرجة",
    price: "دخول مجاني", featured: true,
    short: "حرفيون يعرضون البروكار والموزاييك والنحاس، مع عروض حيّة للصناعة.",
    credit: "Dosseman — CC BY-SA 4.0 (Wikimedia Commons)",
    address: "شارع شكري القوتلي، المرجة، دمشق",
    map: "Tekkiye Mosque, Damascus",
    description: "أسبوع كامل مخصص للحرف اليدوية الدمشقية: نول البروكار، تطعيم الخشب بالصدف، الزجاج المنفوخ، ونقش النحاس. يقف كل حرفي إلى جانب عمله ويشرح مراحل الصناعة للزوار، ويمكن شراء القطع مباشرة منهم. يُختتم المعرض بجلسة حوارية عن مستقبل الحرف التقليدية."
  },
  {
    id: 3, title: "ماراثون دمشق الخيري", category: "sports",
    date: "2026-11-14", time: "07:30", location: "ساحة الأمويين", area: "الأمويين",
    price: "تسجيل مسبق", featured: true,
    short: "سباق 5 و10 كيلومترات، يذهب ريعه لترميم المدارس.",
    credit: "Ahmadac — ملكية عامة (Wikimedia Commons)",
    address: "ملتقى شارع بيروت وشارع شكري القوتلي، دمشق",
    map: "Umayyad Square, Damascus",
    description: "سباق جري مفتوح لكل الأعمار بمسارين: 5 كم للهواة والعائلات و10 كم للمتمرّسين. ينطلق السباق من ساحة الأمويين ويمرّ بشارع بيروت ثم يعود إلى نقطة البداية. يحصل كل مشارك على قميص وميدالية، ويُخصص ريع التسجيل لترميم مدارس في ريف دمشق."
  },
  {
    id: 4, title: "يوم العائلة في حديقة تشرين", category: "family",
    date: "2026-11-08", time: "11:00", location: "حديقة تشرين", area: "أبو رمانة",
    price: "دخول مجاني", featured: false,
    short: "ألعاب للأطفال، مسرح دمى، وأكشاك طعام بيتي.",
    credit: "Karkoor2006 — CC BY-SA 4.0 (Wikimedia Commons)",
    address: "شارع جواهر لال نهرو، قرب ساحة الأمويين، دمشق",
    map: "حديقة تشرين، دمشق",
    description: "يوم مفتوح للعائلات فيه مسرح دمى كل ساعة، مسابقات رسم على الأرض بالطباشير، وألعاب جماعية يديرها متطوعون. ستكون هناك أكشاك لطعام بيتي تديرها سيدات من الأحياء المجاورة. أحضر بطانية للجلوس على العشب."
  },
  {
    id: 5, title: "سينما في القلعة: أفلام قصيرة", category: "culture",
    date: "2026-11-20", time: "19:00", location: "قلعة دمشق", area: "دمشق القديمة",
    price: "دخول مجاني", featured: false,
    short: "عرض خمسة أفلام سورية قصيرة في الهواء الطلق ونقاش مع المخرجين.",
    credit: "Mewes — ملكية عامة (Wikimedia Commons)",
    address: "شارع الثورة، عند مدخل سوق الحميدية، دمشق القديمة",
    map: "Citadel of Damascus",
    description: "تتحول باحة القلعة إلى صالة سينما مفتوحة لعرض خمسة أفلام قصيرة لمخرجين شباب، تتراوح مدة كل فيلم بين 8 و20 دقيقة. بعد العرض جلسة نقاش مع المخرجين. الأفلام مناسبة لمن هم فوق 13 عاماً."
  },
  {
    id: 6, title: "ورشة رسم للأطفال", category: "family",
    date: "2026-11-21", time: "10:00", location: "بيت السباعي", area: "دمشق القديمة",
    price: "حجز مسبق", featured: false,
    short: "الأطفال يرسمون نوافير وزخارف البيت الدمشقي بإشراف فنانين.",
    credit: "LBM1948 — CC BY-SA 4.0 (Wikimedia Commons)",
    address: "جادة القباني، جنوب سوق مدحت باشا، دمشق القديمة",
    map: "33.508056,36.306944",
    description: "ورشة لمدة ساعتين للأطفال من 6 إلى 12 سنة. يتجول الأطفال أولاً في البيت ويتعرفون على الزخارف والنافورة والليوان، ثم يرسمون ما رأوه بالألوان المائية. المواد مؤمنة، والأماكن محدودة بعشرين طفلاً."
  },
  {
    id: 7, title: "دوري كرة السلة للأحياء", category: "sports",
    date: "2026-11-27", endDate: "2026-11-29", time: "16:00", location: "مدينة الجلاء الرياضية", area: "المزة",
    price: "دخول مجاني", featured: false,
    short: "ثماني فرق من أحياء دمشق تتنافس على كأس الدوري.",
    credit: "Ildar Sagdejev — CC BY-SA 4.0 (Wikimedia Commons)",
    address: "أوتوستراد المزة، دمشق",
    map: "مدينة الجلاء الرياضية، دمشق",
    description: "بطولة على ثلاثة أيام تشارك فيها ثماني فرق تمثل أحياء المدينة. الأدوار الأولى يوم الجمعة، ونصف النهائي السبت، والنهائي يوم الأحد مساءً مع حفل تتويج. المدرجات مفتوحة للجميع."
  },
  {
    id: 8, title: "حفل الكورال الشبابي", category: "music",
    date: "2026-12-04", time: "19:30", location: "مسرح الحمراء", area: "الشعلان",
    price: "تذاكر مسبقة", featured: true,
    short: "أربعون صوتاً يغنّون من التراث السوري والعربي بتوزيع جديد.",
    credit: "مصور غير معروف — CC0 (Wikimedia Commons)",
    address: "الصالحية، قرب الشعلان، دمشق",
    map: "مسرح الحمراء، دمشق",
    description: "كورال من أربعين شاباً وشابة يقدم أغاني من التراث السوري والعربي بتوزيعات متعددة الأصوات، بمرافقة بيانو ووتريات. البرنامج مدته ساعة ونصف مع استراحة قصيرة."
  },
  {
    id: 9, title: "أمسية شعرية في النوفرة", category: "culture",
    date: "2026-12-10", time: "18:00", location: "مقهى النوفرة", area: "دمشق القديمة",
    price: "دخول مجاني", featured: false,
    short: "شعراء شباب يقرؤون قصائدهم عند الجامع الأموي.",
    credit: "Sheam k — CC BY-SA 3.0 (Wikimedia Commons)",
    address: "قرب الباب الشرقي للجامع الأموي، دمشق القديمة",
    map: "مقهى النوفرة، دمشق",
    description: "قراءات لستة شعراء شباب في المقهى الأقدم بدمشق، مع فقرة مفتوحة في النهاية لمن يرغب بإلقاء قصيدة. الأمسية تُقام بالعربية الفصحى والمحكية."
  },
  {
    id: 10, title: "سوق الشتاء في باب توما", category: "family",
    date: "2026-12-18", endDate: "2026-12-24", time: "15:00", location: "ساحة باب توما", area: "باب توما",
    price: "دخول مجاني", featured: false,
    short: "أكشاك هدايا يدوية ومشروبات ساخنة وأضواء في الحارات.",
    credit: "Dosseman — CC BY-SA 4.0 (Wikimedia Commons)",
    address: "ساحة باب توما، دمشق القديمة",
    map: "باب توما، دمشق",
    description: "سوق موسمي تمتد أكشاكه في الحارات المحيطة بالساحة: هدايا يدوية، حلويات شتوية، سحلب ومشروبات ساخنة. تُضاء الحارات كل مساء وتُقدّم فقرات موسيقية قصيرة للأطفال."
  },
  {
    id: 11, title: "بطولة الشطرنج المفتوحة", category: "sports",
    date: "2027-01-09", time: "09:00", location: "المركز الثقافي", area: "أبو رمانة",
    price: "تسجيل مسبق", featured: false,
    short: "سبع جولات بنظام سويسري لجميع المستويات.",
    credit: "Jorge Royan — CC BY-SA 3.0 (Wikimedia Commons)",
    address: "الجلاء، أبو رمانة، دمشق",
    map: "المركز الثقافي العربي أبو رمانة، دمشق",
    description: "بطولة شطرنج مفتوحة بسبع جولات بنظام سويسري، زمن كل لاعب 15 دقيقة مع إضافة 10 ثوانٍ لكل نقلة. هناك جوائز للفئات: تحت 14 سنة، السيدات، والترتيب العام."
  },
  {
    id: 12, title: "مهرجان موسيقى الشتاء", category: "music",
    date: "2027-01-16", endDate: "2027-01-17", time: "18:00", location: "مدينة المعارض", area: "طريق المطار",
    price: "تذاكر مسبقة", featured: false,
    short: "يومان من الحفلات لفرق مستقلة من دمشق وحلب واللاذقية.",
    credit: "Shixart1985 — CC BY 2.0 (Wikimedia Commons)",
    address: "طريق مطار دمشق الدولي، عقربا",
    map: "Syrian Expo Center - Damascus Fair Grounds",
    description: "مهرجان على مسرحين لفرق موسيقية مستقلة: روك عربي، جاز، وموسيقى إلكترونية بآلات شرقية. يتوفر نقل بالحافلات من ساحة الأمويين كل نصف ساعة."
  }
];
