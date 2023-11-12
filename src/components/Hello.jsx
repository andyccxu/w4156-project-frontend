import PropTypes from "prop-types";

const Hello = (props) => {
  // const name = "Andy";
  return (
    <div className="border-l-4 bg-slate-400">
      <h1>Hello {props.name}</h1>
    </div>
  );
};

// Props Validation
Hello.propTypes = {
  name: PropTypes.string.isRequired,
};

export default Hello;
