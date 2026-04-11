<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $notifications = $request->user()
            ->notifications()
            ->latest()
            ->paginate(15)
            ->through(function ($notification) {
                return [
                    'id' => $notification->id,
                    'type' => class_basename($notification->type),
                    'data' => $notification->data,
                    'read_at' => $notification->read_at,
                    'created_at' => $notification->created_at,
                ];
            });

        return Inertia::render('Backend/Notifications/Index', [
            'notifications' => $notifications,
        ]);
    }

    public function markAsRead(Request $request, string $id)
    {
        $notification = $request->user()->notifications()->findOrFail($id);

        if (!$notification->read_at) {
            $notification->markAsRead();
        }

        return back()->with('success', 'Notification marked as read.');
    }

    public function markAllAsRead(Request $request)
    {
        $request->user()
            ->unreadNotifications()
            ->update(['read_at' => now()]);

        return back()->with('success', 'All notifications marked as read.');
    }
}
