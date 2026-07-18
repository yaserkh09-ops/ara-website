/**
 * ARA marketing copy — bilingual (EN default / AR full-RTL).
 *
 * Baseline strings were transcribed from `ara-website-copy.md`. The
 * WEBSITE_FINALIZE pass (2026-07-18) then applied the ratified revisions:
 * the two named solutions (Intelligent Inventory Management — paid by
 * healthcare organizations · Network Visibility & Management — paid by
 * pharmaceutical companies), the authorized pricing language (joining a
 * company's network is free for the institution — the company pays; access
 * is granted, scoped, and revocable), "ARA Solutions · أرى" on textual brand
 * surfaces, and bilingual copy fixes. Business-model language here must not
 * change without a ratified ruling.
 *
 * The `ar` object is typed against `en` (`Copy`), so the build fails if a key
 * is missing in either locale — keeping the two languages structurally in sync.
 *
 * A small number of strings are NOT in the copy file and are unavoidable
 * UI micro-copy (skip link, toggle/menu aria-labels, motif & diagram labels,
 * meta description). These live under `ui` and are marked `// [micro-copy]`
 * for your review — kept minimal and in the locked voice.
 */

export const LOCALES = ['en', 'ar'] as const;
export type Locale = (typeof LOCALES)[number];

/** Shared, language-neutral constants (the only links out). */
export const site = {
  signInUrl: 'https://app.arasolutions.io',
  contactEmail: 'admin@arasolutions.io',
  contactHref: 'mailto:admin@arasolutions.io',
  /** Legal pages (English-only this release), linked from both footers. */
  legal: {
    privacy: '/privacy-policy',
    terms: '/terms',
  },
  /** Section anchors used by nav + in-page jumps. */
  anchors: {
    whatWeSolve: 'what-we-solve',
    whatAraDoes: 'what-ara-does',
    whoItsFor: 'who-its-for',
    howItWorks: 'how-it-works',
    trust: 'trust',
    cta: 'get-started',
  },
} as const;

