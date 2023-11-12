import Hello from "../components/hello";

// currently, this is purely a simple demo on the use of
// componenets and props
//
const CreatePage = () => {
  return (
    <div className="space-y-2">
      <h1>Create a schedule</h1>
      <Hello name="Serdar" />
      <Hello name="Jasur" />
      <Hello name="Lexa" />
      <Hello name="Andy" />
    </div>
  );
};

export default CreatePage;
