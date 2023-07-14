export default interface UserData {
  name: string;
  school: string;
  categories: {
    [key: string]: number;
  };
  preTestScore: number;
  postTestScore: number;
}
