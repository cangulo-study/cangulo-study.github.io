export interface Question {
  id: number;
  question: string;
  options: Record<string, string>;
  correctOption: string;
}

export interface AnsweredQuestion {
  id: number;
  selectedOption: string;
  toReview: boolean;
}

export interface TestReviewState {
  questions: Question[];
  answers: AnsweredQuestion[];
  setId: string;
}