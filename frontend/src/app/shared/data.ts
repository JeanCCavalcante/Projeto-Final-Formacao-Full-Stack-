export interface UserInfo {
  id: number;
  createdAt: string;
  firstName: string;
  lastName: string;
  avatar: string;
  city: string;
  state: string;
  timezone: string;
  email: string;
  phoneNumber: string;
}

export interface NotificationSetting {
  id: number;
  createdAt: string;
  notifications: {
    email: {
      productUpdates: boolean;
      securityUpdates: boolean;
    };
    phone: {
      email: boolean;
      securityUpdates: boolean;
    };
  };
}

export interface Application {
  id: number;
  updatedAt: Date;
  name: string;
  icon: string;
  description: string;
  installs: number;
}

export interface CustomersInfo {
  id: number;
  createdAt: Date;
  firstName: string;
  lastName: string;
  avatar: string;
  email: string;
  location: { city: string; state: string; country: string };
  phone: string;
}

export interface OverviewInfo {
  budget: {
    current: number;
    lastMonth: number;
  };
  totalCustomers: {
    current: number;
    lastMonth: number;
  };
  taskProgress: number;
  totalProfit: number;
  trafficSource: {
    desktop: number;
    tablet: number;
    phone: number;
  };
}

export interface SalesInfo {
  currentYear: Array<number>;
  lastYear: Array<number>;
}

export interface LatestOrder {
  id: string;
  customer: string;
  orderDate: Date;
  status: string;
}

export interface LatestProduct {
  id: string;
  name: string;
  picture: string;
  updatedAt: Date;
}

export class Data {
  id: number = Math.floor(Math.random() * (5 - 1 + 1) + 1);

  states = [
    'Alabama',
    'Alaska',
    'Arizona',
    'Arkansas',
    'California',
    'Colorado',
    'Connecticut',
    'Delaware',
    'Florida',
    'Georgia',
    'Hawaii',
    'Idaho',
    'Illinois',
    'Indiana',
    'Iowa',
    'Kansas',
    'Kentucky',
    'Louisiana',
    'Maine',
    'Maryland',
    'Massachusetts',
    'Michigan',
    'Minnesota',
    'Mississippi',
    'Missouri',
    'Montana',
    'Nebraska',
    'Nevada',
    'New Hampshire',
    'New Jersey',
    'New Mexico',
    'New York',
    'North Carolina',
    'North Dakota',
    'Ohio',
    'Oklahoma',
    'Oregon',
    'Pennsylvania',
    'Rhode Island',
    'South Carolina',
    'South Dakota',
    'Tennessee',
    'Texas',
    'Utah',
    'Vermont',
    'Virginia',
    'Washington',
    'West Virginia',
    'Wisconsin',
    'Wyoming',
  ];
}
