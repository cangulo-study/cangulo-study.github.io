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

export interface TestData {
  difficulty: string;
  questions: Question[];
}

export interface TestResultState {
  questions: Question[];
  answers: AnsweredQuestion[];
  score?: number;
  testnumber?: string;
}

export interface TestItem {
  id: number;
  name: string;
  filename: string;
  difficulty: string;
}