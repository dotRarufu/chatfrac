export type Question = {
  content: { text: string | { videoLink: string } };
  answers: string[];
  solutions?: string[];
};

export default Question;
