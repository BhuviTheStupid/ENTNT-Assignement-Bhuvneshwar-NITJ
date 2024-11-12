import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { updateQuestion, fetchQuestionById} from "@/api/apiAssessment"; // Import the update API function
import { z } from "zod";

// Define the Zod schema for form validation
const questionSchema = z.object({
  question: z.string().min(1, "Question is required").max(255, "Question is too long"),
  op1: z.string().min(1, "Option A is required").max(100, "Option A is too long"),
  op2: z.string().min(1, "Option B is required").max(100, "Option B is too long"),
  op3: z.string().min(1, "Option C is required").max(100, "Option C is too long"),
  op4: z.string().min(1, "Option D is required").max(100, "Option D is too long"),
});

const UpdateQuestionPage = () => {
  const { id } = useParams(); // Get the question ID from the URL
  console.log(useParams());
  const navigate = useNavigate();
  const { isLoaded, user } = useUser();
  
  const [questionData, setQuestionData] = useState({
    question: "",
    op1: "",
    op2: "",
    op3: "",
    op4: "",
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isLoaded) {
      // Check if id exists before making the API request
      if (id) {
        fetchQuestionById(user?.session?.jwtToken || "", { id })
          .then((data) => {
            // If data is returned, set the state with the question data
            if (data) {
                console.log(data.question, data.op1, data.id);
              setQuestionData({
                question: data.question,
                op1: data.op1,
                op2: data.op2,
                op3: data.op3,
                op4: data.op4,
              });
            }
          })
          .catch((err) => console.error("Error fetching question:", err));
      }
    }
  }, [isLoaded, id]);
  

  const handleUpdateQuestion = async () => {
    // Validate the form using Zod
    try {
      questionSchema.parse(questionData); // If valid, continue with the update
        console.log(questionData, id);
      // Include ques_id explicitly in the payload
      const result = await updateQuestion(user?.session?.jwtToken || "", {
        question: questionData.question,
        op1: questionData.op1,
        op2: questionData.op2,
        op3: questionData.op3,
        op4: questionData.op4,
        id: id,  // Add ques_id here
      });
  
      if (result) {
        console.log(id);
        navigate(`/assessment/${id}`); // Redirect after successful update
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newFormErrors = error.errors.reduce((acc, err) => {
          acc[err.path[0]] = err.message; // Map error messages to the respective fields
          return acc;
        }, {});
        setFormErrors(newFormErrors); // Set the form errors
      } else {
        console.error("Error updating question:", error);
      }
    }
  };
  

  const handleChange = (e) => {
    setQuestionData({ ...questionData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-col gap-8 mt-5 bg-gray-900 min-h-screen p-6">
      <h1 className="gradient-title font-extrabold pb-3 text-4xl sm:text-6xl text-white">Update Question</h1>
        
      <div className="flex flex-col gap-4 mt-6 h-auto w-full items-center mb-3 bg-gray-800 p-6 rounded-lg shadow-lg">
        <input
          type="text"
          name="question"
          placeholder="Enter updated question"
          value={questionData.question}
          onChange={handleChange}
          className={`input input-bordered bg-gray-700 text-white border-gray-600 placeholder-gray-400 ${formErrors.question ? 'border-red-500' : ''}`}
        />
        {formErrors.question && <p className="text-red-500 text-sm">{formErrors.question}</p>}

        <input
          type="text"
          name="op1"
          placeholder="Option A"
          value={questionData.op1}
          onChange={handleChange}
          className={`input input-bordered bg-gray-700 text-white border-gray-600 placeholder-gray-400 ${formErrors.op1 ? 'border-red-500' : ''}`}
        />
        {formErrors.op1 && <p className="text-red-500 text-sm">{formErrors.op1}</p>}

        <input
          type="text"
          name="op2"
          placeholder="Option B"
          value={questionData.op2}
          onChange={handleChange}
          className={`input input-bordered bg-gray-700 text-white border-gray-600 placeholder-gray-400 ${formErrors.op2 ? 'border-red-500' : ''}`}
        />
        {formErrors.op2 && <p className="text-red-500 text-sm">{formErrors.op2}</p>}

        <input
          type="text"
          name="op3"
          placeholder="Option C"
          value={questionData.op3}
          onChange={handleChange}
          className={`input input-bordered bg-gray-700 text-white border-gray-600 placeholder-gray-400 ${formErrors.op3 ? 'border-red-500' : ''}`}
        />
        {formErrors.op3 && <p className="text-red-500 text-sm">{formErrors.op3}</p>}

        <input
          type="text"
          name="op4"
          placeholder="Option D"
          value={questionData.op4}
          onChange={handleChange}
          className={`input input-bordered bg-gray-700 text-white border-gray-600 placeholder-gray-400 ${formErrors.op4 ? 'border-red-500' : ''}`}
        />
        {formErrors.op4 && <p className="text-red-500 text-sm">{formErrors.op4}</p>}

        <button
          onClick={handleUpdateQuestion}
          className="mt-4 btn bg-blue-600 text-white hover:bg-blue-500"
        >
          Update Question
        </button>
      </div>
    </div>
  );
};

export default UpdateQuestionPage;
