// UpdateQuestionModal.js
import { useState } from "react";
import { Button } from "@/components/ui/button";

const UpdateQuestionModal = ({ question, onSave, onClose }) => {
  const [updatedQuestion, setUpdatedQuestion] = useState({ ...question });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedQuestion((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(updatedQuestion);
  };

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg">
      <h2 className="font-bold text-lg mb-4">Edit Question</h2>
      <input
        type="text"
        name="question"
        value={updatedQuestion.question}
        onChange={handleChange}
        placeholder="Question"
        className="bg-gray-700 text-white p-3 rounded-md border-gray-600 mb-4 w-full"
      />
      <input
        type="text"
        name="op1"
        value={updatedQuestion.op1}
        onChange={handleChange}
        placeholder="Option A"
        className="bg-gray-700 text-white p-3 rounded-md border-gray-600 mb-2 w-full"
      />
      <input
        type="text"
        name="op2"
        value={updatedQuestion.op2}
        onChange={handleChange}
        placeholder="Option B"
        className="bg-gray-700 text-white p-3 rounded-md border-gray-600 mb-2 w-full"
      />
      <input
        type="text"
        name="op3"
        value={updatedQuestion.op3}
        onChange={handleChange}
        placeholder="Option C"
        className="bg-gray-700 text-white p-3 rounded-md border-gray-600 mb-2 w-full"
      />
      <input
        type="text"
        name="op4"
        value={updatedQuestion.op4}
        onChange={handleChange}
        placeholder="Option D"
        className="bg-gray-700 text-white p-3 rounded-md border-gray-600 mb-4 w-full"
      />
      <div className="flex justify-end gap-2">
        <Button onClick={onClose} variant="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="primary">
          Save
        </Button>
      </div>
    </div>
  );
};

export default UpdateQuestionModal;
