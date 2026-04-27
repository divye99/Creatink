// Lightweight i18n: English baseline + Hindi for key strings.
const dict = {
  en: {
    nav_home: 'Home', nav_discover: 'Discover', nav_campaigns: 'Campaigns',
    nav_messages: 'Messages', nav_profile: 'Profile',
    cta_continue: 'Continue', cta_send_otp: 'Send OTP', cta_verify: 'Verify',
    cta_login: 'Log in', cta_signup: 'Sign up',
    onb_choose_type: 'Choose your account type',
    onb_creator: 'Creator', onb_brand: 'Brand',
    disclaimer_ack: 'I have read and accept the terms above',
  },
  hi: {
    nav_home: 'होम', nav_discover: 'खोजें', nav_campaigns: 'अभियान',
    nav_messages: 'संदेश', nav_profile: 'प्रोफ़ाइल',
    cta_continue: 'जारी रखें', cta_send_otp: 'OTP भेजें', cta_verify: 'सत्यापित करें',
    cta_login: 'लॉग इन', cta_signup: 'साइन अप',
    onb_choose_type: 'अपना खाता प्रकार चुनें',
    onb_creator: 'क्रिएटर', onb_brand: 'ब्रांड',
    disclaimer_ack: 'मैंने ऊपर दी गई शर्तें पढ़ ली हैं और स्वीकार करता/करती हूँ',
  },
}

export const t = (lang, key) => dict[lang]?.[key] ?? dict.en[key] ?? key
export const LANGS = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
]
