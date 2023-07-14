export default interface UserData {
  name: string;
  school: string;
  categories: {
    [key: string]: number | null;
  };
  preTestScore: number | null;
  postTestScore: number | null;
}
