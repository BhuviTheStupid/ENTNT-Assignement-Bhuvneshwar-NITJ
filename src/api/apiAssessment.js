import supabaseClient from "@/utils/supabase";

// Fetch all assessments
export async function getAssessments(token="", { job_id }) {
  const supabase = await supabaseClient(token);
  let query = supabase
    .from("assessments")
    .select("*");

  if (job_id) {
    query = query.eq("job_id", job_id);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching Assessments:", error);
    return null;
  }

  return data;
}

// Read a single assessment by assessment.id
export async function getSingleAssessment(token="", { assessment_id }) {
  // Validate assessment_id
  if (!assessment_id || isNaN(assessment_id)) {
    console.error("Error: invalid assessment_id", assessment_id);
    return null;
  }

  const supabase = await supabaseClient(token);
  let query = supabase
    .from("assessments")
    .select("*")
    .eq("id", assessment_id);  // Use assessment.id to fetch

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching assessment:", error.message);
    return null;
  }

  if (!data || data.length === 0) {
    console.error("No assessment found for assessment_id:", assessment_id);
    return null;
  }

  return data[0];  // Returning the first assessment (you can change this if needed)
}

// Add a new question to an assessment (auto-generated assessment_id)
export async function addNewQuestion(token="", { job_id, question, op1, op2, op3, op4 }) {
    // Validate input parameters
    if (!question || !op1 || !op2 || !op3 || !op4) {
      console.error("All fields are required.");
      throw new Error("All fields are required.");
    }
  
    try {
      const supabase = await supabaseClient(token);
  
      const { data, error } = await supabase
        .from("assessments")
        .insert([
          {
            question,
            op1,
            op2,
            op3,
            op4,
            job_id,
          }
        ])
        .select();
  
      if (error) {
        console.error("Error adding new question:", error.message || error);
        throw new Error("Error adding new question");
      }
  
      return data[0];  // Return the newly added question
    } catch (err) {
      console.error("An error occurred:", err);
      throw new Error("Error adding new question");
    }
  }
  
  

// Delete a question from an assessment
export async function deleteQues(token="", { ques_id }) {
    console.log("JWT Token in deleteQues:", token);

  const supabase = await supabaseClient(token);

  const { data, error: deleteError } = await supabase
    .from("assessments")
    .delete()
    .eq("id", ques_id)
    .select();

  if (deleteError) {
    console.error("Error deleting question:", deleteError);
    return null;
  }

  return data;
}

// Delete an assessment by job_id
export async function deleteAssessment(token="", { job_id }) {
  const supabase = await supabaseClient(token);

  const { data, error: deleteError } = await supabase
    .from("assessments")
    .delete()
    .eq("job_id", job_id)
    .select();

  if (deleteError) {
    console.error("Error deleting assessment:", deleteError);
    return null;
  }

  return data;
}

// Fetch questions from a specific assessment based on assessment_id
export async function getQuestionsFromAssessment(token="", { assessment_id }) {
    // Validate assessment_id
    if (!assessment_id || isNaN(assessment_id)) {
      console.error("Error: invalid assessment_id", assessment_id);
      return null;
    }
  
    const supabase = await supabaseClient(token);
    
    // Query the 'assessments' table to fetch questions for the given assessment_id
    const { data, error } = await supabase
      .from("assessments")  // We are querying the 'assessments' table for questions
      .select("id, question, op1, op2, op3, op4")  // Select only relevant fields (question options, etc.)
      .eq("id", assessment_id);  // Filter questions by assessment_id
  
    if (error) {
      console.error("Error fetching questions:", error.message);
      return null;
    }
  
    return data;  // Return the list of questions for the given assessment_id
}


// Fetch questions related to a specific job_id or assessment_id
export async function getQuestionsForAssessment(token="", { job_id, assessment_id }) {
    const supabase = await supabaseClient(token);
  
    // Ensure the job_id is used since it's equivalent to assessment_id
    let query = supabase
      .from("assessments")  // Query the 'assessments' table for questions
      .select("id, question, op1, op2, op3, op4")  // Select relevant columns (question, options)
      .eq("job_id", job_id);  // Filter by job_id which is equal to assessment_id
  
    const { data, error } = await query;
  
    if (error) {
      console.error("Error fetching questions:", error.message);
      return null;
    }
  
    // Return all questions that match the criteria
    return data;  // This should return multiple questions for the given job_id (assessment_id)
  }
  
export async function addNewAssessment(token="", _, assData) {
    const supabase = await supabaseClient(token);
  
    const { data, error } = await supabase
      .from("assessments")
      .insert([assData])
      .select();
  
    if (error) {
      console.error(error);
      throw new Error("Error Creating Assessment");
    }
  
    return data;
  }

// Update an existing question in an assessment
export async function updateQuestion(token="", { question, op1, op2, op3, op4, id}) {
  // Validate input parameters
  if (!id || !question || !op1 || !op2 || !op3 || !op4) {
    console.log(id, question, op1, op2, op3, op4);
    console.error("All fields are required.");
    throw new Error("All fields are required.");
  }

  try {
    const supabase = await supabaseClient(token);

    // Update the question in the 'assessments' table
    const { data, error } = await supabase
      .from("assessments")
      .update({
        question,
        op1,
        op2,
        op3,
        op4,
      })
      .eq("id", id)  // Use the question ID to update the specific question
      .select();

    if (error) {
      console.error("Error updating question:", error.message || error);
      throw new Error("Error updating question");
    }

    return data[0];  // Return the updated question

  } catch (err) {
    console.error("An error occurred:", err);
    throw new Error("Error updating question");
  }
}

export async function fetchQuestionById(token = "", { id }) {
  // Validate the id
  if (!id || isNaN(id)) {
    console.error("Error: invalid id", id);
    return null;
  }

  const supabase = await supabaseClient(token);

  // Query the 'assessments' table to fetch a specific question by its ID
  const { data, error } = await supabase
    .from("assessments")
    .select("id, question, op1, op2, op3, op4")
    .eq("id", id)  // Filter by the question ID
    .single();  // Ensure we get a single record

  if (error) {
    console.error("Error fetching question by ID:", error.message);
    return null;
  }

  return data;  // Return the question data
}