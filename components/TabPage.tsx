import React, { useEffect, useState } from 'react';
import { TabID } from '../App';

interface TabItem {
  label: string;
  category: string;
}

interface TabContent {
  title: string;
  description: string;
  items: TabItem[];
}

interface TabPageProps {
  tabId: TabID;
  onBack: () => void;
  onTabChange?: (tabId: TabID) => void;
}

// --- Constants ---
const ROSTER_CAP = 10;

// --- Helper to find parent navigation tab ---
const getParentTab = (tabId: TabID): TabID => {
  if (typeof tabId === 'string' && tabId.startsWith('team-')) return 'more';

  const parentMap: Partial<Record<TabID, TabID>> = {
    'college': 'more',
    'rosters': 'more',
    'applications': 'more',
    'partner-hub': 'more',
    'rules': 'more',
    'hall-of-fame': 'legacy',
    'league-history': 'legacy'
  };
  return parentMap[tabId] || tabId;
};

// --- Roster Data Types ---
interface RosterMember {
  name: string;
  role: 'FO' | 'Player';
  status: 'active' | 'inactive';
}

const teamRosterData: Record<string, RosterMember[]> = {
  clippers: [
    { name: 'jomz', role: 'FO', status: 'active' },
    { name: '1luv', role: 'Player', status: 'active' },
    { name: 'pansho', role: 'Player', status: 'active' },
    { name: 'bum', role: 'Player', status: 'active' },
    { name: 'coves', role: 'Player', status: 'active' },
    { name: 'abel', role: 'Player', status: 'active' },
    { name: 'rahbizzy', role: 'Player', status: 'active' },
    { name: 'polar', role: 'Player', status: 'active' },
    { name: 'chxno', role: 'Player', status: 'active' },
    { name: 'gmz', role: 'Player', status: 'active' },
  ],
  nuggets: [
    { name: 'doge', role: 'FO', status: 'active' },
    { name: 'roundy', role: 'Player', status: 'active' },
    { name: 'trex', role: 'Player', status: 'active' },
    { name: 'talent', role: 'Player', status: 'active' },
    { name: 'virnadol', role: 'Player', status: 'active' },
  ],
  lakers: [
    { name: 'sinful', role: 'FO', status: 'active' },
    { name: '3tomo', role: 'Player', status: 'active' },
    { name: 'nacho', role: 'Player', status: 'active' },
    { name: 'aym8', role: 'Player', status: 'active' },
    { name: 'memee', role: 'Player', status: 'active' },
    { name: 'punkmonk', role: 'Player', status: 'active' },
    { name: 'jamal', role: 'Player', status: 'active' },
  ]
};

// --- Active Teams with Roster Pages ---
const activeTeams: Record<string, string> = {
  'clippers': 'Los Angeles Clippers',
  'mavericks': 'Dallas Mavericks',
  'nuggets': 'Denver Nuggets',
  'lakers': 'Los Angeles Lakers',
  'grizzlies': 'Memphis Grizzlies',
  'timberwolves': 'Minnesota Timberwolves',
  'thunder': 'Oklahoma City Thunder',
  'hawks': 'Atlanta Hawks',
  'celtics': 'Boston Celtics',
  'bulls': 'Chicago Bulls',
  'heat': 'Miami Heat',
  'bucks': 'Milwaukee Bucks',
  'magic': 'Orlando Magic',
  'raptors': 'Toronto Raptors'
};

// --- Team Colors Mapping ---
const teamColors: Record<string, string> = {
  'clippers': '#1D428A',
  'mavericks': '#00538C',
  'nuggets': '#0E2240',
  'lakers': '#552583',
  'grizzlies': '#5D76A9',
  'timberwolves': '#0C2340',
  'thunder': '#007AC1',
  'hawks': '#E03A3E',
  'celtics': '#007A33',
  'bulls': '#CE1141',
  'heat': '#98002E',
  'bucks': '#00471B',
  'magic': '#0077C0',
  'raptors': '#CE1141'
};

// Map short names used in the list to slugs for internal routing
const teamToSlug: Record<string, string> = {
  'Clippers': 'clippers',
  'Mavericks': 'mavericks',
  'Nuggets': 'nuggets',
  'Lakers': 'lakers',
  'Grizzlies': 'grizzlies',
  'Timberwolves': 'timberwolves',
  'Thunder': 'thunder',
  'Hawks': 'hawks',
  'Celtics': 'celtics',
  'Bulls': 'bulls',
  'Heat': 'heat',
  'Bucks': 'bucks',
  'Magic': 'magic',
  'Raptors': 'raptors'
};

// --- Hall of Fame Data ---
interface HOFMember {
  name: string;
  awards?: string[];
  stats?: string;
}

const hallOfFameMembers: HOFMember[] = [
  { 
    name: 'Pansho',
    awards: ['HOF', '5x CHAMP', '1x MVP', '2x FMVP', '3x OPOTY', '1x ROTY', '4x AS', '7x POTS', '25x+ POTG', '13x DPOTG'],
    stats: '2,278 PTS • 341 AST • 134 REB • 177 STL'
  },
  { 
    name: 'Tend',
    awards: ['HOF', '2x CHAMP'],
    stats: 'PENDING'
  },
  { name: 'Packed' },
  { name: 'Marsh' },
  { name: 'Dannygreen' },
  { name: '1luv' },
  { name: 'Rah' },
  { name: 'Dre' }
];

const eligibilityRules = [
  '1x Championship Ring',
  '2x Finals Appearances',
  '25x+ Total POTG / DPOTG',
  '4x Seasons Played',
  '5x Awards',
  'Ring Riding does not count'
];

// --- Team Rosters List (Filtered to active teams only) ---
const teamRosterList = [
  'Clippers', 'Mavericks', 'Nuggets', 'Lakers', 'Grizzlies', 'Timberwolves', 'Thunder', 'Hawks', 'Celtics', 'Bulls', 'Heat', 'Bucks', 'Magic', 'Raptors'
];

