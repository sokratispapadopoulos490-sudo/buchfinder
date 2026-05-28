/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import Account from './pages/Account';
import BookDiscover from './pages/BookDiscover';
import BookSearch from './pages/BookSearch';
import Challenges from './pages/Challenges';
import ClubDetail from './pages/ClubDetail';
import Clubs from './pages/Clubs';
import Community from './pages/Community';
import Compass from './pages/Compass';
import Home from './pages/Home';
import Legal from './pages/Legal';
import Moderation from './pages/Moderation';
import Onboarding from './pages/Onboarding';
import Premium from './pages/Premium';
import PublicProfile from './pages/PublicProfile';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Account": Account,
    "BookDiscover": BookDiscover,
    "BookSearch": BookSearch,
    "Challenges": Challenges,
    "ClubDetail": ClubDetail,
    "Clubs": Clubs,
    "Community": Community,
    "Compass": Compass,
    "Home": Home,
    "Legal": Legal,
    "Moderation": Moderation,
    "Onboarding": Onboarding,
    "Premium": Premium,
    "PublicProfile": PublicProfile,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};