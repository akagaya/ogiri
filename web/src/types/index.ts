export interface User {
  id: string;
  username: string;
  display_name: string;
  created_at: string;
}

export interface Topic {
  id: string;
  body: string;
  user: {
    id: string;
    display_name: string;
  };
  answer_count: number;
  avg_score: number | null;
  created_at: string;
}

export interface Answer {
  id: string;
  body: string;
  user: {
    id: string;
    display_name: string;
  };
  topic_id: string;
  avg_score: number | null;
  comment_count: number;
  my_rating?: number | null;
  created_at: string;
}

export interface Rating {
  id: string;
  score: number;
  user: {
    id: string;
    display_name: string;
  };
  answer_id: string;
  created_at: string;
}

export interface Comment {
  id: string;
  body: string;
  user: {
    id: string;
    display_name: string;
  };
  answer_id: string;
  created_at: string;
  answer?: {
    id: string;
    body: string;
    topic: {
      id: string;
      body: string;
    };
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}
