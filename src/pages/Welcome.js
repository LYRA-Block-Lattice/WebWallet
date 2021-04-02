export default function Welcome(props) {
    return (
      <div>
        <h1>Hello, {props.name}!</h1>
        <p>Current Time: {Date.now()}</p>
      </div>      
    );
  }