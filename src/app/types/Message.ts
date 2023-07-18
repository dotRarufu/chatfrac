// export default interface Message {
//   content: string;
//   sender: 'user' | 'bot';
// }
export type ChatVideo = { type: 'ChatVideo'; videoLink: string };

export type Message = ChatBubble | Carousel | ChatMenu | ChatVideo;

export type ChatBubble = {
  type: 'ChatBubble';
  content: string;
  sender: 'user' | 'bot';
  isLink?: boolean;
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
  link: string;
};

export type ChatMenu = {
  type: 'ChatMenu';

  content: {
    message: string;
    buttons: string[];
  };
};
