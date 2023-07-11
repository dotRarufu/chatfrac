// export default interface Message {
//   content: string;
//   sender: 'user' | 'bot';
// }
export type Message = ChatBubble | Carousel | ChatMenu;

export type ChatBubble = {
  type: 'ChatBubble';
  content: string;
  sender: 'user' | 'bot';
};
export type Carousel = {
  type: 'Carousel';

  content: CarouselItem[];

  // for bots only for now
  // sender: 'user' | 'bot';
};

export type CarouselItem = {
  message: string;
  image: string;
  clickCallback: () => void;
};

export type ChatMenu = {
  type: 'ChatMenu';

  content: {
    message: string;
    buttons: string[];
  };
};
