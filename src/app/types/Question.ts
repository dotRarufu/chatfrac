export type Question = {
  content: { text: string | { videoLink: string } | { imgSrc: string } };
  answers: string[];
  solutions?: string[];
};

export default Question;
