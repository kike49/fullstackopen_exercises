const Header = ({ title }) => <h1>{title}</h1>

const Content = ({ parts }) =>
  parts.map((part) => <Part key={part.id} name={part.name} exercises={part.exercises} />)

const Part = ({ name, exercises }) => <p>{name} {exercises}</p>

const Total = ({parts}) => {
    const exercisesList = parts.map((part) => part.exercises)
    const totalExercises = exercisesList.reduce((sum, current) => sum + current, 0);
    return <p><b>Total of {totalExercises} exercises</b></p>
}

const Course = ({ courses }) => {
    return (
        <div>
            {courses.map((course) => (
                <><Header title={course.name} /><Content parts={course.parts} /><Total parts={course.parts} /></>
            ))}
        </div>
    )
}

export default Course
