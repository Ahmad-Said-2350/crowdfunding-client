export type Role = "supporter" | "creator" | "admin";
export interface User { id: string; name: string; email: string; image?: string | null; role: Role; credits: number; raisedCredits: number }
export interface Campaign {
  _id: string; campaign_title: string; campaign_story: string; category: string; funding_goal: number;
  minimum_contribution: number; deadline: string; reward_info: string; campaign_image_url: string;
  creator_email: string; creator_name: string; amount_raised: number; status: string; createdAt: string;
}
export interface Contribution {
  _id: string; campaign_id: string; campaign_title: string; contribution_amount: number;
  supporter_email: string; supporter_name: string; creator_name: string; creator_email: string;
  message?: string; current_date: string; status: string;
}
