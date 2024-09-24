import Part, { CoursePart } from "./Part";

interface ContentProps {
  coursePart: CoursePart[];
}

const Content = (props: ContentProps): JSX.Element => {
  return <Part coursePart={props.coursePart} />
};

export default Content;
