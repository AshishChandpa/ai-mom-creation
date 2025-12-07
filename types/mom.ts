export type MomSegment = {
  speaker: string;
  text: string;
  start?: number;
  end?: number;
};

export type MomResponse = {
  summary: string[];
  action_items: string[];
  decisions: string[];
  raw_transcript: string;
  speakers?: MomSegment[];
  id?: string;
  created_at?: string;
};

export type MomRecord = {
  id: string;
  created_at: string;
  summary: string[];
  action_items: string[];
  decisions: string[];
  raw_transcript: string;
  speakers?: MomSegment[];
};
