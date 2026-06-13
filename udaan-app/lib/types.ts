export type Kit = {
  type: "kit";
  intro_en?: string;
  intro_hi?: string;
  businesses: {
    name_en?: string;
    name_hi?: string;
    range?: string;
    why_en?: string;
    why_hi?: string;
  }[];
  pricing: {
    items: { item_en?: string; item_hi?: string; price?: string }[];
    script_en?: string;
    script_hi?: string;
  };
  whatsapp_en?: string;
  whatsapp_hi?: string;
  schemes: {
    name?: string;
    what_en?: string;
    what_hi?: string;
    step_en?: string;
    step_hi?: string;
  }[];
  projection: {
    monthly?: string;
    year?: string;
    assumption_en?: string;
    assumption_hi?: string;
    savings_en?: string;
    savings_hi?: string;
  };
  // Enhanced fields
  instagram?: {
    bio_en?: string;
    bio_hi?: string;
    content_ideas_en?: string[];
    hashtags?: string[];
  };
  vendors?: {
    category_en?: string;
    category_hi?: string;
    online?: { name: string; url: string; what_for: string }[];
    local_tip_en?: string;
    local_tip_hi?: string;
  }[];
  business_management?: {
    inventory_tip_en?: string;
    inventory_tip_hi?: string;
    finance_tip_en?: string;
    finance_tip_hi?: string;
    first_week_en?: string;
    first_week_hi?: string;
  };
  motivation_message_en?: string;
  motivation_message_hi?: string;
  action_en?: string;
  action_hi?: string;
};
