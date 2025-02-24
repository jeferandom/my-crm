import { get, post } from "../util/http";
import { token } from "@/atoms/kuepa"; 

const api = "/lead";

export interface LeadData {
  full_name: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile_phone: string;
  interestProgram: string;
  address: string;
  city: string;
  status?: "active" | "inactive";
  trackings?: Array<{
    tracking: string;
    description: string;
    new: boolean;
    name: string;
  }>;
}

export const leadService = {
  api,
  get: async ({ _id }: { _id: string }): Promise<LeadData> => {
    return await get({ api: `${api}/get/` });
  },
  getAll: async (): Promise<LeadData[]> => {
    const response = await get({ api: `${api}/` });
    if (response.code === 200 && response.status === "success") {
      return response.list;
    } else {
      throw new Error("Failed to fetch leads");
    }
  },
  create: async (leadData: LeadData): Promise<LeadData> => {
    return await post({
      api: `${api}/upsert`,
      options: {
        data: leadData
      },
    });
  },
};
