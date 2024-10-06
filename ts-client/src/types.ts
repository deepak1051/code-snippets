export interface Snippet {
  steps: Step[];
  title: string;
  _id: string;
}

export interface Step {
  stepCode: string;
  stepTitle: string;
  // _id: string;
  id: string;
}
