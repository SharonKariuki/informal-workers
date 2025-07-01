import { connectToDatabase } from "../../../../lib/mongoose";
import Course from "../../../../models/Course";
import { NextResponse } from "next/server";

export async function PATCH(request, { params }) {
  const { id } = params;

  try {
    const body = await request.json();

    const { action, title, description } = body;

    if (!action) {
      return NextResponse.json(
        { success: false, message: "No action specified." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    let updates = {};

    if (action === "update") {
      if (title !== undefined) updates.title = title;
      if (description !== undefined) updates.description = description;
    } else if (action === "publish") {
      updates.published = true;
    } else if (action === "unpublish") {
      updates.published = false;
    } else {
      return NextResponse.json(
        { success: false, message: `Invalid action: ${action}` },
        { status: 400 }
      );
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    );

    if (!updatedCourse) {
      return NextResponse.json(
        { success: false, message: "Course not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Course ${action === "update" ? "updated" : action + "ed"} successfully`,
      course: updatedCourse,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: `Course ${params?.action || "operation"} failed`,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    await connectToDatabase();

    const deletedCourse = await Course.findByIdAndDelete(id);

    if (!deletedCourse) {
      return NextResponse.json(
        { success: false, message: "Course not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Course deletion failed",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