// --- Schedule Data Definition ---
const scheduleData = [
  {
    week: 4,
    games: [
      {
        title: 'Game 1',
        matchups: [
          'Dallas Mavericks @ Los Angeles Lakers',
          'Minnesota Timberwolves @ Chicago Bulls',
          'Los Angeles Clippers @ Miami Heat',
          'Boston Celtics @ Milwaukee Bucks',
          'Oklahoma City Thunder @ Toronto Raptors',
          'Memphis Grizzlies @ Atlanta Hawks',
          'Denver Nuggets @ Orlando Magic'
        ]
      },
      {
        title: 'Game 2',
        matchups: [
          'Orlando Magic @ Oklahoma City Thunder',
          'Milwaukee Bucks @ Memphis Grizzlies',
          'Miami Heat @ Minnesota Timberwolves',
          'Toronto Raptors @ Los Angeles Clippers',
          'Los Angeles Lakers @ Denver Nuggets',
          'Atlanta Hawks @ Boston Celtics',
          'Chicago Bulls @ Dallas Mavericks'
        ]
      }
    ]
  },
  {
    week: 3,
    games: [
      {
        title: 'Game 1',
        matchups: [
          'Los Angeles Lakers @ Boston Celtics',
          'Memphis Grizzlies @ Orlando Magic',
          'Denver Nuggets @ Chicago Bulls',
          'Toronto Raptors @ Miami Heat',
          'Dallas Mavericks @ Minnesota Timberwolves',
          'Atlanta Hawks @ Milwaukee Bucks',
          'Los Angeles Clippers @ Oklahoma City Thunder'
        ]
      },
      {
        title: 'Game 2',
        matchups: [
          'Chicago Bulls @ Los Angeles Lakers',
          'Orlando Magic @ Atlanta Hawks',
          'Oklahoma City Thunder @ Denver Nuggets',
          'Milwaukee Bucks @ Toronto Raptors',
          'Boston Celtics @ Dallas Mavericks',
          'Miami Heat @ Memphis Grizzlies',
          'Minnesota Timberwolves @ Los Angeles Clippers'
        ]
      }
    ]
  },
  {
    week: 2,
    games: [
      {
        title: 'Game 1',
        matchups: [
          'Minnesota Timberwolves @ Boston Celtics',
          'Toronto Raptors @ Orlando Magic',
          'Los Angeles Clippers @ Chicago Bulls',
          'Denver Nuggets @ Miami Heat',
          'Milwaukee Bucks @ Oklahoma City Thunder',
          'Atlanta Hawks @ Dallas Mavericks',
          'Los Angeles Lakers @ Memphis Grizzlies'
        ]
      },
      {
        title: 'Game 2',
        matchups: [
          'Boston Celtics @ Denver Nuggets',
          'Orlando Magic @ Minnesota Timberwolves',
          'Chicago Bulls @ Atlanta Hawks',
          'Memphis Grizzlies @ Toronto Raptors',
          'Oklahoma City Thunder @ Los Angeles Lakers',
          'Dallas Mavericks @ Los Angeles Clippers',
          'Miami Heat @ Milwaukee Bucks'
        ]
      }
    ]
  },
  {
    week: 1,
    games: [
      {
        title: 'Game 1',
        matchups: [
          'Orlando Magic @ Boston Celtics',
          'Miami Heat @ Chicago Bulls',
          'Oklahoma City Thunder @ Denver Nuggets',
          'Memphis Grizzlies @ Dallas Mavericks',
          'Los Angeles Clippers @ Milwaukee Bucks',
          'Toronto Raptors @ Los Angeles Lakers',
          'Atlanta Hawks @ Minnesota Timberwolves'
        ]
      },
      {
        title: 'Game 2',
        matchups: [
          'Dallas Mavericks @ Denver Nuggets',
          'Chicago Bulls @ Memphis Grizzlies',
          'Milwaukee Bucks @ Orlando Magic',
          'Boston Celtics @ Miami Heat',
          'Minnesota Timberwolves @ Los Angeles Clippers',
          'Oklahoma City Thunder @ Toronto Raptors',
          'Los Angeles Lakers @ Atlanta Hawks'
        ]
      }
    ]
  }
];

// --- Rules Data ---
const rulesData = [
  {
    id: 'server',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6" y2="6"/><line x1="6" y1="18" x2="6" y2="18"/>
      </svg>
    ),
    title: 'Server Rules',
    content: [
      'No NSFW content',
      'No advertising or promoting',
      'No spamming',
      'User information must remain confidential',
      'Follow the Discord Community Guidelines'
    ]
  },
  {
    id: 'franchise',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/>
      </svg>
    ),
    title: 'Franchise Rules',
    content: [
      'You may only play on 1 team per schedule release',
      'No loans',
      'Leaving the server to bypass the demand cooldown will result in a suspension'
    ]
  },
  {
    id: 'setup',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
      </svg>
    ),
    title: 'Setup Rules',
    content: [
      '4v4 only',
      'Mercy must always be on',
      'All games must be played on North American servers',
      'You must take the ball out of bounds to start the game',
      'A team has 15 minutes to join after the code is sent',
      'Excessive ball skins, effects, or emotes are not allowed (FOV-changing or large visual effects)',
      'You may not waste time by calling unnecessary timeouts'
    ]
  },
  {
    id: 'court',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>
      </svg>
    ),
    title: 'Cherry Picking & Court Rules',
    content: [
      {
        text: 'No cherry picking or inbounding to the opposite half unless:',
        subRules: ['The ball went out of bounds', 'Off a rebound', 'A new quarter has begun']
      },
      'Cherry picking is allowed with under 10 seconds left in any quarter'
    ]
  },
  {
    id: 'timeout',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    title: 'Timeout Rules',
    content: [
      'Each team is allowed 3 timeouts',
      'Each timeout lasts 3 minutes',
      'Going over 3 minutes causes timeouts to stack',
      'After a timeout, the ball must be cleared backcourt on the inbound'
    ]
  },
  {
    id: 'pccheck',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
    title: 'PC Checking Rules',
    content: [
      'PC checks may be requested during a game with a clip showing suspicious behavior',
      'You do not need a clip to check for alting',
      'PC checks cannot be called in the 4th quarter unless the clip is obvious',
      'PC checks must be conducted by an official PC checker',
      'Leaving after being asked for a PC check results in an FFL',
      'Recently clearing shellbags results in an FFL'
    ]
  },
  {
    id: 'suspension',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
    title: 'Suspension-Level Offenses',
    content: [
      'Advertising or sending cheats',
      'Reporting an account to Infinity Sports for ban evasion',
      'Using macros, cheats, FPS uncapping, bootstrappers, or fastflags',
      'Gifting boxes to a player in action'
    ]
  },
  {
    id: 'ban',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
      </svg>
    ),
    title: 'Ban-Level Offenses',
    content: [
      'DDoSing or intentionally interrupting a game',
      'Repeated offenses'
    ]
  }
];

// --- Standings Data ---
const westernStandings = [
  { rank: 1, team: 'Los Angeles Clippers', w: 7, l: 0, gb: '0' },
  { rank: 2, team: 'Dallas Mavericks', w: 5, l: 1, gb: '1.0' },
  { rank: 3, team: 'Los Angeles Lakers', w: 4, l: 2, gb: '2.0' },
  { rank: 4, team: 'Denver Nuggets', w: 4, l: 3, gb: '2.0' },
  { rank: 5, team: 'Memphis Grizzlies', w: 2, l: 6, gb: '5.0' },
  { rank: 6, team: 'Minnesota Timberwolves', w: 0, l: 6, gb: '6.0' },
  { rank: 7, team: 'Oklahoma City Thunder', w: 0, l: 8, gb: '7.0' }
];