const en = {
  meta: {
    lang: 'en',
    dir: 'ltr' as 'ltr' | 'rtl',
    title: 'ARA Solutions · أرى — Inventory Intelligence Solution',
    // [micro-copy] meta description — drawn from the hero subhead's promise.
    description:
      "ARA gives healthcare organizations a more reliable supply, and gives the companies that serve them real-time visibility into what's actually in stock.",
  },

  // §0 · Header / Nav
  nav: {
    links: {
      whatWeSolve: 'What We Solve?',
      whoItsFor: "Who It's For?",
      howItWorks: 'How It Works?',
    },
    signIn: 'Sign in',
    // toggle shows both locales; current is highlighted
    toggle: { en: 'EN', ar: 'AR' },
  },

  // §1 · Hero
  hero: {
    eyebrow: 'Inventory Intelligence Solution',
    headline: 'Never caught short. Never sold blind.',
    tagline: "See what's available. Instantly.",
    subhead:
      'ARA gives healthcare organizations a more reliable supply — and gives the companies that serve them real-time visibility into what’s actually in stock. Stronger partnerships on both sides, so the best is always there for the patient.',
    primary: 'Sign in',
    secondary: 'See how it works',
  },

  // §2 · What We Solve?
  problem: {
    eyebrow: 'The problem',
    heading: 'Right now, data is not intelligent.',
    body: "For healthcare organizations, running out of a medication is a daily risk — and a manual one. Stock data sits locked inside each facility ERP system, not easily accessible and invisible to the companies that could act on it. So a critical product runs dry, and no one sees it until a patient is already waiting. The companies supplying that medication would act — if only they could see it. It's a visibility problem, and it costs everyone.",
    // pain points (organization -> company -> patient)
    points: [
      {
        title: 'Managing stock is time-consuming',
        body: 'Manual checks and reorders eat hours that should go to patients.',
      },
      {
        title: 'Missed restock moments',
        body: "Low stock goes unseen until it's a lost sale.",
      },
      {
        title: 'Stockouts affect the patient',
        body: 'Medication runs out before anyone upstream can react.',
      },
    ],
  },

  // §3 · What ARA Does?
  solution: {
    eyebrow: 'What ARA does',
    heading: 'Inventory data, finally made intelligent.',
    body: 'One platform, two solutions. Intelligent Inventory Management gives healthcare organizations a live, intelligent view of their own stock. Network Visibility & Management gives the companies that supply them real-time visibility into stock for their products — always on a permission basis, and only where an organization has granted access. The same data that used to sit blind in a back office becomes something everyone can act on.',
    // value cells — words pulled from the body line above ("live, accessible … permission basis")
    values: [
      { label: 'Live' },
      { label: 'Accessible' },
      { label: 'Permission-based' },
    ],
  },

  // §4 · Who It's For?
  audiences: {
    eyebrow: "Who it's for",
    heading: 'Built for every side of the shelf.',
    organizations: {
      label: 'For healthcare organizations',
      solution: 'Intelligent Inventory Management',
      body: "A paid subscription for hospitals and pharmacies: a clearer, more intelligent view of your own stock — fewer stockouts, less manual chasing of suppliers, and a supply chain that finally responds to what you actually need. And joining a company's network costs you nothing — the company pays; you only grant access, and you can revoke it at any time. Your data stays yours.",
    },
    companies: {
      label: 'For pharmaceutical companies',
      solution: 'Network Visibility & Management',
      body: "A paid subscription that shows real-time stock for your products at every account that has authorized you. Act before a shelf runs empty, direct your effort where it's genuinely needed, and serve your customers with data instead of guesswork.",
    },
  },

  // §5 · How It Works?
  how: {
    eyebrow: 'How it works',
    heading: 'Three steps to a clear network.',
    stepWord: 'Step',
    steps: [
      {
        n: '1',
        title: 'Share',
        body: 'Healthcare organizations connect their inventory securely, on their own terms. The data stays theirs; they decide who can see it.',
      },
      {
        n: '2',
        title: 'Standardize',
        body: 'ARA maps every item to one clean, standardized catalog — so a product means the same thing every time, everywhere.',
      },
      {
        n: '3',
        title: 'See',
        body: 'Cleared teams get a live view — organizations see their own stock in a new light, and companies see only their products, at authorized accounts, always up to date.',
      },
    ],
  },

  // §6 · Built on Trust
  trust: {
    eyebrow: 'Built on trust',
    heading: 'Your data, your terms.',
    pillars: [
      {
        title: 'You own your data',
        body: 'Your inventory stays yours. You decide which companies can see it, and you can change that at any time.',
      },
      {
        title: 'Enterprise-grade access control',
        body: "Every user sees only what they're authorized to — enforced at the database level.",
      },
      {
        title: 'Always current',
        body: 'Everyone works from the same live data, the moment it changes. No stale reports, no guesswork.',
      },
    ],
  },

  // §7 · Final CTA
  cta: {
    heading: "Ready to see what's available instantly?",
    body: "Whether you're a healthcare organization or a company that supplies one, ARA is live and ready today. Sign in to your account, or reach us to bring your organization on board.",
    primary: 'Sign in',
    secondary: 'Get in touch',
  },

  // §8 · Footer
  footer: {
    tagline: "See what's available. Instantly.",
    contactLabel: 'Contact',
    quickLinksLabel: 'Quick links',
    legal: '© 2026 ARA Solutions · أرى. Pharmaceutical inventory intelligence for Saudi Arabia.',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
  },

  // Non-copy-file UI strings (minimal, in-voice). [micro-copy] = for review.
  ui: {
    skipToContent: 'Skip to content', // [micro-copy]
    toFromLabel: 'Language', // [micro-copy] aria-label for the language toggle
    switchToOther: 'العربية', // label of the link to the other locale
    switchToOtherAria: 'التبديل إلى العربية', // [micro-copy]
    openMenu: 'Open menu', // [micro-copy]
    closeMenu: 'Close menu', // [micro-copy]
    home: 'ARA home', // [micro-copy] logo link aria-label
    // Hero "shelf becomes visible" motif. [micro-copy]
    motif: {
      caption:
        'Hidden inventory becomes shared, live visibility: stock tiles light up as an organization and a company connect.',
      panelTitle: 'Live inventory', // [micro-copy]
      liveLabel: 'Live', // [micro-copy]
      org: 'Organization',
      company: 'Company',
      inStock: 'In stock',
      low: 'Low',
      out: 'Out',
    },
    // §3 product dashboard mock (clearly sample data). [micro-copy]
    dashboard: {
      title: 'Inventory',
      item: 'Item',
      stock: 'Stock',
      status: 'Status',
      access: 'Access',
      shared: 'Shared',
      private: 'Private',
    },
    // Honest value strip — short claims drawn from the locked copy. [micro-copy]
    proof: [
      "Free to join a company's network",
      'Real-time visibility',
      'Permission-based by design',
      'Enterprise-grade access control',
    ],
    // §3 mechanism diagram + §5 flow. [micro-copy]
    diagram: {
      locked: 'Locked',
      live: 'Live',
      shared: 'Shared',
      caption:
        'Locked back-office inventory becomes live, connected, permission-based data.',
      flowCaption: 'Inventory flows from organizations to authorized companies.',
    },
  },
};

export type Copy = typeof en;

