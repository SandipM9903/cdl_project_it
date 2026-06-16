import { z } from "zod";

export const UserSchema = z.object({
  oppDate: z.string().nonempty({ message: "Opp_date is required" }),
  oppDesc: z.string().nonempty({ message: "Opp_desc is required" }),
  oppShortDesc: z.string().nonempty({ message: "Opp_short_desc is required" }),
  oppOverview: z.string().nonempty({ message: "Opp_overview is required" }),
  projectType: z.string().nonempty({ message: "Project type is required" }),
  estimationType: z
    .string()
    .nonempty({ message: "Estimation type is required" }),
  billingType: z.string().nonempty({ message: "Billing type is required" }),
  businessUnit: z.string().nonempty({ message: "Business unit is required" }),
  leadPractice: z.string().nonempty({ message: "Lead practice is required" }),
  customerType: z.string().nonempty({ message: "Customer type is required" }),
  customerState: z.string().nonempty({ message: "Customer state is required" }),
  customerName: z.string().nonempty({ message: "Customer name is required" }),
  customerBudget: z
    .string()
    .nonempty({ message: "Customer budget is required" }),
  customerCity: z.string().nonempty({ message: "Customer city is required" }),
  rfpStatus: z.string().nonempty({ message: "RFP status is required" }),
  rfpProcess: z.string().nonempty({ message: "RFP process is required" }),
});
