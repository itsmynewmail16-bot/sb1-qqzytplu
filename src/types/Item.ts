export interface Item {
  id: string;
  name: string;
  description: string;
  images: string[];
  hiddenImages: string[];
  video?: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  securityQuestion: string;
  securityAnswer: string;
  dateReported: string;
  claimed: boolean;
  claimerInfo?: {
    claimedAt: string;
    location: {
      latitude: number;
      longitude: number;
    };
  };
}