<?php
// app/Http/Controllers/JobController.php

namespace App\Http\Controllers;

use App\Models\Job;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class JobController extends Controller
{
    public function index()
    {
        $jobs = Job::with('employer')->latest()->paginate(10);
        return response()->json($jobs);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'requirements' => 'required|string',
            'location' => 'required|string',
            'salary_range' => 'nullable|string',
            'job_type' => 'required|string',
            'category' => 'required|string',
            'experience_level' => 'required|string',
            'application_deadline' => 'required|date',
        ]);

        $job = Job::create([
            ...$request->all(),
            'user_id' => Auth::id(),
            'is_active' => true,
        ]);

        return response()->json($job, 201);
    }

    public function show(Job $job)
    {
        return response()->json($job->load('employer', 'applications'));
    }

    public function update(Request $request, Job $job)
    {
        $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'requirements' => 'sometimes|string',
            'location' => 'sometimes|string',
            'salary_range' => 'nullable|string',
            'job_type' => 'sometimes|string',
            'category' => 'sometimes|string',
            'experience_level' => 'sometimes|string',
            'application_deadline' => 'sometimes|date',
            'is_active' => 'sometimes|boolean',
        ]);

        $job->update($request->all());

        return response()->json($job);
    }

    public function destroy(Job $job)
    {
        $job->delete();
        return response()->json(['message' => 'Job deleted successfully']);
    }
}
