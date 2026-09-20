export type InterestCategory = 
  | "Sports" 
  | "Gaming" 
  | "Outdoors" 
  | "Tech" 
  | "Creative" 
  | "Social" 
  | "Anime & Pop Culture" 
  | "Food & Chai";

export interface Interest {
  id: string;
  name: string;
  category: InterestCategory;
  emoji: string;
  badgeBg: string;
  badgeTextColor: string;
  avatarIcon: string;
}

export interface Location {
  name: string;
  area: string;
  city: string;
  distanceKm: number;
  lat?: number;
  lng?: number;
}

export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  animeAvatar: string;
  bio: string;
  badge: string;
  hypeLevel: number;
  karma: number;
  interests: string[];
  location: string;
  isHost?: boolean;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  communityId?: string;
  communityName?: string;
  host: User;
  interest: Interest;
  location: Location;
  dateTime: string;
  maxParticipants: number;
  currentParticipants: User[];
  status: "UPCOMING" | "LIVE_NOW" | "SPOTS_FULL" | "COMPLETED";
  spotsUrgent?: boolean;
  bannerBg: string;
  animeSticker: string;
  hypeCount: number;
  rules?: string[];
  entryFee?: string;
}

export interface Community {
  id: string;
  name: string;
  tagline: string;
  description: string;
  bannerBg: string;
  accentColor: string;
  category: InterestCategory;
  memberCount: number;
  activeEventsCount: number;
  location: string;
  activityStatus: "VERY ACTIVE" | "ACTIVE" | "NEW" | "LOOKING FOR MEMBERS";
  leadUser: User;
  members: User[];
  tags: string[];
  animeMascot: string;
  isVerified?: boolean;
  upcomingActivities?: Activity[];
  recentActivityLog?: { id: string; text: string; time: string }[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: "INVITE" | "ACTIVITY_UPDATE" | "HYPE" | "COMMUNITY_JOIN";
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  avatar?: string;
}

export interface AIMessage {
  id: string;
  sender: "user" | "sensei";
  text: string;
  timestamp: string;
  suggestedActivities?: Activity[];
  suggestedCommunities?: Community[];
  sticker?: string;
}
