// app/api/employers/[id]/route.js

const fakeEmployers = {
  1: {
    id: 1,
    name: "Acme Corp",
    company: "Acme Inc.",
    location: "Nairobi",
    email: "info@acme.com",
    phone: "+254700000000",
    industry: "Tech",
    companySize: "50-200",
    foundedYear: 2015,
    bio: "Acme is a leading company in innovative solutions.",
    jobs: [
      {
        id: 101,
        title: "Software Engineer",
        location: "Nairobi",
        type: "Full Time",
        description: "Work on cool stuff!"
      }
    ]
  }
};

export async function GET(request, { params }) {
  const id = params.id;
  const employer = fakeEmployers[id];

  if (!employer) {
    return new Response(
      JSON.stringify({ message: "Employer not found" }),
      {
        status: 404,
        headers: { "Content-Type": "application/json" }
      }
    );
  }

  return new Response(
    JSON.stringify(employer),
    {
      status: 200,
      headers: { "Content-Type": "application/json" }
    }
  );
}