const easternStandings = [
  { rank: 1, team: 'Toronto Raptors', w: 6, l: 2, gb: '0' },
  { rank: 2, team: 'Milwaukee Bucks', w: 6, l: 2, gb: '1.0' },
  { rank: 3, team: 'Chicago Bulls', w: 4, l: 2, gb: '1.5' },
  { rank: 4, team: 'Orlando Magic', w: 5, l: 3, gb: '2.0' },
  { rank: 5, team: 'Miami Heat', w: 3, l: 3, gb: '2.5' },
  { rank: 6, team: 'Boston Celtics', w: 3, l: 5, gb: '4.0' },
  { rank: 7, team: 'Atlanta Hawks', w: 1, l: 7, gb: '4.5' }
];

// --- College Data ---
const collegeStandings = [
  { rank: 1, tag: 'DAL', team: 'Duke', record: '2-0' },
  { rank: 2, tag: 'ORL', team: 'BYU', record: '2-0' },
  { rank: 3, tag: 'IND', team: 'WVU', record: '1-1' },
  { rank: 4, tag: 'NOP', team: 'Purdue', record: '1-1' },
  { rank: 5, tag: 'MIA', team: 'Texas A&M', record: '1-1' },
  { rank: 6, tag: 'LAC', team: 'UConn', record: '1-1' },
  { rank: 7, tag: 'MIN', team: 'Kentucky', record: '0-2' },
  { rank: 8, tag: 'CHI', team: 'Utah Utes', record: '0-2' }
];

const collegeStats = [
  { player: 'Ken', pts: 98, ast: 9, reb: 4, stl: 2 },
  { player: 'Roundy', pts: 80, ast: 5, reb: 7, stl: 6 },
  { player: 'Frq', pts: 60, ast: 10, reb: 1, stl: 3 },
  { player: 'Chicken', pts: 56, ast: 23, reb: 3, stl: 10 },
  { player: 'Kevo', pts: 55, ast: 8, reb: 1, stl: 10 },
  { player: 'Punkmonk', pts: 53, ast: 11, reb: 6, stl: 0 },
  { player: 'Faded', pts: 52, ast: 14, reb: 2, stl: 8 },
  { player: 'Green', pts: 42, ast: 36, reb: 15, stl: 7 },
  { player: 'Tomo', pts: 41, ast: 4, reb: 0, stl: 1 },
  { player: 'Chris', pts: 40, ast: 7, reb: 2, stl: 5 },
  { player: 'Soulz', pts: 37, ast: 7, reb: 4, stl: 2 },
  { player: 'Demon2', pts: 37, ast: 2, reb: 4, stl: 2 },
  { player: 'Neil', pts: 35, ast: 12, reb: 5, stl: 6 },
  { player: 'Cam', pts: 33, ast: 8, reb: 4, stl: 5 },
  { player: 'Morgana', pts: 28, ast: 0, reb: 0, stl: 1 },
  { player: 'Bleu', pts: 28, ast: 1, reb: 0, stl: 1 },
  { player: 'Jomz', pts: 28, ast: 9, reb: 2, stl: 2 },
  { player: 'Jack', pts: 24, ast: 1, reb: 3, stl: 0 },
  { player: 'Jake', pts: 24, ast: 21, reb: 1, stl: 4 },
  { player: 'Seeker', pts: 21, ast: 20, reb: 2, stl: 5 },
  { player: 'Xid', pts: 17, ast: 8, reb: 3, stl: 1 },
  { player: 'Coves', pts: 15, ast: 22, reb: 5, stl: 2 },
  { player: 'Max', pts: 12, ast: 26, reb: 4, stl: 5 },
  { player: 'Blixer', pts: 9, ast: 6, reb: 1, stl: 1 },
  { player: 'Y2', pts: 7, ast: 2, reb: 3, stl: 1 },
  { player: 'Colt', pts: 3, ast: 10, reb: 3, stl: 0 },
  { player: 'Viro', pts: 0, ast: 9, reb: 0, stl: 0 }
];

// --- Team Name Mapping for Mobile ---
const teamShortNames: Record<string, string> = {
  'Oklahoma City Thunder': 'Thunder',
  'Los Angeles Lakers': 'Lakers',
  'Los Angeles Clippers': 'Clippers',
  'Minnesota Timberwolves': 'Timberwolves',
  'Denver Nuggets': 'Nuggets',
  'Dallas Mavericks': 'Mavericks',
  'Miami Heat': 'Heat',
  'Chicago Bulls': 'Bulls',
  'Boston Celtics': 'Celtics',
  'Milwaukee Bucks': 'Bucks',
  'Toronto Raptors': 'Raptors',
  'Orlando Magic': 'Magic',
  'Memphis Grizzlies': 'Grizzlies',
  'Atlanta Hawks': 'Hawks'
};

