// Event type options for filtering and selection
export const eventTypes = [
  { id: 'wedding', name: 'Wedding', icon: '💍' },
  { id: 'corporate', name: 'Corporate Event', icon: '🏢' },
  { id: 'birthday', name: 'Birthday Party', icon: '🎂' },
  { id: 'graduation', name: 'Graduation', icon: '🎓' },
  { id: 'anniversary', name: 'Anniversary', icon: '❤️' },
  { id: 'baby_shower', name: 'Baby Shower', icon: '👶' },
  { id: 'engagement', name: 'Engagement', icon: '💎' },
  { id: 'christmas', name: 'Christmas Party', icon: '🎄' },
  { id: 'easter', name: 'Easter Celebration', icon: '🐰' },
  { id: 'conference', name: 'Conference', icon: '🎤' },
  { id: 'seminar', name: 'Seminar', icon: '📊' },
  { id: 'workshop', name: 'Workshop', icon: '🛠️' },
  { id: 'award_ceremony', name: 'Award Ceremony', icon: '🏆' },
  { id: 'festival', name: 'Festival', icon: '🎪' },
  { id: 'concert', name: 'Concert', icon: '🎵' },
  { id: 'gala', name: 'Gala', icon: '✨' },
  { id: 'sports_event', name: 'Sports Event', icon: '⚽' },
  { id: 'trade_show', name: 'Trade Show', icon: '🛍️' },
  { id: 'fundraiser', name: 'Fundraiser', icon: '💝' },
  { id: 'reunion', name: 'Reunion', icon: '👪' },
  { id: 'funeral', name: 'Memorial Service', icon: '🕯️' },
  { id: 'dinner_party', name: 'Dinner Party', icon: '🍽️' },
  { id: 'market', name: 'Market', icon: '🏪' },
  { id: 'exhibition', name: 'Exhibition', icon: '🖼️' },
  { id: 'team_building', name: 'Team Building', icon: '🤝' },
  { id: 'launch_party', name: 'Product Launch', icon: '🚀' },
  { id: 'cultural', name: 'Cultural Celebration', icon: '🎭' },
  { id: 'fashion_show', name: 'Fashion Show', icon: '👗' },
  { id: 'ramadan', name: 'Ramadan Celebration', icon: '🌙' },
  { id: 'diwali', name: 'Diwali Festival', icon: '🪔' },
  { id: 'halloween', name: 'Halloween Party', icon: '🎃' },
  { id: 'new_years', name: 'New Year Celebration', icon: '🎆' },
  { id: 'valentines', name: 'Valentine\'s Day', icon: '💌' },
  { id: 'other', name: 'Other Event', icon: '📆' },
];

// Find event type by ID
export const getEventTypeById = (id: string) => {
  return eventTypes.find(eventType => eventType.id === id);
};

// Get event type icon by ID
export const getEventTypeIcon = (id: string) => {
  const eventType = getEventTypeById(id);
  return eventType ? eventType.icon : '📆';
};

// Get event type name by ID
export const getEventTypeName = (id: string) => {
  const eventType = getEventTypeById(id);
  return eventType ? eventType.name : 'Event';
};