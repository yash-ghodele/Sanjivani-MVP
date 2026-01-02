import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            // Sidebar
            scanYourCrop: 'Scan Your Crop',
            home: 'Home',
            cropCalendar: 'Crop Calendar',
            exportData: 'Export Data',
            helpFaq: 'Help & FAQ',
            quickStats: 'Quick Stats',
            totalScans: 'Total Scans',
            activeAlerts: 'Active Alerts',
            detectingLocation: 'Detecting location...',
            enableLocation: 'Enable Location Access',
            language: 'Language',

            // Days of week
            monday: 'Monday',
            tuesday: 'Tuesday',
            wednesday: 'Wednesday',
            thursday: 'Thursday',
            friday: 'Friday',
            saturday: 'Saturday',
            sunday: 'Sunday',

            // Dashboard
            goodMorning: 'Good Morning',
            goodAfternoon: 'Good Afternoon',
            goodEvening: 'Good Evening',
            todaysPriority: "Today's Priority",
            allClear: 'All Clear!',
            noUrgentTasks: 'No urgent tasks for today. Your farm is looking healthy.',
            recentActivity: 'Recent Activity',
            noScans: 'No scan history yet',
            startFirstScan: 'Start your first scan to begin tracking your crops',

            // Calendar
            planSchedule: 'Plan your sowing and harvest schedules',
            authRequired: 'Authentication Required',
            signInToAccess: 'Please sign in to access the crop calendar',
            allCrops: 'All Crops',
            days: 'Days',
            growthStages: 'Growth Stages',

            // Common
            loading: 'Loading...',
            retry: 'Retry',
            goToDashboard: 'Go to Dashboard',
        },
    },
    hi: {
        translation: {
            // Sidebar (Hindi)
            scanYourCrop: 'अपनी फसल को स्कैन करें',
            home: 'होम',
            cropCalendar: 'फसल कैलेंडर',
            exportData: 'डेटा निर्यात करें',
            helpFaq: 'सहायता और FAQ',
            quickStats: 'त्वरित आँकड़े',
            totalScans: 'कुल स्कैन',
            activeAlerts: 'सक्रिय अलर्ट',
            detectingLocation: 'स्थान का पता लगाया जा रहा है...',
            enableLocation: 'स्थान की अनुमति दें',
            language: 'भाषा',

            // Days of week (Hindi)
            monday: 'सोमवार',
            tuesday: 'मंगलवार',
            wednesday: 'बुधवार',
            thursday: 'गुरुवार',
            friday: 'शुक्रवार',
            saturday: 'शनिवार',
            sunday: 'रविवार',

            // Dashboard (Hindi)
            goodMorning: 'सुप्रभात',
            goodAfternoon: 'नमस्ते',
            goodEvening: 'शुभ संध्या',
            todaysPriority: 'आज की प्राथमिकता',
            allClear: 'सब ठीक है!',
            noUrgentTasks: 'आज के लिए कोई जरूरी काम नहीं। आपका खेत स्वस्थ दिख रहा है।',
            recentActivity: 'हाल की गतिविधि',
            noScans: 'अभी तक कोई स्कैन इतिहास नहीं',
            startFirstScan: 'अपनी फसलों को ट्रैक करने के लिए पहला स्कैन शुरू करें',

            // Calendar (Hindi)
            planSchedule: 'अपनी बुवाई और कटाई का कार्यक्रम बनाएं',
            authRequired: 'प्रमाणीकरण आवश्यक',
            signInToAccess: 'फसल कैलेंडर तक पहुंचने के लिए कृपया साइन इन करें',
            allCrops: 'सभी फसलें',
            days: 'दिन',
            growthStages: 'विकास चरण',

            // Common (Hindi)
            loading: 'लोड हो रहा है...',
            retry: 'पुनः प्रयास करें',
            goToDashboard: 'डैशबोर्ड पर जाएं',
        },
    },
    mr: {
        translation: {
            // Sidebar (Marathi)
            scanYourCrop: 'तुमच्या पिकाचे स्कॅन करा',
            home: 'मुख्यपृष्ठ',
            cropCalendar: 'पीक कॅलेंडर',
            exportData: 'डेटा निर्यात करा',
            helpFaq: 'मदत आणि FAQ',
            quickStats: 'जलद आकडेवारी',
            totalScans: 'एकूण स्कॅन',
            activeAlerts: 'सक्रिय सूचना',
            detectingLocation: 'स्थान शोधत आहे...',
            enableLocation: 'स्थान परवानगी द्या',
            language: 'भाषा',

            // Days of week (Marathi)
            monday: 'सोमवार',
            tuesday: 'मंगळवार',
            wednesday: 'बुधवार',
            thursday: 'गुरुवार',
            friday: 'शुक्रवार',
            saturday: 'शनिवार',
            sunday: 'रविवार',

            // Dashboard (Marathi)
            goodMorning: 'सुप्रभात',
            goodAfternoon: 'नमस्कार',
            goodEvening: 'शुभ संध्याकाळ',
            todaysPriority: 'आजची प्राथमिकता',
            allClear: 'सर्व ठीक आहे!',
            noUrgentTasks: 'आजसाठी काही तातडीचे काम नाही. तुमचे शेत निरोगी दिसत आहे।',
            recentActivity: 'अलीकडील क्रियाकलाप',
            noScans: 'अद्याप स्कॅन इतिहास नाही',
            startFirstScan: 'तुमच्या पिकांचा मागोवा घेण्यासाठी पहिले स्कॅन सुरू करा',

            // Calendar (Marathi)
            planSchedule: 'तुमचे पेरणी आणि कापणी वेळापत्रक तयार करा',
            authRequired: 'प्रमाणीकरण आवश्यक',
            signInToAccess: 'पीक कॅलेंडर पाहण्यासाठी कृपया साइन इन करा',
            allCrops: 'सर्व पिके',
            days: 'दिवस',
            growthStages: 'वाढीचे टप्पे',

            // Common (Marathi)
            loading: 'लोड होत आहे...',
            retry: 'पुन्हा प्रयत्न करा',
            goToDashboard: 'डॅशबोर्डवर जा',
        },
    },
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'en', // default language
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false, // React already escapes values
        },
    });

export default i18n;
