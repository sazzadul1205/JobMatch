<?php

if (!function_exists('sanitize_filename')) {
    function sanitize_filename($filename) {
        // Remove special characters
        $filename = preg_replace('/[^a-zA-Z0-9\s_-]/', '', $filename);
        // Replace spaces with underscores
        $filename = str_replace(' ', '_', $filename);
        // Remove multiple underscores
        $filename = preg_replace('/_+/', '_', $filename);
        // Trim underscores from ends
        $filename = trim($filename, '_');
        // Limit length
        $filename = substr($filename, 0, 100);
        return $filename ?: 'file';
    }
}