const TabPage: React.FC<TabPageProps> = ({ tabId, onBack, onTabChange }) => {
  const [openWeeks, setOpenWeeks] = useState<number[]>([4]);
  const [easterEggIndex, setEasterEggIndex] = useState(0);
  const [rosterSearchQuery, setRosterSearchQuery] = useState('');

  const easterEggMessages = [
    "carefully created by jomz",
    "pansho is the goat",
    "1luv has so much aura",
    "drexel is so tuff veiny",
    "rah loves minors"
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
    // Reset search when changing team
    setRosterSearchQuery('');
  }, [tabId]);

  const toggleWeek = (week: number) => {
    setOpenWeeks(prev => 
      prev.includes(week) ? prev.filter(w => w !== week) : [...prev, week]
    );
  };

  const subPages: TabID[] = ['college', 'rosters', 'applications', 'partner-hub', 'rules', 'hall-of-fame', 'league-history'];
  const isSubPage = subPages.includes(tabId);
  
  const isCollege = tabId === 'college';
  const isHOF = tabId === 'hall-of-fame';
  const isLegacy = tabId === 'legacy';
  const isTeamPage = typeof tabId === 'string' && tabId.startsWith('team-');
  
  const accentText = isHOF ? 'text-[#D4AF37]' : (isCollege ? 'text-[#0EA5E9]' : 'text-[#D60A07]');
  const accentBg = isHOF ? 'bg-[#D4AF37]' : (isCollege ? 'bg-[#0EA5E9]' : 'bg-[#D60A07]');
  const accentShadow = isHOF ? 'hover:shadow-[#D4AF37]/5' : (isCollege ? 'hover:shadow-[#0EA5E9]/5' : 'hover:shadow-[#D60A07]/5');
  const accentBgSoft = isHOF ? 'bg-[#D4AF37]/10' : (isCollege ? 'bg-[#0EA5E9]/5' : 'bg-[#D60A07]/5');

  const formatWinPct = (w: number, l: number) => {
    if (w + l === 0) return '.000';
    const pct = (w / (w + l)).toFixed(3);
    return pct.startsWith('0') ? pct.substring(1) : pct;
  };

  const handleBackNavigation = () => {
    if (isTeamPage && onTabChange) {
      onTabChange('rosters');
      return;
    }
    const legacySubPages: TabID[] = ['hall-of-fame', 'league-history'];
    if (legacySubPages.includes(tabId) && onTabChange) {
      onTabChange('legacy');
    } else if (isSubPage && onTabChange) {
      onTabChange('more');
    } else {
      onBack();
    }
  };

  const contentMap: Record<string, TabContent> = {
    standings: {
      title: 'League Standings',
      description: 'current competitive landscape of the nbll.',
      items: [] 
    },
    schedule: {
      title: 'league schedule',
      description: 'collapsable week-by-week matchups.',
      items: [] 
    },
    stats: {
      title: 'Player Statistics',
      description: 'In-depth performance metrics and historical data analysis.',
      items: []
    },
    legacy: {
      title: 'The Legacy Vault',
      description: "all players' career legacy values & more.",
      items: [
        { label: 'Hall of Fame', category: 'Greats' },
        { label: 'League History', category: 'History' }
      ]
    },
    'hall-of-fame': {
      title: 'hall of fame',
      description: 'celebrating the legends who defined the game.',
      items: []
    },
    'league-history': {
      title: 'league history',
      description: 'coming soon.',
      items: []
    },
    rules: {
      title: 'Rules',
      description: 'League policies, gameplay settings, and enforcement.',
      items: [] 
    },
    more: {
      title: 'Discover More',
      description: 'Explore the peripheral ecosystem of the NBLL.',
      items: [
        { label: 'College', category: 'Pathway' },
        { label: 'Rosters', category: 'Teams' },
        { label: 'Applications', category: 'Registry' },
        { label: 'Rules', category: 'Official' }
      ]
    },
    college: {
      title: 'College Circuit',
      description: 'Scouting the next generation of legends from the collegiate ranks.',
      items: [] 
    },
    rosters: {
      title: 'Team Rosters',
      description: 'select a team to view their personnel.',
      items: [] 
    },
    applications: {
      title: 'League Applications',
      description: 'coming soon.',
      items: []
    },
    'partner-hub': {
      title: 'Partner Hub',
      description: 'The official network for NBLL affiliates and strategic partners.',
      items: [
        { label: 'Sponsor Portal', category: 'Network' },
        { label: 'Brand Assets', category: 'Media' }
      ]
    }
  };

  const getPageContent = () => {
    if (isTeamPage) {
      const slug = tabId.replace('team-', '');
      const teamName = activeTeams[slug] || 'Team Roster';
      return {
        title: teamName,
        description: teamRosterData[slug] ? 'official team personnel listing.' : 'Roster coming soon.',
        items: []
      };
    }
    return contentMap[tabId] || { 
      title: tabId.charAt(0).toUpperCase() + tabId.slice(1), 
      description: 'Information regarding this section is currently being updated.',
      items: []
    };
  };

  const page = getPageContent();

  const handleItemClick = (label: string) => {
    const slugMap: Record<string, TabID> = {
      'college': 'college',
      'rosters': 'rosters',
      'applications': 'applications',
      'rules': 'rules',
      'hall of fame': 'hall-of-fame',
      'league history': 'league-history'
    };
    
    const target = slugMap[label.toLowerCase()] || label.toLowerCase() as TabID;
    const validTabs: TabID[] = ['standings', 'schedule', 'stats', 'legacy', 'rules', 'more', 'college', 'rosters', 'applications', 'partner-hub', 'hall-of-fame', 'league-history'];
    
    if (onTabChange && validTabs.includes(target)) {
      onTabChange(target);
    }
  };

  const getEmbedUrl = () => {
    if (tabId === 'stats') return 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ40oM4VxQKSbZoD6NQXO3vb9GYVP6bQvZczPVAYaw-6lcLsGlWIdEhJUshk2lOe5wp2flh3QsLP4As/pubhtml?gid=0&single=true&widget=true&headers=false';
    return null;
  };

  const embedUrl = getEmbedUrl();

  const RulesAccordion: React.FC<{ section: typeof rulesData[0] }> = ({ section }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className={`border border-zinc-100 rounded-2xl overflow-hidden bg-white shadow-sm mb-4`}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-zinc-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className={accentText}>{section.icon}</span>
            <span className="text-lg font-bold text-zinc-900 tracking-tight">{section.title}</span>
          </div>
          <svg className={`w-5 h-5 text-zinc-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        {isOpen && (
          <div className="px-6 pb-6 pt-2 animate-page-enter">
            <ul className="space-y-4">
              {section.content.map((item, idx) => {
                if (typeof item === 'string') {
                  return (
                    <li key={idx} className="flex gap-3 text-zinc-600 font-medium">
                      <span className={`w-1.5 h-1.5 rounded-full ${accentBg} shrink-0 mt-2`} />
                      <span>{item}</span>
                    </li>
                  );
                } else {
                  return (
                    <li key={idx} className="space-y-2">
                      <div className="flex gap-3 text-zinc-900 font-bold">
                        <span className={`w-1.5 h-1.5 rounded-full ${accentBg} shrink-0 mt-2`} />
                        <span>{item.text}</span>
                      </div>
                      <ul className="ml-8 space-y-2">
                        {item.subRules.map((sub, sIdx) => (
                          <li key={sIdx} className="flex gap-3 text-zinc-500 font-medium italic text-sm">
                            <span className="text-zinc-300">—</span>
                            <span>{sub}</span>
                          </li>
                        ))}
                      </ul>
                    </li>
                  );
                }
              })}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const getTeamSlug = () => (typeof tabId === 'string' ? tabId.replace('team-', '') : '');
  const teamSlug = isTeamPage ? getTeamSlug() : '';
  const teamColor = teamColors[teamSlug] || '#D60A07';
  const currentRoster = teamRosterData[teamSlug] || [];

  const filteredRoster = currentRoster
    .filter(m => m.name.toLowerCase().includes(rosterSearchQuery.toLowerCase()))
    .sort((a, b) => {
      // Role sorting: FO first
      if (a.role === 'FO' && b.role !== 'FO') return -1;
      if (a.role !== 'FO' && b.role === 'FO') return 1;
      // Alphabetical secondary sort
      return a.name.localeCompare(b.name);
    });

  return (
    <div className={`min-h-screen bg-white pt-32 pb-20 px-4 md:px-6 animate-page-enter`}>
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Breadcrumb / Back */}
        <button 
          onClick={handleBackNavigation}
          className={`group flex items-center gap-2 ${accentText} font-bold text-sm tracking-widest uppercase hover:opacity-70 transition-all`}
          style={isTeamPage ? { color: teamColor } : {}}
        >
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          {isTeamPage ? 'rosters' : (isSubPage ? (getParentTab(tabId) === 'legacy' ? 'legacy' : 'more') : 'home')}
        </button>

        {/* Content Header */}
        <div className="space-y-4">
          <h2 className={`text-4xl md:text-6xl font-black tracking-tighter ${isHOF ? 'text-[#D4AF37]' : (isCollege ? 'text-black' : 'text-zinc-900')}`}>
            {page.title.toLowerCase()}
          </h2>
          <p className={`text-lg md:text-xl font-medium max-w-2xl ${isHOF ? 'text-[#D4AF37]/80' : (isCollege ? 'text-zinc-800' : 'text-zinc-500')}`}>
            {page.description.toLowerCase()}
          </p>
        </div>

        {/* Dynamic Team Roster View */}
        {isTeamPage && (
          <div className="animate-page-enter space-y-8">
            {teamRosterData[teamSlug] ? (
              <>
                {/* Personnel Dashboard Controls */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-zinc-100">
                  <div className="relative flex-1 max-w-md">
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" style={{ color: `${teamColor}40` }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                       <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input 
                      type="text" 
                      placeholder="search personnel..."
                      value={rosterSearchQuery}
                      onChange={(e) => setRosterSearchQuery(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-100 rounded-xl py-3 pl-12 pr-4 text-sm font-bold text-zinc-900 outline-none focus:ring-2 transition-all placeholder:text-zinc-300"
                      style={{ '--tw-ring-color': `${teamColor}20` } as any}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300">roster cap</span>
                    <div className="h-1.5 w-32 bg-zinc-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-1000" style={{ backgroundColor: teamColor, width: `${(currentRoster.length / ROSTER_CAP) * 100}%` }} />
                    </div>
                    <span className="text-[10px] font-black text-zinc-900">{currentRoster.length}/{ROSTER_CAP}</span>
                  </div>
                </div>

                {/* Personnel List */}
                <div className="bg-white border border-zinc-100 rounded-[2rem] overflow-hidden shadow-sm">
                  <div className="grid grid-cols-[1fr_7rem_4rem] md:grid-cols-[1fr_12rem_4rem_6rem] px-6 py-4 bg-zinc-50/50 border-b border-zinc-100 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                    <div>name</div>
                    <div>role</div>
                    <div className="hidden md:block text-center">status</div>
                    <div className="text-right">actions</div>
                  </div>
                  <div className="divide-y divide-zinc-50">
                    {filteredRoster.map((member, idx) => (
                      <div 
                        key={idx} 
                        className={`grid grid-cols-[1fr_7rem_4rem] md:grid-cols-[1fr_12rem_4rem_6rem] px-6 py-5 items-center transition-colors hover:bg-zinc-50/30 group ${member.role === 'FO' ? 'bg-zinc-50/10' : ''}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-zinc-900">{member.name}</span>
                          {member.role === 'FO' && (
                            <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest text-white shadow-sm" style={{ backgroundColor: teamColor }}>FO</span>
                          )}
                        </div>
                        <div className="text-[10px] font-black text-zinc-400 uppercase tracking-wider">
                          {member.role === 'FO' ? 'FRANCHISE OWNER' : 'Player'}
                        </div>
                        <div className="hidden md:flex justify-center">
                          <div className={`w-2 h-2 rounded-full ${member.status === 'active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-zinc-200'}`} />
                        </div>
                        <div className="flex justify-end">
                           <button 
                             className="text-[9px] font-black uppercase tracking-widest text-zinc-300 hover:text-zinc-900 transition-colors py-1 px-2 border border-zinc-100 rounded-lg group-hover:border-zinc-200"
                             style={{ '--hover-color': teamColor } as any}
                           >
                             view
                           </button>
                        </div>
                      </div>
                    ))}
                    {filteredRoster.length === 0 && (
                      <div className="py-20 text-center">
                        <p className="text-zinc-300 font-bold italic">No personnel matches found.</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
                <div className={`w-20 h-20 rounded-full ${accentBgSoft} flex items-center justify-center`}>
                  <svg className={`w-10 h-10 ${accentText}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-zinc-900 uppercase tracking-tighter">Personnel Pending</h3>
                  <p className="text-zinc-400 font-medium max-w-md mx-auto">This team's official roster is currently being synchronized with the league database.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Hall of Fame Specialized View */}
        {tabId === 'hall-of-fame' ? (
          <div className="space-y-16 animate-page-enter">
            {/* Eligibility Section */}
            <div className="bg-zinc-50 border border-zinc-100 rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 shadow-sm border-l-[6px] border-l-[#D4AF37]">
              <div className="flex items-center gap-3 mb-6">
                <div className={`${accentText}`}>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-black text-zinc-900 uppercase tracking-tight">Eligibility</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                {eligibilityRules.map((rule, idx) => (
                  <div key={idx} className="flex items-center gap-3 py-1 group transition-all">
                    <span className={`w-1 h-1 rounded-full ${accentBg} shrink-0 opacity-60`} />
                    <span className="text-[13px] md:text-[14px] font-bold text-zinc-700 tracking-tight leading-tight">{rule}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Inducted Members Section */}
            <div className="space-y-10">
              <div className="flex items-center gap-4">
                <h3 className="text-3xl font-black text-zinc-900 uppercase tracking-tighter">Inducted Members</h3>
                <div className="h-px bg-zinc-100 flex-1" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
                {hallOfFameMembers.map((member, idx) => (
                  <div 
                    key={idx} 
                    className="group relative bg-white border-2 border-zinc-100 rounded-[2rem] overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-2xl hover:-translate-y-2 hover:border-[#D4AF37] cursor-default flex flex-col h-full"
                  >
                    <div className="aspect-[16/11] bg-zinc-50 relative overflow-hidden shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 via-zinc-200 to-zinc-300 opacity-50" />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-[11px] font-black text-[#D4AF37]/50 uppercase tracking-[0.2em] text-center px-4">Image coming soon</span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-[#D4AF37]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute top-4 right-4 px-3 py-1 bg-white/80 backdrop-blur-md rounded-full border border-zinc-200">
                        <span className="text-[10px] font-black text-zinc-400 tracking-widest uppercase">legend</span>
                      </div>
                      <div className="absolute bottom-4 left-6 right-6">
                        <h4 className="text-2xl font-black text-zinc-900 tracking-tighter group-hover:text-[#D4AF37] transition-colors drop-shadow-sm">
                          {member.name}
                        </h4>
                      </div>
                    </div>
                    <div className="p-6 bg-white border-t border-zinc-50 flex flex-col flex-1">
                      <div className="space-y-4 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-300">Honors</span>
                          <div className={`w-1.5 h-1.5 rounded-full ${member.awards ? 'bg-[#D4AF37]' : 'bg-zinc-200'}`} />
                        </div>
                        {member.awards ? (
                          <div className="flex flex-wrap gap-2.5">
                            {member.awards.map((award, aIdx) => (
                              <span key={aIdx} className="px-2.5 py-1 bg-[#D4AF37]/15 border border-[#D4AF37]/30 rounded-md text-[10px] font-black text-[#D4AF37] uppercase tracking-tight shadow-sm transition-transform hover:scale-105">
                                {award}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs font-bold text-zinc-400 italic">Honors coming soon</p>
                        )}
                      </div>
                      <div className="mt-8">
                        {member.stats ? (
                          <div className="pt-4 border-t border-zinc-50">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-300">All-Time Stats</span>
                            </div>
                            <p className="text-[10px] font-black text-zinc-800 tracking-tight leading-none bg-zinc-50 p-2.5 rounded-lg border border-zinc-100/50">
                              {member.stats}
                            </p>
                          </div>
                        ) : (
                          <div className="pt-4 border-t border-zinc-50">
                            <div className="flex flex-wrap gap-2 h-8 items-center">
                              <div className="w-6 h-6 rounded-full bg-zinc-100 border border-dashed border-zinc-200 flex items-center justify-center">
                                <span className="text-[8px] text-zinc-300">+</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-8 border-t border-zinc-100 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-zinc-400">
              <span className="hover:text-[#D4AF37] transition-colors">© NBLL Hall of Fame</span>
              <span className="hover:text-[#D4AF37] transition-colors">Archives Updated Q4 2025</span>
            </div>
          </div>
        ) : isLegacy ? (
          <div className="space-y-16 animate-page-enter">
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-zinc-900 uppercase tracking-tight">Legacy Sheet</h3>
                <p className="text-sm font-medium text-zinc-400">check back later. rahbizzy is stinky.</p>
              </div>
              <div className="w-full rounded-[2.5rem] overflow-hidden border border-zinc-100 shadow-xl bg-zinc-50 relative aspect-[4/5] md:aspect-video lg:h-[700px] transition-all duration-500 hover:shadow-2xl">
                 <div className="absolute inset-0 flex items-center justify-center flex-col gap-4 text-center p-8">
                    <div className="w-16 h-16 bg-zinc-200/50 rounded-2xl flex items-center justify-center mb-2">
                       <svg className="w-8 h-8 text-zinc-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                          <polyline points="10 9 9 9 8 9" />
                       </svg>
                    </div>
                    <span className="text-lg font-black text-zinc-400 uppercase tracking-widest">Google Sheets Embed (Coming Soon)</span>
                    <p className="text-xs font-bold text-zinc-300 max-w-xs uppercase tracking-tight">Archives from seasons 1 through 10 will be synchronized here.</p>
                 </div>
              </div>
            </div>
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="h-px bg-zinc-100 flex-1" />
                <span className="text-[10px] font-black text-zinc-400 tracking-[0.2em] uppercase">quick navigation</span>
                <div className="h-px bg-zinc-100 flex-1" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {page.items.map((item, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => handleItemClick(item.label)}
                    className="group relative overflow-hidden flex min-h-[160px] text-left transition-all rounded-[2rem] bg-white border border-zinc-100 hover:shadow-2xl hover:-translate-y-1 hover:border-[#D60A07]/20"
                  >
                    <div className="flex-1 p-8 flex flex-col justify-between relative z-10">
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-black text-[#D60A07]/50 tracking-[0.3em] uppercase">
                          {item.category}
                        </span>
                        <h3 className="text-2xl font-black text-zinc-900 tracking-tighter">
                          {item.label.toLowerCase()}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 text-zinc-300 transition-colors font-black text-[10px] uppercase tracking-widest group-hover:text-[#D60A07]">
                        view archives
                        <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </div>
                    </div>
                    <div className="w-[30%] border-l border-zinc-50 bg-zinc-50/20 p-8 flex flex-col justify-end relative transition-all duration-500 ease-out group-hover:bg-zinc-50/50 group-hover:-translate-x-1.5">
                       <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#D60A07] opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                             <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                       </svg>
                    </div>
                  </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : tabId === 'rules' ? (
          <div className="flex flex-col pt-8">
            <div className="w-full max-w-4xl space-y-20">
              <div className="md:hidden">
                {rulesData.map((section) => (
                  <RulesAccordion key={section.id} section={section} />
                ))}
              </div>
              <div className="hidden md:block space-y-20">
                {rulesData.map((section) => (
                  <section key={section.id} id={section.id} className="scroll-mt-48 space-y-8 group">
                    <div className="flex items-center gap-4">
                      <div className={`p-2.5 rounded-xl ${accentBgSoft} ${accentText}`}>
                        {section.icon}
                      </div>
                      <h3 className="text-3xl font-black text-zinc-900 tracking-tight">{section.title}</h3>
                    </div>
                    <div className="bg-white border border-zinc-100 rounded-[2rem] p-8 shadow-sm group-hover:shadow-md transition-shadow">
                      <ul className="space-y-6">
                        {section.content.map((item, idx) => {
                          if (typeof item === 'string') {
                            return (
                              <li key={idx} className="flex gap-4 text-zinc-600 font-medium leading-relaxed">
                                <span className={`w-1.5 h-1.5 rounded-full ${accentBg} shrink-0 mt-2.5 opacity-40`} />
                                <span>{item}</span>
                              </li>
                            );
                          } else {
                            return (
                              <li key={idx} className="space-y-3">
                                <div className="flex gap-4 text-zinc-900 font-bold leading-relaxed">
                                  <span className={`w-1.5 h-1.5 rounded-full ${accentBg} shrink-0 mt-2.5 opacity-40`} />
                                  <span>{item.text}</span>
                                </div>
                                <ul className="ml-10 space-y-3">
                                  {item.subRules.map((sub, sIdx) => (
                                    <li key={sIdx} className="flex gap-3 text-zinc-500 font-medium italic">
                                      <span className="text-zinc-300">/</span>
                                      <span>{sub}</span>
                                    </li>
                                  ))}
                                </ul>
                              </li>
                            );
                          }
                        })}
                      </ul>
                    </div>
                  </section>
                ))}
              </div>
              <div className={`p-8 rounded-[2.5rem] ${accentBgSoft} border ${isCollege ? 'border-sky-100' : (isHOF ? 'border-[#D4AF37]/20' : 'border-[#D60A07]/10')} space-y-4`}>
                <div className="flex items-center gap-3">
                  <svg className={`w-6 h-6 ${accentText}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <h4 className="text-lg font-black text-zinc-900 uppercase tracking-tight">Enforcement Policy</h4>
                </div>
                <p className="text-zinc-600 font-medium leading-relaxed">
                  The League Administration reserves the right to issue warnings, suspensions, or permanent bans based on behavioral patterns. Punishments scale based on severity and repeat offenses.
                </p>
              </div>
              <div className="pt-8 border-t border-zinc-100 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-zinc-400">
                <span>© NBLL</span>
                <span>Last updated: Q4 2025</span>
              </div>
            </div>
          </div>
        ) : tabId === 'standings' ? (
          <div className="space-y-8 md:space-y-16 pt-4 md:pt-8 pb-12">
            {[
              { title: 'Western Conference', data: westernStandings },
              { title: 'Eastern Conference', data: easternStandings }
            ].map((conf) => (
              <div key={conf.title} className="space-y-4 md:space-y-6">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-xl md:text-2xl font-black text-zinc-900 tracking-tight uppercase">
                    {conf.title}
                  </h3>
                  <div className="h-px bg-zinc-100 flex-1 hidden sm:block" />
                </div>
                <div className="bg-white border border-zinc-100 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-sm">
                  <div className="w-full">
                    <div className="grid grid-cols-[2.5rem_1fr_2.5rem_2.5rem_3.5rem] md:grid-cols-[3rem_1fr_4rem_4rem_5rem_4rem] px-4 md:px-6 py-3 md:py-4 bg-zinc-50 border-b border-zinc-100 text-[9px] md:text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                      <div>rank</div>
                      <div>team</div>
                      <div className="text-center">w</div>
                      <div className="text-center">l</div>
                      <div className="hidden md:block text-center">win%</div>
                      <div className="text-right">gb</div>
                    </div>
                    <div className="divide-y divide-zinc-100">
                      {conf.data.map((row) => (
                        <React.Fragment key={row.team}>
                          <div className={`grid grid-cols-[2.5rem_1fr_2.5rem_2.5rem_3.5rem] md:grid-cols-[3rem_1fr_4rem_4rem_5rem_4rem] px-4 md:px-6 py-3 md:py-5 items-center hover:bg-zinc-50/50 transition-colors ${row.rank <= 4 ? 'bg-[#D60A07]/5 shadow-[inset_4px_0_0_#D60A07]' : ''}`}>
                            <div className="text-xs md:text-sm font-black text-zinc-300">
                              {row.rank.toString().padStart(2, '0')}
                            </div>
                            <div className="text-xs md:text-sm font-bold text-zinc-800 truncate">{row.team}</div>
                            <div className="text-xs md:text-sm font-black text-zinc-900 text-center tabular-nums">{row.w}</div>
                            <div className="text-xs md:text-sm font-black text-zinc-900 text-center tabular-nums">{row.l}</div>
                            <div className="hidden md:block text-sm font-medium text-zinc-500 text-center tabular-nums">
                              {formatWinPct(row.w, row.l)}
                            </div>
                            <div className="text-xs md:text-sm font-black text-zinc-900 text-right tabular-nums">{row.gb}</div>
                          </div>
                          {row.rank === 4 && (
                            <div className="relative py-2 flex items-center justify-center bg-zinc-50/30 overflow-hidden">
                              <div className="absolute inset-0 flex items-center px-4" aria-hidden="true">
                                <div className="w-full border-t-2 border-dashed border-zinc-200"></div>
                              </div>
                              <div className="relative px-4 bg-[#fcfcfc] rounded-full border border-zinc-100">
                                <span className="text-[8px] font-black text-zinc-400 uppercase tracking-[0.25em]">playoff cutoff</span>
                              </div>
                            </div>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex items-center gap-4 pt-4">
              <div className="h-px bg-zinc-100 flex-1" />
              <div className="flex items-center gap-2 px-6 py-3 bg-zinc-50 rounded-2xl border border-zinc-100">
                <div className="w-2.5 h-2.5 rounded-full bg-[#D60A07] shadow-[0_0_8px_rgba(214,10,7,0.4)]" />
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  Key: Top 4 teams in each conference make playoffs.
                </span>
              </div>
              <div className="h-px bg-zinc-100 flex-1" />
            </div>
          </div>
        ) : tabId === 'schedule' ? (
          <div className="pt-8 pb-12 space-y-6">
            {scheduleData.map((weekItem) => {
              const isOpen = openWeeks.includes(weekItem.week);
              return (
                <div 
                  key={weekItem.week}
                  className="border border-zinc-100 rounded-[2rem] overflow-hidden bg-white shadow-sm transition-all duration-300"
                >
                  <button 
                    onClick={() => toggleWeek(weekItem.week)}
                    className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-zinc-50/50 transition-colors border-l-8 border-[#D60A07]"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-black text-zinc-900 uppercase tracking-tighter">
                        WEEK {weekItem.week}
                      </span>
                      {weekItem.week === 4 && (
                        <span className="px-2 py-0.5 bg-[#D60A07]/10 text-[#D60A07] text-[9px] font-black uppercase tracking-widest rounded">
                          current
                        </span>
                      )}
                    </div>
                    <svg 
                      className={`w-6 h-6 text-zinc-300 transition-transform duration-500 ${isOpen ? 'rotate-180 text-[#D60A07]' : ''}`} 
                      viewBox="0 0 24 24" 
                      fill="none"  stroke="currentColor" strokeWidth="3" 
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  {isOpen && (
                    <div className="px-8 pb-8 pt-2 animate-page-enter">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {weekItem.games.map((game, gIdx) => (
                          <div key={gIdx} className="space-y-6">
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] font-black text-[#D60A07] uppercase tracking-[0.3em]">
                                {game.title}
                              </span>
                              <div className="h-px bg-zinc-100 flex-1" />
                            </div>
                            <div className="space-y-2">
                              {game.matchups.map((matchup, mIdx) => {
                                const [away, home] = matchup.split(' @ ');
                                return (
                                  <div 
                                    key={mIdx}
                                    className="group flex items-center justify-between p-4 rounded-2xl bg-zinc-50/50 border border-transparent hover:border-zinc-100 hover:bg-white transition-all duration-300"
                                  >
                                    <div className="flex-1 text-sm font-bold text-zinc-800 text-left">
                                      <span className="hidden md:inline">{away}</span>
                                      <span className="md:hidden">{teamShortNames[away] || away}</span>
                                    </div>
                                    <div className="px-3 py-1 bg-white border border-zinc-100 rounded-full shadow-sm">
                                      <span className="text-[10px] font-black text-[#D60A07]">@</span>
                                    </div>
                                    <div className="flex-1 text-sm font-bold text-zinc-800 text-right">
                                      <span className="hidden md:inline">{home}</span>
                                      <span className="md:hidden">{teamShortNames[home] || home}</span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : tabId === 'stats' ? (
          <div className="space-y-16 pt-4">
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-xl font-black text-zinc-900 uppercase tracking-tight">S11 Stats</h3>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${accentBg} opacity-75`}></span>
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${accentBg}`}></span>
                  </span>
                  <span className={`text-[10px] font-black ${accentText} tracking-[0.2em] uppercase`}>
                    live data
                  </span>
                </div>
              </div>
              <div className={`w-full rounded-[2.5rem] overflow-hidden border border-zinc-200 shadow-2xl bg-zinc-50 relative aspect-[4/5] md:aspect-video lg:h-[750px] transition-all duration-700 ${accentShadow} hover:border-zinc-300`}>
                <iframe 
                  src={embedUrl || ''}
                  className="w-full h-full border-none"
                  title="S11 Stats"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-xl font-black text-zinc-900 uppercase tracking-tight">All-Time Stats (S1–S10)</h3>
              </div>
              <div className={`w-full rounded-[2.5rem] overflow-hidden border border-zinc-200 shadow-2xl bg-zinc-50 relative aspect-[4/5] md:aspect-video lg:h-[750px] transition-all duration-700 hover:shadow-zinc-500/5 hover:border-zinc-300`}>
                <iframe 
                  src="https://docs.google.com/spreadsheets/d/e/2PACX-1vQpbI0iBshMjG0A-ilbu2Tc0OEJuHGYZlIjH9e2mPCIGX2vGp6HfMPVBsglH1givd9AGTWRKxaH0_Ek/pubhtml?widget=true&headers=false"
                  className="w-full h-full border-none"
                  title="All-Time Stats"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        ) : tabId === 'college' ? (
          <div className="space-y-16 pt-8 pb-12">
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <h3 className="text-2xl font-black text-zinc-900 tracking-tight uppercase">
                    college standings
                  </h3>
                  <span className="px-3 py-1 bg-zinc-100 text-zinc-500 text-[10px] font-black uppercase tracking-widest rounded-full">
                    season 1
                  </span>
                </div>
                <div className={`h-0.5 ${isCollege ? 'bg-sky-100' : 'bg-zinc-100'} flex-1 hidden sm:block`} />
              </div>
              <div className={`bg-white border ${isCollege ? 'border-sky-100' : 'border-zinc-100'} rounded-[2rem] overflow-hidden shadow-sm`}>
                <div className="grid grid-cols-[3rem_1fr_4rem] px-6 py-4 bg-zinc-50 border-b border-zinc-100 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                  <div>pos</div>
                  <div>team</div>
                  <div className="text-right">rec</div>
                </div>
                <div className="divide-y divide-zinc-100">
                  {collegeStandings.map((s) => (
                    <div key={s.rank} className="grid grid-cols-[3rem_1fr_4rem] px-6 py-5 items-center hover:bg-zinc-50/50 transition-colors">
                      <div className="text-sm font-black text-zinc-300">
                        {s.rank.toString().padStart(2, '0')}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-black ${accentText} ${accentBgSoft} px-2 py-0.5 rounded shrink-0`}>
                          {s.tag}
                        </span>
                        <span className="text-sm font-bold text-zinc-800 truncate">{s.team}</span>
                      </div>
                      <div className="text-sm font-black text-zinc-900 text-right tabular-nums">
                        {s.record}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <h3 className="text-2xl font-black text-zinc-900 tracking-tight uppercase">
                    college stats
                  </h3>
                  <span className="px-3 py-1 bg-zinc-100 text-zinc-500 text-[10px] font-black uppercase tracking-widest rounded-full">
                    season 1 leaders
                  </span>
                </div>
                <div className={`h-0.5 ${isCollege ? 'bg-sky-100' : 'bg-zinc-100'} flex-1 hidden sm:block`} />
              </div>
              <div className={`bg-white border ${isCollege ? 'border-sky-100' : 'border-zinc-100'} rounded-[2rem] overflow-hidden shadow-sm overflow-x-auto`}>
                <div className="min-w-[500px]">
                  <div className="grid grid-cols-[1fr_4rem_4rem_4rem_4rem] px-6 py-4 bg-zinc-50 border-b border-zinc-100 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                    <div>player</div>
                    <div className={`text-center ${accentText}`}>pts</div>
                    <div className="text-center">ast</div>
                    <div className="text-center">reb</div>
                    <div className="text-center">stl</div>
                  </div>
                  <div className="divide-y divide-zinc-100">
                    {collegeStats.map((s, idx) => (
                      <div key={idx} className="grid grid-cols-[1fr_4rem_4rem_4rem_4rem] px-6 py-4 items-center hover:bg-zinc-50/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-black text-zinc-300 w-4">{idx + 1}</span>
                          <span className="text-sm font-bold text-zinc-800">{s.player}</span>
                        </div>
                        <div className="text-sm font-black text-zinc-900 text-center tabular-nums">{s.pts}</div>
                        <div className="text-sm font-medium text-zinc-500 text-center tabular-nums">{s.ast}</div>
                        <div className="text-sm font-medium text-zinc-500 text-center tabular-nums">{s.reb}</div>
                        <div className="text-sm font-medium text-zinc-500 text-center tabular-nums">{s.stl}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : tabId === 'rosters' ? (
          <div className="animate-page-enter">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {teamRosterList.map((team, idx) => {
                const slug = teamToSlug[team];
                const color = teamColors[slug];
                return (
                  <button 
                    key={idx}
                    onClick={() => {
                      if (slug && onTabChange) {
                        onTabChange(`team-${slug}`);
                      }
                    }}
                    style={{ 
                      borderLeft: `4px solid ${color}`,
                      backgroundColor: `${color}08` 
                    }}
                    className="group flex items-center justify-between p-6 bg-white border border-zinc-100 rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-left active:scale-[0.98] relative overflow-hidden"
                  >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity hidden md:block" style={{ backgroundColor: color }} />
                    <span className="text-lg md:text-xl font-black text-zinc-900 tracking-tight transition-colors uppercase relative z-10">
                      {team}
                    </span>
                    <div className="flex items-center gap-2 transition-all duration-300 translate-x-0 group-hover:translate-x-1 relative z-10" style={{ color: color }}>
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">view roster</span>
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : tabId === 'applications' ? (
          <div className="py-24 flex flex-col items-center justify-center text-center space-y-8 animate-page-enter">
            <div className="px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-full shadow-sm">
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">coming soon</span>
            </div>
            <p className="text-zinc-500 font-bold text-lg md:text-xl tracking-tight max-w-md leading-relaxed">
              applications are temporarily closed. check back later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-page-enter">
            {page.items.map((item, idx) => (
              <button 
                key={idx} 
                onClick={() => handleItemClick(item.label)}
                className={`group p-8 bg-white border border-zinc-100 rounded-[2rem] text-left transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 ${accentShadow}`}
              >
                <div className="flex flex-col h-full justify-between gap-8">
                  <div className="space-y-2">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${accentText} opacity-60`}>
                      {item.category}
                    </span>
                    <h3 className="text-2xl font-black text-zinc-900 tracking-tighter group-hover:translate-x-1 transition-transform">
                      {item.label.toLowerCase()}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">view section</span>
                    <div className={`w-8 h-8 rounded-full ${accentBgSoft} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <svg className={`w-4 h-4 ${accentText}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Subtle Easter Egg Footer for More Page */}
        {tabId === 'more' && (
          <div className="pt-20 pb-8 text-center">
            <button 
              onClick={() => setEasterEggIndex(prev => (prev + 1) % easterEggMessages.length)}
              className="text-[11px] text-zinc-400 font-medium lowercase tracking-wide select-none outline-none transition-colors hover:text-zinc-500 cursor-pointer active:scale-95 duration-200 block mx-auto"
            >
              <span key={easterEggIndex} className="inline-block animate-easter-egg">
                {easterEggMessages[easterEggIndex]}
              </span>
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes page-enter {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-page-enter {
          animation: page-enter 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes easter-egg-in {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-easter-egg {
          animation: easter-egg-in 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default TabPage;
