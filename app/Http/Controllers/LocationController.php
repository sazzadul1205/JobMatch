<?php
// app/Http/Controllers/LocationController.php

namespace App\Http\Controllers;

use App\Models\Location;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LocationController extends Controller
{
    public function index()
    {
        $locations = Location::withTrashed()->get();
        return Inertia::render('Backend/Locations/Index', [
            'locations' => $locations
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        Location::create($validated);

        return redirect()->back();
    }

    public function update(Request $request, Location $location)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        $location->update($validated);

        return redirect()->back();
    }

    public function destroy(Location $location)
    {
        $location->delete();

        return redirect()->back();
    }

    public function toggleActive(Location $location)
    {
        $location->update([
            'is_active' => !$location->is_active
        ]);

        return back()->with('success', 'Location status updated');
    }

    public function restore($id)
    {
        $location = Location::withTrashed()->findOrFail($id);
        $location->restore();

        return back();
    }
}
