import { NextResponse } from "next/server";
import { createClient } from "@sanity/client";

export async function GET() {
  try {
    // Log environment variables (without exposing sensitive values)
    console.log("Environment check:");
    console.log("NEXT_PUBLIC_SANITY_PROJECT_ID:", process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ? "✅ Set" : "❌ Missing");
    console.log("NEXT_PUBLIC_SANITY_DATASET:", process.env.NEXT_PUBLIC_SANITY_DATASET ? "✅ Set" : "❌ Missing");
    console.log("SANITY_API_TOKEN:", process.env.SANITY_API_TOKEN ? "✅ Set" : "❌ Missing");

    // Validate project ID
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    if (!projectId) {
      return NextResponse.json({ error: "Missing NEXT_PUBLIC_SANITY_PROJECT_ID" }, { status: 500 });
    }

    // Create test client
    const client = createClient({
      projectId,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
      apiVersion: "2024-03-01",
      token: process.env.SANITY_API_TOKEN,
      useCdn: false,
    });

    // Test 1: Basic connection (read)
    const testRead = await client.fetch('*[_type == "person"][0...1]');
    console.log("✅ Read test successful");

    // Test 2: Create a test document (write)
    const testDoc = {
      _type: "testDocument",
      title: "Test Document",
      timestamp: new Date().toISOString(),
    };

    const createdDoc = await client.create(testDoc);
    console.log("✅ Write test successful");

    // Test 3: Delete the test document (cleanup)
    await client.delete(createdDoc._id);
    console.log("✅ Delete test successful");

    return NextResponse.json({
      status: "success",
      message: "All Sanity tests passed",
      readTest: testRead.length > 0 ? "Found documents" : "No documents found",
      writeTest: "Successfully created and deleted test document",
    });
  } catch (error: any) {
    console.error("Sanity test failed:", error);
    
    let errorMessage = "Unknown error";
    let errorDetails = {};

    if (error.message.includes("Unauthorized")) {
      errorMessage = "Invalid or missing API token";
      errorDetails = {
        solution: "Create a new token with Editor permissions in Sanity manage",
        url: "https://www.sanity.io/manage",
      };
    } else if (error.message.includes("not found")) {
      errorMessage = "Invalid project ID or dataset";
      errorDetails = {
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
      };
    }

    return NextResponse.json(
      {
        status: "error",
        message: errorMessage,
        details: errorDetails,
        originalError: error.message,
      },
      { status: 500 }
    );
  }
} 