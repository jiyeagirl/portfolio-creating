export type VendorCategory = "studio" | "dress" | "makeup";

export type RatingBreakdown = {
  kindness: number;
  priceSatisfaction: number;
  resultSatisfaction: number;
  afterCare: number;
};

export type PackageItem = { label: string; included: boolean };
export type OptionItem = { label: string; price: number };

export type Vendor = {
  id: string;
  name: string;
  category: VendorCategory;
  region: string;
  photoId: number;
  photoCrop?: string;
  ratingAvg: number;
  ratingBreakdown: RatingBreakdown;
  reviewCount: number;
  avgPaidPrice: number;
  packageItems: PackageItem[];
  optionItems: OptionItem[];
  verifiedCount: number;
  tags: string[];
  summary: string;
  address: string;
  rankChange: "up" | "down" | "same";
};

export type ReviewPhoto = { photoId: number; crop?: string };

export type Review = {
  id: string;
  vendorId: string;
  authorInitial: string;
  authorLabel: string;
  ratingBreakdown: RatingBreakdown;
  ratingAvg: number;
  paidPrice: number;
  packageSummary: string;
  content: string;
  photos: ReviewPhoto[];
  createdAt: string;
  helpfulCount: number;
  reported?: boolean;
};

export type VerificationStatus = "received" | "reviewing" | "approved" | "rejected";
export type VerificationDocType = "receipt" | "contract";

export type VerificationRequest = {
  id: string;
  vendorName: string;
  category: VendorCategory;
  docType: VerificationDocType;
  amount: number;
  contractDate: string;
  status: VerificationStatus;
  rejectReason?: string;
  submittedAt: string;
};

export type CommunityCategory = "studio" | "dress" | "makeup" | "prep";

export type Comment = {
  id: string;
  authorInitial: string;
  authorLabel: string;
  content: string;
  likeCount: number;
  createdAt: string;
};

export type CommunityPost = {
  id: string;
  category: CommunityCategory;
  title: string;
  content: string;
  authorInitial: string;
  authorLabel: string;
  photoId?: number;
  photoCrop?: string;
  aiAnswer?: string;
  answerCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  comments: Comment[];
};

export type FaqItem = { id: string; question: string; answer: string };
export type NoticeItem = { id: string; title: string; date: string; body: string };

export type ActivityItem = {
  id: string;
  type: "post" | "comment" | "like";
  label: string;
  targetTitle: string;
  createdAt: string;
};

export type MyReview = {
  id: string;
  vendorName: string;
  category: VendorCategory;
  ratingAvg: number;
  content: string;
  status: "published" | "draft";
  createdAt: string;
};
