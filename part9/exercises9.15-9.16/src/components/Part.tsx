interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartBaseDescription extends CoursePartBase {
  description: string;
}

interface CoursePartBasic extends CoursePartBaseDescription {
  kind: "basic";
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group";
}

interface CoursePartBackground extends CoursePartBaseDescription {
  backgroundMaterial: string;
  kind: "background";
}

interface CoursePartRequirements extends CoursePartBaseDescription {
  requirements: string[];
  kind: "special";
}

export type CoursePart =
  | CoursePartBasic
  | CoursePartGroup
  | CoursePartBackground
  | CoursePartRequirements;

interface PartProps {
  coursePart: CoursePart[];
}

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const Part = (props: PartProps): JSX.Element => {
  return (
    <div>
      {props.coursePart.map((part) => {
        switch (part.kind) {
          case "basic":
            return (
              <div key={part.name}>
                <p>
                  <b>
                    {part.name} - {part.exerciseCount}
                  </b>
                  <br />
                  <i>{part.description}</i>
                </p>
              </div>
            );
          case "background":
            return (
              <div key={part.name}>
                <p>
                  <b>
                    {part.name} - {part.exerciseCount}
                  </b>
                  <br />
                  <i>{part.description}</i>
                  <br />
                  <span>Material: {part.backgroundMaterial}</span>
                </p>
              </div>
            );
          case "group":
            return (
              <div key={part.name}>
                <p>
                  <b>
                    {part.name} - {part.exerciseCount}
                  </b>
                  <br />
                  <span>Project exercises: {part.groupProjectCount}</span>
                </p>
              </div>
            );
          case "special":
            return (
              <div key={part.name}>
                <p>
                  <b>
                    {part.name} - {part.exerciseCount}
                  </b>
                  <br />
                  <i>{part.description}</i>
                  <br />
                  <span>
                    Skills required: {part.requirements.join(", ")}
                  </span>
                </p>
              </div>
            );
          default:
            return assertNever(part);
        }
      })}
    </div>
  );
};

export default Part;
