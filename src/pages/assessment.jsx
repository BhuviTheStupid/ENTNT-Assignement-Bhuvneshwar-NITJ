import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { ClipboardCheck, Trash, PenBox, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as Dialog from "@radix-ui/react-dialog";
import useFetch from "@/hooks/use-fetch";
import { getSingleAssessment, getQuestionsForAssessment, deleteQues, addNewQuestion, updateQuestion } from "@/api/apiAssessment";
import { getSingleJob } from "@/api/apiJobs";

const AssessmentPage = () => {
  const { id } = useParams();
  const { isLoaded, user } = useUser();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    op1: "",
    op2: "",
    op3: "",
    op4: ""
  });
  const [editQuestion, setEditQuestion] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState({});
  const [adding, setAdding] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const { loading: loadingAssessment, data: assessments, fn: fetchAssessment } = useFetch(getSingleAssessment, { assessment_id: id });
  const { loading: loadingQuestions, data: fetchedQuestions, fn: fetchQuestions } = useFetch(getQuestionsForAssessment, { assessment_id: id, job_id: assessments?.job_id });
  const { loading: loadingJob, data: jobs, fn: fetchJob } = useFetch(getSingleJob, { job_id: assessments?.job_id });

  useEffect(() => {
    if (isLoaded && id) {
      fetchAssessment().catch((error) => console.error("Error fetching assessment:", error));
    }
  }, [isLoaded, id]);

  useEffect(() => {
    if (assessments?.job_id) {
      fetchJob().catch((error) => console.error("Error fetching job:", error));
    }
  }, [assessments?.job_id]);

  useEffect(() => {
    if (assessments?.job_id) {
      fetchQuestions().catch((error) => console.error("Error fetching questions:", error));
    }
  }, [assessments?.job_id]);

  useEffect(() => {
    if (fetchedQuestions) {
      setQuestions(fetchedQuestions);
    }
  }, [fetchedQuestions]);

  const handleDeleteQuestion = async (questionId) => {
    if (!user?.session?.jwtToken) return;

    setDeleteLoading((prev) => ({ ...prev, [questionId]: true }));

    try {
      const result = await deleteQues(user.session.jwtToken, { ques_id: questionId });
      if (result) {
        setQuestions((prevQuestions) => prevQuestions.filter((question) => question.id !== questionId));
      }
    } catch (error) {
      console.error("Error deleting question:", error);
    } finally {
      setDeleteLoading((prev) => ({ ...prev, [questionId]: false }));
    }
  };

  const handleAddNewQuestion = async () => {
    setAdding(true);
    const token = "";
    try {
      const result = await addNewQuestion(token, { ...newQuestion, assessment_id: id });
      if (result) {
        setQuestions([...questions, result]);
        setNewQuestion({ question: "", op1: "", op2: "", op3: "", op4: "" });
        setIsAddOpen(false); // Close the add dialog after adding the question
      }
    } catch (error) {
      console.error("Error adding question:", error);
    } finally {
      setAdding(false);
    }
  };

  const handleEditQuestion = async () => {
    if (!editQuestion) return;
    const token = "";
    try {
      const result = await updateQuestion(token, { ...editQuestion, assessment_id: id });
      if (result) {
        setQuestions((prev) =>
          prev.map((q) => (q.id === editQuestion.id ? result : q))
        );
        setEditQuestion(null);
      }
    } catch (error) {
      console.error("Error updating question:", error);
    }
  };

  if (loadingAssessment || loadingQuestions || loadingJob || !assessments || !questions) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div className="p-4 bg-gray-900 min-h-screen">
      <div className="flex flex-col-reverse gap-6 md:flex-row justify-between items-center">
        <h1 className="font-extrabold text-4xl sm:text-6xl text-white pb-3">
          {jobs?.name || "Untitled Assessment"}
        </h1>
        <Dialog.Root open={isAddOpen} onOpenChange={setIsAddOpen}>
          <Dialog.Trigger asChild>
            <Button className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-500">
              <PlusCircle /> Add New Question
            </Button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />
            <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-lg p-6 bg-gray-800 rounded-lg transform -translate-x-1/2 -translate-y-1/2">
              <Dialog.Title className="text-white font-bold">Add New Question</Dialog.Title>
              <Dialog.Description className="text-gray-400">Enter the new question and options below.</Dialog.Description>
              <div className="flex flex-col gap-4 mt-4">
                <input
                  type="text"
                  placeholder="Question"
                  value={newQuestion.question}
                  onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                  className="bg-gray-700 text-white p-3 rounded-md border-gray-600"
                />
                <input
                  type="text"
                  placeholder="Option A"
                  value={newQuestion.op1}
                  onChange={(e) => setNewQuestion({ ...newQuestion, op1: e.target.value })}
                  className="bg-gray-700 text-white p-3 rounded-md border-gray-600"
                />
                <input
                  type="text"
                  placeholder="Option B"
                  value={newQuestion.op2}
                  onChange={(e) => setNewQuestion({ ...newQuestion, op2: e.target.value })}
                  className="bg-gray-700 text-white p-3 rounded-md border-gray-600"
                />
                <input
                  type="text"
                  placeholder="Option C"
                  value={newQuestion.op3}
                  onChange={(e) => setNewQuestion({ ...newQuestion, op3: e.target.value })}
                  className="bg-gray-700 text-white p-3 rounded-md border-gray-600"
                />
                <input
                  type="text"
                  placeholder="Option D"
                  value={newQuestion.op4}
                  onChange={(e) => setNewQuestion({ ...newQuestion, op4: e.target.value })}
                  className="bg-gray-700 text-white p-3 rounded-md border-gray-600"
                />
                <Button
                  onClick={handleAddNewQuestion}
                  disabled={adding}
                  className="mt-2 bg-blue-600 text-white hover:bg-blue-500"
                >
                  {adding ? "Adding..." : "Add Question"}
                </Button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      {questions.length > 0 && (
        <div className="flex flex-col gap-4 mt-4">
          <h2 className="font-bold text-xl text-white">Questions</h2>
          {questions.map((question, index) => (
            <div key={question.id} className="border-b pb-4 mb-4 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-white">{`Q${index + 1}: ${question?.question}`}</h3>
                <div className="flex flex-col gap-2 ml-4 mt-2">
                  <p className="text-gray-300">A. {question?.op1}</p>
                  <p className="text-gray-300">B. {question?.op2}</p>
                  <p className="text-gray-300">C. {question?.op3}</p>
                  <p className="text-gray-300">D. {question?.op4}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Dialog.Root open={Boolean(editQuestion)} onOpenChange={(open) => !open && setEditQuestion(null)}>
                  <Dialog.Trigger asChild>
                    <button onClick={() => setEditQuestion(question)}>
                      <PenBox fill="blue" size={20} className="text-blue-300 cursor-pointer items-center" />
                    </button>
                  </Dialog.Trigger>
                  <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-lg p-6 bg-gray-800 rounded-lg transform -translate-x-1/2 -translate-y-1/2">
                      <Dialog.Title className="text-white font-bold">Edit Question</Dialog.Title>
                      <Dialog.Description className="text-gray-400">Edit the question and options below.</Dialog.Description>
                      <div className="flex flex-col gap-4 mt-4">
                        <input
                          type="text"
                          placeholder="Question"
                          value={editQuestion?.question || ""}
                          onChange={(e) => setEditQuestion({ ...editQuestion, question: e.target.value })}
                          className="bg-gray-700 text-white p-3 rounded-md border-gray-600"
                        />
                        <input
                          type="text"
                          placeholder="Option A"
                          value={editQuestion?.op1 || ""}
                          onChange={(e) => setEditQuestion({ ...editQuestion, op1: e.target.value })}
                          className="bg-gray-700 text-white p-3 rounded-md border-gray-600"
                        />
                        <input
                          type="text"
                          placeholder="Option B"
                          value={editQuestion?.op2 || ""}
                          onChange={(e) => setEditQuestion({ ...editQuestion, op2: e.target.value })}
                          className="bg-gray-700 text-white p-3 rounded-md border-gray-600"
                        />
                        <input
                          type="text"
                          placeholder="Option C"
                          value={editQuestion?.op3 || ""}
                          onChange={(e) => setEditQuestion({ ...editQuestion, op3: e.target.value })}
                          className="bg-gray-700 text-white p-3 rounded-md border-gray-600"
                        />
                        <input
                          type="text"
                          placeholder="Option D"
                          value={editQuestion?.op4 || ""}
                          onChange={(e) => setEditQuestion({ ...editQuestion, op4: e.target.value })}
                          className="bg-gray-700 text-white p-3 rounded-md border-gray-600"
                        />
                        <Button onClick={handleEditQuestion} className="mt-2 bg-blue-600 text-white hover:bg-blue-500">
                          Save Changes
                        </Button>
                      </div>
                    </Dialog.Content>
                  </Dialog.Portal>
                </Dialog.Root>

                <button
                  onClick={() => handleDeleteQuestion(question.id)}
                  disabled={deleteLoading[question.id]}
                  className="ml-4 text-red-500 hover:text-red-700"
                >
                  <Trash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssessmentPage;