const ar: Copy = {
  meta: {
    lang: 'ar',
    dir: 'rtl',
    title: 'ARA Solutions · أرى — منصة ذكاء المخزون',
    // [micro-copy] meta description — drawn from the hero subhead.
    description:
      'تمنح ARA المنشآت الصحية سلسلة إمدادٍ أكثر موثوقية، وتمنح الشركات التي تخدمها رؤيةً لحظيةً لما هو متوفرٌ فعلًا في المخزون.',
  },

  nav: {
    links: {
      whatWeSolve: 'ماذا نحل؟',
      whoItsFor: 'لمن صُمّمت؟',
      howItWorks: 'كيف تعمل؟',
    },
    signIn: 'تسجيل الدخول',
    toggle: { en: 'EN', ar: 'AR' },
  },

  hero: {
    eyebrow: 'منصة ذكاء المخزون',
    headline: 'لا نفاد للمخزون. ولا بيع بلا رؤية.',
    tagline: 'شاهد المتوفر. فورًا.',
    subhead:
      'تمنح ARA المنشآت الصحية سلسلة إمدادٍ أكثر موثوقية، وتمنح الشركات التي تخدمها رؤيةً لحظيةً لما هو متوفرٌ فعلًا في المخزون. شراكاتٌ أقوى على الجانبين، ليبقى الأفضل دائمًا في متناول المريض.',
    primary: 'تسجيل الدخول',
    secondary: 'شاهد كيف تعمل',
  },

  problem: {
    eyebrow: 'المشكلة',
    heading: 'اليوم، البيانات ليست ذكية.',
    body: 'بالنسبة للمنشآت الصحية، نفاد الدواء خطرٌ يوميٌّ — وعمليةٌ يدويةٌ. تبقى بيانات المخزون محتجزةً داخل نظام تخطيط الموارد (ERP) في كل منشأة، يصعب الوصول إليها وتغيب عن أعين الشركات القادرة على التصرّف. فينفد منتجٌ حيويّ دون أن ينتبه أحد، حتى يصبح المريض في الانتظار. أما الشركات المورّدة لهذا الدواء فكانت لتتحرّك — لو أنها تستطيع الرؤية. إنها مشكلة رؤية، وكلفتها تطال الجميع.',
    points: [
      {
        title: 'إدارة المخزون تستهلك الوقت',
        body: 'الفحوص والطلبات اليدوية تلتهم ساعاتٍ كان الأجدر أن تُصرف على المرضى.',
      },
      {
        title: 'لحظات إعادة التوريد الضائعة',
        body: 'انخفاض المخزون يمرّ دون أن يُرى، حتى تضيع فرصة البيع.',
      },
      {
        title: 'نفاد المخزون يطال المريض',
        body: 'الدواء ينفد قبل أن يتمكّن أحدٌ في أعلى السلسلة من التحرّك.',
      },
    ],
  },

  solution: {
    eyebrow: 'ماذا تفعل ARA',
    heading: 'بيانات المخزون، وقد أصبحت ذكيةً أخيرًا.',
    body: 'منصةٌ واحدة وحلّان. تمنح «الإدارة الذكية للمخزون» المنشآت الصحية رؤيةً حيّةً وذكيةً لمخزونها، وتمنح «رؤية الشبكة وإدارتها» الشركات المورّدة رؤيةً لحظيةً لمخزون منتجاتها — دائمًا وفق الأذونات، ولا يظهر إلا ما سمحت به المنشأة. فتتحوّل البياناتُ التي كانت حبيسة المكاتب الخلفية إلى معلومةٍ يستطيع الجميع التصرّف بناءً عليها.',
    values: [
      { label: 'حيّة' },
      { label: 'سهلة الوصول' },
      { label: 'وفق الأذونات' },
    ],
  },

  audiences: {
    eyebrow: 'لمن صُمّمت',
    heading: 'مصمَّمةٌ لكل أطراف المنظومة.',
    organizations: {
      label: 'للمنشآت الصحية',
      solution: 'الإدارة الذكية للمخزون',
      body: 'اشتراكٌ مدفوعٌ للمستشفيات والصيدليات: رؤيةٌ أوضح وأذكى لمخزونك — نفادٌ أقل، ومطاردةٌ يدويةٌ أقل للموردين، وسلسلة إمدادٍ تستجيب أخيرًا لما تحتاجه فعلًا. أما الانضمام إلى شبكة أي شركةٍ فلا يكلّفك شيئًا — الشركة هي من يدفع، وأنت فقط تمنح صلاحية وصولٍ يمكنك سحبها في أي وقت. بياناتك تبقى ملكك.',
    },
    companies: {
      label: 'لشركات الأدوية',
      solution: 'رؤية الشبكة وإدارتها',
      body: 'اشتراكٌ مدفوعٌ يعرض لك مخزون منتجاتك لحظيًا في كل حسابٍ منحك صلاحية الوصول. تحرّك قبل أن يفرغ الرف، ووجّه جهدك إلى حيث تمسّ الحاجة فعلًا، واخدم عملاءك بالبيانات بدلًا من التخمين.',
    },
  },

  how: {
    eyebrow: 'كيف تعمل',
    heading: 'ثلاث خطواتٍ نحو شبكةٍ واضحة.',
    stepWord: 'الخطوة',
    steps: [
      {
        n: '١',
        title: 'المشاركة',
        body: 'تربط المنشآت الصحية مخزونها بأمان، ووفق شروطها. تبقى البيانات ملكها، وهي من يقرّر من يراها.',
      },
      {
        n: '٢',
        title: 'التوحيد',
        body: 'توحّد ARA كل صنفٍ في كتالوجٍ واحدٍ منظّم — ليحمل المنتج المعنى ذاته في كل مرةٍ وكل مكان.',
      },
      {
        n: '٣',
        title: 'الرؤية',
        body: 'تحصل الفرق المصرّح لها على رؤيةٍ حيّة — ترى المنشآت مخزونها بصورةٍ جديدة، وترى الشركات منتجاتها فقط، في الحسابات المصرّح بها، ومحدّثةً دائمًا.',
      },
    ],
  },

  trust: {
    eyebrow: 'مبنيّةٌ على الثقة',
    heading: 'بياناتك، وبشروطك.',
    pillars: [
      {
        title: 'بياناتك ملكك',
        body: 'يبقى مخزونك ملكًا لك. أنت من يقرّر أي الشركات يمكنها رؤيته، ويمكنك تغيير ذلك في أي وقت.',
      },
      {
        title: 'تحكّمٌ في الوصول بمعايير المؤسسات',
        body: 'كل مستخدمٍ لا يرى إلا ما صُرّح له به — وهذا مفروضٌ على مستوى قاعدة البيانات.',
      },
      {
        title: 'محدّثةٌ دائمًا',
        body: 'يعمل الجميع من البيانات الحيّة نفسها، لحظة تغيّرها. لا تقارير قديمة، ولا تخمين.',
      },
    ],
  },

  cta: {
    heading: 'جاهزٌ لترى المتوفر فورًا؟',
    body: 'سواءٌ كنت منشأةً صحية أو شركةً تورّد لها، فإن ARA جاهزةٌ وتعمل اليوم. سجّل الدخول إلى حسابك، أو تواصل معنا لانضمام مؤسستك.',
    primary: 'تسجيل الدخول',
    secondary: 'تواصل معنا',
  },

  footer: {
    tagline: 'شاهد المتوفر. فورًا.',
    contactLabel: 'التواصل',
    quickLinksLabel: 'روابط سريعة',
    legal: '© ٢٠٢٦ ARA Solutions · أرى. ذكاء المخزون الدوائي للمملكة العربية السعودية.',
    privacy: 'سياسة الخصوصية',
    terms: 'شروط الاستخدام',
  },

  ui: {
    skipToContent: 'تخطَّ إلى المحتوى', // [micro-copy]
    toFromLabel: 'اللغة', // [micro-copy]
    switchToOther: 'English',
    switchToOtherAria: 'Switch to English', // [micro-copy]
    openMenu: 'فتح القائمة', // [micro-copy]
    closeMenu: 'إغلاق القائمة', // [micro-copy]
    home: 'الصفحة الرئيسية ARA', // [micro-copy]
    motif: {
      caption:
        'يتحوّل المخزون الخفيّ إلى رؤيةٍ حيّةٍ مشتركة: تُضيء بطاقات المخزون عند اتصال المنشأة بالشركة.', // [micro-copy]
      panelTitle: 'المخزون الحيّ', // [micro-copy]
      liveLabel: 'حيّ', // [micro-copy]
      org: 'المنشأة',
      company: 'الشركة',
      inStock: 'متوفر',
      low: 'منخفض',
      out: 'نافد',
    },
    // §3 product dashboard mock (clearly sample data). [micro-copy]
    dashboard: {
      title: 'المخزون',
      item: 'الصنف',
      stock: 'الكمية',
      status: 'الحالة',
      access: 'الوصول',
      shared: 'مُشارَك',
      private: 'خاص',
    },
    proof: [
      'الانضمام إلى شبكات الشركات مجانيٌّ للمنشآت',
      'رؤية لحظية',
      'قائمة على الأذونات',
      'تحكّمٌ في الوصول بمعايير المؤسسات',
    ],
    diagram: {
      locked: 'مُقفل',
      live: 'حيّ',
      shared: 'مُشارَك',
      caption:
        'يتحوّل مخزون المكاتب الخلفية المُقفل إلى بياناتٍ حيّةٍ ومتصلةٍ ووفق الأذونات.', // [micro-copy]
      flowCaption: 'تتدفق بيانات المخزون من المنشآت إلى الشركات المصرّح لها.', // [micro-copy]
    },
  },
};

export const copy: Record<Locale, Copy> = { en, ar };

export function getCopy(locale: Locale): Copy {
  return copy[locale];
}
